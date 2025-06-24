
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
    
    // Separate critical and non-critical JS files
    const criticalJsFiles = jsFiles.filter(file => 
      file.includes('vendor') || 
      file.includes('index') || 
      file.includes('main')
    );
    
    const nonCriticalJsFiles = jsFiles.filter(file => !criticalJsFiles.includes(file));
    
    // Generate critical JS script tags (loaded immediately)
    const criticalJsScripts = criticalJsFiles.map(file => 
      `    <script type="module" src="${file}"></script>`
    ).join('\n');
    
    // Generate non-critical JS script tags (deferred)
    const deferredJsScripts = nonCriticalJsFiles.map(file => 
      `    <script type="module" src="${file}" defer></script>`
    ).join('\n');
    
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
      /* CRITICAL: CSS Custom Properties - EXACT match to Vite build */
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
      
      /* CRITICAL: Base reset - EXACT match to Vite build */
      * { 
        box-sizing: border-box; 
        border-color: hsl(var(--border)); 
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
      
      /* CRITICAL: Layout classes - EXACT match to fund pages */
      .min-h-screen { min-height: 100vh; }
      .w-full { width: 100%; }
      .h-full { height: 100%; }
      .flex { display: flex; }
      .flex-col { flex-direction: column; }
      .flex-row { flex-direction: row; }
      .flex-1 { flex: 1 1 0%; }
      .items-center { align-items: center; }
      .items-start { align-items: flex-start; }
      .items-end { align-items: flex-end; }
      .justify-center { justify-content: center; }
      .justify-between { justify-content: space-between; }
      .justify-start { justify-content: flex-start; }
      .justify-end { justify-content: flex-end; }
      .bg-gray-50 { background-color: rgb(249 250 251); }
      .bg-slate-50 { background-color: rgb(248 250 252); }
      .bg-white { background-color: white; }
      
      /* CRITICAL: Container system - EXACT match to fund pages */
      .container { 
        width: 100%; 
        margin-left: auto; 
        margin-right: auto; 
        padding-left: 1rem; 
        padding-right: 1rem; 
      }
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
      
      /* CRITICAL: Padding system - EXACT match to fund pages */
      .p-0 { padding: 0; }
      .p-1 { padding: 0.25rem; }
      .p-2 { padding: 0.5rem; }
      .p-3 { padding: 0.75rem; }
      .p-4 { padding: 1rem; }
      .p-5 { padding: 1.25rem; }
      .p-6 { padding: 1.5rem; }
      .p-8 { padding: 2rem; }
      .p-10 { padding: 2.5rem; }
      .px-1 { padding-left: 0.25rem; padding-right: 0.25rem; }
      .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
      .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
      .px-4 { padding-left: 1rem; padding-right: 1rem; }
      .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .px-8 { padding-left: 2rem; padding-right: 2rem; }
      .py-1 { padding-top: 0.25rem; padding-bottom: 0.25rem; }
      .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
      .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
      .py-4 { padding-top: 1rem; padding-bottom: 1rem; }
      .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
      .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
      .py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }
      
      /* CRITICAL: Spacing system - EXACT match */
      .space-x-1 > * + * { margin-left: 0.25rem; }
      .space-x-2 > * + * { margin-left: 0.5rem; }
      .space-x-3 > * + * { margin-left: 0.75rem; }
      .space-x-4 > * + * { margin-left: 1rem; }
      .space-y-1 > * + * { margin-top: 0.25rem; }
      .space-y-2 > * + * { margin-top: 0.5rem; }
      .space-y-3 > * + * { margin-top: 0.75rem; }
      .space-y-4 > * + * { margin-top: 1rem; }
      .space-y-5 > * + * { margin-top: 1.25rem; }
      .space-y-6 > * + * { margin-top: 1.5rem; }
      .space-y-8 > * + * { margin-top: 2rem; }
      .space-y-10 > * + * { margin-top: 2.5rem; }
      .gap-1 { gap: 0.25rem; }
      .gap-2 { gap: 0.5rem; }
      .gap-3 { gap: 0.75rem; }
      .gap-4 { gap: 1rem; }
      .gap-6 { gap: 1.5rem; }
      .gap-8 { gap: 2rem; }
      
      /* CRITICAL: Card styling - EXACT match to fund details */
      .rounded { border-radius: 0.25rem; }
      .rounded-sm { border-radius: 0.125rem; }
      .rounded-md { border-radius: 0.375rem; }
      .rounded-lg { border-radius: 0.5rem; }
      .rounded-xl { border-radius: 0.75rem; }
      .rounded-2xl { border-radius: 1rem; }
      .rounded-full { border-radius: 9999px; }
      .shadow { box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06); }
      .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
      .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      .border { border-width: 1px; }
      .border-0 { border-width: 0; }
      .border-b { border-bottom-width: 1px; }
      .border-t { border-top-width: 1px; }
      .border-r { border-right-width: 1px; }
      .border-l { border-left-width: 1px; }
      .border-gray-100 { border-color: rgb(243 244 246); }
      .border-gray-200 { border-color: rgb(229 231 235); }
      .border-gray-300 { border-color: rgb(209 213 219); }
      .border-slate-100 { border-color: rgb(241 245 249); }
      .border-slate-200 { border-color: rgb(226 232 240); }
      .border-green-200 { border-color: rgb(187 247 208); }
      .overflow-hidden { overflow: hidden; }
      .overflow-x-hidden { overflow-x: hidden; }
      .overflow-y-auto { overflow-y: auto; }
      
      /* CRITICAL: Background colors - EXACT match */
      .bg-gray-100 { background-color: rgb(243 244 246); }
      .bg-gray-200 { background-color: rgb(229 231 235); }
      .bg-slate-100 { background-color: rgb(241 245 249); }
      .bg-secondary { background-color: hsl(var(--secondary)); }
      .bg-primary { background-color: hsl(var(--primary)); }
      .bg-green-50 { background-color: rgb(240 253 244); }
      .bg-emerald-50 { background-color: rgb(236 253 245); }
      .bg-green-600 { background-color: rgb(22 163 74); }
      .bg-green-700 { background-color: rgb(21 128 61); }
      .bg-red-50 { background-color: rgb(254 242 242); }
      .bg-red-500 { background-color: rgb(239 68 68); }
      .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
      .from-slate-50 { --tw-gradient-from: rgb(248 250 252); --tw-gradient-to: rgb(248 250 252 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
      .to-slate-100 { --tw-gradient-to: rgb(241 245 249); }
      .from-green-50 { --tw-gradient-from: rgb(240 253 244); --tw-gradient-to: rgb(240 253 244 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
      .to-emerald-50 { --tw-gradient-to: rgb(236 253 245); }
      
      /* CRITICAL: Text colors - EXACT match */
      .text-gray-400 { color: rgb(156 163 175); }
      .text-gray-500 { color: rgb(107 114 128); }
      .text-gray-600 { color: rgb(75 85 99); }
      .text-gray-700 { color: rgb(55 65 81); }
      .text-gray-800 { color: rgb(31 41 55); }
      .text-gray-900 { color: rgb(17 24 39); }
      .text-white { color: white; }
      .text-black { color: black; }
      .text-primary { color: hsl(var(--primary)); }
      .text-green-700 { color: rgb(21 128 61); }
      .text-green-900 { color: rgb(20 83 45); }
      .text-red-600 { color: rgb(220 38 38); }
      .text-red-500 { color: rgb(239 68 68); }
      
      /* CRITICAL: Typography - EXACT match */
      .text-xs { font-size: 0.75rem; line-height: 1rem; }
      .text-sm { font-size: 0.875rem; line-height: 1.25rem; }
      .text-base { font-size: 1rem; line-height: 1.5rem; }
      .text-lg { font-size: 1.125rem; line-height: 1.75rem; }
      .text-xl { font-size: 1.25rem; line-height: 1.75rem; }
      .text-2xl { font-size: 1.5rem; line-height: 2rem; }
      .text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
      .text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
      .text-5xl { font-size: 3rem; line-height: 1; }
      .text-6xl { font-size: 3.75rem; line-height: 1; }
      .font-normal { font-weight: 400; }
      .font-medium { font-weight: 500; }
      .font-semibold { font-weight: 600; }
      .font-bold { font-weight: 700; }
      .text-center { text-align: center; }
      .text-left { text-align: left; }
      .text-right { text-align: right; }
      .leading-tight { line-height: 1.25; }
      .leading-snug { line-height: 1.375; }
      .leading-normal { line-height: 1.5; }
      .leading-relaxed { line-height: 1.625; }
      .tracking-tight { letter-spacing: -0.025em; }
      .tracking-wide { letter-spacing: 0.025em; }
      
      /* CRITICAL: Grid system - EXACT match */
      .grid { display: grid; }
      .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      
      /* CRITICAL: Transitions - EXACT match */
      .transition { 
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke, opacity, box-shadow, transform, filter, backdrop-filter; 
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); 
        transition-duration: 150ms; 
      }
      .transition-colors { 
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke; 
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); 
        transition-duration: 150ms; 
      }
      .transition-shadow { 
        transition-property: box-shadow; 
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); 
        transition-duration: 300ms; 
      }
      .transition-all { 
        transition-property: all; 
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); 
        transition-duration: 150ms; 
      }
      .duration-150 { transition-duration: 150ms; }
      .duration-300 { transition-duration: 300ms; }
      
      /* CRITICAL: Button and interactive element styling */
      .inline-flex { display: inline-flex; }
      .whitespace-nowrap { white-space: nowrap; }
      .ring-offset-background { --tw-ring-offset-color: hsl(var(--background)); }
      .focus-visible\:outline-none:focus-visible { outline: none; }
      .focus-visible\:ring-2:focus-visible { 
        box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow, 0 0 #0000); 
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
      }
      .disabled\:pointer-events-none:disabled { pointer-events: none; }
      .disabled\:opacity-50:disabled { opacity: 0.5; }
      
      /* CRITICAL: Hover states - EXACT match */
      .hover\:bg-primary:hover { background-color: hsl(var(--primary)); }
      .hover\:text-white:hover { color: white; }
      .hover\:bg-gray-100:hover { background-color: rgb(243 244 246); }
      .hover\:bg-slate-100:hover { background-color: rgb(241 245 249); }
      .hover\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
      .hover\:shadow-md:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
      .hover\:bg-green-700:hover { background-color: rgb(21 128 61); }
      .hover\:bg-accent:hover { background-color: hsl(var(--accent)); }
      .hover\:text-accent-foreground:hover { color: hsl(var(--accent-foreground)); }
      .hover\:underline:hover { text-decoration-line: underline; }
      
      /* CRITICAL: Responsive breakpoints - EXACT match */
      @media (min-width: 640px) {
        .container { max-width: 640px; }
        .sm\:px-4 { padding-left: 1rem; padding-right: 1rem; }
        .sm\:py-8 { padding-top: 2rem; padding-bottom: 2rem; }
        .sm\:px-0 { padding-left: 0; padding-right: 0; }
        .sm\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
        .sm\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .sm\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .sm\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .sm\:flex-row { flex-direction: row; }
        .sm\:items-center { align-items: center; }
        .sm\:items-start { align-items: flex-start; }
        .sm\:justify-between { justify-content: space-between; }
        .sm\:w-auto { width: auto; }
        .sm\:mb-4 { margin-bottom: 1rem; }
        .sm\:mb-6 { margin-bottom: 1.5rem; }
        .sm\:mb-8 { margin-bottom: 2rem; }
        .sm\:mb-10 { margin-bottom: 2.5rem; }
        .sm\:space-x-2 > * + * { margin-left: 0.5rem; }
        .sm\:space-x-4 > * + * { margin-left: 1rem; }
      }
      
      @media (min-width: 768px) {
        .container { max-width: 768px; }
        .md\:text-left { text-align: left; }
        .md\:mx-0 { margin-left: 0; margin-right: 0; }
        .md\:text-5xl { font-size: 3rem; line-height: 1; }
        .md\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .md\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .md\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .md\:justify-start { justify-content: flex-start; }
        .md\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .md\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .md\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .md\:py-8 { padding-top: 2rem; padding-bottom: 2rem; }
        .md\:p-6 { padding: 1.5rem; }
        .md\:p-8 { padding: 2rem; }
        .md\:p-10 { padding: 2.5rem; }
        .md\:space-y-8 > * + * { margin-top: 2rem; }
        .md\:rounded-2xl { border-radius: 1rem; }
        .md\:text-base { font-size: 1rem; line-height: 1.5rem; }
        .md\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .md\:gap-4 { gap: 1rem; }
        .md\:flex-row { flex-direction: row; }
        .md\:items-center { align-items: center; }
        .md\:space-x-4 > * + * { margin-left: 1rem; }
        .md\:space-y-0 > * + * { margin-top: 0; }
      }
      
      @media (min-width: 1024px) {
        .container { max-width: 1024px; }
        .lg\:text-6xl { font-size: 3.75rem; line-height: 1; }
        .lg\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
        .lg\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .lg\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .lg\:px-8 { padding-left: 2rem; padding-right: 2rem; }
        .lg\:p-10 { padding: 2.5rem; }
        .lg\:space-y-10 > * + * { margin-top: 2.5rem; }
        .lg\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      }
      
      @media (min-width: 1280px) {
        .container { max-width: 1280px; }
        .xl\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .xl\:text-6xl { font-size: 3.75rem; line-height: 1; }
      }
      
      @media (min-width: 1536px) {
        .container { max-width: 1536px; }
      }
      
      /* CRITICAL: Display utilities */
      .block { display: block; }
      .inline-block { display: inline-block; }
      .inline { display: inline; }
      .hidden { display: none; }
      
      /* CRITICAL: Position utilities */
      .relative { position: relative; }
      .absolute { position: absolute; }
      .fixed { position: fixed; }
      .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
      
      /* CRITICAL: Z-index utilities */
      .z-10 { z-index: 10; }
      .z-20 { z-index: 20; }
      .z-50 { z-index: 50; }
      
      /* CRITICAL: Width and height utilities */
      .w-4 { width: 1rem; }
      .w-5 { width: 1.25rem; }
      .w-6 { width: 1.5rem; }
      .w-8 { width: 2rem; }
      .w-10 { width: 2.5rem; }
      .w-auto { width: auto; }
      .h-4 { height: 1rem; }
      .h-5 { height: 1.25rem; }
      .h-6 { height: 1.5rem; }
      .h-8 { height: 2rem; }
      .h-9 { height: 2.25rem; }
      .h-10 { height: 2.5rem; }
      .h-11 { height: 2.75rem; }
      
      /* CRITICAL: Cursor utilities */
      .cursor-pointer { cursor: pointer; }
      .cursor-default { cursor: default; }
      
      /* CRITICAL: Flex utilities */
      .flex-wrap { flex-wrap: wrap; }
      .flex-nowrap { flex-wrap: nowrap; }
      .items-baseline { align-items: baseline; }
      .justify-end { justify-content: flex-end; }
      .self-start { align-self: flex-start; }
      .self-end { align-self: flex-end; }
      
      /* CRITICAL: Margins */
      .m-0 { margin: 0; }
      .mb-1 { margin-bottom: 0.25rem; }
      .mb-2 { margin-bottom: 0.5rem; }
      .mb-3 { margin-bottom: 0.75rem; }
      .mb-4 { margin-bottom: 1rem; }
      .mb-6 { margin-bottom: 1.5rem; }
      .mb-8 { margin-bottom: 2rem; }
      .mb-10 { margin-bottom: 2.5rem; }
      .mt-1 { margin-top: 0.25rem; }
      .mt-2 { margin-top: 0.5rem; }
      .mt-4 { margin-top: 1rem; }
      .mt-6 { margin-top: 1.5rem; }
      .mt-8 { margin-top: 2rem; }
      .mr-1 { margin-right: 0.25rem; }
      .mr-2 { margin-right: 0.5rem; }
      .mr-3 { margin-right: 0.75rem; }
      .ml-1 { margin-left: 0.25rem; }
      .ml-2 { margin-left: 0.5rem; }
      .ml-3 { margin-left: 0.75rem; }
      .-ml-1 { margin-left: -0.25rem; }
      
      /* CRITICAL: Tag component specific styles - EXACT match */
      .tag {
        display: inline-block;
        background-color: hsl(var(--secondary));
        font-size: 0.875rem;
        padding: 0.5rem;
        border-radius: 0.375rem;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        cursor: pointer;
      }
      
      .tag:hover {
        background-color: hsl(var(--primary));
        color: white;
      }
      
      /* CRITICAL: Additional utilities for fund pages */
      .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
      }
      
      .line-clamp-3 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
      }
      
      .uppercase { text-transform: uppercase; }
      .lowercase { text-transform: lowercase; }
      .capitalize { text-transform: capitalize; }
      .rounded-t-lg { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; }
      .rounded-b-lg { border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; }
      
      /* CRITICAL: Opacity utilities */
      .opacity-0 { opacity: 0; }
      .opacity-50 { opacity: 0.5; }
      .opacity-75 { opacity: 0.75; }
      .opacity-100 { opacity: 1; }
      
      /* CRITICAL: Transform utilities */
      .transform { transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y)); }
      .scale-95 { --tw-scale-x: .95; --tw-scale-y: .95; }
      .scale-100 { --tw-scale-x: 1; --tw-scale-y: 1; }
      
      /* CRITICAL: Button variant styles to match shadcn/ui */
      .btn-outline {
        border: 1px solid hsl(var(--border));
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
      }
      
      .btn-outline:hover {
        background-color: hsl(var(--accent));
        color: hsl(var(--accent-foreground));
      }
      
      .btn-ghost:hover {
        background-color: rgb(240 240 240);
        color: black;
      }
      
      .btn-sm {
        height: 2.25rem;
        border-radius: 0.375rem;
        padding-left: 0.75rem;
        padding-right: 0.75rem;
      }
      
      .btn-default {
        height: 2.5rem;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
      
      .btn-lg {
        height: 2.75rem;
        border-radius: 0.375rem;
        padding-left: 2rem;
        padding-right: 2rem;
      }
      
      /* CRITICAL: Specific fund page button styling */
      .fund-action-buttons {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
      }
      
      @media (min-width: 768px) {
        .fund-action-buttons {
          flex-direction: row;
          align-items: center;
          gap: 1rem;
          width: auto;
        }
      }
      
      /* CRITICAL: Fund header layout fix */
      .fund-header-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      @media (min-width: 768px) {
        .fund-header-content {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }
      }
      
      .fund-header-info {
        flex: 1;
      }
      
      .fund-header-actions {
        flex-shrink: 0;
      }
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
    
    <!-- Load critical JS immediately -->
${criticalJsScripts}
    
    <!-- Load non-critical JS deferred -->
${deferredJsScripts}
    
    <!-- IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! -->
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
  </body>
</html>`;
  }
}
