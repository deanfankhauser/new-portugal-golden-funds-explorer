import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface RssArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl?: string;
}

interface RssFeedResponse {
  success: boolean;
  articles: RssArticle[];
  feedTitle?: string;
  error?: string;
}

// Simple cache for RSS feeds (15 minutes TTL)
const feedCache = new Map<string, { data: RssFeedResponse; timestamp: number }>();
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes

function getCachedFeed(url: string): RssFeedResponse | null {
  const cached = feedCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[Cache HIT] Returning cached feed for: ${url}`);
    return cached.data;
  }
  return null;
}

function setCachedFeed(url: string, data: RssFeedResponse): void {
  feedCache.set(url, { data, timestamp: Date.now() });
  console.log(`[Cache SET] Cached feed for: ${url}`);
}

// Extract text content from XML, handling CDATA
function extractTextContent(text: string): string {
  if (!text) return '';
  // Remove CDATA wrapper if present
  return text.replace(/<!\[CDATA\[(.*?)\]\]>/gs, '$1').trim();
}

// Parse RSS 2.0 feed
function parseRss2(xml: string): { articles: RssArticle[]; feedTitle?: string } {
  const articles: RssArticle[] = [];
  
  // Extract feed title
  const channelTitleMatch = xml.match(/<channel>[\s\S]*?<title>([^<]+)<\/title>/);
  const feedTitle = channelTitleMatch ? extractTextContent(channelTitleMatch[1]) : undefined;
  
  // Extract items
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  
  while ((match = itemRegex.exec(xml)) !== null && articles.length < 10) {
    const itemContent = match[1];
    
    const titleMatch = itemContent.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
    const linkMatch = itemContent.match(/<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/);
    const descMatch = itemContent.match(/<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/);
    const pubDateMatch = itemContent.match(/<pubDate>([^<]+)<\/pubDate>/);
    
    // Try to find image in media:content, enclosure, or description
    let imageUrl: string | undefined;
    const mediaMatch = itemContent.match(/url="([^"]+\.(jpg|jpeg|png|gif|webp)[^"]*)"/i);
    const enclosureMatch = itemContent.match(/<enclosure[^>]+url="([^"]+)"/);
    
    if (mediaMatch) {
      imageUrl = mediaMatch[1];
    } else if (enclosureMatch) {
      imageUrl = enclosureMatch[1];
    }
    
    if (titleMatch && linkMatch) {
      const description = descMatch ? extractTextContent(descMatch[1]) : '';
      // Strip HTML tags from description
      const cleanDescription = description.replace(/<[^>]*>/g, '').substring(0, 300);
      
      articles.push({
        title: extractTextContent(titleMatch[1]),
        link: extractTextContent(linkMatch[1]),
        description: cleanDescription,
        pubDate: pubDateMatch ? pubDateMatch[1] : new Date().toISOString(),
        imageUrl,
      });
    }
  }
  
  return { articles, feedTitle };
}

// Parse Atom feed
function parseAtom(xml: string): { articles: RssArticle[]; feedTitle?: string } {
  const articles: RssArticle[] = [];
  
  // Extract feed title
  const feedTitleMatch = xml.match(/<feed[\s\S]*?<title>([^<]+)<\/title>/);
  const feedTitle = feedTitleMatch ? extractTextContent(feedTitleMatch[1]) : undefined;
  
  // Extract entries
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  let match;
  
  while ((match = entryRegex.exec(xml)) !== null && articles.length < 10) {
    const entryContent = match[1];
    
    const titleMatch = entryContent.match(/<title[^>]*>([^<]+)<\/title>/);
    const linkMatch = entryContent.match(/<link[^>]+href="([^"]+)"/);
    const summaryMatch = entryContent.match(/<summary[^>]*>([\s\S]*?)<\/summary>/);
    const contentMatch = entryContent.match(/<content[^>]*>([\s\S]*?)<\/content>/);
    const updatedMatch = entryContent.match(/<updated>([^<]+)<\/updated>/);
    const publishedMatch = entryContent.match(/<published>([^<]+)<\/published>/);
    
    if (titleMatch && linkMatch) {
      const rawDescription = summaryMatch ? summaryMatch[1] : (contentMatch ? contentMatch[1] : '');
      const cleanDescription = extractTextContent(rawDescription).replace(/<[^>]*>/g, '').substring(0, 300);
      
      articles.push({
        title: extractTextContent(titleMatch[1]),
        link: linkMatch[1],
        description: cleanDescription,
        pubDate: publishedMatch ? publishedMatch[1] : (updatedMatch ? updatedMatch[1] : new Date().toISOString()),
      });
    }
  }
  
  return { articles, feedTitle };
}

async function fetchAndParseFeed(url: string): Promise<RssFeedResponse> {
  // Check cache first
  const cached = getCachedFeed(url);
  if (cached) {
    return cached;
  }
  
  console.log(`[Fetch] Fetching RSS feed from: ${url}`);
  
  try {
    // Validate URL
    const parsedUrl = new URL(url);
    if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
      throw new Error('Invalid URL protocol. Only HTTP/HTTPS is allowed.');
    }
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'MovingTo-RSS-Fetcher/1.0',
        'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml',
      },
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch feed: ${response.status} ${response.statusText}`);
    }
    
    const xml = await response.text();
    console.log(`[Fetch] Received ${xml.length} bytes`);
    
    let result: { articles: RssArticle[]; feedTitle?: string };
    
    // Detect feed type and parse accordingly
    if (xml.includes('<feed') && xml.includes('xmlns="http://www.w3.org/2005/Atom"')) {
      console.log('[Parse] Detected Atom feed');
      result = parseAtom(xml);
    } else if (xml.includes('<rss') || xml.includes('<channel>')) {
      console.log('[Parse] Detected RSS 2.0 feed');
      result = parseRss2(xml);
    } else {
      console.log('[Parse] Unknown feed format, trying RSS 2.0 parser');
      result = parseRss2(xml);
    }
    
    console.log(`[Parse] Found ${result.articles.length} articles`);
    
    const responseData: RssFeedResponse = {
      success: true,
      articles: result.articles,
      feedTitle: result.feedTitle,
    };
    
    // Cache the successful response
    setCachedFeed(url, responseData);
    
    return responseData;
  } catch (error) {
    console.error(`[Error] Failed to fetch/parse feed: ${error.message}`);
    return {
      success: false,
      articles: [],
      error: error.message,
    };
  }
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { feedUrl } = await req.json();
    
    if (!feedUrl) {
      return new Response(
        JSON.stringify({ success: false, articles: [], error: 'feedUrl is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }
    
    console.log(`[Request] Fetching RSS feed: ${feedUrl}`);
    const result = await fetchAndParseFeed(feedUrl);
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  } catch (error) {
    console.error(`[Error] Request handling failed: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, articles: [], error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
