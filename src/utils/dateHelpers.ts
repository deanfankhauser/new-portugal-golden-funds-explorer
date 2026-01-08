import { differenceInDays } from 'date-fns';

/**
 * Check if a fund was updated within the last 5 days
 */
export const isRecentlyUpdated = (updatedAt: string | undefined): boolean => {
  if (!updatedAt) return false;
  
  try {
    const updateDate = new Date(updatedAt);
    const now = new Date();
    const daysDifference = differenceInDays(now, updateDate);
    
    return daysDifference <= 5;
  } catch (error) {
    console.error('Error parsing date:', error);
    return false;
  }
};
