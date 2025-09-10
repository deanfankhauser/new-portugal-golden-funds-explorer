import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Fund } from '../../data/funds';
import { isFundGVEligible } from '../../data/services/gv-eligibility-service';
import { AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { DATA_AS_OF_LABEL } from '../../utils/constants';

interface EnhancedGVEligibilityBadgeProps {
  fund: Fund;
  showDetails?: boolean;
}

const EnhancedGVEligibilityBadge: React.FC<EnhancedGVEligibilityBadgeProps> = ({ 
  fund, 
  showDetails = true 
}) => {
  const isGVEligible = isFundGVEligible(fund);
  const hasRealEstate = fund.tags.some(tag => 
    tag.toLowerCase().includes('real estate') || 
    tag.toLowerCase().includes('property')
  );
  
  // All funds are now Golden Visa eligible
  const getEligibilityStatus = () => {
    return 'yes';
  };
  
  const status = getEligibilityStatus();
  
  const getStatusConfig = () => {
    switch (status) {
      case 'yes':
        return {
          variant: 'default' as const,
          icon: CheckCircle,
          label: 'Golden Visa Eligible',
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'no':
        return {
          variant: 'destructive' as const,
          icon: AlertTriangle,
          label: 'Not GV Eligible',
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'unclear':
        return {
          variant: 'secondary' as const,
          icon: HelpCircle,
          label: 'GV Eligibility Unclear',
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200'
        };
    }
  };
  
  const config = getStatusConfig();
  const Icon = config.icon;
  
  const getExplanation = () => {
    return "Appears GV-eligible based on manager docs; verify with counsel.";
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
                {status === 'no' && 'Not Golden Visa Eligible:'}
                {status === 'unclear' && 'Eligibility Status Unclear:'}
                {status === 'yes' && 'Appears GV Eligible:'}
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
              GV still requires €500,000 total. Confirm with manager + lawyer before investing.
            </AlertDescription>
          </Alert>
        </>
      )}
    </div>
  );
};

export default EnhancedGVEligibilityBadge;