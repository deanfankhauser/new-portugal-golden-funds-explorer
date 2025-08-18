import React from 'react';
import { Review } from '../../../types/review';
import { StarRating } from '../../common/StarRating';
import { CheckCircle } from 'lucide-react';
import { Card } from '../../ui/card';

interface ReviewItemProps {
  review: Review;
}

export const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original string if invalid date
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString; // Fallback to original string on error
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{review.title}</h4>
            {review.verified && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span className="text-xs">Verified</span>
              </div>
            )}
          </div>
          <StarRating rating={review.rating} size="sm" />
        </div>
        <div className="text-right text-xs text-muted-foreground">
          <div>{review.reviewerName}</div>
          <div>{review.reviewerCountry}</div>
          <div>{formatDate(review.dateReviewed)}</div>
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground leading-relaxed">
        {review.content}
      </p>
    </Card>
  );
};