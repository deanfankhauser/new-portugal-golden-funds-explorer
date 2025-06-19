
import React, { useEffect } from 'react';
import { PageSEOProps } from '../../types/seo';
import { SEODataService } from '../../services/seoDataService';
import MetaTags from './MetaTags';

const PageSEO: React.FC<PageSEOProps> = (props) => {
  const seoData = SEODataService.getSEOData(props);

  // Enhanced debug logging and aggressive title updates
  useEffect(() => {
    console.log(`SEO: Setting meta tags for ${props.pageType}`, {
      title: seoData.title,
      description: seoData.description,
      url: seoData.url,
      pageType: props.pageType,
      fundName: props.fundName,
      managerName: props.managerName,
      categoryName: props.categoryName,
      tagName: props.tagName
    });
    
    // Multiple aggressive title update attempts
    const updateTitle = () => {
      document.title = seoData.title;
      
      // Remove any conflicting title tags and set our own
      const existingTitles = document.querySelectorAll('title');
      existingTitles.forEach((title, index) => {
        if (index > 0) title.remove(); // Remove duplicates, keep only first
        else title.textContent = seoData.title; // Update the first one
      });
    };
    
    // Immediate update
    updateTitle();
    
    // Fallback updates at different intervals
    const timers = [
      setTimeout(updateTitle, 10),
      setTimeout(updateTitle, 100),
      setTimeout(updateTitle, 500)
    ];
    
    // Final verification
    const verificationTimer = setTimeout(() => {
      const actualTitle = document.title;
      console.log('SEO: Final title verification:', actualTitle);
      console.log('SEO: Expected title:', seoData.title);
      
      if (actualTitle !== seoData.title) {
        console.warn('SEO: Title mismatch detected! Final force update...');
        document.title = seoData.title;
      }
    }, 1000);
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      clearTimeout(verificationTimer);
    };
  }, [props.pageType, props.fundName, props.managerName, props.categoryName, props.tagName, seoData.title, seoData.description, seoData.url]);

  return <MetaTags seoData={seoData} />;
};

export default PageSEO;
