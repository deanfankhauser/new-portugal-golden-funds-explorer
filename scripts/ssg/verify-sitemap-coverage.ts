import fs from 'fs';
import path from 'path';
import { getAllStaticRoutes } from '../../src/ssg/routeDiscovery';
import { URL_CONFIG } from '../../src/utils/urlConfig';

/**
 * Verify that sitemap contains all discoverable pages.
 * - Collects all static and dynamic routes via RouteDiscovery
 * - Parses public sitemaps (single or index) and extracts all <loc> URLs
 * - Reports any missing URLs and extras
 */
async function verifySitemapCoverage(publicDir = path.join(process.cwd(), 'public')) {
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) {
    console.error(`❌ No sitemap.xml found in ${publicDir}`);
    process.exitCode = 1;
    return;
  }

  // 1) Collect expected URLs from the app
  const routes = await getAllStaticRoutes();
  // Normalize to absolute URLs
  const expectedURLs = new Set<string>();
  for (const r of routes) {
    const full = r.path === '/' ? URL_CONFIG.BASE_URL : `${URL_CONFIG.BASE_URL}${r.path}`;
    expectedURLs.add(full);
  }

  // 2) Parse sitemap(s) to collect actual URLs
  const sitemapFilesToRead: string[] = [];
  const mainContent = fs.readFileSync(sitemapPath, 'utf8');

  // Helper to extract all <loc>...</loc> values from a given XML string
  const extractLocs = (xml: string): string[] => {
    const matches = xml.matchAll(/<loc>(.*?)<\/loc>/g);
    return Array.from(matches).map(m => m[1].trim());
  };

  let sitemapURLs: Set<string> = new Set();

  if (mainContent.includes('<sitemapindex')) {
    // Read referenced sitemap files
    const locs = extractLocs(mainContent);
    for (const loc of locs) {
      // Convert absolute URL to local filename (assumes files are in /public)
      const filename = loc.split('/').pop()!;
      const filePath = path.join(publicDir, filename);
      if (fs.existsSync(filePath)) {
        sitemapFilesToRead.push(filePath);
      } else {
        console.warn(`⚠️ Referenced sitemap file not found locally: ${filePath}`);
      }
    }
  } else {
    sitemapFilesToRead.push(sitemapPath);
  }

  for (const file of sitemapFilesToRead) {
    const content = fs.readFileSync(file, 'utf8');
    extractLocs(content).forEach(loc => sitemapURLs.add(loc));
  }

  // 3) Compare sets
  const missing = Array.from(expectedURLs).filter(u => !sitemapURLs.has(u));
  const extras = Array.from(sitemapURLs).filter(u => !expectedURLs.has(u));

  console.log('📋 Expected URLs (from app):', expectedURLs.size);
  console.log('🗺️  URLs in sitemap:', sitemapURLs.size);
  console.log('—');

  if (missing.length) {
    console.warn(`❌ Missing ${missing.length} URL(s) in sitemap:`);
    missing.forEach(u => console.warn(`   • ${u}`));
  } else {
    console.log('✅ No missing URLs. Sitemap covers all discovered pages.');
  }

  if (extras.length) {
    console.warn(`ℹ️  ${extras.length} URL(s) present only in sitemap (not discovered from app):`);
    extras.forEach(u => console.warn(`   • ${u}`));
  }

  // Exit code for CI
  if (missing.length > 0) {
    process.exitCode = 1;
  }
}

// CLI
if (import.meta.url === `file://${process.argv[1]}`) {
  const targetDir = process.argv[2] ? path.resolve(process.argv[2]) : path.join(process.cwd(), 'public');
  verifySitemapCoverage(targetDir);
}

export { verifySitemapCoverage };