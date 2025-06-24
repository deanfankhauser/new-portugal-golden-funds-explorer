
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
  
  <!-- Critical CSS for SSG -->
  <style>
    /* Tailwind CSS Variables */
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

    /* Base Reset */
    *, *::before, *::after {
      box-sizing: border-box;
      border-width: 0;
      border-style: solid;
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
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    /* CRITICAL: Container System - EXACT MATCH */
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
        padding-left: 1rem;
        padding-right: 1rem;
      }
    }

    @media (min-width: 768px) {
      .container { 
        max-width: 768px; 
        padding-left: 1.5rem;
        padding-right: 1.5rem;
      }
    }

    @media (min-width: 1024px) {
      .container { 
        max-width: 1024px; 
        padding-left: 2rem;
        padding-right: 2rem;
      }
    }

    @media (min-width: 1280px) {
      .container { 
        max-width: 1280px; 
      }
    }

    @media (min-width: 1536px) {
      .container { 
        max-width: 1536px; 
      }
    }

    /* Layout */
    .min-h-screen { min-height: 100vh; }
    .w-full { width: 100%; }
    .h-full { height: 100%; }
    .flex { display: flex; }
    .flex-col { flex-direction: column; }
    .flex-1 { flex: 1 1 0%; }
    .grid { display: grid; }
    .hidden { display: none; }
    .block { display: block; }
    .inline-block { display: inline-block; }

    /* Grid System */
    .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }

    @media (min-width: 1024px) {
      .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .lg\\:col-span-1 { grid-column: span 1 / span 1; }
      .lg\\:col-span-3 { grid-column: span 3 / span 3; }
      .lg\\:block { display: block; }
      .lg\\:hidden { display: none; }
      .lg\\:sticky { position: sticky; }
      .lg\\:top-4 { top: 1rem; }
    }

    /* Responsive Display - CRITICAL */
    @media (min-width: 1024px) {
      .hidden.lg\\:block { display: block; }
    }

    /* Flexbox */
    .items-center { align-items: center; }
    .items-start { align-items: flex-start; }
    .justify-center { justify-content: center; }
    .justify-between { justify-content: space-between; }
    .justify-start { justify-content: flex-start; }

    /* Spacing */
    .space-y-4 > * + * { margin-top: 1rem; }
    .space-y-5 > * + * { margin-top: 1.25rem; }
    .space-y-6 > * + * { margin-top: 1.5rem; }
    .space-y-8 > * + * { margin-top: 2rem; }

    .gap-2 { gap: 0.5rem; }
    .gap-3 { gap: 0.75rem; }
    .gap-4 { gap: 1rem; }
    .gap-6 { gap: 1.5rem; }

    /* Max Width */
    .max-w-7xl { max-width: 80rem; }
    .max-w-5xl { max-width: 64rem; }
    .max-w-4xl { max-width: 56rem; }
    .max-w-md { max-width: 28rem; }
    .mx-auto { margin-left: auto; margin-right: auto; }

    /* Text */
    .text-center { text-align: center; }
    .text-left { text-align: left; }

    @media (min-width: 768px) {
      .md\\:text-left { text-align: left; }
      .md\\:mx-0 { margin-left: 0; margin-right: 0; }
      .md\\:justify-start { justify-content: flex-start; }
    }

    /* Typography */
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

    /* Responsive Typography */
    @media (min-width: 640px) {
      .sm\\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
      .sm\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
      .sm\\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
      .sm\\:text-base { font-size: 1rem; line-height: 1.5rem; }
    }

    @media (min-width: 768px) {
      .md\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
      .md\\:text-5xl { font-size: 3rem; line-height: 1; }
      .md\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
    }

    @media (min-width: 1024px) {
      .lg\\:text-5xl { font-size: 3rem; line-height: 1; }
      .lg\\:text-6xl { font-size: 3.75rem; line-height: 1; }
    }

    @media (min-width: 1280px) {
      .xl\\:text-6xl { font-size: 3.75rem; line-height: 1; }
    }

    /* Font Weights */
    .font-normal { font-weight: 400; }
    .font-medium { font-weight: 500; }
    .font-semibold { font-weight: 600; }
    .font-bold { font-weight: 700; }

    /* Leading */
    .leading-tight { line-height: 1.25; }
    .leading-relaxed { line-height: 1.625; }

    /* Colors */
    .bg-white { background-color: white; }
    .bg-slate-50 { background-color: rgb(248 250 252); }
    .bg-gray-50 { background-color: rgb(249 250 251); }
    .bg-gray-100 { background-color: rgb(243 244 246); }
    .bg-gray-200 { background-color: rgb(229 231 235); }
    .bg-blue-50 { background-color: rgb(239 246 255); }
    .bg-blue-100 { background-color: rgb(219 234 254); }
    .bg-blue-600 { background-color: rgb(37 99 235); }
    .bg-indigo-50 { background-color: rgb(238 242 255); }
    .bg-secondary { background-color: hsl(var(--secondary)); }
    .bg-primary { background-color: hsl(var(--primary)); }

    /* Gradients */
    .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
    .from-blue-50 { --tw-gradient-from: rgb(239 246 255); --tw-gradient-to: rgb(239 246 255 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
    .to-indigo-50 { --tw-gradient-to: rgb(238 242 255); }

    /* Text Colors */
    .text-gray-500 { color: rgb(107 114 128); }
    .text-gray-600 { color: rgb(75 85 99); }
    .text-gray-700 { color: rgb(55 65 81); }
    .text-gray-800 { color: rgb(31 41 55); }
    .text-gray-900 { color: rgb(17 24 39); }
    .text-blue-600 { color: rgb(37 99 235); }
    .text-blue-700 { color: rgb(29 78 216); }
    .text-blue-900 { color: rgb(30 58 138); }
    .text-white { color: white; }

    /* Padding */
    .p-2 { padding: 0.5rem; }
    .p-4 { padding: 1rem; }
    .p-5 { padding: 1.25rem; }
    .p-6 { padding: 1.5rem; }
    .p-8 { padding: 2rem; }
    .px-2 { padding-left: 0.5rem; padding-right: 0.5rem; }
    .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
    .px-4 { padding-left: 1rem; padding-right: 1rem; }
    .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
    .py-6 { padding-top: 1.5rem; padding-bottom: 1.5rem; }
    .py-8 { padding-top: 2rem; padding-bottom: 2rem; }
    .py-10 { padding-top: 2.5rem; padding-bottom: 2.5rem; }

    /* Responsive Padding */
    @media (min-width: 640px) {
      .sm\\:px-0 { padding-left: 0; padding-right: 0; }
      .sm\\:px-4 { padding-left: 1rem; padding-right: 1rem; }
      .sm\\:py-8 { padding-top: 2rem; padding-bottom: 2rem; }
      .sm\\:p-5 { padding: 1.25rem; }
    }

    @media (min-width: 1024px) {
      .lg\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
    }

    /* Margins */
    .mb-2 { margin-bottom: 0.5rem; }
    .mb-3 { margin-bottom: 0.75rem; }
    .mb-4 { margin-bottom: 1rem; }
    .mb-6 { margin-bottom: 1.5rem; }
    .mb-8 { margin-bottom: 2rem; }
    .mb-10 { margin-bottom: 2.5rem; }
    .mr-2 { margin-right: 0.5rem; }

    /* Responsive Margins */
    @media (min-width: 640px) {
      .sm\\:mb-4 { margin-bottom: 1rem; }
      .sm\\:mb-6 { margin-bottom: 1.5rem; }
      .sm\\:mb-8 { margin-bottom: 2rem; }
      .sm\\:mb-10 { margin-bottom: 2.5rem; }
      .sm\\:space-y-6 > * + * { margin-top: 1.5rem; }
    }

    @media (min-width: 768px) {
      .md\\:mb-6 { margin-bottom: 1.5rem; }
      .md\\:mb-8 { margin-bottom: 2rem; }
    }

    /* Borders */
    .border { border-width: 1px; }
    .border-gray-200 { border-color: rgb(229 231 235); }
    .border-blue-200 { border-color: rgb(191 219 254); }
    .rounded-lg { border-radius: 0.5rem; }
    .rounded-xl { border-radius: 0.75rem; }

    /* Shadows */
    .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }

    /* Buttons */
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.375rem;
      border-width: 1px;
      border-color: transparent;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0.5rem 1rem;
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
      cursor: pointer;
      text-decoration: none;
    }

    /* Button Variants */
    .btn-primary {
      background-color: rgb(37 99 235);
      color: white;
      height: 2.75rem;
    }

    .btn-primary:hover {
      background-color: rgb(29 78 216);
    }

    .btn-outline {
      background-color: transparent;
      border-color: rgb(229 231 235);
      color: rgb(17 24 39);
    }

    .btn-outline:hover {
      background-color: rgb(249 250 251);
    }

    /* Width utilities */
    .w-full { width: 100%; }
    .w-16 { width: 4rem; }
    .h-4 { height: 1rem; }
    .h-5 { height: 1.25rem; }
    .h-8 { height: 2rem; }
    .h-11 { height: 2.75rem; }
    .h-12 { height: 3rem; }
    .h-16 { height: 4rem; }

    /* Responsive heights */
    @media (min-width: 640px) {
      .sm\\:h-12 { height: 3rem; }
    }

    /* Flexbox utilities */
    .flex-shrink-0 { flex-shrink: 0; }
    .min-w-0 { min-width: 0; }

    /* Transitions */
    .transition-colors {
      transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
      transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
      transition-duration: 150ms;
    }

    /* Order utilities - CRITICAL FOR MOBILE/DESKTOP LAYOUT */
    .order-1 { order: 1; }
    .order-2 { order: 2; }

    @media (min-width: 1024px) {
      .lg\\:order-1 { order: 1; }
      .lg\\:order-2 { order: 2; }
    }

    /* Mobile Filter Toggle - CRITICAL */
    @media (min-width: 1024px) {
      .lg\\:hidden { display: none !important; }
    }

    /* Cursor */
    .cursor-pointer { cursor: pointer; }

    /* Icons */
    .lucide-icon {
      width: 1rem;
      height: 1rem;
      stroke: currentColor;
      stroke-width: 2;
      stroke-linecap: round;
      stroke-linejoin: round;
      fill: none;
    }

    /* Tag styles */
    .tag {
      display: inline-block;
      background-color: hsl(var(--secondary));
      font-size: 0.875rem;
      padding: 0.5rem;
      border-radius: 0.375rem;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
      transition: all 150ms ease;
      cursor: pointer;
    }

    .tag:hover {
      background-color: hsl(var(--primary));
      color: white;
    }

    /* Position */
    .relative { position: relative; }
    .sticky { position: sticky; }

    /* Form elements */
    input, textarea, select {
      font-family: inherit;
      font-size: 100%;
      font-weight: inherit;
      line-height: inherit;
      color: inherit;
      margin: 0;
      padding: 0;
    }

    /* Focus styles */
    button:focus,
    input:focus,
    textarea:focus,
    select:focus {
      outline: 2px solid hsl(var(--ring));
      outline-offset: 2px;
    }

    /* Print styles */
    @media print {
      *, *::before, *::after {
        background: transparent !important;
        color: black !important;
        box-shadow: none !important;
        text-shadow: none !important;
      }
    }
  </style>
  
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
