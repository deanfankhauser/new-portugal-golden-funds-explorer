
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { compileSSGFiles } from './compile-ssg.js';

export async function buildSSG(buildEnv = 'production') {
  try {
    // Step 1: Run the regular Vite build first with environment flag
    const env = buildEnv === 'development' ? 'VITE_BUILD_ENV=development ' : '';
    execSync(`${env}vite build`, { stdio: 'inherit' });
    
    // Step 2: Verify build output
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      throw new Error('Vite build failed - dist directory not found');
    }

    // Step 3: Generate static files
    compileSSGFiles();
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    
    // Fallback: ensure basic build exists
    try {
      const env = buildEnv === 'development' ? 'VITE_BUILD_ENV=development ' : '';
      execSync(`${env}vite build`, { stdio: 'inherit' });
    } catch (fallbackError) {
      console.error('❌ Fallback build also failed:', fallbackError.message);
      process.exit(1);
    }
  }
}

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const buildEnv = process.argv[2] || 'production';
  console.log(`🏗️ Building SSG for ${buildEnv} environment...`);
  buildSSG(buildEnv);
}
