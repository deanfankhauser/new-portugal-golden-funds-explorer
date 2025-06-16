
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { compileSSGFiles } from './compile-ssg.js';

export async function buildSSG() {
  console.log('🚀 Building static site with SSG...');
  
  try {
    // Step 1: Run the regular Vite build first
    console.log('\n📦 Step 1/2: Running Vite build...');
    execSync('vite build', { stdio: 'inherit' });
    
    // Step 2: Verify build output
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      throw new Error('Vite build failed - dist directory not found');
    }
    
    console.log('✅ Vite build completed successfully');

    // Step 3: Generate static files
    console.log('\n🎨 Step 2/2: Generating static files...');
    compileSSGFiles();
    
    console.log('\n🎉 Build complete!');
    console.log(`📁 Files are ready in: ${distDir}`);
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    
    // Fallback: ensure basic build exists
    try {
      console.log('🔄 Attempting fallback build...');
      execSync('vite build', { stdio: 'inherit' });
      console.log('✅ Fallback build completed');
    } catch (fallbackError) {
      console.error('❌ Fallback build also failed:', fallbackError.message);
      process.exit(1);
    }
  }
}

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  buildSSG();
}
