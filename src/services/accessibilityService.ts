
export class AccessibilityService {
  
  // Add ARIA landmarks to page sections
  static addLandmarks(): void {
    // Mark main content area
    const mainContent = document.querySelector('main');
    if (mainContent && !mainContent.getAttribute('aria-label')) {
      mainContent.setAttribute('aria-label', 'Main content');
    }

    // Mark navigation areas
    const navElements = document.querySelectorAll('nav');
    navElements.forEach((nav, index) => {
      if (!nav.getAttribute('aria-label')) {
        nav.setAttribute('aria-label', index === 0 ? 'Primary navigation' : `Navigation ${index + 1}`);
      }
    });

    // Mark search functionality
    const searchElements = document.querySelectorAll('[role="search"], input[type="search"]');
    searchElements.forEach(search => {
      if (!search.getAttribute('aria-label')) {
        search.setAttribute('aria-label', 'Search funds');
      }
    });
  }

  // Enhance form accessibility
  static enhanceFormAccessibility(): void {
    // Add proper labels to form controls
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      const inputElement = input as HTMLInputElement;
      if (!inputElement.getAttribute('aria-label') && !inputElement.getAttribute('aria-labelledby')) {
        const label = document.querySelector(`label[for="${inputElement.id}"]`);
        if (!label && inputElement.placeholder) {
          inputElement.setAttribute('aria-label', inputElement.placeholder);
        }
      }
    });
  }

  // Check and fix color contrast issues
  static checkColorContrast(): void {
    // This would typically integrate with a contrast checking library
    // For now, we'll log elements that might have contrast issues
    const textElements = document.querySelectorAll('p, span, div, h1, h2, h3, h4, h5, h6, a, button');
    
    textElements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Basic check for common low-contrast combinations
      if (color === 'rgb(128, 128, 128)' && backgroundColor === 'rgb(255, 255, 255)') {
        console.warn('Potential contrast issue detected:', element);
      }
    });
  }

  // Add keyboard navigation support
  static enhanceKeyboardNavigation(): void {
    // Ensure all interactive elements are focusable
    const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
    
    interactiveElements.forEach(element => {
      if (!element.getAttribute('tabindex') && element.tagName !== 'INPUT' && element.tagName !== 'SELECT' && element.tagName !== 'TEXTAREA') {
        const htmlElement = element as HTMLElement;
        if (!htmlElement.hasAttribute('tabindex')) {
          htmlElement.setAttribute('tabindex', '0');
        }
      }
    });
  }

  // Initialize all accessibility enhancements
  static initializeAccessibility(): void {
    // Run on DOM content loaded
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        this.addLandmarks();
        this.enhanceFormAccessibility();
        this.enhanceKeyboardNavigation();
      });
    } else {
      this.addLandmarks();
      this.enhanceFormAccessibility();
      this.enhanceKeyboardNavigation();
    }
  }
}
