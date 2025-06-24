
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
    
    <!-- Load built CSS assets (primary) -->
${cssLinks}
    
    <!-- Load SSG fallback styles (critical CSS for immediate rendering) -->
    <style>
      /* Critical CSS inlined to match Vite build exactly */
      :root {
        --background: 0 0% 100%;
        --foreground: 0 0% 0%;
        --card: 0 0% 100%;
        --card-foreground: 0 0% 0%;
        --primary: 0 85% 60%;
        --primary-foreground: 0 0% 100%;
        --secondary: 210 40% 96.1%;
        --muted: 210 40% 96.1%;
        --border: 214.3 31.8% 91.4%;
        --ring: 0 85% 60%;
        --radius: 0.5rem;
      }
      * { box-sizing: border-box; border-color: hsl(var(--border)); }
      html, body, #root { width: 100%; margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; }
      body { background-color: hsl(var(--background)); color: hsl(var(--foreground)); line-height: 1.5; }
      
      /* Essential layout classes that MUST work immediately */
      .min-h-screen { min-height: 100vh; }
      .flex { display: flex; }
      .flex-col { flex-direction: column; }
      .flex-1 { flex: 1 1 0%; }
      .bg-gray-50 { background-color: rgb(249 250 251); }
      .bg-slate-50 { background-color: rgb(248 250 252); }
      .bg-white { background-color: white; }
      
      /* Container system - CRITICAL for fund pages */
      .container { 
        width: 100%; 
        margin-left: auto; 
        margin-right: auto; 
        padding-left: 1rem; 
        padding-right: 1rem; 
      }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .max-w-7xl { max-width: 80rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
      .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
      
      /* Card styling - CRITICAL for fund details */
      .rounded-xl { border-radius: 0.75rem; }
      .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      .border { border-width: 1px; }
      .border-gray-100 { border-color: rgb(243 244 246); }
      .overflow-hidden { overflow: hidden; }
      .transition-shadow { transition-property: box-shadow; transition-duration: 300ms; }
      .duration-300 { transition-duration: 300ms; }
      
      /* Spacing system */
      .space-y-6 > * + * { margin-top: 1.5rem; }
      .space-y-8 > * + * { margin-top: 2rem; }
      .p-4 { padding: 1rem; }
      .p-6 { padding: 1.5rem; }
      .p-8 { padding: 2rem; }
      .p-10 { padding: 2.5rem; }
      
      /* Responsive breakpoints */
      @media (min-width: 640px) {
        .container { max-width: 640px; }
      }
      @media (min-width: 768px) {
        .container { max-width: 768px; }
        .md\:p-6 { padding: 1.5rem; }
        .md\:p-8 { padding: 2rem; }
        .md\:p-10 { padding: 2.5rem; }
        .md\:space-y-8 > * + * { margin-top: 2rem; }
        .md\:rounded-2xl { border-radius: 1rem; }
      }
      @media (min-width: 1024px) {
        .container { max-width: 1024px; }
        .lg\:p-10 { padding: 2.5rem; }
        .lg\:space-y-10 > * + * { margin-top: 2.5rem; }
      }
      @media (min-width: 1280px) {
        .container { max-width: 1280px; }
      }
      @media (min-width: 1536px) {
        .container { max-width: 1536px; }
      }
      
      /* Hover effects */
      .hover\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
    </style>
    
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3ML90T25MY"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-3ML90T25MY');
    </script>
    
    <!-- Security headers that work in meta tags -->
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
