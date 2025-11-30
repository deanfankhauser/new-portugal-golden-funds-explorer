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
  const isDebug = process.env.SSG_DEBUG === '1';
  
  try {
    console.log(`\n🔨 Processing route: ${route.path}`);
    if (isDebug) {
      console.log(`   Route type: ${route.pageType}`);
      console.log(`   Route params:`, route.params);
    }
    
    const { html, seoData } = await renderRoute(route);
    
    // CRITICAL: Check for error markers in rendered HTML
    const errorMarkers = [
      'Page Loading...',
      'Error rendering page',
      'require is not defined',
      'Cannot find module',
      'Unexpected token',
      'is not a function'
    ];
    
    const hasError = errorMarkers.some(marker => html.includes(marker));
    if (hasError) {
      const foundMarker = errorMarkers.find(marker => html.includes(marker));
      console.error(`❌ SSG ERROR: Route ${route.path} contains error marker: "${foundMarker}"`);
      console.error(`   HTML preview:`, html.substring(0, 500));
      throw new Error(`SSG CRITICAL: Route ${route.path} rendered with error content: ${foundMarker}`);
    }
    
    // Diagnostic: Check rendered app HTML first
    const initialHasH1 = html.includes('<h1');
    const initialLength = html.length;
    const hasContent = html.includes('main') || html.includes('article');
    
    console.log(`   Rendered HTML: ${initialLength} chars, Has H1: ${initialHasH1}, Has content: ${hasContent}`);
    
    if (isDebug && !initialHasH1) {
      console.log(`   First 500 chars of HTML:`, html.substring(0, 500));
    }
    
    // Generate full HTML (may inject fallback H1)
    const fullHTML = generateHTMLTemplate(html, seoData, validCss, validJs);
    
    // Check final HTML output
    const finalHasH1 = fullHTML.includes('<h1');
    const h1Count = (fullHTML.match(/<h1[^>]*>/g) || []).length;
    
    if (!finalHasH1 && route.path !== '/') {
      console.error(`❌ CRITICAL: No H1 tag in final HTML for ${route.path}`);
      if (isDebug) {
        console.log(`   Full HTML length: ${fullHTML.length}`);
      }
    } else if (h1Count > 1) {
      console.warn(`⚠️  Warning: Multiple H1 tags (${h1Count}) in ${route.path}`);
    } else if (finalHasH1) {
      console.log(`   ✅ Final HTML has valid H1 tag`);
    }
    
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
    
    if (isDebug) {
      console.log(`   ✅ Written to: ${outputPath}`);
      console.log(`   File size: ${(fullHTML.length / 1024).toFixed(2)}KB`);
    } else {
      console.log(`   ✅ Written to: ${outputPath}`);
    }
    
    // Fail build if critical pages lack H1
    if (!finalHasH1 && ['/', '/disclaimer', '/privacy'].includes(route.path)) {
      console.error(`❌ BUILD FAILURE: Critical page ${route.path} missing H1 tag`);
      return { success: false };
    }
    
    return { success: true, outputPath, seoData };
    
  } catch (error) {
    console.error(`❌ SSG: Failed to generate ${route.path}`);
    console.error(`   Error:`, error.message);
    if (isDebug) {
      console.error(`   Stack trace:`, error.stack);
    }
    return { success: false };
  }
}