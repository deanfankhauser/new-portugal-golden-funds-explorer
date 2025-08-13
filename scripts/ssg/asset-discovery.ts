import fs from 'fs';
import path from 'path';

export interface AssetFiles {
  cssFiles: string[];
  jsFiles: string[];
}

export function findBuiltAssets(distDir: string): AssetFiles {
  const cssFiles: string[] = [];
  const jsFiles: string[] = [];
  
  const assetsDir = path.join(distDir, 'assets');
  
  if (!fs.existsSync(assetsDir)) {
    return { cssFiles, jsFiles };
  }
  
  const files = fs.readdirSync(assetsDir);
  
  files.forEach(file => {
    const fullPath = path.join(assetsDir, file);
    
    if (fs.statSync(fullPath).isFile()) {
      if (file.endsWith('.css') && !file.includes('.map')) {
        cssFiles.push(file);
      } else if (file.endsWith('.js') && !file.includes('.map')) {
        jsFiles.push(file);
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
    // Main index files first (these contain React)
    if (a.includes('index-') && !b.includes('index-')) return -1;
    if (!a.includes('index-') && b.includes('index-')) return 1;
    // Vendor files next
    if (a.includes('vendor') && !b.includes('vendor')) return -1;
    if (!a.includes('vendor') && b.includes('vendor')) return 1;
    // Chunks last
    if (a.includes('chunk-') && !b.includes('chunk-')) return 1;
    if (!a.includes('chunk-') && b.includes('chunk-')) return -1;
    return a.localeCompare(b);
  });
  
  // Asset summary: CSS: ${cssFiles.length}, JS: ${jsFiles.length}
  
  return { cssFiles, jsFiles };
}

export function validateAssetPaths(distDir: string, cssFiles: string[], jsFiles: string[]): { validCss: string[], validJs: string[] } {
  const validCss: string[] = [];
  const validJs: string[] = [];
  
  cssFiles.forEach(css => {
    const assetPath = path.join(distDir, 'assets', css);
    if (fs.existsSync(assetPath)) {
      validCss.push(css);
    }
  });
  
  jsFiles.forEach(js => {
    const assetPath = path.join(distDir, 'assets', js);
    if (fs.existsSync(assetPath)) {
      validJs.push(js);
    }
  });
  return { validCss, validJs };
}