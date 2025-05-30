
import React, { useState, useRef, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  placeholder?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  placeholder
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    skip: priority // Skip intersection observer for priority images
  });

  const shouldLoad = priority || inView;

  // Generate optimized image URL
  const getOptimizedSrc = (originalSrc: string) => {
    // Check if browser supports WebP
    const supportsWebP = (() => {
      const canvas = document.createElement('canvas');
      canvas.width = 1;
      canvas.height = 1;
      return canvas.toDataURL('image/webp').indexOf('webp') > -1;
    })();

    let optimizedSrc = originalSrc;

    // Add responsive sizing parameters if available
    if (width || height) {
      const params = new URLSearchParams();
      if (width) params.set('w', width.toString());
      if (height) params.set('h', height.toString());
      params.set('q', '85'); // Quality 85%
      
      const separator = originalSrc.includes('?') ? '&' : '?';
      optimizedSrc = `${originalSrc}${separator}${params.toString()}`;
    }

    // Convert to WebP if supported and not already WebP
    if (supportsWebP && !originalSrc.includes('.webp')) {
      optimizedSrc = optimizedSrc.replace(/\.(jpg|jpeg|png)/, '.webp');
    }

    return optimizedSrc;
  };

  // Generate placeholder (low quality version)
  const getPlaceholderSrc = (originalSrc: string) => {
    if (placeholder) return placeholder;
    
    const params = new URLSearchParams();
    params.set('w', '20');
    params.set('q', '10');
    params.set('blur', '5');
    
    const separator = originalSrc.includes('?') ? '&' : '?';
    return `${originalSrc}${separator}${params.toString()}`;
  };

  useEffect(() => {
    if (shouldLoad && imgRef.current) {
      const img = imgRef.current;
      const optimizedSrc = getOptimizedSrc(src);
      
      // Preload the high-quality image
      const highQualityImg = new Image();
      
      highQualityImg.onload = () => {
        setIsLoaded(true);
        img.src = optimizedSrc;
      };
      
      highQualityImg.onerror = () => {
        setIsError(true);
        // Fallback to original src
        img.src = src;
      };
      
      highQualityImg.src = optimizedSrc;
    }
  }, [shouldLoad, src, width, height]);

  const setRefs = (element: HTMLImageElement) => {
    imgRef.current = element;
    inViewRef(element);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={setRefs}
        src={shouldLoad ? (isLoaded ? getOptimizedSrc(src) : getPlaceholderSrc(src)) : getPlaceholderSrc(src)}
        alt={alt}
        width={width}
        height={height}
        className={`transition-all duration-300 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-70 scale-105 blur-sm'
        } ${isError ? 'opacity-50' : ''}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => {
          if (shouldLoad) setIsLoaded(true);
        }}
        onError={() => setIsError(true)}
      />
      
      {/* Loading skeleton */}
      {!isLoaded && !isError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Error fallback */}
      {isError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
          Image failed to load
        </div>
      )}
    </div>
  );
};

export default OptimizedImage;
