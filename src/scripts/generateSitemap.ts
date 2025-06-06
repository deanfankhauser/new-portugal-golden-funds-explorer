
import { SitemapService } from '../services/sitemapService';

// Script to generate sitemap
export const generateSitemap = () => {
  try {
    const sitemapXML = SitemapService.generateSitemapXML();
    console.log('Sitemap generated successfully');
    return sitemapXML;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    throw error;
  }
};

// Export for use in build processes
export { SitemapService };
