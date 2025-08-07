export interface ImageOptimizationConfig {
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  width?: number;
  height?: number;
  lazy?: boolean;
  placeholder?: 'blur' | 'empty';
}

export class ImageOptimizationService {
  
  // Generate optimized image attributes
  static getOptimizedImageProps(
    src: string, 
    alt: string,
    config: ImageOptimizationConfig = {}
  ): {
    src?: string;
    'data-src'?: string;
    srcSet?: string;
    'data-srcset'?: string;
    alt: string;
    loading?: 'lazy' | 'eager';
    decoding?: 'async';
    className?: string;
    style?: React.CSSProperties;
  } {
    const { 
      quality = 85, 
      format = 'auto', 
      width, 
      height, 
      lazy = true,
      placeholder = 'blur'
    } = config;

    const optimizedSrc = this.buildOptimizedUrl(src, { quality, format, width, height });
    const srcSet = this.generateResponsiveSrcSet(src, { quality, format });

    const props: any = {
      alt: alt || '',
      decoding: 'async' as const,
    };

    if (lazy) {
      // Lazy loading configuration
      props['data-src'] = optimizedSrc;
      props['data-srcset'] = srcSet;
      props.loading = 'lazy';
      props.className = 'lazy';
      
      // Placeholder for lazy images
      if (placeholder === 'blur') {
        props.src = this.generateBlurDataUrl(width || 400, height || 300);
        props.style = {
          filter: 'blur(8px)',
          transition: 'filter 0.3s ease',
        };
      } else {
        props.src = this.generateEmptyDataUrl();
      }
    } else {
      // Eager loading for above-the-fold images
      props.src = optimizedSrc;
      props.srcSet = srcSet;
      props.loading = 'eager';
    }

    return props;
  }

  // Build optimized URL with parameters
  private static buildOptimizedUrl(
    src: string, 
    options: { quality?: number; format?: string; width?: number; height?: number }
  ): string {
    if (!src.startsWith('http')) {
      return src; // Return local URLs as-is
    }

    try {
      const url = new URL(src);
      const params = new URLSearchParams(url.search);
      
      if (options.quality) params.set('q', options.quality.toString());
      if (options.format && options.format !== 'auto') params.set('f', options.format);
      if (options.width) params.set('w', options.width.toString());
      if (options.height) params.set('h', options.height.toString());
      
      // Add format optimization for supported services
      if (this.supportsWebP() && !src.includes('.webp')) {
        params.set('format', 'webp');
      }
      
      url.search = params.toString();
      return url.toString();
    } catch (error) {
      console.warn('Failed to optimize image URL:', error);
      return src;
    }
  }

  // Generate responsive srcSet
  private static generateResponsiveSrcSet(
    src: string, 
    options: { quality?: number; format?: string }
  ): string {
    if (!src.startsWith('http')) {
      return src; // Return local URLs as-is
    }

    const breakpoints = [400, 768, 1024, 1280, 1920];
    
    return breakpoints
      .map(width => {
        const optimizedUrl = this.buildOptimizedUrl(src, {
          ...options,
          width
        });
        return `${optimizedUrl} ${width}w`;
      })
      .join(', ');
  }

  // Check WebP support
  private static supportsWebP(): boolean {
    if (typeof window === 'undefined') return false;
    
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').indexOf('webp') > -1;
  }

  // Generate blur placeholder data URL
  private static generateBlurDataUrl(width: number, height: number): string {
    return `data:image/svg+xml;base64,${btoa(`
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="#f3f4f6"/>
        <animate attributeName="fill" values="#f3f4f6;#e5e7eb;#f3f4f6" dur="2s" repeatCount="indefinite"/>
      </svg>
    `)}`;
  }

  // Generate empty placeholder data URL
  private static generateEmptyDataUrl(): string {
    return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMSIgaGVpZ2h0PSIxIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InRyYW5zcGFyZW50Ii8+PC9zdmc+';
  }

  // Initialize global image optimization
  static initializeGlobalOptimization(): void {
    // Add CSS for lazy loading transitions
    this.addLazyLoadingCSS();
    
    // Observe and optimize existing images
    this.optimizeExistingImages();
    
    // Set up mutation observer for new images
    this.setupImageMutationObserver();
  }

  // Add CSS for lazy loading effects
  private static addLazyLoadingCSS(): void {
    const existingStyle = document.querySelector('#image-optimization-styles');
    if (existingStyle) return;

    const style = document.createElement('style');
    style.id = 'image-optimization-styles';
    style.textContent = `
      img.lazy {
        transition: filter 0.3s ease, opacity 0.3s ease;
      }
      
      img.lazy.loaded {
        filter: none !important;
        opacity: 1;
      }
      
      img[data-src] {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: shimmer 2s infinite;
      }
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    
    document.head.appendChild(style);
  }

  // Optimize existing images on the page
  private static optimizeExistingImages(): void {
    const images = document.querySelectorAll('img:not([data-optimized])');
    
    images.forEach((img) => {
      const image = img as HTMLImageElement;
      
      // Mark as optimized to avoid reprocessing
      image.setAttribute('data-optimized', 'true');
      
      // Add loading attribute if not present
      if (!image.loading) {
        image.loading = 'lazy';
      }
      
      // Add decoding attribute
      image.decoding = 'async';
      
      // Optimize alt text if missing
      if (!image.alt && image.src) {
        const filename = image.src.split('/').pop()?.split('.')[0] || '';
        image.alt = filename.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      }
    });
  }

  // Set up mutation observer for new images
  private static setupImageMutationObserver(): void {
    if (typeof window === 'undefined' || !(window as any).MutationObserver) return;

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element;
            
            // Check if the node itself is an image
            if (element.tagName === 'IMG') {
              this.optimizeImage(element as HTMLImageElement);
            }
            
            // Check for images within the added node
            const images = element.querySelectorAll?.('img:not([data-optimized])');
            images?.forEach((img) => this.optimizeImage(img as HTMLImageElement));
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    // Store observer for cleanup
    (window as any).__imageOptimizationObserver = observer;
  }

  // Optimize individual image
  private static optimizeImage(img: HTMLImageElement): void {
    if (img.getAttribute('data-optimized')) return;
    
    img.setAttribute('data-optimized', 'true');
    
    if (!img.loading) img.loading = 'lazy';
    img.decoding = 'async';
    
    if (!img.alt && img.src) {
      const filename = img.src.split('/').pop()?.split('.')[0] || '';
      img.alt = filename.replace(/[-_]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
  }

  // Cleanup observers
  static cleanup(): void {
    const lazyObserver = (window as any).__lazyImageObserver;
    const mutationObserver = (window as any).__imageOptimizationObserver;
    
    if (lazyObserver) {
      lazyObserver.disconnect();
      delete (window as any).__lazyImageObserver;
    }
    
    if (mutationObserver) {
      mutationObserver.disconnect();
      delete (window as any).__imageOptimizationObserver;
    }
  }
}