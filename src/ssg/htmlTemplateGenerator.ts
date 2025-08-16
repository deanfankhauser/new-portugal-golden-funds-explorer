import { SEOData } from '../types/seo';

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

  if (import.meta.env.DEV) {
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

  const validatedCssFiles = cssFiles;

  const validatedJsFiles = jsFiles;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
  
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-BE3HZBVG9D"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-BE3HZBVG9D');
  </script>
  
  <!-- Critical SEO Meta Tags -->
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title}" />  
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:type" content="${seoData.structuredData?.['@type'] === 'Person' ? 'profile' : seoData.structuredData?.['@type'] === 'Article' ? 'article' : seoData.structuredData?.['@type'] === 'FinancialProduct' ? 'product' : 'website'}" />
  <meta property="og:site_name" content="Movingto - Portugal Golden Visa Funds" />
  <meta property="og:image" content="https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@movingtoio" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg" />
  <link rel="canonical" href="${url}" />
  
  <!-- Enhanced Meta Tags -->
  <meta name="keywords" content="Portugal Golden Visa, investment funds, Portuguese residency, Golden Visa funds 2025, fund comparison, investment migration" />
  <meta name="author" content="Dean Fankhauser, CEO - Movingto" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="theme-color" content="#EF4444" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  <meta name="format-detection" content="telephone=no" />
  
  <!-- Structured Data -->
  ${hasStructuredData ? `<script type="application/ld+json">${JSON.stringify(structuredData, null, 2)}</script>` : ''}
  
  <!-- Critical Resource Preconnects -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preconnect" href="https://www.googletagmanager.com">
  
  <!-- Google Fonts - Load immediately -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Favicon -->
  <link rel="icon" type="image/x-icon" href="https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/66fbc14f0b738f09e77cadb8_fav.png">
  
  <!-- Critical CSS Inline for Performance -->
  <style>
    /* Critical CSS to prevent FOUC and ensure proper rendering */
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 0;
      line-height: 1.6;
      color: #1f2937;
      background-color: #ffffff;
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
        background-color: #ffffff;
        color: #000000;
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
  <div id="root">${appHtml}</div>
  
  <!-- Built JavaScript Files -->
  ${validatedJsFiles.map(js => `  <script type="module" src="/assets/${js}"></script>`).join('\n')}
  
  <!-- Analytics and performance tracking (disabled in production build) -->
</body>
</html>`;
}
