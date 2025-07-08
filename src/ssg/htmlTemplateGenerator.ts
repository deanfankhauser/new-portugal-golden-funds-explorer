
import { SEOData } from '../types/seo';

export function generateHTMLTemplate(
  appHtml: string, 
  seoData: SEOData, 
  cssFiles: string[] = [], 
  jsFiles: string[] = []
): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-3ML90T25MY"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-3ML90T25MY');
  </script>
  
  <!-- Critical SEO Meta Tags -->
  <title>\${seoData.title}</title>
  <meta name="description" content="\${seoData.description}" />
  <meta property="og:title" content="\${seoData.title}" />
  <meta property="og:description" content="\${seoData.description}" />
  <meta property="og:url" content="\${seoData.url}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Movingto - Portugal Golden Visa Funds" />
  <meta property="og:image" content="https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@movingtoio" />
  <meta name="twitter:title" content="\${seoData.title}" />
  <meta name="twitter:description" content="\${seoData.description}" />
  <meta name="twitter:image" content="https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg" />
  <link rel="canonical" href="\${seoData.url}" />
  
  <!-- Enhanced Meta Tags -->
  <meta name="keywords" content="Portugal Golden Visa, investment funds, Portuguese residency, Golden Visa funds 2025, fund comparison, investment migration" />
  <meta name="author" content="Dean Fankhauser, CEO - Movingto" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <meta name="theme-color" content="#EF4444" />
  
  <!-- Structured Data -->
  \${seoData.structuredData ? `<script type="application/ld+json">\${JSON.stringify(seoData.structuredData)}</script>` : ''}
  
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
    /* Critical CSS to prevent FOUC */
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
    }
    
    /* Ensure loading state is properly styled */
    #root {
      min-height: 100vh;
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
  </style>
  
  <!-- Built CSS Files -->
  \${cssFiles.map(css => `  <link rel="stylesheet" href="./assets/\${css}" />`).join('\n')}
</head>
<body>
  <div id="root">\${appHtml}</div>
  
  <!-- Built JavaScript Files -->
  \${jsFiles.map(js => `  <script type="module" src="./assets/\${js}"></script>`).join('\n')}
  
  <!-- Analytics placeholder for future implementation -->
  <script>
    // Basic page load tracking
    console.log('SSG Page loaded:', {
      title: document.title,
      url: window.location.href,
      timestamp: new Date().toISOString()
    });
  </script>
</body>
</html>`;
}
