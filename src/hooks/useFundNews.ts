import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface NewsArticle {
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl?: string;
}

interface FundNewsResponse {
  success: boolean;
  articles: NewsArticle[];
  feedTitle?: string;
  error?: string;
}

async function fetchFundNews(rssFeedUrl: string): Promise<FundNewsResponse> {
  const { data, error } = await supabase.functions.invoke('fetch-rss-feed', {
    body: { feedUrl: rssFeedUrl },
  });

  if (error) {
    console.error('[useFundNews] Error fetching RSS feed:', error);
    throw new Error(error.message || 'Failed to fetch news feed');
  }

  return data as FundNewsResponse;
}

export function useFundNews(rssFeedUrl: string | undefined | null) {
  return useQuery({
    queryKey: ['fundNews', rssFeedUrl],
    queryFn: () => fetchFundNews(rssFeedUrl!),
    enabled: !!rssFeedUrl && rssFeedUrl.length > 0,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes (formerly cacheTime)
    retry: 1,
    refetchOnWindowFocus: false,
  });
}
