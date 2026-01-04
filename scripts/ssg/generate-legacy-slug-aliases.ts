import fs from 'fs';
import path from 'path';
import { fetchAllFundsForBuild } from '../../src/lib/build-data-fetcher';

/**
 * Generate a deterministic slug from fund name
 * Must match the logic used in generate-fund-slug-redirects.ts
 */
function fundNameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Generate HTML template for legacy slug alias page
 * Returns 200 with canonical link and instant redirect to fundId
 */
function generateAliasHTML(fundId: string, fundName: string, slug: string): string {
  const canonicalUrl = `https://funds.movingto.com/${fundId}`;
  
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirecting to ${fundName}...</title>
  
  <!-- Canonical URL for SEO -->
  <link rel="canonical" href="${canonicalUrl}" />
  
  <!-- Prevent indexing of alias pages -->
  <meta name="robots" content="noindex,follow">
  
  <!-- Instant meta refresh redirect -->
  <meta http-equiv="refresh" content="0; url=/${fundId}">
  
  <!-- Minimal styling -->
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #EDEAE6;
      color: #4B0F23;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    .spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #4B0F23;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    a {
      color: #4B0F23;
      text-decoration: underline;
    }
  </style>
  
  <!-- JavaScript redirect fallback -->
  <script>
    // Immediate redirect
    window.location.replace('/${fundId}');
  </script>
</head>
<body>
  <div class="container">
    <div class="spinner"></div>
    <h1>Redirecting...</h1>
    <p>You're being redirected to <strong>${fundName}</strong></p>
    <noscript>
      <p><a href="/${fundId}">Click here if you are not redirected automatically</a></p>
    </noscript>
  </div>
</body>
</html>`;
}

/**
 * Generate static alias pages for all legacy fund slugs
 * These pages return 200 (not 404) and redirect to canonical fundId URLs
 */
export async function generateLegacySlugAliases() {
  const distDir = path.join(process.cwd(), 'dist');
  
  console.log('\n🔗 Generating legacy slug alias pages...');
  
  if (!fs.existsSync(distDir)) {
    throw new Error('dist directory not found. Run vite build first.');
  }
  
  // Fetch all funds
  const funds = await fetchAllFundsForBuild();
  console.log(`📊 Processing ${funds.length} funds for legacy slug aliases...`);
  
  let generatedCount = 0;
  let skippedCount = 0;
  
  for (const fund of funds) {
    const slug = fundNameToSlug(fund.name);
    const aliasDir = path.join(distDir, slug);
    const aliasFile = path.join(aliasDir, 'index.html');
    
    // Skip if fundId and slug are the same (no legacy alias needed)
    if (slug === fund.id) {
      skippedCount++;
      continue;
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(aliasDir)) {
      fs.mkdirSync(aliasDir, { recursive: true });
    }
    
    // Generate and write alias HTML
    const html = generateAliasHTML(fund.id, fund.name, slug);
    fs.writeFileSync(aliasFile, html, 'utf-8');
    
    generatedCount++;
  }
  
  console.log(`✅ Generated ${generatedCount} legacy slug alias pages`);
  console.log(`⏭️  Skipped ${skippedCount} funds (slug matches id)`);
  console.log(`📁 Alias pages written to: ${distDir}/{slug}/index.html`);
  console.log('\n💡 These pages:');
  console.log('   - Return 200 (not 404)');
  console.log('   - Include canonical link to /{fundId}');
  console.log('   - Redirect instantly to /{fundId}');
  console.log('   - Are marked noindex,follow for SEO\n');
}

// Allow direct execution
if (import.meta.url === `file://${process.argv[1]}`) {
  generateLegacySlugAliases().catch(error => {
    console.error('💥 Legacy slug alias generation failed:', error);
    process.exit(1);
  });
}
