
const { execSync } = require('child_process');
const { prerenderRoutes } = require('./prerender');
const fs = require('fs');
const path = require('path');

function buildSSG() {
  console.log('🚀 Building static site with SSG...');
  
  try {
    // Step 1: Run the regular Vite build first
    console.log('\n📦 Step 1/3: Running Vite build...');
    execSync('vite build', { stdio: 'inherit' });
    
    // Step 2: Verify build output
    const distDir = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distDir)) {
      throw new Error('Vite build failed - dist directory not found');
    }
    
    console.log('✅ Vite build completed successfully');

    // Step 3: Run the pre-rendering
    console.log('\n🎨 Step 2/3: Generating static pages...');
    prerenderRoutes();
    
    // Step 4: Final verification
    console.log('\n🔍 Step 3/3: Verifying generated files...');
    
    const indexFile = path.join(distDir, 'index.html');
    const sitemapFile = path.join(distDir, 'sitemap.xml');
    
    if (fs.existsSync(indexFile)) {
      console.log('✅ Homepage generated successfully');
    } else {
      console.warn('⚠️  Homepage not found');
    }
    
    if (fs.existsSync(sitemapFile)) {
      console.log('✅ Sitemap generated successfully');
    } else {
      console.warn('⚠️  Sitemap not found');
    }
    
    // Count generated pages
    const countFiles = (dir) => {
      let count = 0;
      try {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          const filePath = path.join(dir, file);
          if (fs.statSync(filePath).isDirectory()) {
            count += countFiles(filePath);
          } else if (file === 'index.html') {
            count++;
          }
        }
      } catch (error) {
        console.warn(`Could not read directory: ${dir}`);
      }
      return count;
    };
    
    const pageCount = countFiles(distDir);
    console.log(`📄 Total pages generated: ${pageCount}`);
    
    // Verify some key pages exist
    const keyPages = [
      'funds',
      'categories', 
      'tags',
      'managers'
    ];
    
    keyPages.forEach(page => {
      const pagePath = path.join(distDir, page, 'index.html');
      if (fs.existsSync(pagePath)) {
        console.log(`✅ /${page} page generated`);
      } else {
        console.warn(`⚠️  /${page} page not found`);
      }
    });
    
    console.log('\n🎉 Static site generation complete!');
    console.log('🔗 Run "npm run preview" to test the generated site.');
    console.log(`📁 Files are ready in: ${distDir}`);
    
  } catch (error) {
    console.error('\n❌ Build failed:', error.message);
    if (error.stdout) {
      console.error('STDOUT:', error.stdout.toString());
    }
    if (error.stderr) {
      console.error('STDERR:', error.stderr.toString());
    }
    process.exit(1);
  }
}

if (require.main === module) {
  buildSSG();
}

module.exports = { buildSSG };
