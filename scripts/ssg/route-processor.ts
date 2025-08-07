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
    console.log(`🔨 SSG: Processing ${route.path} (${route.pageType})`);
    
    const { html, seoData } = await renderRoute(route);
    const fullHTML = generateHTMLTemplate(html, seoData, validCss, validJs);
    
    // Determine output path
    let outputPath: string;
    if (route.path === '/') {
      outputPath = path.join(distDir, 'index.html');
    } else {
      const routeDir = path.join(distDir, route.path);
      if (!fs.existsSync(routeDir)) {
        fs.mkdirSync(routeDir, { recursive: true });
      }
      outputPath = path.join(routeDir, 'index.html');
    }
    
    fs.writeFileSync(outputPath, fullHTML);
    
    console.log(`✅ SSG: Generated ${outputPath}`);
    console.log(`   📝 Title: ${seoData.title}`);
    console.log(`   📄 Description: ${seoData.description.substring(0, 80)}...`);
    
    return { success: true, outputPath, seoData };
    
  } catch (error) {
    console.error(`❌ SSG: Failed to generate ${route.path}:`, error.message);
    return { success: false };
  }
}