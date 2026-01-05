import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, BadgeCheck, TrendingUp, Calendar, Briefcase } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ManagerLogo } from '@/components/shared/ManagerLogo';
import { cn } from '@/lib/utils';
import { managerToSlug } from '@/lib/utils';
import { formatFundSize } from '@/utils/currencyFormatters';

export interface EnrichedManager {
  name: string;
  fundsCount: number;
  totalFundSize: number | null;
  logoUrl?: string;
  description?: string;
  city?: string;
  country?: string;
  aum?: number;
  foundedYear?: number;
  isVerified?: boolean;
}

interface ManagerCardProps {
  manager: EnrichedManager;
}

const ManagerCard: React.FC<ManagerCardProps> = ({ manager }) => {
  const location = [manager.city, manager.country].filter(Boolean).join(', ');
  const slug = managerToSlug(manager.name);
  
  return (
    <Card className={cn(
      "h-full transition-all duration-200",
      "hover:shadow-lg hover:border-primary/30",
      "bg-card"
    )}>
      <CardContent className="p-5 flex flex-col h-full">
        {/* Header: Logo + Name + Location */}
        <div className="flex items-start gap-4 mb-4">
          <ManagerLogo
            logoUrl={manager.logoUrl}
            managerName={manager.name}
            size="lg"
            showInitialsFallback={true}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground truncate">
                {manager.name}
              </h3>
              {manager.isVerified && (
                <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
              )}
            </div>
            {location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{location}</span>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {manager.description && (
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {manager.description}
          </p>
        )}

        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm py-3 border-t border-border mt-auto">
          <div className="flex items-center gap-1.5">
            <Briefcase className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium tabular-nums">{manager.fundsCount}</span>
            <span className="text-muted-foreground">fund{manager.fundsCount !== 1 ? 's' : ''}</span>
          </div>
          
          {(manager.aum || manager.totalFundSize) && (
            <div className="flex items-center gap-1.5">
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium tabular-nums">
                {formatFundSize(manager.aum || manager.totalFundSize)}
              </span>
            </div>
          )}
          
          {manager.foundedYear && (
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Est. {manager.foundedYear}</span>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="flex gap-3 pt-4">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link to={`/manager/${slug}`}>
              View Profile
            </Link>
          </Button>
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1"
            asChild
          >
            <Link to={`/manager/${slug}#contact`}>
              Request Intro
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ManagerCard;
