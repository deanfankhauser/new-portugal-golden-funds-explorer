import { useMemo } from 'react';
import { useRealTimeFunds } from './useRealTimeFunds';
import { FundCategory } from '@/data/types/funds';

interface CategoryWithCount {
  category: FundCategory;
  count: number;
}

export function useFundCategories() {
  const { funds, loading, error } = useRealTimeFunds();

  const categories = useMemo(() => {
    if (!funds.length) return [];

    const categoryMap = new Map<string, number>();

    funds.forEach((fund) => {
      if (fund.category) {
        const count = categoryMap.get(fund.category) || 0;
        categoryMap.set(fund.category, count + 1);
      }
    });

    // Convert to array and sort by count (descending)
    const result: CategoryWithCount[] = Array.from(categoryMap.entries())
      .map(([category, count]) => ({
        category: category as FundCategory,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    return result;
  }, [funds]);

  return { categories, isLoading: loading, error };
}
