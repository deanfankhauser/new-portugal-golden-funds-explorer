import React from 'react';
import { Shield, TrendingUp, Building2, Calendar } from 'lucide-react';
import StandardCard from '../common/StandardCard';
import { Profile } from '@/types/profile';

interface ManagerStatsSectionProps {
  managerProfile: Profile;
  fundsCount: number;
}

const ManagerStatsSection: React.FC<ManagerStatsSectionProps> = ({ 
  managerProfile, 
  fundsCount 
}) => {
  const formatAUM = (aum: number): string => {
    if (aum >= 1000) {
      return `${(aum / 1000).toFixed(1)}B`;
    }
    return `${aum}M`;
  };

  const hasStats = managerProfile.assets_under_management || 
                   managerProfile.founded_year || 
                   fundsCount > 0 || 
                   managerProfile.registration_number;

  if (!hasStats) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-8">Company Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* AUM Card */}
          {managerProfile.assets_under_management && managerProfile.assets_under_management > 0 && (
            <StandardCard padding="sm" className="text-center">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground">
                €{formatAUM(managerProfile.assets_under_management)}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Assets Under Management
              </div>
            </StandardCard>
          )}
          
          {/* Founded Year Card */}
          {managerProfile.founded_year && (
            <StandardCard padding="sm" className="text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground">
                {managerProfile.founded_year}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Founded
              </div>
            </StandardCard>
          )}
          
          {/* Funds Count Card */}
          {fundsCount > 0 && (
            <StandardCard padding="sm" className="text-center">
              <Building2 className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-3xl font-bold text-foreground">
                {fundsCount}
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                Active Fund{fundsCount !== 1 ? 's' : ''}
              </div>
            </StandardCard>
          )}
          
          {/* CMVM Regulated Badge Card */}
          {managerProfile.registration_number && (
            <StandardCard padding="sm" className="text-center">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="text-sm font-semibold text-foreground mb-1">CMVM Regulated</div>
              <div className="text-xs text-muted-foreground font-mono">
                #{managerProfile.registration_number}
              </div>
            </StandardCard>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManagerStatsSection;
