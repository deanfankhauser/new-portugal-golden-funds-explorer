import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
  className?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxRating = 5,
  size = 'md',
  showValue = false,
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const isFilled = starValue <= rating;
          const isPartial = starValue > rating && starValue - 1 < rating;
          
          return (
            <Star
              key={index}
              className={`${sizeClasses[size]} ${
                isFilled 
                  ? 'fill-yellow-400 text-yellow-400' 
                  : isPartial 
                    ? 'fill-yellow-200 text-yellow-400'
                    : 'fill-none text-gray-300'
              }`}
            />
          );
        })}
      </div>
      {showValue && (
        <span className={`${textSizeClasses[size]} text-muted-foreground ml-1`}>
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
};