import fs from 'fs';
import path from 'path';
import { StaticRoute } from '../../src/ssg/routeDiscovery';
import { renderRoute } from '../../src/ssg/ssrUtils';
import { generateHTMLTemplate } from '../../src/ssg/htmlTemplateGenerator';

export interface RouteProcessingResult {
  success: boolean;
  outputPath?: string;
  seoData?: any;
}

export async function processRoute(
  route: StaticRoute, 
  distDir: string, 
  validCss: string[], 
  validJs: string[]
): Promise<RouteProcessingResult> {
  try {
    console.log(`\n🔨 Processing route: ${route.path}`);
    console.log(`   Route params:`, route.params);
    
    const { html, seoData } = await renderRoute(route);
    
    // Diagnostic: Check HTML content
    const hasH1 = html.includes('<h1');
    const contentLength = html.length;
    console.log(`   Rendered HTML: ${contentLength} chars, Has H1: ${hasH1}`);
    
    if (!hasH1 && route.path !== '/') {
      console.warn(`⚠️  Warning: No H1 tag found in ${route.path}`);
    }
    
    const fullHTML = generateHTMLTemplate(html, seoData, validCss, validJs);
    
    // Determine output path
    let outputPath: string;
    if (route.path === '/') {
      outputPath = path.join(distDir, 'index.html');
    } else {
      const sanitizedPath = route.path.replace(/^\/+/, '');
      const routeDir = path.join(distDir, sanitizedPath);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      outputPath = path.join(routeDir, 'index.html');
    }
    
    fs.writeFileSync(outputPath, fullHTML);
    console.log(`   ✅ Written to: ${outputPath}`);
    
    return { success: true, outputPath, seoData };
    
  } catch (error) {
    console.error(`❌ SSG: Failed to generate ${route.path}:`, error.message);
    console.error(`   Stack trace:`, error.stack);
    return { success: false };
  }
}