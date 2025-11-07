import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

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
        <CheckCircle2 className="w-4 h-4 text-success" />
        <Label htmlFor="verified-filter" className="cursor-pointer font-semibold text-sm">
          Show Verified Funds Only
        </Label>
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
