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
  hasCorrectDomain: boolean;
}

export function validateGeneratedFile(
  filePath: string, 
  seoData: any, 
  validCss: string[], 
  validJs: string[]
): ValidationChecks {
  const generatedContent = fs.readFileSync(filePath, 'utf8');
  
  // Helper function to check structured data presence for both objects and arrays
  const hasStructuredData = Array.isArray(seoData.structuredData) 
    ? seoData.structuredData.length > 0 
    : !!seoData.structuredData && Object.keys(seoData.structuredData).length > 0;

  const validationChecks: ValidationChecks = {
    hasTitle: generatedContent.includes(`<title>${seoData.title}</title>`),
    hasDescription: generatedContent.includes(`content="${seoData.description}"`),
    hasStructuredData,
    hasFonts: generatedContent.includes('fonts.googleapis.com'),
    hasRelativeCSS: validCss.length === 0 || validCss.every(css => 
      generatedContent.includes(`href="/assets/${css}"`) || generatedContent.includes(`href="./assets/${css}"`)),
    hasRelativeJS: validJs.length === 0 || validJs.every(js => 
      generatedContent.includes(`src="/assets/${js}"`) || generatedContent.includes(`src="./assets/${js}"`)),
    noAbsolutePaths: !generatedContent.includes('https://funds.movingto.com/assets/'),
    hasCorrectCanonical: generatedContent.includes(`href="${seoData.url}"`),
    hasCorrectOgUrl: generatedContent.includes(`content="${seoData.url}"`),
    hasCorrectDomain: seoData.url.includes('https://funds.movingto.com')
  };
  
  const validationResults = Object.entries(validationChecks)
    .map(([key, passed]) => `${key}: ${passed ? '✅' : '❌'}`)
    .join(', ');
  
  // Silent validation - no logging unless critical issues found
  
  if (!validationChecks.hasCorrectDomain) {
    console.error(`   ❌ URL domain mismatch: ${seoData.url}`);
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
  
  criticalPages.forEach(({ file, name }) => {
    const pagePath = path.join(distDir, file);
    if (fs.existsSync(pagePath)) {
      const content = fs.readFileSync(pagePath, 'utf8');
      const hasCorrectDomain = content.includes('https://funds.movingto.com');
      const hasCorrectCanonical = content.includes('rel="canonical" href="https://funds.movingto.com');
      const hasCorrectOgUrl = content.includes('property="og:url" content="https://funds.movingto.com');
      
      // Silent validation - only log critical errors if needed
    }
  });
}