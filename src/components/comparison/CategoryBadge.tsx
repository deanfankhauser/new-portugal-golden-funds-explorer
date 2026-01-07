import React from 'react';
import { cn } from '@/lib/utils';

interface CategoryBadgeProps {
  category: string;
  className?: string;
}

const categoryVariants: Record<string, string> = {
  'Crypto': 'bg-purple-100 text-purple-700 border-purple-200',
  'Bitcoin': 'bg-orange-100 text-orange-700 border-orange-200',
  'Private Equity': 'bg-blue-100 text-blue-700 border-blue-200',
  'Venture Capital': 'bg-indigo-100 text-indigo-700 border-indigo-200',
  'Infrastructure': 'bg-slate-100 text-slate-700 border-slate-200',
  'Debt': 'bg-slate-100 text-slate-700 border-slate-200',
  'Credit': 'bg-slate-100 text-slate-700 border-slate-200',
  'Clean Energy': 'bg-green-100 text-green-700 border-green-200',
  'Fund-of-Funds': 'bg-teal-100 text-teal-700 border-teal-200',
  'Other': 'bg-gray-100 text-gray-700 border-gray-200',
};

const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category, className }) => {
  const variant = categoryVariants[category] || categoryVariants['Other'];
  
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md border',
      variant,
      className
    )}>
      {category}
    </span>
  );
};

export default CategoryBadge;
