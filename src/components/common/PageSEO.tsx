
import React, { useEffect } from 'react';
import { PageSEOProps } from '../../types/seo';
import { SEODataService } from '../../services/seoDataService';
import MetaTags from './MetaTags';

const PageSEO: React.FC<PageSEOProps> = (props) => {
  // Add very aggressive debugging
  console.log('🔥 PageSEO: COMPONENT MOUNTED - Props received:', props);
  console.log('🔥 PageSEO: Current URL info:', {
    href: typeof window !== 'undefined' ? window.location.href : 'SSR',
    pathname: typeof window !== 'undefined' ? window.location.pathname : 'SSR',
    origin: typeof window !== 'undefined' ? window.location.origin : 'SSR',
    hostname: typeof window !== 'undefined' ? window.location.hostname : 'SSR'
  });

  const seoData = SEODataService.getSEOData(props);
  
  console.log('🔥 PageSEO: SEO Data Generated:', seoData);

  // Enhanced debug logging and aggressive title updates
  useEffect(() => {
    console.log('🔥 PageSEO: useEffect triggered with props:', props);
    console.log('🔥 PageSEO: Generated SEO data in useEffect:', seoData);
    
    // Check if we're under a proxy
    if (typeof window !== 'undefined') {
      const isUnderProxy = window.location.pathname.startsWith('/funds/') || 
                          window.location.href.includes('/funds/');
      
      console.log('🔥 PageSEO: PROXY DETECTION RESULTS:', {
        isUnderProxy,
        pathname: window.location.pathname,
        href: window.location.href,
        pageType: props.pageType,
        fundName: props.fundName,
        seoTitle: seoData.title,
        isDefaultTitle: seoData.title === 'Portugal Golden Visa Investment Funds | Eligible Investments 2025'
      });

      if (isUnderProxy && props.pageType === 'fund') {
        console.log('🔥 PageSEO: 🚨 FUND PAGE UNDER PROXY DETECTED!');
        console.log('🔥 PageSEO: Fund name provided:', props.fundName);
        console.log('🔥 PageSEO: Generated title:', seoData.title);
        
        if (seoData.title === 'Portugal Golden Visa Investment Funds | Eligible Investments 2025') {
          console.error('🔥 PageSEO: 🚨🚨🚨 CRITICAL ISSUE: Fund page under proxy showing default homepage title!');
          console.error('🔥 PageSEO: This confirms the bug - fund-specific SEO not being generated under proxy');
        } else {
          console.log('🔥 PageSEO: ✅ Fund page title looks correct under proxy');
        }
      }
    }
    
    console.log(`🔥 PageSEO: Processing SEO for ${props.pageType}`, {
      title: seoData.title,
      description: seoData.description,
      url: seoData.url,
      pageType: props.pageType,
      fundName: props.fundName,
      managerName: props.managerName,
      categoryName: props.categoryName,
      tagName: props.tagName,
      currentUrl: typeof window !== 'undefined' ? window.location.href : 'SSR',
      pathname: typeof window !== 'undefined' ? window.location.pathname : 'SSR'
    });
    
    // Proxy-specific debugging for fund pages
    if (props.pageType === 'fund') {
      console.log(`🔥 PageSEO: FUND PAGE ANALYSIS for: "${props.fundName}"`);
      console.log(`🔥 PageSEO: Generated SEO title: "${seoData.title}"`);
      
      // Check if we're under proxy
      if (typeof window !== 'undefined') {
        const isUnderProxy = window.location.pathname.startsWith('/funds/') || 
                            window.location.href.includes('/funds/');
        
        console.log(`🔥 PageSEO: Proxy context analysis:`, {
          isUnderProxy,
          pathname: window.location.pathname,
          href: window.location.href,
          fundNameProvided: !!props.fundName,
          fundName: props.fundName,
          isDefaultTitle: seoData.title === 'Portugal Golden Visa Investment Funds | Eligible Investments 2025'
        });

        if (isUnderProxy && seoData.title === 'Portugal Golden Visa Investment Funds | Eligible Investments 2025') {
          console.error(`🔥 PageSEO: 🚨 PROXY ISSUE DETECTED - Fund page under proxy showing default title!`);
          console.error(`🔥 PageSEO: Expected fund-specific title but got homepage title`);
          console.error(`🔥 PageSEO: Fund name: "${props.fundName}"`);
          console.error(`🔥 PageSEO: This suggests SEO service is not receiving fund name properly under proxy`);
        }
      }
      
      // Verify the title includes the fund name
      if (props.fundName && !seoData.title.includes(props.fundName)) {
        console.error(`🔥 PageSEO: Fund page title missing fund name: "${props.fundName}" in title: "${seoData.title}"`);
      } else if (props.fundName && seoData.title === 'Portugal Golden Visa Investment Funds | Eligible Investments 2025') {
        console.error(`🔥 PageSEO: 🚨 Fund page using default homepage title instead of fund-specific title!`);
        console.error(`🔥 PageSEO: This is the core issue - fund name is provided but not used in title generation`);
      } else if (props.fundName) {
        console.log(`🔥 PageSEO: ✅ Fund page title format correct for "${props.fundName}"`);
      }
    }
    
    // For tag pages, ensure we have the tag name and verify title format
    if (props.pageType === 'tag') {
      console.log(`🔥 PageSEO: Processing tag page for: "${props.tagName}"`);
      console.log(`🔥 PageSEO: Generated SEO title: "${seoData.title}"`);
      
      // Verify the title includes "Fund Tags"
      if (props.tagName && !seoData.title.includes('Fund Tags')) {
        console.error(`🔥 PageSEO: Tag page title missing "Fund Tags": "${seoData.title}"`);
      } else {
        console.log(`🔥 PageSEO: ✅ Tag page title format correct`);
      }
    }

    // For category pages, verify title format
    if (props.pageType === 'category') {
      console.log(`🔥 PageSEO: Processing category page for: "${props.categoryName}"`);
      console.log(`🔥 PageSEO: Generated SEO title: "${seoData.title}"`);
      
      // Verify the title includes "Fund Categories"
      if (props.categoryName && !seoData.title.includes('Fund Categories')) {
        console.error(`🔥 PageSEO: Category page title missing "Fund Categories": "${seoData.title}"`);
      } else {
        console.log(`🔥 PageSEO: ✅ Category page title format correct`);
      }
    }

    // For manager pages, verify title format
    if (props.pageType === 'manager') {
      console.log(`🔥 PageSEO: Processing manager page for: "${props.managerName}"`);
      console.log(`🔥 PageSEO: Generated SEO title: "${seoData.title}"`);
      
      // Verify the title includes manager name and proper format
      if (props.managerName && !seoData.title.includes(props.managerName)) {
        console.error(`🔥 PageSEO: Manager page title missing manager name: "${seoData.title}"`);
      } else if (props.managerName && !seoData.title.includes('Fund Manager Profile')) {
        console.error(`🔥 PageSEO: Manager page title missing "Fund Manager Profile": "${seoData.title}"`);
      } else {
        console.log(`🔥 PageSEO: ✅ Manager page title format correct`);
      }
    }
    
    // Multiple aggressive title update attempts
    const updateTitle = () => {
      const newTitle = seoData.title;
      console.log(`🔥 PageSEO: Updating document title to: "${newTitle}"`);
      document.title = newTitle;
      
      // Remove any conflicting title tags and set our own
      const existingTitles = document.querySelectorAll('title');
      existingTitles.forEach((title, index) => {
        if (index > 0) {
          console.log(`🔥 PageSEO: Removing duplicate title tag: "${title.textContent}"`);
          title.remove(); // Remove duplicates, keep only first
        } else {
          const oldTitle = title.textContent;
          title.textContent = newTitle; // Update the first one
          console.log(`🔥 PageSEO: Updated title tag from "${oldTitle}" to "${newTitle}"`);
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
      console.log('🔥 PageSEO: Final title verification:', actualTitle);
      console.log('🔥 PageSEO: Expected title:', seoData.title);
      
      if (actualTitle !== seoData.title) {
        console.warn('🔥 PageSEO: Title mismatch detected! Final force update...');
        document.title = seoData.title;
        
        // Also check if there are multiple title elements
        const titleElements = document.querySelectorAll('title');
        console.log(`🔥 PageSEO: Found ${titleElements.length} title elements`);
        titleElements.forEach((el, i) => {
          console.log(`🔥 PageSEO: Title element ${i}: "${el.textContent}"`);
        });
      } else {
        console.log('🔥 PageSEO: ✅ Title verification successful');
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
