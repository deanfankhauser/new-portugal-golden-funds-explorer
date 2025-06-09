
export class ImageOptimizationService {
  
  // Generate responsive image sources with WebP support
  static generateResponsiveSources(originalSrc: string, sizes: number[] = [400, 800, 1200]): string {
    const supportsWebP = this.checkWebPSupport();
    const baseSrc = originalSrc.split('?')[0];
    const extension = baseSrc.split('.').pop()?.toLowerCase();
    
    // Generate srcset for different sizes
    const srcSet = sizes.map(size => {
      const optimizedSrc = this.optimizeImageUrl(originalSrc, size);
      return `${optimizedSrc} ${size}w`;
    }).join(', ');
    
    return srcSet;
  }

  // Optimize image URL with size and format parameters
  static optimizeImageUrl(originalSrc: string, width?: number, height?: number): string {
    // For external images (Unsplash, etc.), add optimization parameters
    if (originalSrc.includes('unsplash.com')) {
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('auto', 'format');
      params.set('fit', 'crop');
      params.set('q', '80');
      
      const separator = originalSrc.includes('?') ? '&' : '?';
      return `${originalSrc}${separator}${params.toString()}`;
    }
    
    return originalSrc;
  }

  // Check WebP support
  static checkWebPSupport(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('webp') > -1;
  }

  // Generate alt text for fund logos
  static generateFundLogoAlt(fundName: string, managerName?: string): string {
    if (managerName) {
      return `${fundName} logo managed by ${managerName}`;
    }
    return `${fundName} investment fund logo`;
  }

  // Generate alt text for fund category icons
  static generateCategoryIconAlt(category: string): string {
    return `${category} investment category icon`;
  }

  // Lazy load images with intersection observer
  static initializeLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              if (img.dataset.srcset) {
                img.srcset = img.dataset.srcset;
              }
              img.classList.remove('lazy');
              img.classList.add('loaded');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      // Observe all images with data-src attribute
      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
}
