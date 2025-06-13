
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Function to compile and run TypeScript files in Node.js
function compileAndRunTSFile(tsFilePath, functionName, ...args) {
  try {
    // Create a temporary execution script
    const tempScriptContent = `
import { ${functionName} } from '${tsFilePath}';

const result = ${functionName}(${args.map(arg => JSON.stringify(arg)).join(', ')});
console.log(JSON.stringify(result, null, 2));
`;
    
    const tempScriptPath = path.join(process.cwd(), 'temp-script.mjs');
    fs.writeFileSync(tempScriptPath, tempScriptContent);
    
    // Execute with node directly using ES modules
    const command = `node --loader ts-node/esm --experimental-specifier-resolution=node ${tempScriptPath}`;
    
    const result = execSync(command, { 
      encoding: 'utf8', 
      cwd: process.cwd(),
      env: { ...process.env, NODE_OPTIONS: '--loader ts-node/esm' }
    });
    
    // Clean up temp file
    if (fs.existsSync(tempScriptPath)) {
      fs.unlinkSync(tempScriptPath);
    }
    
    return JSON.parse(result.trim());
  } catch (error) {
    console.error(`Error running ${tsFilePath}:`, error.message);
    
    // Clean up temp file on error
    const tempScriptPath = path.join(process.cwd(), 'temp-script.mjs');
    if (fs.existsSync(tempScriptPath)) {
      fs.unlinkSync(tempScriptPath);
    }
    
    return null;
  }
}

export function prerenderRoutes() {
  const distDir = path.join(process.cwd(), 'dist');
  
  // Ensure dist directory exists
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  console.log('Starting static site generation...');

  try {
    // Get all routes from the route discovery service
    const routes = compileAndRunTSFile('./src/ssg/routeDiscovery', 'RouteDiscovery.getAllStaticRoutes');
    
    if (!routes || routes.length === 0) {
      console.error('No routes found for pre-rendering');
      return;
    }

    console.log(`Found ${routes.length} routes to pre-render`);

    // Pre-render each route
    let successCount = 0;
    let errorCount = 0;

    for (const route of routes) {
      try {
        console.log(`Rendering: ${route.path}`);
        
        // Get the rendered HTML and SEO data for this route
        const renderResult = compileAndRunTSFile('./src/ssg/ssrUtils', 'SSRUtils.renderRoute', route);
        
        if (!renderResult) {
          console.warn(`Failed to render route: ${route.path}`);
          errorCount++;
          continue;
        }

        const { html, seoData } = renderResult;
        
        // Generate the complete HTML document
        const fullHTML = compileAndRunTSFile('./src/ssg/ssrUtils', 'SSRUtils.generateHTMLTemplate', html, seoData);
        
        // Determine the output file path
        let outputPath;
        if (route.path === '/') {
          outputPath = path.join(distDir, 'index.html');
        } else {
          const routeDir = path.join(distDir, route.path);
          if (!fs.existsSync(routeDir)) {
            fs.mkdirSync(routeDir, { recursive: true });
          }
          outputPath = path.join(routeDir, 'index.html');
        }

        // Write the HTML file
        fs.writeFileSync(outputPath, fullHTML);
        successCount++;
        
      } catch (error) {
        console.error(`Error rendering route ${route.path}:`, error.message);
        errorCount++;
      }
    }

    // Generate sitemap
    console.log('Generating sitemap...');
    const sitemap = compileAndRunTSFile('./src/ssg/routeDiscovery', 'RouteDiscovery.generateSitemap');
    
    if (sitemap) {
      fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemap);
      console.log('Sitemap generated successfully');
    }

    console.log(`\nStatic site generation complete!`);
    console.log(`✅ Successfully rendered: ${successCount} pages`);
    if (errorCount > 0) {
      console.log(`❌ Failed to render: ${errorCount} pages`);
    }
    console.log(`📁 Output directory: ${distDir}`);
    console.log('\nRun "npm run preview" to test the generated site.');
    
  } catch (error) {
    console.error('Critical error during pre-rendering:', error.message);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Allow running this script directly
if (import.meta.url === `file://${process.argv[1]}`) {
  prerenderRoutes();
}
