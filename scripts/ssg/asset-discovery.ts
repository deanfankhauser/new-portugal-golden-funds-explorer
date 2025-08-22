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
  
  // Group files by type and get file stats
  const cssFileMap = new Map<string, { file: string; mtime: Date }>();
  const jsFileMap = new Map<string, { file: string; mtime: Date }>();
  
  files.forEach(file => {
    const fullPath = path.join(assetsDir, file);
    
    if (fs.statSync(fullPath).isFile()) {
      const stats = fs.statSync(fullPath);
      
      if (file.endsWith('.css') && !file.includes('.map')) {
        // For index files, keep only the newest
        if (file.includes('index-')) {
          const existing = cssFileMap.get('index');
          if (!existing || stats.mtime > existing.mtime) {
            cssFileMap.set('index', { file, mtime: stats.mtime });
          }
        } else {
          cssFiles.push(file);
        }
      } else if (file.endsWith('.js') && !file.includes('.map')) {
        // For index files, keep only the newest
        if (file.includes('index-')) {
          const existing = jsFileMap.get('index');
          if (!existing || stats.mtime > existing.mtime) {
            jsFileMap.set('index', { file, mtime: stats.mtime });
          }
        } else {
          jsFiles.push(file);
        }
      }
    }
  });
  
  // Add the newest index files
  if (cssFileMap.has('index')) {
    cssFiles.unshift(cssFileMap.get('index')!.file);
  }
  if (jsFileMap.has('index')) {
    jsFiles.unshift(jsFileMap.get('index')!.file);
  }
  
  // Sort remaining files for predictable loading order
  cssFiles.sort((a, b) => {
    if (a.includes('index-')) return -1;
    if (b.includes('index-')) return 1;
    return a.localeCompare(b);
  });
  
  jsFiles.sort((a, b) => {
    if (a.includes('index-')) return -1;
    if (b.includes('index-')) return 1;
    // Vendor files next
    if (a.includes('vendor') && !b.includes('vendor')) return -1;
    if (!a.includes('vendor') && b.includes('vendor')) return 1;
    // Chunks last
    if (a.includes('chunk-') && !b.includes('chunk-')) return 1;
    if (!a.includes('chunk-') && b.includes('chunk-')) return -1;
    return a.localeCompare(b);
  });
  
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