import fs from 'fs';
import path from 'path';
import { funds } from '../../src/data/services/funds-service';
import { DateManagementService } from '../../src/services/dateManagementService';

export function generateFundsSitemap(distDir: string): void {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${funds.map(fund => {
  const contentDates = DateManagementService.getFundContentDates(fund);
  const lastmod = DateManagementService.formatSitemapDate(contentDates.dateModified);
  
  return `  <url>
    <loc>https://funds.movingto.com/${fund.id}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${contentDates.changeFrequency}</changefreq>
    <priority>0.9</priority>
  </url>`;
}).join('\n')}
</urlset>`;

  fs.writeFileSync(path.join(distDir, 'sitemap-funds.xml'), sitemap);
  console.log(`✅ Funds Sitemap: Generated sitemap-funds.xml with ${funds.length} fund URLs`);
}