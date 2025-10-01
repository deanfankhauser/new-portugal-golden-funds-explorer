#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

const BASE_URL = 'https://funds.movingto.com';

const fundsData = [
  '3cc-golden-income',
  'bluewater-capital-fund',
  'crown-investments-fund',
  'digital-insight-fund',
  'emerald-green-fund',
  'flex-space-fund',
  'global-european-cinema-fund',
  'growth-blue-fund',
  'heed-top-fund',
  'horizon-fund',
  'imga-funds',
  'inz-fund',
  'lakeview-fund',
  'lince-growth-fund',
  'lince-yield-fund',
  'mercurio-fund-ii',
  'optimize-golden-opportunities',
  'pela-terra-ii-regenerate-fund',
  'portugal-investment-1',
  'portugal-liquid-opportunities',
  'portugal-prime-fcr',
  'portugal-prime-fund',
  'prime-insight-fund',
  'solar-future-fund',
  'steady-growth-investment',
  'ventures-eu-fund'
];

const categories = [
  'Real Estate',
  'Private Equity',
  'Venture Capital',
  'Alternative Investments',
  'UCITS Funds',
  'Sustainability',
  'Infrastructure',
  'Film & Cinema'
];

const tags = [
  'UCITS',
  'Daily NAV',
  'No Lock-Up',
  'PFIC-Compliant',
  'Golden Visa funds for U.S. citizens',
  'Real Estate',
  'Venture Capital',
  'Private Equity',
  'Sustainability',
  'Infrastructure',
  'Film & Cinema'
];

const managers = [
  '3cc',
  'Bluewater Capital',
  'Crown Investments',
  'Digital Insight',
  'Emerald Asset Management',
  'Flex Space',
  'Global Cinema',
  'Growth Capital',
  'HEED',
  'Horizon Capital',
  'IMGA',
  'InZ',
  'Lakeview',
  'Lince Capital',
  'Mercurio',
  'Optimize',
  'Pela Terra',
  'Portugal Investment',
  'Prime Capital',
  'Solar Future',
  'Steady Growth',
  'Ventures EU'
];

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function formatDate() {
  return new Date().toISOString().split('T')[0];
}

function generateSitemapXML() {
  const currentDate = formatDate();
  const urls = [];

  urls.push({
    loc: BASE_URL,
    lastmod: currentDate,
    changefreq: 'daily',
    priority: 1.0
  });

  const staticPages = [
    { path: '/index', priority: 0.9, changefreq: 'daily' },
    { path: '/categories', priority: 0.8, changefreq: 'weekly' },
    { path: '/tags', priority: 0.8, changefreq: 'weekly' },
    { path: '/managers', priority: 0.8, changefreq: 'weekly' },
    { path: '/comparisons', priority: 0.8, changefreq: 'weekly' },
    { path: '/alternatives', priority: 0.7, changefreq: 'weekly' },
    { path: '/about', priority: 0.6, changefreq: 'monthly' },
    { path: '/disclaimer', priority: 0.3, changefreq: 'monthly' },
    { path: '/privacy', priority: 0.3, changefreq: 'monthly' },
    { path: '/faqs', priority: 0.7, changefreq: 'monthly' },
    { path: '/roi-calculator', priority: 0.6, changefreq: 'monthly' }
  ];

  staticPages.forEach(page => {
    urls.push({
      loc: `${BASE_URL}${page.path}`,
      lastmod: currentDate,
      changefreq: page.changefreq,
      priority: page.priority
    });
  });

  fundsData.forEach(fundId => {
    urls.push({
      loc: `${BASE_URL}/${fundId}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.9
    });

    urls.push({
      loc: `${BASE_URL}/${fundId}/alternatives`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  categories.forEach(category => {
    const slug = slugify(category);
    urls.push({
      loc: `${BASE_URL}/categories/${slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.8
    });
  });

  tags.forEach(tag => {
    const slug = slugify(tag);
    urls.push({
      loc: `${BASE_URL}/tags/${slug}`,
      lastmod: currentDate,
      changefreq: 'weekly',
      priority: 0.7
    });
  });

  managers.forEach(manager => {
    const slug = slugify(manager);
    urls.push({
      loc: `${BASE_URL}/manager/${slug}`,
      lastmod: currentDate,
      changefreq: 'monthly',
      priority: 0.7
    });
  });

  for (let i = 0; i < fundsData.length; i++) {
    for (let j = i + 1; j < Math.min(i + 10, fundsData.length); j++) {
      const fund1 = fundsData[i];
      const fund2 = fundsData[j];
      const slug = [fund1, fund2].sort().join('-vs-');
      urls.push({
        loc: `${BASE_URL}/compare/${slug}`,
        lastmod: currentDate,
        changefreq: 'monthly',
        priority: 0.6
      });
    }
  }

  const urlElements = urls.map(url => {
    let xml = '  <url>\n';
    xml += `    <loc>${url.loc}</loc>\n`;
    xml += `    <lastmod>${url.lastmod}</lastmod>\n`;
    xml += `    <changefreq>${url.changefreq}</changefreq>\n`;
    xml += `    <priority>${url.priority.toFixed(1)}</priority>\n`;
    xml += '  </url>';
    return xml;
  }).join('\n');

  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;

  return { xml: sitemapXML, count: urls.length };
}

function generateSitemap() {
  try {
    console.log('🗺️  Generating comprehensive sitemap...');

    const { xml, count } = generateSitemapXML();

    const publicDir = path.join(process.cwd(), 'public');
    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');

    console.log(`✅ Sitemap generated successfully!`);
    console.log(`   📊 Total URLs: ${count}`);
    console.log(`   📁 File: public/sitemap.xml`);

    const distDir = path.join(process.cwd(), 'dist');
    if (fs.existsSync(distDir)) {
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml, 'utf8');
      console.log(`   📁 Also copied to: dist/sitemap.xml`);
    }

  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error.message);
    process.exit(1);
  }
}

generateSitemap();
