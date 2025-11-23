import React from 'react';
import { Building2, Calendar, MapPin, Shield, TrendingUp, DollarSign } from 'lucide-react';
import { Profile } from '@/types/profile';
import { Fund } from '@/data/types/funds';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/components/fund-details/utils/formatters';

interface ManagerSnapshotCardProps {
  managerProfile: Profile | null;
  isManagerVerified: boolean;
  fundsCount: number;
  managerFunds: Fund[];
}

const ManagerSnapshotCard: React.FC<ManagerSnapshotCardProps> = ({ 
  managerProfile, 
  isManagerVerified,
  fundsCount,
  managerFunds
}) => {
  // Calculate minimum investment range from funds
  const minInvestments = managerFunds
    .map(f => f.minimumInvestment)
    .filter((val): val is number => val !== null && val !== undefined && val > 0);
  
  const minOfMins = minInvestments.length > 0 ? Math.min(...minInvestments) : null;
  const maxOfMins = minInvestments.length > 1 ? Math.max(...minInvestments) : null;

  return (
    <div className="bg-background border border-border rounded-xl p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Manager Snapshot</h3>
      
      {/* Verification Badge */}
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <Shield className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground mb-1">Verification Status</p>
          {isManagerVerified ? (
            <Badge variant="success" className="gap-1.5">
              <Shield className="h-3 w-3" />
              Verified Manager
            </Badge>
          ) : (
            <Badge variant="outline" className="gap-1.5 border-amber-300 bg-amber-50 text-amber-700">
              <Shield className="h-3 w-3" />
              Manager Not Verified
            </Badge>
          )}
        </div>
      </div>

      {/* Founded Year */}
      {managerProfile?.founded_year && (
        <div className="flex items-start gap-3 pb-4 border-b border-border">
          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">Founded</p>
            <p className="text-sm text-muted-foreground">{managerProfile.founded_year}</p>
          </div>
        </div>
      )}

      {/* Headquarters */}
      {(managerProfile?.city || managerProfile?.country) && (
        <div className="flex items-start gap-3 pb-4 border-b border-border">
          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">Headquarters</p>
            <p className="text-sm text-muted-foreground">
              {[managerProfile.city, managerProfile.country].filter(Boolean).join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Regulator */}
      {(managerProfile?.registration_number || managerProfile?.license_number) && (
        <div className="flex items-start gap-3 pb-4 border-b border-border">
          <Building2 className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">Regulator</p>
            <p className="text-sm text-muted-foreground">CMVM (Portugal)</p>
            {managerProfile.registration_number && (
              <p className="text-xs text-muted-foreground mt-1">
                Reg: {managerProfile.registration_number}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Number of Funds */}
      <div className="flex items-start gap-3 pb-4 border-b border-border">
        <TrendingUp className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground mb-1">Funds on Platform</p>
          <p className="text-sm text-muted-foreground">
            {fundsCount} {fundsCount === 1 ? 'fund' : 'funds'}
          </p>
        </div>
      </div>

      {/* Minimum Investment Range */}
      {minOfMins !== null && (
        <div className="flex items-start gap-3">
          <DollarSign className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground mb-1">Minimum Investment</p>
            <p className="text-sm text-muted-foreground">
              {maxOfMins && maxOfMins !== minOfMins 
                ? `${formatCurrency(minOfMins)} – ${formatCurrency(maxOfMins)}`
                : formatCurrency(minOfMins)
              }
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerSnapshotCard;
