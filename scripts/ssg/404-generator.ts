import fs from 'fs';
import path from 'path';
import { generateHTMLTemplate } from '../../src/ssg/htmlTemplateGenerator';
import { getNotFoundSeo } from '../../src/lib/seo';

export async function generate404Page(distDir: string): Promise<void> {
  try {
    // Get SEO data from centralized helper
    const seoData = getNotFoundSeo();

    // Simple 404 HTML content
    const html404Content = `
      <div class="min-h-screen flex flex-col">
        <header class="bg-white shadow-sm">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center h-16">
              <div class="flex-shrink-0">
                <a href="/" class="text-2xl font-bold text-portugal-blue">Movingto</a>
              </div>
            </div>
          </div>
        </header>
        
        <main class="flex-1 flex items-center justify-center py-12 px-4">
          <div class="text-center">
            <h1 class="text-6xl font-bold text-portugal-blue mb-4">404</h1>
            <p class="text-2xl text-gray-600 mb-8">Oops! Page not found</p>
            <p class="text-gray-500 mb-8 max-w-md mx-auto">
              The page you are looking for might have been removed, had its name changed, 
              or is temporarily unavailable.
            </p>
            <a href="/" class="inline-block bg-portugal-blue hover:bg-portugal-darkblue text-white px-6 py-3 rounded-md font-medium transition-colors">
              Browse Portugal Golden Visa Investment Funds
            </a>
          </div>
        </main>
        
        <footer class="bg-gray-50 border-t">
          <div class="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <p class="text-center text-gray-500">
              © ${new Date().getFullYear()} Movingto. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    `;

    // Generate full HTML with proper SEO from centralized helper
    const fullHTML = generateHTMLTemplate(html404Content, seoData, [], []);
    
    // Write 404.html to dist directory
    const outputPath = path.join(distDir, '404.html');
    fs.writeFileSync(outputPath, fullHTML);
    
    console.log('✅ SSG: Generated 404.html with noindex robots and WebPage structured data');
    
  } catch (error) {
    console.error('❌ SSG: Failed to generate 404.html:', (error as Error).message);
  }
}