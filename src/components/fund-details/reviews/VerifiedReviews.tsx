import React, { useState, useMemo } from 'react';
import { Fund } from '../../../data/types/funds';
import { Review, ReviewFilters } from '../../../types/review';
import { ReviewsService } from '../../../data/services/reviews-service';
import { ReviewItem } from './ReviewItem';
import { StarRating } from '../../common/StarRating';
import { Card } from '../../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Star, Users } from 'lucide-react';

interface VerifiedReviewsProps {
  fund: Fund;
}

export const VerifiedReviews: React.FC<VerifiedReviewsProps> = ({ fund }) => {
  const [filters, setFilters] = useState<ReviewFilters>({
    minRating: null,
    country: null
  });

  const allReviews = ReviewsService.getReviewsByFundId(fund.id);
  const aggregateRating = ReviewsService.getAggregateRatingByFundId(fund.id);

  const filteredReviews = useMemo(() => {
    return allReviews
      .filter(review => {
        const ratingMatch = filters.minRating === null || review.rating >= filters.minRating;
        const countryMatch = filters.country === null || filters.country === 'all' || 
          review.reviewerCountry.toLowerCase() === filters.country.toLowerCase();
        return ratingMatch && countryMatch;
      })
      .sort((a, b) => new Date(b.dateReviewed).getTime() - new Date(a.dateReviewed).getTime());
  }, [allReviews, filters]);

  const uniqueCountries = useMemo(() => {
    const countries = [...new Set(allReviews.map(review => review.reviewerCountry))];
    return countries.sort();
  }, [allReviews]);

  const ratingDistribution = useMemo(() => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    allReviews.forEach(review => {
      const clampedRating = Math.max(1, Math.min(5, review.rating));
      distribution[clampedRating as keyof typeof distribution]++;
    });
    return distribution;
  }, [allReviews]);

  if (allReviews.length === 0) {
    return (
      <Card className="p-6 text-center">
        <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Reviews Yet</h3>
        <p className="text-muted-foreground">
          This fund hasn't received any verified investor reviews yet. Reviews help other investors make informed decisions.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Verified Reviews</h2>
        <p className="text-muted-foreground">
          Reviews from verified investors who have invested through this fund.
        </p>
      </div>

      {/* Overview Card */}
      <Card className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="text-center" role="img" aria-label={`Average rating ${aggregateRating?.ratingValue} out of 5 stars from ${aggregateRating?.reviewCount} reviews`}>
                <div className="text-3xl font-bold">{aggregateRating?.ratingValue}</div>
                <StarRating rating={aggregateRating?.ratingValue || 0} size="lg" />
                <div className="text-sm text-muted-foreground mt-1">
                  {aggregateRating?.reviewCount} review{aggregateRating?.reviewCount !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = ratingDistribution[rating as keyof typeof ratingDistribution];
              const percentage = allReviews.length > 0 ? (count / allReviews.length) * 100 : 0;
              
              return (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="w-8">{rating}</span>
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-400 h-2 rounded-full transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-8 text-right text-muted-foreground">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <Select 
          value={filters.minRating?.toString() || 'all'} 
          onValueChange={(value) => setFilters(prev => ({ 
            ...prev, 
            minRating: value === 'all' ? null : parseInt(value) 
          }))}
        >
          <SelectTrigger className="w-48 bg-white z-50" aria-label="Filter by minimum rating">
            <SelectValue placeholder="Filter by rating" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="all">All ratings</SelectItem>
            <SelectItem value="5">5 stars only</SelectItem>
            <SelectItem value="4">4+ stars</SelectItem>
            <SelectItem value="3">3+ stars</SelectItem>
            <SelectItem value="2">2+ stars</SelectItem>
            <SelectItem value="1">1+ stars</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={filters.country || 'all'} 
          onValueChange={(value) => setFilters(prev => ({ 
            ...prev, 
            country: value === 'all' ? null : value 
          }))}
        >
          <SelectTrigger className="w-48 bg-white z-50" aria-label="Filter by country">
            <SelectValue placeholder="Filter by country" />
          </SelectTrigger>
          <SelectContent className="bg-white z-50">
            <SelectItem value="all">All countries</SelectItem>
            {uniqueCountries.map(country => (
              <SelectItem key={country} value={country}>{country}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground" aria-live="polite">
          <Users className="w-4 h-4" />
          Showing {filteredReviews.length} of {allReviews.length} reviews
        </div>

        {filteredReviews.length > 0 ? (
          <div className="space-y-4">
            {filteredReviews.map(review => (
              <ReviewItem key={review.id} review={review} />
            ))}
          </div>
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">
              No reviews match your current filters.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};