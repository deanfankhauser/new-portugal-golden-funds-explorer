import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingDown, 
  Shield, 
  Clock, 
  Leaf, 
  Layers, 
  Building, 
  Rocket,
  Home,
  Zap,
  Building2,
  Bitcoin,
  MoreHorizontal,
  Award,
  CheckCircle,
  PieChart,
  Droplet,
  Folder,
  LucideIcon
} from 'lucide-react';
import { usePopularCategories, getTileConfig } from '@/hooks/usePopularCategories';
import { Skeleton } from '@/components/ui/skeleton';

// Icon mapping for dynamic lookup
const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  TrendingDown,
  Shield,
  Clock,
  Leaf,
  Layers,
  Building,
  Rocket,
  Home,
  Zap,
  Building2,
  Bitcoin,
  MoreHorizontal,
  Award,
  CheckCircle,
  PieChart,
  Droplet,
  Folder,
};

// Priority order for tiles (show these first if they exist)
const PRIORITY_ORDER = [
  'verified-funds',
  'low-fees',
  'low-risk',
  'short-lock-up-less-than-5-years',
  'esg',
  'debt',
  'private-equity',
  'venture-capital',
];

const PopularCategoriesTiles: React.FC = () => {
  const { data: allCategories, isLoading } = usePopularCategories();

  // Sort and limit to 8 tiles based on priority
  const displayTiles = React.useMemo(() => {
    if (!allCategories || allCategories.length === 0) return [];

    // Create a map for quick lookup
    const categoryMap = new Map(allCategories.map(c => [c.slug, c]));

    // Start with priority items that exist
    const orderedTiles = PRIORITY_ORDER
      .filter(slug => categoryMap.has(slug))
      .map(slug => categoryMap.get(slug)!);

    // Add remaining items sorted by count
    const remainingItems = allCategories
      .filter(c => !PRIORITY_ORDER.includes(c.slug))
      .sort((a, b) => b.count - a.count);

    // Combine and limit to 8
    return [...orderedTiles, ...remainingItems].slice(0, 8);
  }, [allCategories]);

  if (isLoading) {
    return (
      <section className="py-12 sm:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
            Popular categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-xl border border-border p-5">
                <div className="flex items-start gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!displayTiles || displayTiles.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8 text-center">
          Popular categories
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {displayTiles.map((tile) => {
            const config = getTileConfig(tile.slug, tile.name);
            const IconComponent = ICON_MAP[config.iconName] || Folder;
            
            return (
              <Link
                key={tile.href}
                to={tile.href}
                className="group bg-card rounded-xl border border-border p-5 hover:border-primary/30 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <IconComponent className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground text-sm sm:text-base group-hover:text-primary transition-colors">
                        {tile.name}
                      </h3>
                      <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                        {tile.count}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-muted-foreground mt-1 line-clamp-2">
                      {config.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-end mt-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularCategoriesTiles;
