
import React, { useEffect } from 'react';
import { PageSEOProps } from '../../types/seo';
import { SEODataService } from '../../services/seoDataService';
import MetaTags from './MetaTags';

const PageSEO: React.FC<PageSEOProps> = (props) => {
  const seoData = SEODataService.getSEOData(props);

  // Debug logging to track meta tag updates
  useEffect(() => {
    console.log(`SEO: Setting meta tags for ${props.pageType}`, {
      title: seoData.title,
      description: seoData.description,
      url: seoData.url,
      pageType: props.pageType,
      fundName: props.fundName
    });
    
    // Immediate and aggressive title update
    document.title = seoData.title;
    
    // Remove any conflicting title tags and set our own
    const existingTitles = document.querySelectorAll('title');
    existingTitles.forEach((title, index) => {
      if (index > 0) title.remove(); // Remove duplicates, keep only first
      else title.textContent = seoData.title; // Update the first one
    });
    
    // Force a small delay to ensure DOM is ready and verify title update
    const timer = setTimeout(() => {
      const actualTitle = document.title;
      console.log('SEO: Current document title:', actualTitle);
      console.log('SEO: Expected title:', seoData.title);
      
      if (actualTitle !== seoData.title) {
        console.warn('SEO: Title mismatch detected! Forcing update...');
        document.title = seoData.title;
        
        // Also check for any default title tags that might be interfering
        const defaultTitles = document.querySelectorAll('title');
        defaultTitles.forEach(title => {
          if (title.textContent?.includes('Portugal Golden Visa Investment Funds | Movingto') && !title.textContent.includes(props.pageType)) {
            title.textContent = seoData.title;
          }
        });
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [props.pageType, props.fundName, props.managerName, props.categoryName, props.tagName, seoData.title, seoData.description, seoData.url]);

  return <MetaTags seoData={seoData} />;
};

export default PageSEO;
