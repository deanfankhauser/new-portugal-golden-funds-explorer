
import { useEffect } from 'react';
import { SitemapService } from '../services/sitemapService';

const Sitemap = () => {
  useEffect(() => {
    // Generate the sitemap XML
    const sitemapXML = SitemapService.generateSitemapXML();
    
    // Set the proper content type for XML
    document.contentType = 'application/xml';
    
    // Replace the page content with the XML
    document.open();
    document.write(sitemapXML);
    document.close();
  }, []);

  // This component won't actually render anything visible
  // as it replaces the document content with XML
  return null;
};

export default Sitemap;
