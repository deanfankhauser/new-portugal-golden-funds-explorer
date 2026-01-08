import { SEOData } from '../types/seo';

/**
 * Generate comprehensive meta tags HTML for SSR/SSG
 * This function creates all SEO-critical meta tags that will be injected into static HTML
 * 
 * @param seoData - SEO data from ConsolidatedSEOService
 * @returns HTML string containing all meta tags
 */
/**
 * Extract FAQ data from structured data (handles both single schema and @graph arrays)
 * @param structuredData - Structured data from SEOData
 * @returns FAQ data or null if no FAQPage found
 */
function extractFAQData(structuredData: any): { mainEntity: any[] } | null {
  if (!structuredData) return null;
  
  // Handle @graph array (Phase 2 breadcrumb implementation)
  if (structuredData['@graph'] && Array.isArray(structuredData['@graph'])) {
    const faqPage = structuredData['@graph'].find((schema: any) => schema['@type'] === 'FAQPage');
    if (faqPage && faqPage.mainEntity) {
      return { mainEntity: faqPage.mainEntity };
    }
  }
  
  // Handle array of schemas (Phase 1 implementation)
  if (Array.isArray(structuredData)) {
    const faqPage = structuredData.find((schema: any) => schema['@type'] === 'FAQPage');
    if (faqPage && faqPage.mainEntity) {
      return { mainEntity: faqPage.mainEntity };
    }
  }
  
  // Handle single FAQPage schema
  if (structuredData['@type'] === 'FAQPage' && structuredData.mainEntity) {
    return { mainEntity: structuredData.mainEntity };
  }
  
  return null;
}

/**
 * Generate hidden FAQ HTML content for search engine crawlers
 * DISABLED: We only use JSON-LD FAQPage schema in <head>, duplicate microdata removed
 * @param faqData - FAQ data extracted from structured data
 * @returns Empty string (duplicate microdata no longer needed)
 */
function generateFAQContentHTML(faqData: { mainEntity: any[] }): string {
  // Return empty string - JSON-LD FAQPage schema in head is sufficient
  // Duplicate microdata can confuse crawlers and is unnecessary
  return '';
}

export function generateMetaTagsHTML(seoData: SEOData): string {
  const title = seoData.title || 'Portugal Golden Visa Investment Funds | Eligible Investments 2025';
  const description = seoData.description || 'Compare and discover the best Golden Visa-eligible investment funds in Portugal. Expert analysis, comprehensive data, and personalized recommendations.';
  const url = seoData.url || 'https://funds.movingto.com';
  
  // Strip query params from canonical URL for clean indexing
  const canonicalUrl = (() => {
    try {
      const rawCanonical = seoData.canonical || url;
      const urlObj = new URL(rawCanonical);
      urlObj.search = ''; // Remove query params
      urlObj.hash = ''; // Remove fragment
      // Remove trailing slashes (except homepage)
      if (urlObj.pathname.endsWith('/') && urlObj.pathname !== '/') {
        urlObj.pathname = urlObj.pathname.slice(0, -1);
      }
      return urlObj.toString();
    } catch {
      return seoData.canonical || url;
    }
  })();
  
  const keywords = seoData.keywords?.join(', ') || 'Portugal Golden Visa, investment funds, Portuguese residency, Golden Visa funds 2025, fund comparison, investment migration';
  const robots = seoData.robots || 'index, follow, max-image-preview:large';
  
  // Determine Open Graph type based on URL and structured data
  const ogType = (() => {
    if (url.includes('/compare/') && url.includes('-vs-')) return 'article';
    
    // Fund pages use 'website' type (not 'product') per SEO requirements
    // Only Person schemas use 'profile' type
    const structuredData = seoData.structuredData;
    if (structuredData) {
      if (Array.isArray(structuredData)) {
        const hasPerson = structuredData.some((s: any) => s['@type'] === 'Person');
        if (hasPerson) return 'profile';
      } else {
        if (structuredData['@type'] === 'Person') return 'profile';
      }
    }
    
    // All fund pages default to 'website' type
    return 'website';
  })();
  
  return `
  <!-- Critical SEO Meta Tags - Injected during SSR/SSG Build -->
  <title>${title}</title>
  <meta name="description" content="${description}" />
  
  <!-- Open Graph Meta Tags for Social Sharing -->
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:site_name" content="Movingto Funds" />
  <meta property="og:image" content="https://funds.movingto.com/og-default.png" />
  
  <!-- Twitter Card Meta Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@movingtoio" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="https://funds.movingto.com/og-default.png" />
  
  <!-- SEO Enhancement Meta Tags -->
  <link rel="canonical" href="${canonicalUrl}" />
  <meta name="keywords" content="${keywords}" />
  <meta name="author" content="Dean Fankhauser, CEO - Movingto" />
  <meta name="robots" content="${robots}" />
  `;
}

export function generateHTMLTemplate(
  appHtml: string, 
  seoData: SEOData, 
  cssFiles: string[] = [], 
  jsFiles: string[] = []
): string {
  // Ensure all SEO data has fallbacks
  const title = seoData.title || 'Portugal Golden Visa Investment Funds | Eligible Investments 2025';
  const description = seoData.description || 'Compare and discover the best Golden Visa-eligible investment funds in Portugal. Expert analysis, comprehensive data, and personalized recommendations.';
  const url = seoData.url || 'https://funds.movingto.com';
  const structuredData = seoData.structuredData || {};

  // Helper function to check structured data presence for both objects and arrays
  const hasStructuredData = Array.isArray(structuredData) 
    ? structuredData.length > 0 
    : !!structuredData && Object.keys(structuredData).length > 0;

  // Check if we're in development mode safely for SSG environments
  const isDev = typeof process !== 'undefined' ? process.env.NODE_ENV === 'development' : false;
  
  if (isDev) {
    console.log('🔥 HTMLTemplate: Generating with SEO data:', {
      title: title.substring(0, 50) + '...',
      description: description.substring(0, 50) + '...',
      url,
      hasStructuredData,
      structuredDataInfo: Array.isArray(structuredData) 
        ? `array with ${structuredData.length} items` 
        : `object with ${Object.keys(structuredData).length} keys`,
      cssFiles: cssFiles.length,
      jsFiles: jsFiles.length
    });
  }

  // Use all validated assets passed from orchestrator
  const validatedCssFiles = cssFiles;
  const validatedJsFiles = jsFiles;

  // Ensure a single H1 exists for SEO if the app content lacks one (SSR fallback)
  const contentWithH1 = appHtml && appHtml.includes('<h1')
    ? appHtml
    : `<main><h1 class="text-2xl font-bold text-foreground mb-4">${title}</h1>${appHtml || ''}</main>`;

  // Generate comprehensive meta tags using the dedicated function
  const metaTagsHTML = generateMetaTagsHTML(seoData);
  
  // Extract and generate FAQ content for crawlers if FAQPage schema exists
  const faqData = extractFAQData(structuredData);
  const faqContentHTML = faqData ? generateFAQContentHTML(faqData) : '';
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  <base href="/" />
  ${metaTagsHTML}
  
  <!-- Additional Meta Tags -->
  <meta name="theme-color" content="#C5A46D" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="format-detection" content="telephone=no" />
  
  <!-- Structured Data -->
  ${hasStructuredData ? `<script type="application/ld+json" data-managed="consolidated-seo">${JSON.stringify(structuredData, null, 2)}</script>` : ''}
  
  <!-- Other Helmet-managed tags (excluding title) -->
  ${seoData.helmetData?.meta || ''}
  ${seoData.helmetData?.link || ''}
  ${seoData.helmetData?.script || ''}
  
  <!-- Critical Resource Preconnects - Establish early connections to improve LCP -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://www.googletagmanager.com">
  <link rel="preconnect" href="https://server.fillout.com" crossorigin>
  <link rel="preconnect" href="https://bkmvydnfhmkjnuszroim.supabase.co" crossorigin>
  
  <!-- Asset Preloads -->
  ${validatedCssFiles.length > 0 ? `<link rel="preload" href="/assets/${validatedCssFiles[0]}" as="style" />` : ''}
  ${validatedJsFiles.map(js => `  <link rel="modulepreload" href="/assets/${js}" />`).join('\n')}
  
  <!-- Google Fonts - Non-blocking load with fallback -->
  <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"></noscript>
  
  <!-- Favicon -->
  <link rel="icon" href="/lovable-uploads/3965a727-dc95-4cfe-bc27-546bdd2397f3.png" type="image/png">
  <link rel="apple-touch-icon" href="/lovable-uploads/3965a727-dc95-4cfe-bc27-546bdd2397f3.png">
  
  <!-- Critical CSS Inline for Performance -->
  <style>
    /* Critical CSS variables - Match index.css exactly */
    :root {
      /* Brand Color System - Warm Premium Heritage */
      --brand-bordeaux: 340 66% 18%;      /* Rich Bordeaux #4B0F23 */
      --brand-bronze: 20 33% 50%;         /* Matte Bronze #A97155 */
      --brand-bone: 36 16% 92%;           /* Bone White #EDEAE6 */
      
      /* Core Design Tokens */
      --background: var(--brand-bone);
      --foreground: 340 20% 16%;
      --card: 36 15% 97%;
      --card-foreground: 340 20% 16%;
      --popover: 36 15% 97%;
      --popover-foreground: 340 20% 16%;
      --primary: var(--brand-bordeaux);
      --primary-foreground: 0 0% 98%;
      --secondary: 36 12% 96%;
      --secondary-foreground: 340 20% 20%;
      --muted: 36 12% 90%;
      --muted-foreground: 340 15% 45%;
      --accent: var(--brand-bronze);
      --accent-foreground: 0 0% 100%;
      --destructive: 0 84% 60%;
      --destructive-foreground: 0 0% 100%;
      --border: 20 10% 80%;
      --input: 20 10% 80%;
      --ring: var(--brand-bordeaux);
      --radius: 0.5rem;
    }
    
    /* Critical CSS to prevent FOUC and ensure proper rendering */
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      color: hsl(var(--foreground));
      background-color: hsl(var(--background));
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-feature-settings: "rlig" 1, "calt" 1;
    }
    
    /* Ensure loading state is properly styled */
    #root {
      min-height: 100vh;
      width: 100%;
    }
    
    /* Basic button styling to prevent layout shift */
    button {
      font-family: inherit;
      cursor: pointer;
    }
    
    /* Tailwind CSS reset essentials */
    h1, h2, h3, h4, h5, h6 {
      margin: 0;
      font-weight: 600;
      text-rendering: optimizeLegibility;
    }
    
    p {
      margin: 0;
    }
    
    /* Loading skeleton styles */
    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.5; }
    }
    
    /* Ensure proper mobile viewport handling */
    @media (max-width: 768px) {
      body {
        font-size: 16px; /* Prevent zoom on iOS */
      }
    }
    
    /* High contrast mode support */
    @media (prefers-contrast: high) {
      body {
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
      }
    }
    
    /* Reduced motion support */
    @media (prefers-reduced-motion: reduce) {
      * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }
    }
  </style>
  
  <!-- Built CSS Files -->
  ${validatedCssFiles.map(css => `  <link rel="stylesheet" href="/assets/${css}" />`).join('\n')}
</head>
<body>
  <div id="root">${contentWithH1}</div>
  ${faqContentHTML}
  
  <!-- Built JavaScript Files - Only load main entry -->
  ${(() => {
    const mainEntry = validatedJsFiles.find(js => js.startsWith('index-')) || validatedJsFiles[0];
    return mainEntry ? `  <script type="module" src="/assets/${mainEntry}"></script>` : '';
  })()}
  
  <!-- Google tag (gtag.js) - Deferred load after page interactive -->
  <script>
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      // Defer analytics until after page is interactive to avoid blocking FCP
      if ('requestIdleCallback' in window) {
        requestIdleCallback(function() { loadGoogleAnalytics(); }, { timeout: 2000 });
      } else {
        window.addEventListener('load', function() {
          setTimeout(loadGoogleAnalytics, 1000);
        });
      }
      
      function loadGoogleAnalytics() {
        var script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=G-BE3HZBVG9D';
        script.onerror = function() {
          console.warn('Google Analytics failed to load');
        };
        document.head.appendChild(script);
        
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-BE3HZBVG9D', {
          transport_type: 'beacon'
        });
      }
    }
  </script>
</body>
</html>`;
}
