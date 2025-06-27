
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
  
  <!-- SEO Meta Tags -->
  <title>${seoData.title}</title>
  <meta name="description" content="${seoData.description}" />
  <meta property="og:title" content="${seoData.title}" />
  <meta property="og:description" content="${seoData.description}" />
  <meta property="og:url" content="${seoData.url}" />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${seoData.title}" />
  <meta name="twitter:description" content="${seoData.description}" />
  <link rel="canonical" href="${seoData.url}" />
  
  <!-- Structured Data -->
  ${seoData.structuredData ? `<script type="application/ld+json">${JSON.stringify(seoData.structuredData)}</script>` : ''}
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
  
  <!-- Link to built CSS files -->
  ${cssFiles.map(css => `<link rel="stylesheet" href="${css}" />`).join('\n  ')}
</head>
<body>
  <div id="root">${appHtml}</div>
  
  <!-- Link to built JS files -->
  ${jsFiles.map(js => `<script type="module" src="${js}"></script>`).join('\n  ')}
</body>
</html>`;
}
