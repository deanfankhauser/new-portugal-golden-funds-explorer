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
    // Log fund page processing in development
    const isDev = typeof process !== 'undefined' && process.env.NODE_ENV === 'development';
    if (isDev && route.pageType === 'fund') {
      console.log(`\n🔥 Processing fund page: ${route.path} (${route.params?.fundName})`);
    }
    
    const { html, seoData } = await renderRoute(route);
    
    // Verify content quality for fund pages
    if (isDev && route.pageType === 'fund') {
      const hasH1 = html.includes('<h1');
      const hasH2 = html.includes('<h2');
      const contentLength = html.length;
      console.log(`   📊 Content: ${contentLength} chars, H1: ${hasH1 ? '✅' : '❌'}, H2: ${hasH2 ? '✅' : '❌'}`);
      
      if (!hasH1) {
        console.warn(`   ⚠️  WARNING: Fund page ${route.path} has no H1 tag!`);
      }
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
    
    // Verify the written file in development
    if (isDev && route.pageType === 'fund') {
      const writtenContent = fs.readFileSync(outputPath, 'utf8');
      const hasH1InFile = writtenContent.includes('<h1');
      console.log(`   💾 Written to: ${outputPath}`);
      console.log(`   📝 File has H1: ${hasH1InFile ? '✅' : '❌'}`);
    }
    
    return { success: true, outputPath, seoData };
    
  } catch (error) {
    console.error(`❌ SSG: Failed to generate ${route.path}:`, error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    return { success: false };
  }
}