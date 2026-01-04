import React from 'react';
import { Fund } from '../../data/types/funds';
import { Badge } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Shield, CheckCircle } from 'lucide-react';
import { GVBadge } from '../ui/GVBadge';

interface TrustBadgesProps {
  fund: Fund;
}

const TrustBadges: React.FC<TrustBadgesProps> = ({ fund }) => {
  const isUCITS = fund.tags?.includes('UCITS');
  const isGVIntended = fund.tags?.includes('Golden Visa Eligible');
  const cmvmId = fund.cmvmId;

  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-3">
        {isUCITS && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-white/10 text-white border-white/30 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5" />
                UCITS
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>EU-regulated fund meeting strict standards</p>
            </TooltipContent>
          </Tooltip>
        )}

        {cmvmId && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge className="bg-white/10 text-white border-white/30 flex items-center gap-1.5">
                <CheckCircle className="h-3.5 w-3.5" />
                CMVM #{cmvmId}
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Regulated by Portuguese Securities Market Commission</p>
            </TooltipContent>
          </Tooltip>
        )}

        {isGVIntended && fund.isVerified && (
          <GVBadge variant="card" className="bg-white/10 text-white border-white/30" />
        )}
      </div>
    </TooltipProvider>
  );
};

export default TrustBadges;
