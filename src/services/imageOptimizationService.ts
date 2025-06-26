
export class ImageOptimizationService {
  
  // Generate responsive image URLs with optimization parameters
  static generateResponsiveImageUrl(
    originalUrl: string,
    options: {
      width?: number;
      height?: number;
      quality?: number;
      format?: 'webp' | 'jpg' | 'png';
      placeholder?: boolean;
    } = {}
  ): string {
    // For external images, we can't optimize them directly
    // But we can provide fallbacks and check format support
    if (originalUrl.startsWith('http')) {
      return this.optimizeExternalImage(originalUrl, options);
    }

    // For local images, we can add query parameters for optimization
    const url = new URL(originalUrl, window.location.origin);
    
    if (options.width) url.searchParams.set('w', options.width.toString());
    if (options.height) url.searchParams.set('h', options.height.toString());
    if (options.quality) url.searchParams.set('q', options.quality.toString());
    if (options.format) url.searchParams.set('f', options.format);

    return url.toString();
  }

  // Optimize external images with format detection
  private static optimizeExternalImage(url: string, options: any): string {
    // Check WebP support
    const supportsWebP = this.checkWebPSupport();
    
    // If the original image is not WebP and we support WebP, try to convert
    if (supportsWebP && options.format === 'webp' && !url.includes('.webp')) {
      // For demonstration - in a real app, you'd use an image CDN
      console.log('WebP optimization available for:', url);
    }

    return url;
  }

  // Check if browser supports WebP
  static checkWebPSupport(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  }

  // Create lazy loading image element
  static createLazyImage(
    src: string,
    alt: string,
    options: {
      className?: string;
      width?: number;
      height?: number;
      placeholder?: string;
    } = {}
  ): HTMLImageElement {
    const img = document.createElement('img');
    
    // Set up lazy loading
    img.setAttribute('data-src', src);
    img.alt = alt;
    img.className = `lazy ${options.className || ''}`;
    
    // Add placeholder
    if (options.placeholder) {
      img.src = options.placeholder;
    } else {
      // Create a simple placeholder
      img.src = this.generatePlaceholder(options.width || 300, options.height || 200);
    }

    // Set dimensions if provided
    if (options.width) img.width = options.width;
    if (options.height) img.height = options.height;

    return img;
  }

  // Generate a simple placeholder image
  private static generatePlaceholder(width: number, height: number): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f3f4f6';
      ctx.fillRect(0, 0, width, height);
      
      ctx.fillStyle = '#9ca3af';
      ctx.font = '14px Inter, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Loading...', width / 2, height / 2);
    }
    
    return canvas.toDataURL();
  }

  // Initialize lazy loading with Intersection Observer
  static initializeLazyLoading(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      console.log('Lazy loading not supported');
      return;
    }

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.src = src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            observer.unobserve(img);
            
            console.log('Lazy loaded image:', src);
          }
        }
      });
    }, {
      rootMargin: '50px 0px', // Start loading 50px before the image enters viewport
      threshold: 0.1
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });

    // Set up a mutation observer to catch dynamically added images
    const mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            const lazyImages = element.querySelectorAll('img[data-src]');
            lazyImages.forEach(img => imageObserver.observe(img));
          }
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Preload critical images
  static preloadCriticalImages(imageUrls: string[]): void {
    imageUrls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;
      document.head.appendChild(link);
      
      console.log('Preloading critical image:', url);
    });
  }
}
