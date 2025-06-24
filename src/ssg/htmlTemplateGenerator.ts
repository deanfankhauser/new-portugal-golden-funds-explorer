
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
    
    // Generate JS script tags (load immediately, no preload)
    const jsScripts = jsFiles.map(file => 
      `    <script type="module" src="${file}"></script>`
    ).join('\n');
    
    return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    
    <!-- Server-side rendered SEO meta tags -->
    <title>${seoData.title}</title>
    ${metaTags}
    
    <!-- Load fonts immediately -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" />
    
    <!-- Load built CSS assets -->
${cssLinks}
    
    <!-- Critical CSS for immediate rendering - EXACT match to Vite build -->
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
        --chart-1: 12 76% 61%;
        --chart-2: 173 58% 39%;
        --chart-3: 197 37% 24%;
        --chart-4: 43 74% 66%;
        --chart-5: 27 87% 67%;
      }
      
      /* CRITICAL: Universal reset - EXACT match to Vite build */
      *, *::before, *::after { 
        box-sizing: border-box; 
        border-width: 0;
        border-style: solid;
        border-color: hsl(var(--border)); 
      }
      
      /* CRITICAL: HTML and body reset */
      html {
        line-height: 1.5;
        -webkit-text-size-adjust: 100%;
        -moz-tab-size: 4;
        tab-size: 4;
        font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
        font-feature-settings: normal;
        font-variation-settings: normal;
      }
      
      body {
        margin: 0;
        line-height: inherit;
      }
      
      hr {
        height: 0;
        color: inherit;
        border-top-width: 1px;
      }
      
      abbr:where([title]) {
        text-decoration: underline dotted;
      }
      
      h1, h2, h3, h4, h5, h6 {
        font-size: inherit;
        font-weight: inherit;
      }
      
      a {
        color: inherit;
        text-decoration: inherit;
      }
      
      b, strong {
        font-weight: bolder;
      }
      
      code, kbd, samp, pre {
        font-family: ui-monospace, SFMono-Regular, "Roboto Mono", "Consolas", "Liberation Mono", "Menlo", monospace;
        font-size: 1em;
      }
      
      small {
        font-size: 80%;
      }
      
      sub, sup {
        font-size: 75%;
        line-height: 0;
        position: relative;
        vertical-align: baseline;
      }
      
      sub {
        bottom: -0.25em;
      }
      
      sup {
        top: -0.5em;
      }
      
      table {
        text-indent: 0;
        border-color: inherit;
        border-collapse: collapse;
      }
      
      button, input, optgroup, select, textarea {
        font-family: inherit;
        font-feature-settings: inherit;
        font-variation-settings: inherit;
        font-size: 100%;
        font-weight: inherit;
        line-height: inherit;
        color: inherit;
        margin: 0;
        padding: 0;
      }
      
      button, select {
        text-transform: none;
      }
      
      button, [type='button'], [type='reset'], [type='submit'] {
        -webkit-appearance: button;
        background-color: transparent;
        background-image: none;
      }
      
      :-moz-focusring {
        outline: auto;
      }
      
      :-moz-ui-invalid {
        box-shadow: none;
      }
      
      progress {
        vertical-align: baseline;
      }
      
      ::-webkit-inner-spin-button, ::-webkit-outer-spin-button {
        height: auto;
      }
      
      [type='search'] {
        -webkit-appearance: textfield;
        outline-offset: -2px;
      }
      
      ::-webkit-search-decoration {
        -webkit-appearance: none;
      }
      
      ::-webkit-file-upload-button {
        -webkit-appearance: button;
        font: inherit;
      }
      
      summary {
        display: list-item;
      }
      
      blockquote, dl, dd, h1, h2, h3, h4, h5, h6, hr, figure, p, pre {
        margin: 0;
      }
      
      fieldset {
        margin: 0;
        padding: 0;
      }
      
      legend {
        padding: 0;
      }
      
      ol, ul, menu {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      
      dialog {
        padding: 0;
      }
      
      textarea {
        resize: vertical;
      }
      
      input::placeholder, textarea::placeholder {
        opacity: 1;
        color: #9ca3af;
      }
      
      button, [role="button"] {
        cursor: pointer;
      }
      
      :disabled {
        cursor: default;
      }
      
      img, svg, video, canvas, audio, iframe, embed, object {
        display: block;
        vertical-align: middle;
      }
      
      img, video {
        max-width: 100%;
        height: auto;
      }
      
      [hidden] {
        display: none;
      }
      
      /* CRITICAL: Base application styles */
      html, body, #root { 
        width: 100%; 
        height: 100%;
        margin: 0; 
        padding: 0; 
        overflow-x: hidden;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
        font-feature-settings: "cv02", "cv03", "cv04", "cv11";
        font-variation-settings: normal;
      }
      
      body { 
        background-color: hsl(var(--background)); 
        color: hsl(var(--foreground)); 
        line-height: 1.5; 
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      /* CRITICAL: Layout utilities - EXACT match to Tailwind */
      .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
      
      .pointer-events-none { pointer-events: none; }
      .pointer-events-auto { pointer-events: auto; }
      .visible { visibility: visible; }
      .invisible { visibility: hidden; }
      .static { position: static; }
      .fixed { position: fixed; }
      .absolute { position: absolute; }
      .relative { position: relative; }
      .sticky { position: sticky; }
      .inset-0 { inset: 0px; }
      .inset-x-0 { left: 0px; right: 0px; }
      .inset-y-0 { top: 0px; bottom: 0px; }
      .start-0 { inset-inline-start: 0px; }
      .end-0 { inset-inline-end: 0px; }
      .top-0 { top: 0px; }
      .right-0 { right: 0px; }
      .bottom-0 { bottom: 0px; }
      .left-0 { left: 0px; }
      .top-1 { top: 0.25rem; }
      .right-1 { right: 0.25rem; }
      .bottom-1 { bottom: 0.25rem; }
      .left-1 { left: 0.25rem; }
      .top-2 { top: 0.5rem; }
      .right-2 { right: 0.5rem; }
      .bottom-2 { bottom: 0.5rem; }
      .left-2 { left: 0.5rem; }
      .top-3 { top: 0.75rem; }
      .right-3 { right: 0.75rem; }
      .bottom-3 { bottom: 0.75rem; }
      .left-3 { left: 0.75rem; }
      .top-4 { top: 1rem; }
      .right-4 { right: 1rem; }
      .bottom-4 { bottom: 1rem; }
      .left-4 { left: 1rem; }
      .-top-1 { top: -0.25rem; }
      .-right-1 { right: -0.25rem; }
      .-bottom-1 { bottom: -0.25rem; }
      .-left-1 { left: -0.25rem; }
      
      .isolate { isolation: isolate; }
      .isolation-auto { isolation: auto; }
      
      .z-0 { z-index: 0; }
      .z-10 { z-index: 10; }
      .z-20 { z-index: 20; }
      .z-30 { z-index: 30; }
      .z-40 { z-index: 40; }
      .z-50 { z-index: 50; }
      .-z-10 { z-index: -10; }
      
      .order-1 { order: 1; }
      .order-2 { order: 2; }
      .order-3 { order: 3; }
      .order-4 { order: 4; }
      .order-5 { order: 5; }
      .order-6 { order: 6; }
      .order-7 { order: 7; }
      .order-8 { order: 8; }
      .order-9 { order: 9; }
      .order-10 { order: 10; }
      .order-11 { order: 11; }
      .order-12 { order: 12; }
      .order-first { order: -9999; }
      .order-last { order: 9999; }
      .order-none { order: 0; }
      
      .col-auto { grid-column: auto; }
      .col-span-1 { grid-column: span 1 / span 1; }
      .col-span-2 { grid-column: span 2 / span 2; }
      .col-span-3 { grid-column: span 3 / span 3; }
      .col-span-4 { grid-column: span 4 / span 4; }
      .col-span-5 { grid-column: span 5 / span 5; }
      .col-span-6 { grid-column: span 6 / span 6; }
      .col-span-7 { grid-column: span 7 / span 7; }
      .col-span-8 { grid-column: span 8 / span 8; }
      .col-span-9 { grid-column: span 9 / span 9; }
      .col-span-10 { grid-column: span 10 / span 10; }
      .col-span-11 { grid-column: span 11 / span 11; }
      .col-span-12 { grid-column: span 12 / span 12; }
      .col-span-full { grid-column: 1 / -1; }
      .col-start-1 { grid-column-start: 1; }
      .col-start-2 { grid-column-start: 2; }
      .col-start-3 { grid-column-start: 3; }
      .col-start-4 { grid-column-start: 4; }
      .col-start-5 { grid-column-start: 5; }
      .col-start-6 { grid-column-start: 6; }
      .col-start-7 { grid-column-start: 7; }
      .col-start-8 { grid-column-start: 8; }
      .col-start-9 { grid-column-start: 9; }
      .col-start-10 { grid-column-start: 10; }
      .col-start-11 { grid-column-start: 11; }
      .col-start-12 { grid-column-start: 12; }
      .col-start-13 { grid-column-start: 13; }
      .col-start-auto { grid-column-start: auto; }
      .col-end-1 { grid-column-end: 1; }
      .col-end-2 { grid-column-end: 2; }
      .col-end-3 { grid-column-end: 3; }
      .col-end-4 { grid-column-end: 4; }
      .col-end-5 { grid-column-end: 5; }
      .col-end-6 { grid-column-end: 6; }
      .col-end-7 { grid-column-end: 7; }
      .col-end-8 { grid-column-end: 8; }
      .col-end-9 { grid-column-end: 9; }
      .col-end-10 { grid-column-end: 10; }
      .col-end-11 { grid-column-end: 11; }
      .col-end-12 { grid-column-end: 12; }
      .col-end-13 { grid-column-end: 13; }
      .col-end-auto { grid-column-end: auto; }
      
      .row-auto { grid-row: auto; }
      .row-span-1 { grid-row: span 1 / span 1; }
      .row-span-2 { grid-row: span 2 / span 2; }
      .row-span-3 { grid-row: span 3 / span 3; }
      .row-span-4 { grid-row: span 4 / span 4; }
      .row-span-5 { grid-row: span 5 / span 5; }
      .row-span-6 { grid-row: span 6 / span 6; }
      .row-span-full { grid-row: 1 / -1; }
      .row-start-1 { grid-row-start: 1; }
      .row-start-2 { grid-row-start: 2; }
      .row-start-3 { grid-row-start: 3; }
      .row-start-4 { grid-row-start: 4; }
      .row-start-5 { grid-row-start: 5; }
      .row-start-6 { grid-row-start: 6; }
      .row-start-7 { grid-row-start: 7; }
      .row-start-auto { grid-row-start: auto; }
      .row-end-1 { grid-row-end: 1; }
      .row-end-2 { grid-row-end: 2; }
      .row-end-3 { grid-row-end: 3; }
      .row-end-4 { grid-row-end: 4; }
      .row-end-5 { grid-row-end: 5; }
      .row-end-6 { grid-row-end: 6; }
      .row-end-7 { grid-row-end: 7; }
      .row-end-auto { grid-row-end: auto; }
      
      .float-right { float: right; }
      .float-left { float: left; }
      .float-none { float: none; }
      
      .clear-left { clear: left; }
      .clear-right { clear: right; }
      .clear-both { clear: both; }
      .clear-none { clear: none; }
      
      .m-0 { margin: 0px; }
      .m-1 { margin: 0.25rem; }
      .m-2 { margin: 0.5rem; }
      .m-3 { margin: 0.75rem; }
      .m-4 { margin: 1rem; }
      .m-5 { margin: 1.25rem; }
      .m-6 { margin: 1.5rem; }
      .m-7 { margin: 1.75rem; }
      .m-8 { margin: 2rem; }
      .m-9 { margin: 2.25rem; }
      .m-10 { margin: 2.5rem; }
      .m-11 { margin: 2.75rem; }
      .m-12 { margin: 3rem; }
      .m-14 { margin: 3.5rem; }
      .m-16 { margin: 4rem; }
      .m-20 { margin: 5rem; }
      .m-24 { margin: 6rem; }
      .m-28 { margin: 7rem; }
      .m-32 { margin: 8rem; }
      .m-36 { margin: 9rem; }
      .m-40 { margin: 10rem; }
      .m-44 { margin: 11rem; }
      .m-48 { margin: 12rem; }
      .m-52 { margin: 13rem; }
      .m-56 { margin: 14rem; }
      .m-60 { margin: 15rem; }
      .m-64 { margin: 16rem; }
      .m-72 { margin: 18rem; }
      .m-80 { margin: 20rem; }
      .m-96 { margin: 24rem; }
      .m-auto { margin: auto; }
      .m-px { margin: 1px; }
      .m-0\.5 { margin: 0.125rem; }
      .m-1\.5 { margin: 0.375rem; }
      .m-2\.5 { margin: 0.625rem; }
      .m-3\.5 { margin: 0.875rem; }
      .-m-0 { margin: 0px; }
      .-m-1 { margin: -0.25rem; }
      .-m-2 { margin: -0.5rem; }
      .-m-3 { margin: -0.75rem; }
      .-m-4 { margin: -1rem; }
      .-m-5 { margin: -1.25rem; }
      .-m-6 { margin: -1.5rem; }
      .-m-7 { margin: -1.75rem; }
      .-m-8 { margin: -2rem; }
      .-m-9 { margin: -2.25rem; }
      .-m-10 { margin: -2.5rem; }
      .-m-11 { margin: -2.75rem; }
      .-m-12 { margin: -3rem; }
      .-m-14 { margin: -3.5rem; }
      .-m-16 { margin: -4rem; }
      .-m-20 { margin: -5rem; }
      .-m-24 { margin: -6rem; }
      .-m-28 { margin: -7rem; }
      .-m-32 { margin: -8rem; }
      .-m-36 { margin: -9rem; }
      .-m-40 { margin: -10rem; }
      .-m-44 { margin: -11rem; }
      .-m-48 { margin: -12rem; }
      .-m-52 { margin: -13rem; }
      .-m-56 { margin: -14rem; }
      .-m-60 { margin: -15rem; }
      .-m-64 { margin: -16rem; }
      .-m-72 { margin: -18rem; }
      .-m-80 { margin: -20rem; }
      .-m-96 { margin: -24rem; }
      .-m-px { margin: -1px; }
      .-m-0\.5 { margin: -0.125rem; }
      .-m-1\.5 { margin: -0.375rem; }
      .-m-2\.5 { margin: -0.625rem; }
      .-m-3\.5 { margin: -0.875rem; }
      .mx-0 { margin-left: 0px; margin-right: 0px; }
      .mx-1 { margin-left: 0.25rem; margin-right: 0.25rem; }
      .mx-2 { margin-left: 0.5rem; margin-right: 0.5rem; }
      .mx-3 { margin-left: 0.75rem; margin-right: 0.75rem; }
      .mx-4 { margin-left: 1rem; margin-right: 1rem; }
      .mx-5 { margin-left: 1.25rem; margin-right: 1.25rem; }
      .mx-6 { margin-left: 1.5rem; margin-right: 1.5rem; }
      .mx-7 { margin-left: 1.75rem; margin-right: 1.75rem; }
      .mx-8 { margin-left: 2rem; margin-right: 2rem; }
      .mx-9 { margin-left: 2.25rem; margin-right: 2.25rem; }
      .mx-10 { margin-left: 2.5rem; margin-right: 2.5rem; }
      .mx-11 { margin-left: 2.75rem; margin-right: 2.75rem; }
      .mx-12 { margin-left: 3rem; margin-right: 3rem; }
      .mx-14 { margin-left: 3.5rem; margin-right: 3.5rem; }
      .mx-16 { margin-left: 4rem; margin-right: 4rem; }
      .mx-20 { margin-left: 5rem; margin-right: 5rem; }
      .mx-24 { margin-left: 6rem; margin-right: 6rem; }
      .mx-28 { margin-left: 7rem; margin-right: 7rem; }
      .mx-32 { margin-left: 8rem; margin-right: 8rem; }
      .mx-36 { margin-left: 9rem; margin-right: 9rem; }
      .mx-40 { margin-left: 10rem; margin-right: 10rem; }
      .mx-44 { margin-left: 11rem; margin-right: 11rem; }
      .mx-48 { margin-left: 12rem; margin-right: 12rem; }
      .mx-52 { margin-left: 13rem; margin-right: 13rem; }
      .mx-56 { margin-left: 14rem; margin-right: 14rem; }
      .mx-60 { margin-left: 15rem; margin-right: 15rem; }
      .mx-64 { margin-left: 16rem; margin-right: 16rem; }
      .mx-72 { margin-left: 18rem; margin-right: 18rem; }
      .mx-80 { margin-left: 20rem; margin-right: 20rem; }
      .mx-96 { margin-left: 24rem; margin-right: 24rem; }
      .mx-auto { margin-left: auto; margin-right: auto; }
      .mx-px { margin-left: 1px; margin-right: 1px; }
      .mx-0\.5 { margin-left: 0.125rem; margin-right: 0.125rem; }
      .mx-1\.5 { margin-left: 0.375rem; margin-right: 0.375rem; }
      .mx-2\.5 { margin-left: 0.625rem; margin-right: 0.625rem; }
      .mx-3\.5 { margin-left: 0.875rem; margin-right: 0.875rem; }
      .-mx-0 { margin-left: 0px; margin-right: 0px; }
      .-mx-1 { margin-left: -0.25rem; margin-right: -0.25rem; }
      .-mx-2 { margin-left: -0.5rem; margin-right: -0.5rem; }
      .-mx-3 { margin-left: -0.75rem; margin-right: -0.75rem; }
      .-mx-4 { margin-left: -1rem; margin-right: -1rem; }
      .-mx-5 { margin-left: -1.25rem; margin-right: -1.25rem; }
      .-mx-6 { margin-left: -1.5rem; margin-right: -1.5rem; }
      .-mx-7 { margin-left: -1.75rem; margin-right: -1.75rem; }
      .-mx-8 { margin-left: -2rem; margin-right: -2rem; }
      .-mx-9 { margin-left: -2.25rem; margin-right: -2.25rem; }
      .-mx-10 { margin-left: -2.5rem; margin-right: -2.5rem; }
      .-mx-11 { margin-left: -2.75rem; margin-right: -2.75rem; }
      .-mx-12 { margin-left: -3rem; margin-right: -3rem; }
      .-mx-14 { margin-left: -3.5rem; margin-right: -3.5rem; }
      .-mx-16 { margin-left: -4rem; margin-right: -4rem; }
      .-mx-20 { margin-left: -5rem; margin-right: -5rem; }
      .-mx-24 { margin-left: -6rem; margin-right: -6rem; }
      .-mx-28 { margin-left: -7rem; margin-right: -7rem; }
      .-mx-32 { margin-left: -8rem; margin-right: -8rem; }
      .-mx-36 { margin-left: -9rem; margin-right: -9rem; }
      .-mx-40 { margin-left: -10rem; margin-right: -10rem; }
      .-mx-44 { margin-left: -11rem; margin-right: -11rem; }
      .-mx-48 { margin-left: -12rem; margin-right: -12rem; }
      .-mx-52 { margin-left: -13rem; margin-right: -13rem; }
      .-mx-56 { margin-left: -14rem; margin-right: -14rem; }
      .-mx-60 { margin-left: -15rem; margin-right: -15rem; }
      .-mx-64 { margin-left: -16rem; margin-right: -16rem; }
      .-mx-72 { margin-left: -18rem; margin-right: -18rem; }
      .-mx-80 { margin-left: -20rem; margin-right: -20rem; }
      .-mx-96 { margin-left: -24rem; margin-right: -24rem; }
      .-mx-px { margin-left: -1px; margin-right: -1px; }
      .-mx-0\.5 { margin-left: -0.125rem; margin-right: -0.125rem; }
      .-mx-1\.5 { margin-left: -0.375rem; margin-right: -0.375rem; }
      .-mx-2\.5 { margin-left: -0.625rem; margin-right: -0.625rem; }
      .-mx-3\.5 { margin-left: -0.875rem; margin-right: -0.875rem; }
      .my-0 { margin-top: 0px; margin-bottom: 0px; }
      .my-1 { margin-top: 0.25rem; margin-bottom: 0.25rem; }
      .my-2 { margin-top: 0.5rem; margin-bottom: 0.5rem; }
      .my-3 { margin-top: 0.75rem; margin-bottom: 0.75rem; }
      .my-4 { margin-top: 1rem; margin-bottom: 1rem; }
      .my-5 { margin-top: 1.25rem; margin-bottom: 1.25rem; }
      .my-6 { margin-top: 1.5rem; margin-bottom: 1.5rem; }
      .my-7 { margin-top: 1.75rem; margin-bottom: 1.75rem; }
      .my-8 { margin-top: 2rem; margin-bottom: 2rem; }
      .my-9 { margin-top: 2.25rem; margin-bottom: 2.25rem; }
      .my-10 { margin-top: 2.5rem; margin-bottom: 2.5rem; }
      .my-11 { margin-top: 2.75rem; margin-bottom: 2.75rem; }
      .my-12 { margin-top: 3rem; margin-bottom: 3rem; }
      .my-14 { margin-top: 3.5rem; margin-bottom: 3.5rem; }
      .my-16 { margin-top: 4rem; margin-bottom: 4rem; }
      .my-20 { margin-top: 5rem; margin-bottom: 5rem; }
      .my-24 { margin-top: 6rem; margin-bottom: 6rem; }
      .my-28 { margin-top: 7rem; margin-bottom: 7rem; }
      .my-32 { margin-top: 8rem; margin-bottom: 8rem; }
      .my-36 { margin-top: 9rem; margin-bottom: 9rem; }
      .my-40 { margin-top: 10rem; margin-bottom: 10rem; }
      .my-44 { margin-top: 11rem; margin-bottom: 11rem; }
      .my-48 { margin-top: 12rem; margin-bottom: 12rem; }
      .my-52 { margin-top: 13rem; margin-bottom: 13rem; }
      .my-56 { margin-top: 14rem; margin-bottom: 14rem; }
      .my-60 { margin-top: 15rem; margin-bottom: 15rem; }
      .my-64 { margin-top: 16rem; margin-bottom: 16rem; }
      .my-72 { margin-top: 18rem; margin-bottom: 18rem; }
      .my-80 { margin-top: 20rem; margin-bottom: 20rem; }
      .my-96 { margin-top: 24rem; margin-bottom: 24rem; }
      .my-auto { margin-top: auto; margin-bottom: auto; }
      .my-px { margin-top: 1px; margin-bottom: 1px; }
      .my-0\.5 { margin-top: 0.125rem; margin-bottom: 0.125rem; }
      .my-1\.5 { margin-top: 0.375rem; margin-bottom: 0.375rem; }
      .my-2\.5 { margin-top: 0.625rem; margin-bottom: 0.625rem; }
      .my-3\.5 { margin-top: 0.875rem; margin-bottom: 0.875rem; }
      .-my-0 { margin-top: 0px; margin-bottom: 0px; }
      .-my-1 { margin-top: -0.25rem; margin-bottom: -0.25rem; }
      .-my-2 { margin-top: -0.5rem; margin-bottom: -0.5rem; }
      .-my-3 { margin-top: -0.75rem; margin-bottom: -0.75rem; }
      .-my-4 { margin-top: -1rem; margin-bottom: -1rem; }
      .-my-5 { margin-top: -1.25rem; margin-bottom: -1.25rem; }
      .-my-6 { margin-top: -1.5rem; margin-bottom: -1.5rem; }
      .-my-7 { margin-top: -1.75rem; margin-bottom: -1.75rem; }
      .-my-8 { margin-top: -2rem; margin-bottom: -2rem; }
      .-my-9 { margin-top: -2.25rem; margin-bottom: -2.25rem; }
      .-my-10 { margin-top: -2.5rem; margin-bottom: -2.5rem; }
      .-my-11 { margin-top: -2.75rem; margin-bottom: -2.75rem; }
      .-my-12 { margin-top: -3rem; margin-bottom: -3rem; }
      .-my-14 { margin-top: -3.5rem; margin-bottom: -3.5rem; }
      .-my-16 { margin-top: -4rem; margin-bottom: -4rem; }
      .-my-20 { margin-top: -5rem; margin-bottom: -5rem; }
      .-my-24 { margin-top: -6rem; margin-bottom: -6rem; }
      .-my-28 { margin-top: -7rem; margin-bottom: -7rem; }
      .-my-32 { margin-top: -8rem; margin-bottom: -8rem; }
      .-my-36 { margin-top: -9rem; margin-bottom: -9rem; }
      .-my-40 { margin-top: -10rem; margin-bottom: -10rem; }
      .-my-44 { margin-top: -11rem; margin-bottom: -11rem; }
      .-my-48 { margin-top: -12rem; margin-bottom: -12rem; }
      .-my-52 { margin-top: -13rem; margin-bottom: -13rem; }
      .-my-56 { margin-top: -14rem; margin-bottom: -14rem; }
      .-my-60 { margin-top: -15rem; margin-bottom: -15rem; }
      .-my-64 { margin-top: -16rem; margin-bottom: -16rem; }
      .-my-72 { margin-top: -18rem; margin-bottom: -18rem; }
      .-my-80 { margin-top: -20rem; margin-bottom: -20rem; }
      .-my-96 { margin-top: -24rem; margin-bottom: -24rem; }
      .-my-px { margin-top: -1px; margin-bottom: -1px; }
      .-my-0\.5 { margin-top: -0.125rem; margin-bottom: -0.125rem; }
      .-my-1\.5 { margin-top: -0.375rem; margin-bottom: -0.375rem; }
      .-my-2\.5 { margin-top: -0.625rem; margin-bottom: -0.625rem; }
      .-my-3\.5 { margin-top: -0.875rem; margin-bottom: -0.875rem; }
      .ms-0 { margin-inline-start: 0px; }
      .ms-1 { margin-inline-start: 0.25rem; }
      .ms-2 { margin-inline-start: 0.5rem; }
      .ms-3 { margin-inline-start: 0.75rem; }
      .ms-4 { margin-inline-start: 1rem; }
      .ms-5 { margin-inline-start: 1.25rem; }
      .ms-6 { margin-inline-start: 1.5rem; }
      .ms-7 { margin-inline-start: 1.75rem; }
      .ms-8 { margin-inline-start: 2rem; }
      .ms-9 { margin-inline-start: 2.25rem; }
      .ms-10 { margin-inline-start: 2.5rem; }
      .ms-11 { margin-inline-start: 2.75rem; }
      .ms-12 { margin-inline-start: 3rem; }
      .ms-14 { margin-inline-start: 3.5rem; }
      .ms-16 { margin-inline-start: 4rem; }
      .ms-20 { margin-inline-start: 5rem; }
      .ms-24 { margin-inline-start: 6rem; }
      .ms-28 { margin-inline-start: 7rem; }
      .ms-32 { margin-inline-start: 8rem; }
      .ms-36 { margin-inline-start: 9rem; }
      .ms-40 { margin-inline-start: 10rem; }
      .ms-44 { margin-inline-start: 11rem; }
      .ms-48 { margin-inline-start: 12rem; }
      .ms-52 { margin-inline-start: 13rem; }
      .ms-56 { margin-inline-start: 14rem; }
      .ms-60 { margin-inline-start: 15rem; }
      .ms-64 { margin-inline-start: 16rem; }
      .ms-72 { margin-inline-start: 18rem; }
      .ms-80 { margin-inline-start: 20rem; }
      .ms-96 { margin-inline-start: 24rem; }
      .ms-auto { margin-inline-start: auto; }
      .ms-px { margin-inline-start: 1px; }
      .ms-0\.5 { margin-inline-start: 0.125rem; }
      .ms-1\.5 { margin-inline-start: 0.375rem; }
      .ms-2\.5 { margin-inline-start: 0.625rem; }
      .ms-3\.5 { margin-inline-start: 0.875rem; }
      .-ms-0 { margin-inline-start: 0px; }
      .-ms-1 { margin-inline-start: -0.25rem; }
      .-ms-2 { margin-inline-start: -0.5rem; }
      .-ms-3 { margin-inline-start: -0.75rem; }
      .-ms-4 { margin-inline-start: -1rem; }
      .-ms-5 { margin-inline-start: -1.25rem; }
      .-ms-6 { margin-inline-start: -1.5rem; }
      .-ms-7 { margin-inline-start: -1.75rem; }
      .-ms-8 { margin-inline-start: -2rem; }
      .-ms-9 { margin-inline-start: -2.25rem; }
      .-ms-10 { margin-inline-start: -2.5rem; }
      .-ms-11 { margin-inline-start: -2.75rem; }
      .-ms-12 { margin-inline-start: -3rem; }
      .-ms-14 { margin-inline-start: -3.5rem; }
      .-ms-16 { margin-inline-start: -4rem; }
      .-ms-20 { margin-inline-start: -5rem; }
      .-ms-24 { margin-inline-start: -6rem; }
      .-ms-28 { margin-inline-start: -7rem; }
      .-ms-32 { margin-inline-start: -8rem; }
      .-ms-36 { margin-inline-start: -9rem; }
      .-ms-40 { margin-inline-start: -10rem; }
      .-ms-44 { margin-inline-start: -11rem; }
      .-ms-48 { margin-inline-start: -12rem; }
      .-ms-52 { margin-inline-start: -13rem; }
      .-ms-56 { margin-inline-start: -14rem; }
      .-ms-60 { margin-inline-start: -15rem; }
      .-ms-64 { margin-inline-start: -16rem; }
      .-ms-72 { margin-inline-start: -18rem; }
      .-ms-80 { margin-inline-start: -20rem; }
      .-ms-96 { margin-inline-start: -24rem; }
      .-ms-px { margin-inline-start: -1px; }
      .-ms-0\.5 { margin-inline-start: -0.125rem; }
      .-ms-1\.5 { margin-inline-start: -0.375rem; }
      .-ms-2\.5 { margin-inline-start: -0.625rem; }
      .-ms-3\.5 { margin-inline-start: -0.875rem; }
      .me-0 { margin-inline-end: 0px; }
      .me-1 { margin-inline-end: 0.25rem; }
      .me-2 { margin-inline-end: 0.5rem; }
      .me-3 { margin-inline-end: 0.75rem; }
      .me-4 { margin-inline-end: 1rem; }
      .me-5 { margin-inline-end: 1.25rem; }
      .me-6 { margin-inline-end: 1.5rem; }
      .me-7 { margin-inline-end: 1.75rem; }
      .me-8 { margin-inline-end: 2rem; }
      .me-9 { margin-inline-end: 2.25rem; }
      .me-10 { margin-inline-end: 2.5rem; }
      .me-11 { margin-inline-end: 2.75rem; }
      .me-12 { margin-inline-end: 3rem; }
      .me-14 { margin-inline-end: 3.5rem; }
      .me-16 { margin-inline-end: 4rem; }
      .me-20 { margin-inline-end: 5rem; }
      .me-24 { margin-inline-end: 6rem; }
      .me-28 { margin-inline-end: 7rem; }
      .me-32 { margin-inline-end: 8rem; }
      .me-36 { margin-inline-end: 9rem; }
      .me-40 { margin-inline-end: 10rem; }
      .me-44 { margin-inline-end: 11rem; }
      .me-48 { margin-inline-end: 12rem; }
      .me-52 { margin-inline-end: 13rem; }
      .me-56 { margin-inline-end: 14rem; }
      .me-60 { margin-inline-end: 15rem; }
      .me-64 { margin-inline-end: 16rem; }
      .me-72 { margin-inline-end: 18rem; }
      .me-80 { margin-inline-end: 20rem; }
      .me-96 { margin-inline-end: 24rem; }
      .me-auto { margin-inline-end: auto; }
      .me-px { margin-inline-end: 1px; }
      .me-0\.5 { margin-inline-end: 0.125rem; }
      .me-1\.5 { margin-inline-end: 0.375rem; }
      .me-2\.5 { margin-inline-end: 0.625rem; }
      .me-3\.5 { margin-inline-end: 0.875rem; }
      .-me-0 { margin-inline-end: 0px; }
      .-me-1 { margin-inline-end: -0.25rem; }
      .-me-2 { margin-inline-end: -0.5rem; }
      .-me-3 { margin-inline-end: -0.75rem; }
      .-me-4 { margin-inline-end: -1rem; }
      .-me-5 { margin-inline-end: -1.25rem; }
      .-me-6 { margin-inline-end: -1.5rem; }
      .-me-7 { margin-inline-end: -1.75rem; }
      .-me-8 { margin-inline-end: -2rem; }
      .-me-9 { margin-inline-end: -2.25rem; }
      .-me-10 { margin-inline-end: -2.5rem; }
      .-me-11 { margin-inline-end: -2.75rem; }
      .-me-12 { margin-inline-end: -3rem; }
      .-me-14 { margin-inline-end: -3.5rem; }
      .-me-16 { margin-inline-end: -4rem; }
      .-me-20 { margin-inline-end: -5rem; }
      .-me-24 { margin-inline-end: -6rem; }
      .-me-28 { margin-inline-end: -7rem; }
      .-me-32 { margin-inline-end: -8rem; }
      .-me-36 { margin-inline-end: -9rem; }
      .-me-40 { margin-inline-end: -10rem; }
      .-me-44 { margin-inline-end: -11rem; }
      .-me-48 { margin-inline-end: -12rem; }
      .-me-52 { margin-inline-end: -13rem; }
      .-me-56 { margin-inline-end: -14rem; }
      .-me-60 { margin-inline-end: -15rem; }
      .-me-64 { margin-inline-end: -16rem; }
      .-me-72 { margin-inline-end: -18rem; }
      .-me-80 { margin-inline-end: -20rem; }
      .-me-96 { margin-inline-end: -24rem; }
      .-me-px { margin-inline-end: -1px; }
      .-me-0\.5 { margin-inline-end: -0.125rem; }
      .-me-1\.5 { margin-inline-end: -0.375rem; }
      .-me-2\.5 { margin-inline-end: -0.625rem; }
      .-me-3\.5 { margin-inline-end: -0.875rem; }
      .mt-0 { margin-top: 0px; }
      .mt-1 { margin-top: 0.25rem; }
      .mt-2 { margin-top: 0.5rem; }
      .mt-3 { margin-top: 0.75rem; }
      .mt-4 { margin-top: 1rem; }
      .mt-5 { margin-top: 1.25rem; }
      .mt-6 { margin-top: 1.5rem; }
      .mt-7 { margin-top: 1.75rem; }
      .mt-8 { margin-top: 2rem; }
      .mt-9 { margin-top: 2.25rem; }
      .mt-10 { margin-top: 2.5rem; }
      .mt-11 { margin-top: 2.75rem; }
      .mt-12 { margin-top: 3rem; }
      .mt-14 { margin-top: 3.5rem; }
      .mt-16 { margin-top: 4rem; }
      .mt-20 { margin-top: 5rem; }
      .mt-24 { margin-top: 6rem; }
      .mt-28 { margin-top: 7rem; }
      .mt-32 { margin-top: 8rem; }
      .mt-36 { margin-top: 9rem; }
      .mt-40 { margin-top: 10rem; }
      .mt-44 { margin-top: 11rem; }
      .mt-48 { margin-top: 12rem; }
      .mt-52 { margin-top: 13rem; }
      .mt-56 { margin-top: 14rem; }
      .mt-60 { margin-top: 15rem; }
      .mt-64 { margin-top: 16rem; }
      .mt-72 { margin-top: 18rem; }
      .mt-80 { margin-top: 20rem; }
      .mt-96 { margin-top: 24rem; }
      .mt-auto { margin-top: auto; }
      .mt-px { margin-top: 1px; }
      .mt-0\.5 { margin-top: 0.125rem; }
      .mt-1\.5 { margin-top: 0.375rem; }
      .mt-2\.5 { margin-top: 0.625rem; }
      .mt-3\.5 { margin-top: 0.875rem; }
      .-mt-0 { margin-top: 0px; }
      .-mt-1 { margin-top: -0.25rem; }
      .-mt-2 { margin-top: -0.5rem; }
      .-mt-3 { margin-top: -0.75rem; }
      .-mt-4 { margin-top: -1rem; }
      .-mt-5 { margin-top: -1.25rem; }
      .-mt-6 { margin-top: -1.5rem; }
      .-mt-7 { margin-top: -1.75rem; }
      .-mt-8 { margin-top: -2rem; }
      .-mt-9 { margin-top: -2.25rem; }
      .-mt-10 { margin-top: -2.5rem; }
      .-mt-11 { margin-top: -2.75rem; }
      .-mt-12 { margin-top: -3rem; }
      .-mt-14 { margin-top: -3.5rem; }
      .-mt-16 { margin-top: -4rem; }
      .-mt-20 { margin-top: -5rem; }
      .-mt-24 { margin-top: -6rem; }
      .-mt-28 { margin-top: -7rem; }
      .-mt-32 { margin-top: -8rem; }
      .-mt-36 { margin-top: -9rem; }
      .-mt-40 { margin-top: -10rem; }
      .-mt-44 { margin-top: -11rem; }
      .-mt-48 { margin-top: -12rem; }
      .-mt-52 { margin-top: -13rem; }
      .-mt-56 { margin-top: -14rem; }
      .-mt-60 { margin-top: -15rem; }
      .-mt-64 { margin-top: -16rem; }
      .-mt-72 { margin-top: -18rem; }
      .-mt-80 { margin-top: -20rem; }
      .-mt-96 { margin-top: -24rem; }
      .-mt-px { margin-top: -1px; }
      .-mt-0\.5 { margin-top: -0.125rem; }
      .-mt-1\.5 { margin-top: -0.375rem; }
      .-mt-2\.5 { margin-top: -0.625rem; }
      .-mt-3\.5 { margin-top: -0.875rem; }
      .mr-0 { margin-right: 0px; }
      .mr-1 { margin-right: 0.25rem; }
      .mr-2 { margin-right: 0.5rem; }
      .mr-3 { margin-right: 0.75rem; }
      .mr-4 { margin-right: 1rem; }
      .mr-5 { margin-right: 1.25rem; }
      .mr-6 { margin-right: 1.5rem; }
      .mr-7 { margin-right: 1.75rem; }
      .mr-8 { margin-right: 2rem; }
      .mr-9 { margin-right: 2.25rem; }
      .mr-10 { margin-right: 2.5rem; }
      .mr-11 { margin-right: 2.75rem; }
      .mr-12 { margin-right: 3rem; }
      .mr-14 { margin-right: 3.5rem; }
      .mr-16 { margin-right: 4rem; }
      .mr-20 { margin-right: 5rem; }
      .mr-24 { margin-right: 6rem; }
      .mr-28 { margin-right: 7rem; }
      .mr-32 { margin-right: 8rem; }
      .mr-36 { margin-right: 9rem; }
      .mr-40 { margin-right: 10rem; }
      .mr-44 { margin-right: 11rem; }
      .mr-48 { margin-right: 12rem; }
      .mr-52 { margin-right: 13rem; }
      .mr-56 { margin-right: 14rem; }
      .mr-60 { margin-right: 15rem; }
      .mr-64 { margin-right: 16rem; }
      .mr-72 { margin-right: 18rem; }
      .mr-80 { margin-right: 20rem; }
      .mr-96 { margin-right: 24rem; }
      .mr-auto { margin-right: auto; }
      .mr-px { margin-right: 1px; }
      .mr-0\.5 { margin-right: 0.125rem; }
      .mr-1\.5 { margin-right: 0.375rem; }
      .mr-2\.5 { margin-right: 0.625rem; }
      .mr-3\.5 { margin-right: 0.875rem; }
      .-mr-0 { margin-right: 0px; }
      .-mr-1 { margin-right: -0.25rem; }
      .-mr-2 { margin-right: -0.5rem; }
      .-mr-3 { margin-right: -0.75rem; }
      .-mr-4 { margin-right: -1rem; }
      .-mr-5 { margin-right: -1.25rem; }
      .-mr-6 { margin-right: -1.5rem; }
      .-mr-7 { margin-right: -1.75rem; }
      .-mr-8 { margin-right: -2rem; }
      .-mr-9 { margin-right: -2.25rem; }
      .-mr-10 { margin-right: -2.5rem; }
      .-mr-11 { margin-right: -2.75rem; }
      .-mr-12 { margin-right: -3rem; }
      .-mr-14 { margin-right: -3.5rem; }
      .-mr-16 { margin-right: -4rem; }
      .-mr-20 { margin-right: -5rem; }
      .-mr-24 { margin-right: -6rem; }
      .-mr-28 { margin-right: -7rem; }
      .-mr-32 { margin-right: -8rem; }
      .-mr-36 { margin-right: -9rem; }
      .-mr-40 { margin-right: -10rem; }
      .-mr-44 { margin-right: -11rem; }
      .-mr-48 { margin-right: -12rem; }
      .-mr-52 { margin-right: -13rem; }
      .-mr-56 { margin-right: -14rem; }
      .-mr-60 { margin-right: -15rem; }
      .-mr-64 { margin-right: -16rem; }
      .-mr-72 { margin-right: -18rem; }
      .-mr-80 { margin-right: -20rem; }
      .-mr-96 { margin-right: -24rem; }
      .-mr-px { margin-right: -1px; }
      .-mr-0\.5 { margin-right: -0.125rem; }
      .-mr-1\.5 { margin-right: -0.375rem; }
      .-mr-2\.5 { margin-right: -0.625rem; }
      .-mr-3\.5 { margin-right: -0.875rem; }
      .mb-0 { margin-bottom: 0px; }
      .mb-1 { margin-bottom: 0.25rem; }
      .mb-2 { margin-bottom: 0.5rem; }
      .mb-3 { margin-bottom: 0.75rem; }
      .mb-4 { margin-bottom: 1rem; }
      .mb-5 { margin-bottom: 1.25rem; }
      .mb-6 { margin-bottom: 1.5rem; }
      .mb-7 { margin-bottom: 1.75rem; }
      .mb-8 { margin-bottom: 2rem; }
      .mb-9 { margin-bottom: 2.25rem; }
      .mb-10 { margin-bottom: 2.5rem; }
      .mb-11 { margin-bottom: 2.75rem; }
      .mb-12 { margin-bottom: 3rem; }
      .mb-14 { margin-bottom: 3.5rem; }
      .mb-16 { margin-bottom: 4rem; }
      .mb-20 { margin-bottom: 5rem; }
      .mb-24 { margin-bottom: 6rem; }
      .mb-28 { margin-bottom: 7rem; }
      .mb-32 { margin-bottom: 8rem; }
      .mb-36 { margin-bottom: 9rem; }
      .mb-40 { margin-bottom: 10rem; }
      .mb-44 { margin-bottom: 11rem; }
      .mb-48 { margin-bottom: 12rem; }
      .mb-52 { margin-bottom: 13rem; }
      .mb-56 { margin-bottom: 14rem; }
      .mb-60 { margin-bottom: 15rem; }
      .mb-64 { margin-bottom: 16rem; }
      .mb-72 { margin-bottom: 18rem; }
      .mb-80 { margin-bottom: 20rem; }
      .mb-96 { margin-bottom: 24rem; }
      .mb-auto { margin-bottom: auto; }
      .mb-px { margin-bottom: 1px; }
      .mb-0\.5 { margin-bottom: 0.125rem; }
      .mb-1\.5 { margin-bottom: 0.375rem; }
      .mb-2\.5 { margin-bottom: 0.625rem; }
      .mb-3\.5 { margin-bottom: 0.875rem; }
      .-mb-0 { margin-bottom: 0px; }
      .-mb-1 { margin-bottom: -0.25rem; }
      .-mb-2 { margin-bottom: -0.5rem; }
      .-mb-3 { margin-bottom: -0.75rem; }
      .-mb-4 { margin-bottom: -1rem; }
      .-mb-5 { margin-bottom: -1.25rem; }
      .-mb-6 { margin-bottom: -1.5rem; }
      .-mb-7 { margin-bottom: -1.75rem; }
      .-mb-8 { margin-bottom: -2rem; }
      .-mb-9 { margin-bottom: -2.25rem; }
      .-mb-10 { margin-bottom: -2.5rem; }
      .-mb-11 { margin-bottom: -2.75rem; }
      .-mb-12 { margin-bottom: -3rem; }
      .-mb-14 { margin-bottom: -3.5rem; }
      .-mb-16 { margin-bottom: -4rem; }
      .-mb-20 { margin-bottom: -5rem; }
      .-mb-24 { margin-bottom: -6rem; }
      .-mb-28 { margin-bottom: -7rem; }
      .-mb-32 { margin-bottom: -8rem; }
      .-mb-36 { margin-bottom: -9rem; }
      .-mb-40 { margin-bottom: -10rem; }
      .-mb-44 { margin-bottom: -11rem; }
      .-mb-48 { margin-bottom: -12rem; }
      .-mb-52 { margin-bottom: -13rem; }
      .-mb-56 { margin-bottom: -14rem; }
      .-mb-60 { margin-bottom: -15rem; }
      .-mb-64 { margin-bottom: -16rem; }
      .-mb-72 { margin-bottom: -18rem; }
      .-mb-80 { margin-bottom: -20rem; }
      .-mb-96 { margin-bottom: -24rem; }
      .-mb-px { margin-bottom: -1px; }
      .-mb-0\.5 { margin-bottom: -0.125rem; }
      .-mb-1\.5 { margin-bottom: -0.375rem; }
      .-mb-2\.5 { margin-bottom: -0.625rem; }
      .-mb-3\.5 { margin-bottom: -0.875rem; }
      .ml-0 { margin-left: 0px; }
      .ml-1 { margin-left: 0.25rem; }
      .ml-2 { margin-left: 0.5rem; }
      .ml-3 { margin-left: 0.75rem; }
      .ml-4 { margin-left: 1rem; }
      .ml-5 { margin-left: 1.25rem; }
      .ml-6 { margin-left: 1.5rem; }
      .ml-7 { margin-left: 1.75rem; }
      .ml-8 { margin-left: 2rem; }
      .ml-9 { margin-left: 2.25rem; }
      .ml-10 { margin-left: 2.5rem; }
      .ml-11 { margin-left: 2.75rem; }
      .ml-12 { margin-left: 3rem; }
      .ml-14 { margin-left: 3.5rem; }
      .ml-16 { margin-left: 4rem; }
      .ml-20 { margin-left: 5rem; }
      .ml-24 { margin-left: 6rem; }
      .ml-28 { margin-left: 7rem; }
      .ml-32 { margin-left: 8rem; }
      .ml-36 { margin-left: 9rem; }
      .ml-40 { margin-left: 10rem; }
      .ml-44 { margin-left: 11rem; }
      .ml-48 { margin-left: 12rem; }
      .ml-52 { margin-left: 13rem; }
      .ml-56 { margin-left: 14rem; }
      .ml-60 { margin-left: 15rem; }
      .ml-64 { margin-left: 16rem; }
      .ml-72 { margin-left: 18rem; }
      .ml-80 { margin-left: 20rem; }
      .ml-96 { margin-left: 24rem; }
      .ml-auto { margin-left: auto; }
      .ml-px { margin-left: 1px; }
      .ml-0\.5 { margin-left: 0.125rem; }
      .ml-1\.5 { margin-left: 0.375rem; }
      .ml-2\.5 { margin-left: 0.625rem; }
      .ml-3\.5 { margin-left: 0.875rem; }
      .-ml-0 { margin-left: 0px; }
      .-ml-1 { margin-left: -0.25rem; }
      .-ml-2 { margin-left: -0.5rem; }
      .-ml-3 { margin-left: -0.75rem; }
      .-ml-4 { margin-left: -1rem; }
      .-ml-5 { margin-left: -1.25rem; }
      .-ml-6 { margin-left: -1.5rem; }
      .-ml-7 { margin-left: -1.75rem; }
      .-ml-8 { margin-left: -2rem; }
      .-ml-9 { margin-left: -2.25rem; }
      .-ml-10 { margin-left: -2.5rem; }
      .-ml-11 { margin-left: -2.75rem; }
      .-ml-12 { margin-left: -3rem; }
      .-ml-14 { margin-left: -3.5rem; }
      .-ml-16 { margin-left: -4rem; }
      .-ml-20 { margin-left: -5rem; }
      .-ml-24 { margin-left: -6rem; }
      .-ml-28 { margin-left: -7rem; }
      .-ml-32 { margin-left: -8rem; }
      .-ml-36 { margin-left: -9rem; }
      .-ml-40 { margin-left: -10rem; }
      .-ml-44 { margin-left: -11rem; }
      .-ml-48 { margin-left: -12rem; }
      .-ml-52 { margin-left: -13rem; }
      .-ml-56 { margin-left: -14rem; }
      .-ml-60 { margin-left: -15rem; }
      .-ml-64 { margin-left: -16rem; }
      .-ml-72 { margin-left: -18rem; }
      .-ml-80 { margin-left: -20rem; }
      .-ml-96 { margin-left: -24rem; }
      .-ml-px { margin-left: -1px; }
      .-ml-0\.5 { margin-left: -0.125rem; }
      .-ml-1\.5 { margin-left: -0.375rem; }
      .-ml-2\.5 { margin-left: -0.625rem; }
      .-ml-3\.5 { margin-left: -0.875rem; }
      
      /* ... keep existing code (box-sizing, display, flexbox, and other utilities) the same ... */
      
      .min-h-screen { min-height: 100vh; }
      .w-full { width: 100%; }
      .h-full { height: 100%; }
      .h-4 { height: 1rem; }
      .h-5 { height: 1.25rem; }
      .h-6 { height: 1.5rem; }
      .h-8 { height: 2rem; }
      .h-9 { height: 2.25rem; }
      .h-10 { height: 2.5rem; }
      .h-11 { height: 2.75rem; }
      .w-4 { width: 1rem; }
      .w-5 { width: 1.25rem; }
      .w-6 { width: 1.5rem; }
      .w-8 { width: 2rem; }
      .w-10 { width: 2.5rem; }
      .w-auto { width: auto; }
      
      .flex { display: flex; }
      .inline-flex { display: inline-flex; }
      .grid { display: grid; }
      .block { display: block; }
      .inline-block { display: inline-block; }
      .inline { display: inline; }
      .hidden { display: none; }
      
      .flex-col { flex-direction: column; }
      .flex-row { flex-direction: row; }
      .flex-wrap { flex-wrap: wrap; }
      .flex-nowrap { flex-wrap: nowrap; }
      .flex-1 { flex: 1 1 0%; }
      
      .items-center { align-items: center; }
      .items-start { align-items: flex-start; }
      .items-end { align-items: flex-end; }
      .items-baseline { align-items: baseline; }
      .justify-center { justify-content: center; }
      .justify-between { justify-content: space-between; }
      .justify-start { justify-content: flex-start; }
      .justify-end { justify-content: flex-end; }
      .self-start { align-self: flex-start; }
      .self-end { align-self: flex-end; }
      
      /* CRITICAL: Container system - EXACT match to Vite build */
      .container { 
        width: 100%; 
        margin-left: auto; 
        margin-right: auto; 
        padding-left: 1rem; 
        padding-right: 1rem; 
      }
      
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
      @media (min-width: 1536px) {
        .container { max-width: 1536px; }
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
      
      /* CRITICAL: Spacing system - EXACT match to Vite build */
      .space-x-1 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.25rem; }
      .space-x-2 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.5rem; }
      .space-x-3 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.75rem; }
      .space-x-4 > :not([hidden]) ~ :not([hidden]) { margin-left: 1rem; }
      .space-y-1 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.25rem; }
      .space-y-2 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.5rem; }
      .space-y-3 > :not([hidden]) ~ :not([hidden]) { margin-top: 0.75rem; }
      .space-y-4 > :not([hidden]) ~ :not([hidden]) { margin-top: 1rem; }
      .space-y-5 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.25rem; }
      .space-y-6 > :not([hidden]) ~ :not([hidden]) { margin-top: 1.5rem; }
      .space-y-8 > :not([hidden]) ~ :not([hidden]) { margin-top: 2rem; }
      .space-y-10 > :not([hidden]) ~ :not([hidden]) { margin-top: 2.5rem; }
      
      .gap-1 { gap: 0.25rem; }
      .gap-2 { gap: 0.5rem; }
      .gap-3 { gap: 0.75rem; }
      .gap-4 { gap: 1rem; }
      .gap-6 { gap: 1.5rem; }
      .gap-8 { gap: 2rem; }
      
      /* CRITICAL: Padding system - EXACT match to Vite build */
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
      
      /* CRITICAL: Background colors - EXACT match to Vite build */
      .bg-white { background-color: rgb(255 255 255); }
      .bg-gray-50 { background-color: rgb(249 250 251); }
      .bg-gray-100 { background-color: rgb(243 244 246); }
      .bg-gray-200 { background-color: rgb(229 231 235); }
      .bg-slate-50 { background-color: rgb(248 250 252); }
      .bg-slate-100 { background-color: rgb(241 245 249); }
      .bg-secondary { background-color: hsl(var(--secondary)); }
      .bg-primary { background-color: hsl(var(--primary)); }
      .bg-accent { background-color: hsl(var(--accent)); }
      .bg-muted { background-color: hsl(var(--muted)); }
      .bg-card { background-color: hsl(var(--card)); }
      .bg-green-50 { background-color: rgb(240 253 244); }
      .bg-emerald-50 { background-color: rgb(236 253 245); }
      .bg-green-600 { background-color: rgb(22 163 74); }
      .bg-green-700 { background-color: rgb(21 128 61); }
      .bg-red-50 { background-color: rgb(254 242 242); }
      .bg-red-500 { background-color: rgb(239 68 68); }
      .bg-transparent { background-color: transparent; }
      
      /* Gradients */
      .bg-gradient-to-r { background-image: linear-gradient(to right, var(--tw-gradient-stops)); }
      .from-slate-50 { --tw-gradient-from: rgb(248 250 252); --tw-gradient-to: rgb(248 250 252 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
      .to-slate-100 { --tw-gradient-to: rgb(241 245 249); }
      .from-green-50 { --tw-gradient-from: rgb(240 253 244); --tw-gradient-to: rgb(240 253 244 / 0); --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to); }
      .to-emerald-50 { --tw-gradient-to: rgb(236 253 245); }
      
      /* CRITICAL: Text colors - EXACT match to Vite build */
      .text-gray-400 { color: rgb(156 163 175); }
      .text-gray-500 { color: rgb(107 114 128); }
      .text-gray-600 { color: rgb(75 85 99); }
      .text-gray-700 { color: rgb(55 65 81); }
      .text-gray-800 { color: rgb(31 41 55); }
      .text-gray-900 { color: rgb(17 24 39); }
      .text-white { color: rgb(255 255 255); }
      .text-black { color: rgb(0 0 0); }
      .text-primary { color: hsl(var(--primary)); }
      .text-primary-foreground { color: hsl(var(--primary-foreground)); }
      .text-secondary { color: hsl(var(--secondary)); }
      .text-secondary-foreground { color: hsl(var(--secondary-foreground)); }
      .text-accent { color: hsl(var(--accent)); }
      .text-accent-foreground { color: hsl(var(--accent-foreground)); }
      .text-muted-foreground { color: hsl(var(--muted-foreground)); }
      .text-card-foreground { color: hsl(var(--card-foreground)); }
      .text-green-700 { color: rgb(21 128 61); }
      .text-green-900 { color: rgb(20 83 45); }
      .text-red-600 { color: rgb(220 38 38); }
      .text-red-500 { color: rgb(239 68 68); }
      
      /* CRITICAL: Typography - EXACT match to Vite build */
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
      
      .uppercase { text-transform: uppercase; }
      .lowercase { text-transform: lowercase; }
      .capitalize { text-transform: capitalize; }
      
      .whitespace-nowrap { white-space: nowrap; }
      
      /* CRITICAL: Grid system - EXACT match to Vite build */
      .grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      
      /* CRITICAL: Borders and rounded corners - EXACT match to Vite build */
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
      .border-input { border-color: hsl(var(--input)); }
      
      .rounded { border-radius: 0.25rem; }
      .rounded-sm { border-radius: 0.125rem; }
      .rounded-md { border-radius: 0.375rem; }
      .rounded-lg { border-radius: 0.5rem; }
      .rounded-xl { border-radius: 0.75rem; }
      .rounded-2xl { border-radius: 1rem; }
      .rounded-full { border-radius: 9999px; }
      .rounded-t-lg { border-top-left-radius: 0.5rem; border-top-right-radius: 0.5rem; }
      .rounded-b-lg { border-bottom-left-radius: 0.5rem; border-bottom-right-radius: 0.5rem; }
      
      /* CRITICAL: Shadows - EXACT match to Vite build */
      .shadow { box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1); }
      .shadow-sm { box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05); }
      .shadow-md { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
      .shadow-lg { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
      .shadow-none { box-shadow: 0 0 #0000; }
      
      /* CRITICAL: Overflow - EXACT match to Vite build */
      .overflow-hidden { overflow: hidden; }
      .overflow-x-hidden { overflow-x: hidden; }
      .overflow-y-auto { overflow-y: auto; }
      
      /* CRITICAL: Position - EXACT match to Vite build */
      .relative { position: relative; }
      .absolute { position: absolute; }
      .fixed { position: fixed; }
      .sticky { position: sticky; }
      .inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
      
      /* CRITICAL: Z-index - EXACT match to Vite build */
      .z-10 { z-index: 10; }
      .z-20 { z-index: 20; }
      .z-50 { z-index: 50; }
      
      /* CRITICAL: Cursor - EXACT match to Vite build */
      .cursor-pointer { cursor: pointer; }
      .cursor-default { cursor: default; }
      
      /* CRITICAL: Opacity - EXACT match to Vite build */
      .opacity-0 { opacity: 0; }
      .opacity-50 { opacity: 0.5; }
      .opacity-75 { opacity: 0.75; }
      .opacity-100 { opacity: 1; }
      
      /* CRITICAL: Transitions - EXACT match to Vite build */
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
      
      /* CRITICAL: Button and interactive styling - EXACT match to shadcn/ui */
      .ring-offset-background { --tw-ring-offset-color: hsl(var(--background)); }
      .focus-visible\\:outline-none:focus-visible { outline: 2px solid transparent; outline-offset: 2px; }
      .focus-visible\\:ring-2:focus-visible { 
        --tw-ring-offset-shadow: var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color);
        --tw-ring-shadow: var(--tw-ring-inset) 0 0 0 calc(2px + var(--tw-ring-offset-width)) var(--tw-ring-color);
        box-shadow: var(--tw-ring-offset-shadow), var(--tw-ring-shadow), var(--tw-shadow, 0 0 #0000);
        --tw-ring-color: hsl(var(--ring));
      }
      .focus-visible\\:ring-ring:focus-visible { --tw-ring-color: hsl(var(--ring)); }
      .focus-visible\\:ring-offset-2:focus-visible { --tw-ring-offset-width: 2px; }
      .disabled\\:pointer-events-none:disabled { pointer-events: none; }
      .disabled\\:opacity-50:disabled { opacity: 0.5; }
      
      /* CRITICAL: Hover states - EXACT match to Vite build */
      .hover\\:bg-primary:hover { background-color: hsl(var(--primary)); }
      .hover\\:bg-primary\\/90:hover { background-color: hsl(var(--primary) / 0.9); }
      .hover\\:text-white:hover { color: rgb(255 255 255); }
      .hover\\:bg-gray-100:hover { background-color: rgb(243 244 246); }
      .hover\\:bg-slate-100:hover { background-color: rgb(241 245 249); }
      .hover\\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1); }
      .hover\\:shadow-md:hover { box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); }
      .hover\\:bg-green-700:hover { background-color: rgb(21 128 61); }
      .hover\\:bg-accent:hover { background-color: hsl(var(--accent)); }
      .hover\\:text-accent-foreground:hover { color: hsl(var(--accent-foreground)); }
      .hover\\:underline:hover { text-decoration-line: underline; }
      .hover\\:bg-secondary\\/80:hover { background-color: hsl(var(--secondary) / 0.8); }
      .hover\\:bg-destructive\\/90:hover { background-color: hsl(var(--destructive) / 0.9); }
      
      /* CRITICAL: Line clamping utilities */
      .line-clamp-1 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
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
      
      /* CRITICAL: Button variants - EXACT match to shadcn/ui */
      .btn-default {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        border-radius: calc(var(--radius) - 2px);
        font-size: 0.875rem;
        font-weight: 500;
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        background-color: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
        height: 2.25rem;
        padding-left: 1rem;
        padding-right: 1rem;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
      }
      
      .btn-default:hover {
        background-color: hsl(var(--primary) / 0.9);
      }
      
      .btn-secondary {
        background-color: hsl(var(--secondary));
        color: hsl(var(--secondary-foreground));
      }
      
      .btn-secondary:hover {
        background-color: hsl(var(--secondary) / 0.8);
      }
      
      .btn-outline {
        border: 1px solid hsl(var(--border));
        background-color: hsl(var(--background));
        color: hsl(var(--foreground));
      }
      
      .btn-outline:hover {
        background-color: hsl(var(--accent));
        color: hsl(var(--accent-foreground));
      }
      
      .btn-ghost {
        background-color: transparent;
        color: hsl(var(--foreground));
      }
      
      .btn-ghost:hover {
        background-color: hsl(var(--accent));
        color: hsl(var(--accent-foreground));
      }
      
      .btn-sm {
        height: 2.25rem;
        border-radius: calc(var(--radius) - 2px);
        padding-left: 0.75rem;
        padding-right: 0.75rem;
        font-size: 0.875rem;
      }
      
      .btn-lg {
        height: 2.75rem;
        border-radius: calc(var(--radius) - 2px);
        padding-left: 2rem;
        padding-right: 2rem;
      }
      
      /* CRITICAL: Tag component styles - EXACT match to fund pages */
      .tag {
        display: inline-flex;
        align-items: center;
        background-color: hsl(var(--secondary));
        font-size: 0.875rem;
        padding: 0.25rem 0.5rem;
        border-radius: 0.375rem;
        margin-right: 0.5rem;
        margin-bottom: 0.5rem;
        transition-property: color, background-color, border-color, text-decoration-color, fill, stroke;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
        cursor: pointer;
        white-space: nowrap;
      }
      
      .tag:hover {
        background-color: hsl(var(--primary));
        color: hsl(var(--primary-foreground));
      }
      
      /* CRITICAL: Fund page specific layouts */
      .fund-header-content {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }
      
      .fund-header-info {
        flex: 1;
      }
      
      .fund-header-actions {
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        width: 100%;
      }
      
      /* CRITICAL: Responsive utilities - EXACT match to Vite build */
      @media (min-width: 640px) {
        .sm\\:px-4 { padding-left: 1rem; padding-right: 1rem; }
        .sm\\:py-8 { padding-top: 2rem; padding-bottom: 2rem; }
        .sm\\:px-0 { padding-left: 0; padding-right: 0; }
        .sm\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
        .sm\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .sm\\:text-3xl { font-size: 1.875rem; line-height: 2.25rem; }
        .sm\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .sm\\:flex-row { flex-direction: row; }
        .sm\\:items-center { align-items: center; }
        .sm\\:items-start { align-items: flex-start; }
        .sm\\:justify-between { justify-content: space-between; }
        .sm\\:w-auto { width: auto; }
        .sm\\:mb-4 { margin-bottom: 1rem; }
        .sm\\:mb-6 { margin-bottom: 1.5rem; }
        .sm\\:mb-8 { margin-bottom: 2rem; }
        .sm\\:mb-10 { margin-bottom: 2.5rem; }
        .sm\\:space-x-2 > :not([hidden]) ~ :not([hidden]) { margin-left: 0.5rem; }
        .sm\\:space-x-4 > :not([hidden]) ~ :not([hidden]) { margin-left: 1rem; }
      }
      
      @media (min-width: 768px) {
        .fund-header-content {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }
        
        .fund-header-actions {
          flex-direction: row;
          align-items: center;
          gap: 1rem;
          width: auto;
        }
        
        .md\\:text-left { text-align: left; }
        .md\\:mx-0 { margin-left: 0; margin-right: 0; }
        .md\\:text-5xl { font-size: 3rem; line-height: 1; }
        .md\\:text-xl { font-size: 1.25rem; line-height: 1.75rem; }
        .md\\:text-2xl { font-size: 1.5rem; line-height: 2rem; }
        .md\\:text-lg { font-size: 1.125rem; line-height: 1.75rem; }
        .md\\:justify-start { justify-content: flex-start; }
        .md\\:grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .md\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .md\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
        .md\\:py-8 { padding-top: 2rem; padding-bottom: 2rem; }
        .md\\:p-6 { padding: 1.5rem; }
        .md\\:p-8 { padding: 2rem; }
        .md\\:p-10 { padding: 2.5rem; }
        .md\\:space-y-8 > :not([hidden]) ~ :not([hidden]) { margin-top: 2rem; }
        .md\\:rounded-2xl { border-radius: 1rem; }
        .md\\:text-base { font-size: 1rem; line-height: 1.5rem; }
        .md\\:text-sm { font-size: 0.875rem; line-height: 1.25rem; }
        .md\\:gap-4 { gap: 1rem; }
        .md\\:flex-row { flex-direction: row; }
        .md\\:items-center { align-items: center; }
        .md\\:space-x-4 > :not([hidden]) ~ :not([hidden]) { margin-left: 1rem; }
        .md\\:space-y-0 > :not([hidden]) ~ :not([hidden]) { margin-top: 0; }
      }
      
      @media (min-width: 1024px) {
        .lg\\:text-6xl { font-size: 3.75rem; line-height: 1; }
        .lg\\:text-4xl { font-size: 2.25rem; line-height: 2.5rem; }
        .lg\\:grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .lg\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .lg\\:px-8 { padding-left: 2rem; padding-right: 2rem; }
        .lg\\:p-10 { padding: 2.5rem; }
        .lg\\:space-y-10 > :not([hidden]) ~ :not([hidden]) { margin-top: 2.5rem; }
        .lg\\:px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
      }
      
      @media (min-width: 1280px) {
        .xl\\:grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .xl\\:text-6xl { font-size: 3.75rem; line-height: 1; }
      }
      
      @media (min-width: 1536px) {
        .\\32xl\\:text-7xl { font-size: 4.5rem; line-height: 1; }
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
    
    <!-- Security headers -->
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
    
    <!-- Load JavaScript immediately (no preload) -->
${jsScripts}
    
    <!-- IMPORTANT: DO NOT REMOVE THIS SCRIPT TAG OR THIS VERY COMMENT! -->
    <script src="https://cdn.gpteng.co/gptengineer.js" type="module"></script>
  </body>
</html>`;
  }
}
