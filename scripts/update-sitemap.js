import { writeFileSync } from 'fs';
import { join } from 'path';

// Import the sitemap service (we'll create a simple version here)
import { fundsData } from '../src/data/mock/funds/index.js';

const BASE_URL = 'https://funds.movingto.com';
const currentDate = new Date().toISOString().split('T')[0];

// Generate sitemap entries
const generateSitemapXML = () => {
  const entries = [
    // Static pages
    { url: BASE_URL, changefreq: 'daily', priority: '1.0' },
    { url: `${BASE_URL}/index`, changefreq: 'weekly', priority: '0.9' },
    { url: `${BASE_URL}/categories`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/tags`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/managers`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/comparisons`, changefreq: 'weekly', priority: '0.7' },
    { url: `${BASE_URL}/about`, changefreq: 'monthly', priority: '0.6' },
    { url: `${BASE_URL}/disclaimer`, changefreq: 'monthly', priority: '0.3' },
    { url: `${BASE_URL}/privacy`, changefreq: 'monthly', priority: '0.3' },
    { url: `${BASE_URL}/faqs`, changefreq: 'monthly', priority: '0.7' },
    { url: `${BASE_URL}/roi-calculator`, changefreq: 'monthly', priority: '0.6' },
    { url: `${BASE_URL}/fund-quiz`, changefreq: 'monthly', priority: '0.6' },
    
    // Fund pages - all 11 funds
    ...fundsData.map(fund => ({
      url: `${BASE_URL}/${fund.id}`,
      changefreq: 'weekly',
      priority: '0.9'
    })),
    
    // Category pages
    { url: `${BASE_URL}/categories/hedge-funds`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/categories/real-estate`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/categories/private-equity`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/categories/venture-capital`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/categories/fixed-income`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/categories/alternative-investments`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/categories/commodities`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/categories/crypto`, changefreq: 'weekly', priority: '0.8' },
    
    // Tag pages
    { url: `${BASE_URL}/tags/high-yield`, changefreq: 'weekly', priority: '0.7' },
    { url: `${BASE_URL}/tags/low-risk`, changefreq: 'weekly', priority: '0.7' },
    { url: `${BASE_URL}/tags/medium-risk`, changefreq: 'weekly', priority: '0.7' },
    { url: `${BASE_URL}/tags/high-risk`, changefreq: 'weekly', priority: '0.7' },
    { url: `${BASE_URL}/tags/short-term`, changefreq: 'weekly', priority: '0.7' },
    { url: `${BASE_URL}/tags/medium-term`, changefreq: 'weekly', priority: '0.7' },
    { url: `${BASE_URL}/tags/long-term`, changefreq: 'weekly', priority: '0.7' },
    { url: `${BASE_URL}/tags/accredited-investors`, changefreq: 'weekly', priority: '0.7' },
    { url: `${BASE_URL}/tags/retail-investors`, changefreq: 'weekly', priority: '0.7' },
    { url: `${BASE_URL}/tags/institutional-investors`, changefreq: 'weekly', priority: '0.7' },
    
    // Manager pages
    { url: `${BASE_URL}/manager/lince-capital`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/manager/optimize-investment-partners`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/manager/3cc-capital`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/manager/portugal-ventures`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/manager/steady-growth-management`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/manager/growth-blue-management`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/manager/solar-future-capital`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/manager/mercurio-capital`, changefreq: 'weekly', priority: '0.8' },
    { url: `${BASE_URL}/manager/horizon-investments`, changefreq: 'weekly', priority: '0.8' }
  ];

  const urlElements = entries.map(entry => `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
};

// Generate and write sitemap
const sitemapXML = generateSitemapXML();
const sitemapPath = join(process.cwd(), 'public', 'sitemap.xml');

writeFileSync(sitemapPath, sitemapXML, 'utf8');
console.log(`✅ Sitemap updated with ${fundsData.length} funds at ${sitemapPath}`);
console.log('Fund IDs included:', fundsData.map(f => f.id).join(', '));