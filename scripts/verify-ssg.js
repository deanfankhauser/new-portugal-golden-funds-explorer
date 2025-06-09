
import { readFileSync, existsSync, readdirSync } from 'fs';
import { join } from 'path';

function verifySSG() {
  console.log('Verifying SSG build...');
  
  if (!existsSync('dist')) {
    console.error('❌ dist directory does not exist. Run build:ssg first.');
    return;
  }
  
  const testRoutes = ['/', '/about', '/managers', '/categories', '/tags'];
  
  for (const route of testRoutes) {
    const filePath = route === '/' ? 
      join('dist', 'index.html') : 
      join('dist', route.substring(1), 'index.html');
    
    if (!existsSync(filePath)) {
      console.error(`❌ Missing file: ${filePath}`);
      continue;
    }
    
    const content = readFileSync(filePath, 'utf-8');
    
    // Check for basic SEO meta tags
    const hasTitle = content.includes('<title>') && !content.includes('<title></title>');
    const hasDescription = content.includes('<meta name="description"') && content.includes('content=');
    const hasOG = content.includes('<meta property="og:title"');
    const hasCanonical = content.includes('<link rel="canonical"');
    
    const status = hasTitle && hasDescription && hasOG && hasCanonical ? '✅' : '❌';
    console.log(`${status} ${route}: Title(${hasTitle}) Description(${hasDescription}) OG(${hasOG}) Canonical(${hasCanonical})`);
  }
  
  // Check for fund pages
  const fundsDir = join('dist', 'funds');
  if (existsSync(fundsDir)) {
    const fundFiles = readdirSync(fundsDir);
    console.log(`✅ Generated ${fundFiles.length} fund pages`);
  } else {
    console.log('❌ No fund pages generated');
  }
  
  console.log('Verification complete!');
}

verifySSG();
