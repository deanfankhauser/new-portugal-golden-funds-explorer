import { useEffect } from 'react';

/**
 * Hook to automatically update year references in page titles and headings
 * Runs client-side to keep SSG-generated content fresh across year boundaries
 * without requiring full rebuilds
 */
export const useYearUpdate = (pageType?: string) => {
  useEffect(() => {
    // Only run on fund pages that have year-specific titles
    if (pageType !== 'fund') return;
    
    const currentYear = new Date().getFullYear();
    
    // Pattern to match year in fund titles: ": YYYY Fees, Yield" or ": YYYY Golden Visa"
    const yearPattern = /:\s*(\d{4})\s+(Fees,\s*Yield|Golden\s*Visa)/g;
    
    // Update document title if it contains an outdated year
    if (document.title) {
      const updatedTitle = document.title.replace(yearPattern, (match, year, suffix) => {
        const oldYear = parseInt(year, 10);
        if (oldYear !== currentYear) {
          console.log(`📅 Auto-updating year in title: ${oldYear} → ${currentYear}`);
          return `: ${currentYear} ${suffix}`;
        }
        return match;
      });
      
      if (updatedTitle !== document.title) {
        document.title = updatedTitle;
      }
    }
    
    // Update Open Graph title meta tag
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      const currentOgTitle = ogTitle.getAttribute('content') || '';
      const updatedOgTitle = currentOgTitle.replace(yearPattern, (match, year, suffix) => {
        const oldYear = parseInt(year, 10);
        if (oldYear !== currentYear) {
          return `: ${currentYear} ${suffix}`;
        }
        return match;
      });
      
      if (updatedOgTitle !== currentOgTitle) {
        ogTitle.setAttribute('content', updatedOgTitle);
      }
    }
    
    // Update Twitter title meta tag
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    if (twitterTitle) {
      const currentTwitterTitle = twitterTitle.getAttribute('content') || '';
      const updatedTwitterTitle = currentTwitterTitle.replace(yearPattern, (match, year, suffix) => {
        const oldYear = parseInt(year, 10);
        if (oldYear !== currentYear) {
          return `: ${currentYear} ${suffix}`;
        }
        return match;
      });
      
      if (updatedTwitterTitle !== currentTwitterTitle) {
        twitterTitle.setAttribute('content', updatedTwitterTitle);
      }
    }
    
    // Update any H1 elements that might contain the year pattern
    const h1Elements = document.querySelectorAll('h1');
    h1Elements.forEach(h1 => {
      const currentText = h1.textContent || '';
      const updatedText = currentText.replace(yearPattern, (match, year, suffix) => {
        const oldYear = parseInt(year, 10);
        if (oldYear !== currentYear) {
          console.log(`📅 Auto-updating year in H1: ${oldYear} → ${currentYear}`);
          return `: ${currentYear} ${suffix}`;
        }
        return match;
      });
      
      if (updatedText !== currentText) {
        h1.textContent = updatedText;
      }
    });
    
  }, [pageType]);
};
