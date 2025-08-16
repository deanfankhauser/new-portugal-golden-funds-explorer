import { Review } from '../../types/review';

// File-based review storage
// When we have reviews, they'll be added here

/**
 * HOW TO ADD A NEW REVIEW:
 * 
 * 1. Copy the template below and fill in the details
 * 2. Add the review to the appropriate fund's array
 * 3. Ensure all fields are complete and valid
 * 
 * TEMPLATE (copy and paste):
 * {
 *   id: 'rev-XXX',                    // Unique ID (increment from last)
 *   fundId: 'fund-slug',              // Must match exact fund ID
 *   reviewerName: 'First L.',         // Use first name + last initial
 *   reviewerCountry: 'Portugal',      // Full country name (proper case)
 *   rating: 5,                        // Integer 1-5 (5 = best)
 *   title: 'Short review title',      // Brief, descriptive title
 *   content: 'Full review text...',   // Detailed review content
 *   dateReviewed: '2024-01-15',       // ISO date format (YYYY-MM-DD)
 *   verified: true                    // true = verified investor, false = unverified
 * }
 * 
 * VALIDATION TIPS:
 * - rating: Must be 1, 2, 3, 4, or 5
 * - dateReviewed: Use format YYYY-MM-DD (e.g., 2024-03-15)
 * - verified: Set to true only for confirmed investors
 * - reviewerCountry: Use consistent naming (e.g., "United States", not "USA")
 */

export const reviewsData: Record<string, Review[]> = {
  // Add reviews here when available
  // Example: 'horizon-fund': [ /* reviews array */ ]
};

export default reviewsData;