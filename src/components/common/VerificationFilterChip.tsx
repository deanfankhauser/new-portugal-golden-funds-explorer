import React from 'react';
import { CheckCircle2, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import VerificationExplainerModal from './VerificationExplainerModal';

interface VerificationFilterChipProps {
  showOnlyVerified: boolean;
  setShowOnlyVerified: (value: boolean) => void;
  className?: string;
}

const VerificationFilterChip: React.FC<VerificationFilterChipProps> = ({
  showOnlyVerified,
  setShowOnlyVerified,
  className = ''
}) => {
  return (
    <div className={`flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg border border-border bg-card shadow-sm ${className}`}>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <Label htmlFor="verified-filter" className="cursor-pointer font-semibold text-sm">
                  Show Verified Funds Only
                </Label>
              </div>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <p className="text-sm">
                <strong>Verified:</strong> We've checked this fund's CMVM registration and Golden Visa eligibility.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <VerificationExplainerModal 
          trigger={
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
              <Info className="h-4 w-4 text-muted-foreground" />
            </Button>
          }
        />
      </div>
      <Switch
        id="verified-filter"
        checked={showOnlyVerified}
        onCheckedChange={setShowOnlyVerified}
      />
    </div>
  );
};

export default VerificationFilterChip;
