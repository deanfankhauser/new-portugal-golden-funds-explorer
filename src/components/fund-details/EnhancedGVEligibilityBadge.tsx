import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Fund } from '../../data/types/funds';
import { isFundGVEligible } from '../../data/services/gv-eligibility-service';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { DATA_AS_OF_LABEL } from '../../utils/constants';
import { GV_LABELS } from '../../utils/gvComplianceLabels';

interface EnhancedGVEligibilityBadgeProps {
  fund: Fund;
  showDetails?: boolean;
}

const EnhancedGVEligibilityBadge: React.FC<EnhancedGVEligibilityBadgeProps> = ({ 
  fund, 
  showDetails = true 
}) => {
  const isGVIntended = isFundGVEligible(fund);
  const hasRealEstate = fund.tags.some(tag => 
    tag.toLowerCase().includes('real estate') || 
    tag.toLowerCase().includes('property')
  );
  
  // Only show for verified funds
  if (!fund.isVerified) {
    return null;
  }
  
  // All funds are now Golden Visa intended per manager
  const getIntendedStatus = () => {
    return 'yes';
  };
  
  const status = getIntendedStatus();
  
  const getStatusConfig = () => {
    return {
      variant: 'default' as const,
      icon: CheckCircle,
      label: GV_LABELS.BADGE,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    };
  };
  
  const config = getStatusConfig();
  const Icon = config.icon;
  
  const getExplanation = () => {
    return "Manager states this fund is intended for Golden Visa route; verify with Portuguese legal counsel.";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Badge variant={config.variant} className="text-sm font-medium">
          <Icon className="w-4 h-4 mr-1" />
          {config.label}
        </Badge>
        <span className="text-xs text-muted-foreground">
          {DATA_AS_OF_LABEL}
        </span>
      </div>
      
      {showDetails && (
        <>
          <Alert className={`${config.bgColor} ${config.borderColor}`}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong className={config.color}>
                {GV_LABELS.BADGE}:
              </strong>
              <br />
              {getExplanation()}
            </AlertDescription>
          </Alert>
          
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-sm">
              <strong className="text-amber-700">Important:</strong> 
              <br />
              {GV_LABELS.TOOLTIP}
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
};

export default EnhancedGVEligibilityBadge;