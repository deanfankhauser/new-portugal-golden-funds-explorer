import { generateRedirectRules } from './ssg/generate-redirects';
import fs from 'fs';
import path from 'path';

console.log('🔍 Validating vercel.json redirects...\n');

try {
  const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
  const vercelConfig = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf-8'));
  
  // Generate expected redirects
  const generated = generateRedirectRules();
  const expectedTotal = 
    generated.tagRedirects.length + 
    generated.categoryRedirects.length + 
    generated.legacyRedirects.length;
  
  // FIXED: Check auto-generated redirects only (not manual ones)
  // Auto-generated redirects have either /:slug( or /:num(\d+) patterns
  const autoGenCount = vercelConfig.redirects.filter((r: any) => 
    r.source.includes('/:slug(') || r.source.includes('/:num(\\d+)')
  ).length;
  
  if (autoGenCount !== expectedTotal) {
    console.error(`❌ vercel.json is OUT OF SYNC!`);
    console.error(`   Expected auto-generated: ${expectedTotal} rules`);
    console.error(`   Found: ${autoGenCount} rules`);
    console.error(`\n   Run: npm run generate:redirects\n`);
    process.exit(1);
  }
  
  console.log('✅ vercel.json is up to date');
  console.log(`   - ${generated.stats.tagCount} tags (${generated.stats.tagChunks} chunks)`);
  console.log(`   - ${generated.stats.categoryCount} categories (${generated.stats.categoryChunks} chunks)`);
  console.log(`   - ${generated.stats.legacyCount} legacy patterns`);
  console.log(`   - ${autoGenCount} auto-generated redirect rules`);
  console.log(`   - ${vercelConfig.redirects.length - autoGenCount} manual redirect rules\n`);
  
} catch (error: any) {
  console.error('❌ Validation failed:', error.message);
  process.exit(1);
}
