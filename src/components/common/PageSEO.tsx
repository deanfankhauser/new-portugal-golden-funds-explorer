
import React, { useEffect } from 'react';
import { PageSEOProps } from '../../types/seo';
import { SEODataService } from '../../services/seoDataService';
import MetaTags from './MetaTags';

const PageSEO: React.FC<PageSEOProps> = (props) => {
  const seoData = SEODataService.getSEOData(props);

  // Enhanced debug logging and aggressive title updates
  useEffect(() => {
    console.log(`PageSEO: Setting meta tags for ${props.pageType}`, {
      title: seoData.title,
      description: seoData.description,
      url: seoData.url,
      pageType: props.pageType,
      fundName: props.fundName,
      managerName: props.managerName,
      categoryName: props.categoryName,
      tagName: props.tagName
    });
    
    // For tag pages, ensure we have the tag name
    if (props.pageType === 'tag' && props.tagName) {
      console.log(`PageSEO: Processing tag page for: "${props.tagName}"`);
      console.log(`PageSEO: Generated SEO title: "${seoData.title}"`);
    }
    
    // Multiple aggressive title update attempts
    const updateTitle = () => {
      const newTitle = seoData.title;
      console.log(`PageSEO: Updating document title to: "${newTitle}"`);
      document.title = newTitle;
      
      // Remove any conflicting title tags and set our own
      const existingTitles = document.querySelectorAll('title');
      existingTitles.forEach((title, index) => {
        if (index > 0) {
          console.log(`PageSEO: Removing duplicate title tag: "${title.textContent}"`);
          title.remove(); // Remove duplicates, keep only first
        } else {
          const oldTitle = title.textContent;
          title.textContent = newTitle; // Update the first one
          console.log(`PageSEO: Updated title tag from "${oldTitle}" to "${newTitle}"`);
        }
      });
    };
    
    // Immediate update
    updateTitle();
    
    // Fallback updates at different intervals
    const timers = [
      setTimeout(updateTitle, 10),
      setTimeout(updateTitle, 100),
      setTimeout(updateTitle, 500),
      setTimeout(updateTitle, 1000)
    ];
    
    // Final verification
    const verificationTimer = setTimeout(() => {
      const actualTitle = document.title;
      console.log('PageSEO: Final title verification:', actualTitle);
      console.log('PageSEO: Expected title:', seoData.title);
      
      if (actualTitle !== seoData.title) {
        console.warn('PageSEO: Title mismatch detected! Final force update...');
        document.title = seoData.title;
        
        // Also check if there are multiple title elements
        const titleElements = document.querySelectorAll('title');
        console.log(`PageSEO: Found ${titleElements.length} title elements`);
        titleElements.forEach((el, i) => {
          console.log(`PageSEO: Title element ${i}: "${el.textContent}"`);
        });
      } else {
        console.log('PageSEO: ✅ Title verification successful');
      }
    }, 2000);
    
    return () => {
      timers.forEach(timer => clearTimeout(timer));
      clearTimeout(verificationTimer);
    };
  }, [props.pageType, props.fundName, props.managerName, props.categoryName, props.tagName, seoData.title, seoData.description, seoData.url]);

  return <MetaTags seoData={seoData} />;
};

export default PageSEO;
