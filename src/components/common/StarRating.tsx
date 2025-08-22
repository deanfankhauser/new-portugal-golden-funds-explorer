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
    <div className={`flex items-center gap-1 ${className}`} title={`${rating.toFixed(1)} out of ${maxRating} stars`}>
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, index) => {
          const starValue = index + 1;
          const fillPercentage = Math.max(0, Math.min(100, (rating - index) * 100));
          
          return (
            <div key={index} className={`relative ${sizeClasses[size]}`}>
              {/* Background star (empty) */}
              <Star className={`absolute inset-0 ${sizeClasses[size]} fill-none text-muted`} />
              {/* Foreground star (filled) with clipping */}
              <div 
                className="overflow-hidden"
                style={{ width: `${fillPercentage}%` }}
              >
                <Star className={`${sizeClasses[size]} fill-warning text-warning`} />
              </div>
            </div>
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