import React from 'react';
import { Building2, Shield, ExternalLink } from 'lucide-react';
import StandardCard from '../common/StandardCard';
import { Profile } from '@/types/profile';

interface ManagerContactSectionProps {
  managerProfile: Profile;
}

const ManagerContactSection: React.FC<ManagerContactSectionProps> = ({ 
  managerProfile 
}) => {
  const hasContactInfo = managerProfile.website || managerProfile.city || managerProfile.country;
  const hasRegulatoryInfo = managerProfile.registration_number || managerProfile.license_number;

  if (!hasContactInfo && !hasRegulatoryInfo) return null;

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background border-t border-border">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-semibold text-foreground mb-8">Contact & Regulatory Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Card */}
          {hasContactInfo && (
            <StandardCard padding="md">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Building2 className="h-5 w-5 text-primary" />
                Contact Details
              </h3>
              <div className="space-y-4">
                {managerProfile.website && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Website</div>
                    <a 
                      href={managerProfile.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
                    >
                      {managerProfile.website.replace(/^https?:\/\//, '')}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
                {(managerProfile.city || managerProfile.country) && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Location</div>
                    <div className="text-foreground">
                      {[managerProfile.city, managerProfile.country].filter(Boolean).join(', ')}
                    </div>
                  </div>
                )}
              </div>
            </StandardCard>
          )}
          
          {/* Regulatory Card */}
          {hasRegulatoryInfo && (
            <StandardCard padding="md">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-foreground">
                <Shield className="h-5 w-5 text-primary" />
                Regulatory Information
              </h3>
              <div className="space-y-4">
                {managerProfile.registration_number && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">CMVM Registration Number</div>
                    <div className="font-mono text-sm text-foreground bg-muted/50 px-3 py-2 rounded">
                      {managerProfile.registration_number}
                    </div>
                  </div>
                )}
                {managerProfile.license_number && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">License Number</div>
                    <div className="font-mono text-sm text-foreground bg-muted/50 px-3 py-2 rounded">
                      {managerProfile.license_number}
                    </div>
                  </div>
                )}
              </div>
            </StandardCard>
          )}
        </div>
      </div>
    </section>
  );
};

export default ManagerContactSection;
