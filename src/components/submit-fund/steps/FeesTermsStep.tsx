import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FundSubmissionData } from '@/hooks/useFundSubmission';

interface FeesTermsStepProps {
  formData: FundSubmissionData;
  updateFormData: (updates: Partial<FundSubmissionData>) => void;
}

export default function FeesTermsStep({ formData, updateFormData }: FeesTermsStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        All fields on this step are optional but recommended to help investors understand your fund's terms.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="management_fee">Management Fee (%)</Label>
          <Input
            id="management_fee"
            type="number"
            step="0.1"
            value={formData.management_fee ?? ''}
            onChange={(e) => updateFormData({ 
              management_fee: e.target.value ? parseFloat(e.target.value) : null 
            })}
            placeholder="e.g., 2.0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="performance_fee">Performance Fee (%)</Label>
          <Input
            id="performance_fee"
            type="number"
            step="0.1"
            value={formData.performance_fee ?? ''}
            onChange={(e) => updateFormData({ 
              performance_fee: e.target.value ? parseFloat(e.target.value) : null 
            })}
            placeholder="e.g., 20.0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_return_min">Target Return Min (%)</Label>
          <Input
            id="target_return_min"
            type="number"
            step="0.1"
            value={formData.target_return_min ?? ''}
            onChange={(e) => updateFormData({ 
              target_return_min: e.target.value ? parseFloat(e.target.value) : null 
            })}
            placeholder="e.g., 8.0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="target_return_max">Target Return Max (%)</Label>
          <Input
            id="target_return_max"
            type="number"
            step="0.1"
            value={formData.target_return_max ?? ''}
            onChange={(e) => updateFormData({ 
              target_return_max: e.target.value ? parseFloat(e.target.value) : null 
            })}
            placeholder="e.g., 15.0"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="lock_up_period_months">Lock-up Period (months)</Label>
          <Input
            id="lock_up_period_months"
            type="number"
            value={formData.lock_up_period_months ?? ''}
            onChange={(e) => updateFormData({ 
              lock_up_period_months: e.target.value ? parseInt(e.target.value) : null 
            })}
            placeholder="e.g., 60"
          />
          <p className="text-xs text-muted-foreground">
            The minimum period investors must remain invested
          </p>
        </div>
      </div>
    </div>
  );
}
