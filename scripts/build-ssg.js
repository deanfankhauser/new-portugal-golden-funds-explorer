
const { execSync } = require('child_process');
const { prerenderRoutes } = require('./prerender');

function buildSSG() {
  console.log('Building static site...');
  
  try {
    // Run the regular Vite build
    console.log('Running Vite build...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Run the prerendering
    console.log('Generating static pages...');
    prerenderRoutes();
    
    console.log('Static site generation complete!');
    console.log('Run "npm run preview" to test the generated site.');
    
  } catch (error) {
    console.error('Build failed:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  buildSSG();
}

module.exports = { buildSSG };
