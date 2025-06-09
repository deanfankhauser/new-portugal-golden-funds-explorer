
import React, { useState } from 'react';
import { ImageOptimizationService } from '../../services/imageOptimizationService';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  lazy?: boolean;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  priority = false,
  lazy = true
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate optimized image URLs
  const optimizedSrc = ImageOptimizationService.optimizeImageUrl(src, width, height);
  const responsiveSrcSet = ImageOptimizationService.generateResponsiveSources(src, [400, 800, 1200]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
  };

  // If priority loading (above fold), load immediately
  if (priority) {
    return (
      <img
        src={optimizedSrc}
        srcSet={responsiveSrcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="eager"
      />
    );
  }

  // For lazy loading
  if (lazy) {
    return (
      <img
        data-src={optimizedSrc}
        data-srcset={responsiveSrcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        className={`lazy ${className} ${isLoaded ? 'loaded' : 'loading'}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1 1'%3E%3C/svg%3E"
      />
    );
  }

  // Default behavior
  return (
    <img
      src={optimizedSrc}
      srcSet={responsiveSrcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      className={`${className} ${isLoaded ? 'loaded' : 'loading'}`}
      onLoad={handleLoad}
      onError={handleError}
    />
  );
};

export default OptimizedImage;
