
import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';

async function buildSSG() {
  console.log('Building SSG with vite-ssg...');
  
  try {
    // Build using vite-ssg with the correct entry point
    execSync('npx vite-ssg build --mode production', { 
      stdio: 'inherit',
      cwd: process.cwd(),
      env: { ...process.env, VITE_SSG: 'true' }
    });
    
    console.log('✅ SSG build completed successfully!');
    
    // Verify some key files exist
    const keyFiles = [
      'dist/index.html', 
      'dist/about/index.html', 
      'dist/managers/index.html',
      'dist/categories/index.html',
      'dist/tags/index.html'
    ];
    
    keyFiles.forEach(file => {
      if (existsSync(file)) {
        console.log(`✅ Generated: ${file}`);
      } else {
        console.log(`❌ Missing: ${file}`);
      }
    });
    
  } catch (error) {
    console.error('❌ SSG build failed:', error.message);
    process.exit(1);
  }
}

buildSSG();
