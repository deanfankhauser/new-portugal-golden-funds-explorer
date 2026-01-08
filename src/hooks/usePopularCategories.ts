import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { categoryToSlug, tagToSlug } from '@/lib/utils';

interface CategoryCount {
  type: 'category' | 'tag' | 'special';
  name: string;
  slug: string;
  count: number;
  href: string;
}

export function usePopularCategories() {
  return useQuery({
    queryKey: ['popular-categories'],
    queryFn: async (): Promise<CategoryCount[]> => {
      // Fetch all funds with their categories, tags, and verification status
      const { data: funds, error } = await supabase
        .from('funds')
        .select('category, tags, is_verified')
        .eq('status', 'active');

      if (error) {
        console.error('Error fetching funds for categories:', error);
        throw error;
      }

      if (!funds || funds.length === 0) {
        return [];
      }

      // Count verified funds
      const verifiedCount = funds.filter(f => f.is_verified).length;

      // Count by category
      const categoryCounts = new Map<string, number>();
      funds.forEach(fund => {
        if (fund.category) {
          categoryCounts.set(fund.category, (categoryCounts.get(fund.category) || 0) + 1);
        }
      });

      // Count by tag
      const tagCounts = new Map<string, number>();
      funds.forEach(fund => {
        if (fund.tags && Array.isArray(fund.tags)) {
          fund.tags.forEach(tag => {
            if (tag) {
              tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
            }
          });
        }
      });

      // Build results array
      const results: CategoryCount[] = [];

      // Add verified funds (special type)
      if (verifiedCount > 0) {
        results.push({
          type: 'special',
          name: 'Verified funds',
          slug: 'verified-funds',
          count: verifiedCount,
          href: '/verified-funds',
        });
      }

      // Add categories sorted by count
      const sortedCategories = Array.from(categoryCounts.entries())
        .sort((a, b) => b[1] - a[1]);

      sortedCategories.forEach(([name, count]) => {
        if (count > 0) {
          results.push({
            type: 'category',
            name,
            slug: categoryToSlug(name),
            count,
            href: `/categories/${categoryToSlug(name)}`,
          });
        }
      });

      // Add popular tags sorted by count (filter out duplicates with categories)
      const categoryNames = new Set(Array.from(categoryCounts.keys()).map(c => c.toLowerCase()));
      const sortedTags = Array.from(tagCounts.entries())
        .filter(([name]) => !categoryNames.has(name.toLowerCase()))
        .sort((a, b) => b[1] - a[1]);

      sortedTags.forEach(([name, count]) => {
        if (count > 0) {
          results.push({
            type: 'tag',
            name,
            slug: tagToSlug(name),
            count,
            href: `/tags/${tagToSlug(name)}`,
          });
        }
      });

      return results;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Pre-defined tile configurations for display
export const TILE_CONFIG: Record<string, { description: string; iconName: string }> = {
  'verified-funds': { description: 'Funds verified by our team', iconName: 'ShieldCheck' },
  // Categories
  'private-equity': { description: 'PE-focused funds', iconName: 'Building' },
  'venture-capital': { description: 'VC-focused funds', iconName: 'Rocket' },
  'debt': { description: 'Fixed income strategies', iconName: 'Layers' },
  'clean-energy': { description: 'Renewable energy investments', iconName: 'Zap' },
  'infrastructure': { description: 'Infrastructure investments', iconName: 'Building2' },
  'crypto': { description: 'Cryptocurrency funds', iconName: 'Bitcoin' },
  'other': { description: 'Other investment strategies', iconName: 'MoreHorizontal' },
  // Popular tags
  'low-fees': { description: 'Below-average management fees', iconName: 'TrendingDown' },
  'low-risk': { description: 'Conservative strategies', iconName: 'Shield' },
  'esg': { description: 'Sustainable investments', iconName: 'Leaf' },
  'golden-visa-eligible': { description: 'GV-qualifying funds', iconName: 'Award' },
  'regulated': { description: 'Regulated by authorities', iconName: 'CheckCircle' },
  'diversified': { description: 'Multi-asset exposure', iconName: 'PieChart' },
  'liquid': { description: 'Higher liquidity options', iconName: 'Droplet' },
  'short-lock-up-less-than-5-years': { description: 'Lock-ups under 5 years', iconName: 'Clock' },
};

export function getTileConfig(slug: string, name: string): { description: string; iconName: string } {
  return TILE_CONFIG[slug] || { 
    description: `${name} funds`, 
    iconName: 'Folder' 
  };
}
