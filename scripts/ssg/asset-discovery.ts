import fs from 'fs';
import path from 'path';

export interface AssetFiles {
  cssFiles: string[];
  jsFiles: string[];
}

export function findBuiltAssets(distDir: string): AssetFiles {
  const cssFiles: string[] = [];
  const jsFiles: string[] = [];
  
  console.log('🔍 SSG: Scanning for built assets in:', distDir);
  
  const assetsDir = path.join(distDir, 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    console.warn(`🔍 SSG: Assets directory not found: ${assetsDir}`);
    return { cssFiles, jsFiles };
  }
  
  const files = fs.readdirSync(assetsDir);
  console.log('🔍 SSG: Found files in assets directory:', files);
  
  files.forEach(file => {
    const fullPath = path.join(assetsDir, file);
    
    if (fs.statSync(fullPath).isFile()) {
      if (file.endsWith('.css') && !file.includes('.map')) {
        cssFiles.push(file);
        console.log(`✅ SSG: Found CSS: ${file}`);
      } else if (file.endsWith('.js') && !file.includes('.map')) {
        jsFiles.push(file);
        console.log(`✅ SSG: Found JS: ${file}`);
      }
    }
  });
  
  // Sort files for predictable loading order
  cssFiles.sort((a, b) => {
    // Prioritize main index files
    if (a.includes('index-') && !b.includes('index-')) return -1;
    if (!a.includes('index-') && b.includes('index-')) return 1;
    return a.localeCompare(b);
  });
  
  jsFiles.sort((a, b) => {
    // Main files first, then chunks
    if (a.includes('index-') && !b.includes('index-')) return -1;
    if (!a.includes('index-') && b.includes('index-')) return 1;
    if (a.includes('chunk-') && !b.includes('chunk-')) return 1;
    if (!a.includes('chunk-') && b.includes('chunk-')) return -1;
    return a.localeCompare(b);
  });
  
  console.log(`📊 SSG: Asset summary - CSS: ${cssFiles.length}, JS: ${jsFiles.length}`);
  console.log('📊 SSG: CSS files:', cssFiles);
  console.log('📊 SSG: JS files:', jsFiles);
  
  return { cssFiles, jsFiles };
}

export function validateAssetPaths(distDir: string, cssFiles: string[], jsFiles: string[]): { validCss: string[], validJs: string[] } {
  const validCss: string[] = [];
  const validJs: string[] = [];
  
  console.log('🔍 SSG: Validating asset paths...');
  
  cssFiles.forEach(css => {
    const assetPath = path.join(distDir, 'assets', css);
    if (fs.existsSync(assetPath)) {
      validCss.push(css);
      console.log(`✅ SSG: Valid CSS: ${css}`);
    } else {
      console.warn(`❌ SSG: Missing CSS: ${css}`);
    }
  });
  
  jsFiles.forEach(js => {
    const assetPath = path.join(distDir, 'assets', js);
    if (fs.existsSync(assetPath)) {
      validJs.push(js);
      console.log(`✅ SSG: Valid JS: ${js}`);
    } else {
      console.warn(`❌ SSG: Missing JS: ${js}`);
    }
  });
  
  console.log(`📊 SSG: Validation complete - Valid CSS: ${validCss.length}, Valid JS: ${validJs.length}`);
  return { validCss, validJs };
}