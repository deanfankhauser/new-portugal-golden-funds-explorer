import fs from 'fs';
import path from 'path';

export interface ValidationChecks {
  hasTitle: boolean;
  hasDescription: boolean;
  hasStructuredData: boolean;
  hasFonts: boolean;
  hasRelativeCSS: boolean;
  hasRelativeJS: boolean;
  noAbsolutePaths: boolean;
  hasCorrectCanonical: boolean;
  hasCorrectOgUrl: boolean;
  hasWwwSubdomain: boolean;
}

export function validateGeneratedFile(
  filePath: string, 
  seoData: any, 
  validCss: string[], 
  validJs: string[]
): ValidationChecks {
  const generatedContent = fs.readFileSync(filePath, 'utf8');
  
  const validationChecks: ValidationChecks = {
    hasTitle: generatedContent.includes(`<title>${seoData.title}</title>`),
    hasDescription: generatedContent.includes(`content="${seoData.description}"`),
    hasStructuredData: seoData.structuredData && Object.keys(seoData.structuredData).length > 0,
    hasFonts: generatedContent.includes('fonts.googleapis.com'),
    hasRelativeCSS: validCss.length === 0 || validCss.every(css => generatedContent.includes(`href="./assets/${css}"`)),
    hasRelativeJS: validJs.length === 0 || validJs.every(js => generatedContent.includes(`src="./assets/${js}"`)),
    noAbsolutePaths: !generatedContent.includes('https://www.movingto.com/funds/assets/'),
    hasCorrectCanonical: generatedContent.includes(`href="${seoData.url}"`),
    hasCorrectOgUrl: generatedContent.includes(`content="${seoData.url}"`),
    hasWwwSubdomain: seoData.url.includes('https://www.movingto.com/funds')
  };
  
  const validationResults = Object.entries(validationChecks)
    .map(([key, passed]) => `${key}: ${passed ? '✅' : '❌'}`)
    .join(', ');
  
  console.log(`   🔍 Validation: ${validationResults}`);
  
  if (!validationChecks.hasWwwSubdomain) {
    console.error(`   ❌ URL missing www subdomain: ${seoData.url}`);
  }
  
  if (!validationChecks.hasCorrectCanonical || !validationChecks.hasCorrectOgUrl) {
    console.error(`   ❌ Canonical or OG URL issues in ${filePath}`);
    console.error(`   Expected URL: ${seoData.url}`);
  }
  
  return validationChecks;
}

export function verifyCriticalPages(distDir: string): void {
  const criticalPages = [
    { file: 'index.html', name: 'Homepage' },
    { file: 'index/index.html', name: 'Fund Index' },
    { file: 'about/index.html', name: 'About Page' }
  ];
  
  console.log('\n🔍 Critical Page Verification:');
  criticalPages.forEach(({ file, name }) => {
    const pagePath = path.join(distDir, file);
    if (fs.existsSync(pagePath)) {
      const fileSize = fs.statSync(pagePath).size;
      const content = fs.readFileSync(pagePath, 'utf8');
      const hasWwwSubdomain = content.includes('https://www.movingto.com/funds');
      const hasCorrectCanonical = content.includes('rel="canonical" href="https://www.movingto.com/funds');
      const hasCorrectOgUrl = content.includes('property="og:url" content="https://www.movingto.com/funds');
      
      console.log(`   ${hasWwwSubdomain && hasCorrectCanonical && hasCorrectOgUrl ? '✅' : '❌'} ${name}: ${file} (${Math.round(fileSize / 1024)}KB)`);
      
      if (!hasWwwSubdomain) {
        console.log(`      Missing www subdomain in ${name}`);
      }
      if (!hasCorrectCanonical) {
        console.log(`      Incorrect canonical URL in ${name}`);
      }
      if (!hasCorrectOgUrl) {
        console.log(`      Incorrect OG URL in ${name}`);
      }
    } else {
      console.log(`   ❌ ${name}: ${file} MISSING`);
    }
  });
}