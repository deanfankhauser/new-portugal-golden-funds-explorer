
export class HTMLTemplateGenerator {
  static generateMetaTags(seoData: any): string {
    const metaTags = [
      `<meta name="description" content="${seoData.description}" />`,
      `<meta name="author" content="Dean Fankhauser, CEO" />`,
      `<meta name="robots" content="index, follow, max-image-preview:large" />`,
      `<link rel="canonical" href="${seoData.url}" />`,
      `<meta property="og:title" content="${seoData.title}" />`,
      `<meta property="og:description" content="${seoData.description}" />`,
      `<meta property="og:url" content="${seoData.url}" />`,
      `<meta property="og:type" content="website" />`,
      `<meta property="og:site_name" content="Movingto" />`,
      `<meta property="og:image" content="https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg" />`,
      `<meta name="twitter:card" content="summary_large_image" />`,
      `<meta name="twitter:site" content="@movingtoio" />`,
      `<meta name="twitter:creator" content="@movingtoio" />`,
      `<meta name="twitter:title" content="${seoData.title}" />`,
      `<meta name="twitter:description" content="${seoData.description}" />`,
    ];

    if (seoData.structuredData && Object.keys(seoData.structuredData).length > 0) {
      metaTags.push(
        `<script type="application/ld+json">${JSON.stringify(seoData.structuredData)}</script>`
      );
    }

    return metaTags.join('\n    ');
  }

  static generateHTMLTemplate(content: string, seoData: any): string {
    const metaTags = this.generateMetaTags(seoData);
    
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Server-side rendered SEO meta tags - NEVER default values -->
    <title>${seoData.title}</title>
    ${metaTags}
    
    <!-- Preconnect to external domains for performance -->
    <link rel="preconnect" href="https://www.googletagmanager.com" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="preconnect" href="https://cdn.prod.website-files.com" />
    
    <!-- Load fonts immediately -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
    
    <!-- Critical CSS inline styles -->
    <style>
      :root {
        --background: 0 0% 100%;
        --foreground: 0 0% 0%;
        --card: 0 0% 100%;
        --card-foreground: 0 0% 0%;
        --popover: 0 0% 100%;
        --popover-foreground: 0 0% 0%;
        --primary: 0 85% 60%;
        --primary-foreground: 0 0% 100%;
        --secondary: 210 40% 96.1%;
        --secondary-foreground: 0 0% 0%;
        --muted: 210 40% 96.1%;
        --muted-foreground: 215.4 16.3% 46.9%;
        --accent: 0 85% 60%;
        --accent-foreground: 0 0% 100%;
        --destructive: 0 84.2% 60.2%;
        --destructive-foreground: 0 0% 100%;
        --border: 214.3 31.8% 91.4%;
        --input: 214.3 31.8% 91.4%;
        --ring: 0 85% 60%;
        --radius: 0.5rem;
      }

      * {
        border-color: hsl(var(--border));
        box-sizing: border-box;
      }

      html, body, #root {
        width: 100%;
        height: 100%;
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      }

      body {
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
        line-height: 1.5;
      }

      h1 {
        font-size: 1.875rem;
        font-weight: 700;
        margin-bottom: 1rem;
        line-height: 1.2;
      }

      @media (min-width: 768px) {
        h1 {
          font-size: 2.25rem;
        }
      }

      h2 {
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 0.75rem;
        line-height: 1.3;
      }

      h3 {
        font-size: 1.25rem;
        font-weight: 500;
        margin-bottom: 0.5rem;
        line-height: 1.4;
      }

      .tag {
        display: inline-block;
        background-color: hsl(var(--secondary));
        font-size: 0.875rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        transition: all 0.2s;
        cursor: pointer;
        border: 1px solid transparent;
      }

      .tag:hover {
        background-color: hsl(var(--primary));
        color: white;
      }

      /* Basic component styles */
      .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 0.5rem 1rem;
        font-size: 0.875rem;
        font-weight: 500;
        border-radius: 0.375rem;
        transition: all 0.2s;
        cursor: pointer;
        border: 1px solid transparent;
        text-decoration: none;
      }

      .btn-primary {
        background-color: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
      }

      .btn-primary:hover {
        opacity: 0.9;
      }

      .btn-secondary {
        background-color: hsl(var(--secondary));
        color: hsl(var(--secondary-foreground));
      }

      .btn-secondary:hover {
        background-color: hsl(var(--muted));
      }

      .card {
        background-color: hsl(var(--card));
        color: hsl(var(--card-foreground));
        border: 1px solid hsl(var(--border));
        border-radius: 0.5rem;
        box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
      }

      .container {
        width: 100%;
        margin-left: auto;
        margin-right: auto;
        padding-left: 1rem;
        padding-right: 1rem;
      }

      @media (min-width: 640px) {
        .container {
          max-width: 640px;
        }
      }

      @media (min-width: 768px) {
        .container {
          max-width: 768px;
        }
      }

      @media (min-width: 1024px) {
        .container {
          max-width: 1024px;
        }
      }

      @media (min-width: 1280px) {
        .container {
          max-width: 1280px;
        }
      }
    </style>
    
    <!-- DNS prefetch for better performance -->
    <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
    <link rel="dns-prefetch" href="https://cdn.gpteng.co" />
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3ML90T25MY"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-3ML90T25MY');
    </script>
    
    <!-- Security headers -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
    <meta http-equiv="X-Frame-Options" content="DENY" />
    <meta http-equiv="X-XSS-Protection" content="1; mode=block" />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    
    <!-- Favicon and app icons -->
    <link rel="icon" href="https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/66fbc14f0b738f09e77cadb8_fav.png" type="image/png">
    <link rel="apple-touch-icon" href="https://cdn.prod.website-files.com/6095501e0284878a0e7c5c52/66fbc14f0b738f09e77cadb8_fav.png">
    
    <!-- Theme color for mobile browsers -->
    <meta name="theme-color" content="#EF4444" />
  </head>

  <body>
    <div id="root">${content}</div>
    <!-- IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! -->
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>`;
  }
}
