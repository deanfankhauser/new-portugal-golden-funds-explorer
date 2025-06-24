
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

  static generateHTMLTemplate(content: string, seoData: any, cssFiles: string[] = [], jsFiles: string[] = []): string {
    const metaTags = this.generateMetaTags(seoData);
    
    // Generate CSS link tags for the built assets
    const cssLinks = cssFiles.map(file => `    <link rel="stylesheet" href="${file}" />`).join('\n');
    
    // Generate JS script tags for the built assets
    const jsScripts = jsFiles.map(file => `    <script type="module" src="${file}"></script>`).join('\n');
    
    // Create inline critical CSS as fallback for SSG pages
    const inlineCriticalCSS = `
    <style>
      /* Critical inline CSS for SSG pages */
      :root {
        --background: 0 0% 100%;
        --foreground: 0 0% 0%;
        --primary: 0 85% 60%;
        --border: 214.3 31.8% 91.4%;
      }
      * { box-sizing: border-box; }
      body { margin: 0; font-family: 'Inter', sans-serif; background-color: hsl(var(--background)); color: hsl(var(--foreground)); }
      .container { width: 100%; margin-left: auto; margin-right: auto; padding-left: 1rem; padding-right: 1rem; }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .max-w-7xl { max-width: 80rem; }
      .max-w-6xl { max-width: 72rem; }
      .max-w-5xl { max-width: 64rem; }
      .max-w-4xl { max-width: 56rem; }
      .max-w-3xl { max-width: 48rem; }
      .max-w-2xl { max-width: 42rem; }
      .max-w-xl { max-width: 36rem; }
      .max-w-lg { max-width: 32rem; }
      .max-w-md { max-width: 28rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
      .min-h-screen { min-height: 100vh; }
      .flex { display: flex; }
      .flex-col { flex-direction: column; }
      .flex-1 { flex: 1 1 0%; }
      @media (min-width: 640px) {
        .container { max-width: 640px; }
      }
      @media (min-width: 768px) {
        .container { max-width: 768px; }
      }
      @media (min-width: 1024px) {
        .container { max-width: 1024px; }
      }
      @media (min-width: 1280px) {
        .container { max-width: 1280px; }
      }
    </style>`;
    
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Server-side rendered SEO meta tags - NEVER default values -->
    <title>${seoData.title}</title>
    ${metaTags}
    
    <!-- Load fonts immediately -->
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
    
    <!-- Critical inline CSS for proper layout -->
    ${inlineCriticalCSS}
    
    <!-- Load built CSS assets -->
${cssLinks}
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3ML90T25MY"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-3ML90T25MY');
    </script>
    
    <!-- Security headers that work in meta tags (removed X-Frame-Options) -->
    <meta http-equiv="X-Content-Type-Options" content="nosniff" />
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
${jsScripts}
  </body>
</html>`;
  }
}
