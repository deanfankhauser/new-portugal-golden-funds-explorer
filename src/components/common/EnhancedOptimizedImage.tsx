import React, { useState, useRef, useEffect } from 'react';
import { ImageOptimizationService, ImageOptimizationConfig } from '../../services/imageOptimizationService';

interface EnhancedOptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  optimization?: ImageOptimizationConfig;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const EnhancedOptimizedImage: React.FC<EnhancedOptimizedImageProps> = ({
  src,
  alt,
  optimization = {},
  fallbackSrc,
  onLoad,
  onError,
  className = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const optimizedProps = ImageOptimizationService.getOptimizedImageProps(
    hasError && fallbackSrc ? fallbackSrc : src,
    alt,
    optimization
  );

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Set up intersection observer for lazy loading
    if (optimization.lazy !== false && 'IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const targetImg = entry.target as HTMLImageElement;
              
              // Load the actual image
              if (targetImg.dataset.src) {
                targetImg.src = targetImg.dataset.src;
                targetImg.removeAttribute('data-src');
              }
              
              if (targetImg.dataset.srcset) {
                targetImg.srcset = targetImg.dataset.srcset;
                targetImg.removeAttribute('data-srcset');
              }
              
              observer.unobserve(targetImg);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01
        }
      );

      observer.observe(img);
      
      return () => observer.disconnect();
    }
  }, [optimization.lazy]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (imgRef.current) {
      imgRef.current.classList.add('loaded');
      imgRef.current.style.filter = 'none';
    }
    onLoad?.();
  };

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setHasError(true);
    } else {
      console.warn('Image failed to load:', src);
    }
    onError?.();
  };

  const combinedClassName = `${className} ${optimizedProps.className || ''} ${isLoaded ? 'loaded' : ''}`.trim();

  return (
    <img
      ref={imgRef}
      {...props}
      {...optimizedProps}
      className={combinedClassName}
      onLoad={handleLoad}
      onError={handleError}
      style={{
        ...props.style,
        ...optimizedProps.style,
      }}
    />
  );
};

export default EnhancedOptimizedImage;