
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

function verifySSG() {
  console.log('Verifying SSG build...');
  
  const testRoutes = ['/', '/about', '/managers', '/categories'];
  
  for (const route of testRoutes) {
    const filePath = route === '/' ? 
      join('dist', 'index.html') : 
      join('dist', route, 'index.html');
    
    if (!existsSync(filePath)) {
      console.error(`❌ Missing file: ${filePath}`);
      continue;
    }
    
    const content = readFileSync(filePath, 'utf-8');
    
    // Check for basic meta tags
    const hasTitle = content.includes('<title>');
    const hasDescription = content.includes('<meta name="description"');
    const hasOG = content.includes('<meta property="og:title"');
    
    console.log(`${hasTitle && hasDescription && hasOG ? '✅' : '❌'} ${route}: Title(${hasTitle}) Description(${hasDescription}) OG(${hasOG})`);
  }
  
  console.log('Verification complete!');
}

verifySSG();
