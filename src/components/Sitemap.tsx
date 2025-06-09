
import { useEffect } from 'react';
import { SitemapService } from '../services/sitemapService';

const Sitemap = () => {
  useEffect(() => {
    // Generate the sitemap XML
    const sitemapXML = SitemapService.generateSitemapXML();
    
    // Create a blob with XML content type
    const blob = new Blob([sitemapXML], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    
    // Replace the current page with the XML content
    window.location.replace(url);
  }, []);

  // Show loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-gray-600">Generating sitemap...</p>
      </div>
    </div>
  );
};

export default Sitemap;
