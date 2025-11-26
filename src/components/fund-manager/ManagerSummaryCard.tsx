import { Building2, MapPin, TrendingUp, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StandardCard from '../common/StandardCard';
import { Profile } from '@/types/profile';
import { CompanyLogo } from '../shared/CompanyLogo';

interface ManagerSummaryCardProps {
  managerName: string;
  managerProfile?: Profile | null;
  isVerified?: boolean;
  fundCount: number;
  onScheduleClick: () => void;
}

const ManagerSummaryCard: React.FC<ManagerSummaryCardProps> = ({
  managerName,
  managerProfile,
  isVerified = false,
  fundCount,
  onScheduleClick
}) => {
  const formatAUM = (aum: number): string => {
    const millions = aum / 1000000;
    if (millions >= 1000) {
      const billions = millions / 1000;
      return `€${billions % 1 === 0 ? billions.toFixed(0) : billions.toFixed(1)}B`;
    }
    return `€${millions % 1 === 0 ? millions.toFixed(0) : millions.toFixed(1)}M`;
  };

  return (
    <StandardCard className="overflow-hidden w-80">
      {/* Header Section */}
      <div className="flex items-center justify-center mb-6">
        {managerProfile?.logo_url ? (
          <CompanyLogo
            managerName={managerName}
            size="lg"
          />
        ) : (
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-foreground" />
            <h3 className="text-lg font-semibold text-foreground">
              {managerName}
            </h3>
          </div>
        )}
      </div>

      {/* Verification Badge */}
      {isVerified && (
        <div className="mb-4">
          <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200 w-full justify-center py-2">
            <CheckCircle2 className="h-4 w-4 mr-1" />
            Verified Manager
          </Badge>
        </div>
      )}

      {/* Key Stats */}
      <div className="space-y-3 mb-6">
        {/* Total Funds */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Total Funds</span>
          <span className="font-semibold text-foreground">{fundCount}</span>
        </div>

        {/* Regulatory Status */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Status</span>
          <span className="font-semibold text-foreground text-xs text-right">
            {managerProfile?.entity_type ? `${managerProfile.entity_type} Entity` : 'CMVM Regulated'}
          </span>
        </div>

        {/* AUM */}
        {managerProfile?.assets_under_management && managerProfile.assets_under_management > 0 && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Assets Under Management</span>
            <span className="font-semibold text-foreground">
              {formatAUM(managerProfile.assets_under_management)}
            </span>
          </div>
        )}

        {/* Location */}
        {(managerProfile?.city || managerProfile?.country) && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Location
            </span>
            <span className="font-semibold text-foreground text-right">
              {[managerProfile.city, managerProfile.country].filter(Boolean).join(', ')}
            </span>
          </div>
        )}

        {/* Founded Year */}
        {managerProfile?.founded_year && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Established</span>
            <span className="font-semibold text-foreground">{managerProfile.founded_year}</span>
          </div>
        )}

        {/* License/Registration */}
        {(managerProfile?.license_number || managerProfile?.registration_number) && (
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              License
            </span>
            <span className="font-semibold text-foreground text-xs">
              {managerProfile?.license_number || managerProfile?.registration_number}
            </span>
          </div>
        )}
      </div>

      {/* Company Address */}
      {managerProfile?.address && (
        <div className="pt-4 border-t border-border mb-6">
          <p className="text-sm text-muted-foreground text-center">
            {managerProfile.address}
          </p>
        </div>
      )}

      {/* CTA Button */}
      <Button 
        onClick={onScheduleClick}
        size="lg"
        className="w-full text-base font-semibold py-6"
      >
        Get in touch
      </Button>
    </StandardCard>
  );
};

export default ManagerSummaryCard;
