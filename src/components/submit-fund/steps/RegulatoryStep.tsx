import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FundSubmissionData } from '@/hooks/useFundSubmission';

interface RegulatoryStepProps {
  formData: FundSubmissionData;
  updateFormData: (updates: Partial<FundSubmissionData>) => void;
}

export default function RegulatoryStep({ formData, updateFormData }: RegulatoryStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        All fields on this step are optional. Providing regulatory information helps build investor confidence.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="regulated_by">Regulated By</Label>
          <Input
            id="regulated_by"
            value={formData.regulated_by}
            onChange={(e) => updateFormData({ regulated_by: e.target.value })}
            placeholder="e.g., CMVM, FCA, SEC"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fund_location">Fund Domicile</Label>
          <Input
            id="fund_location"
            value={formData.fund_location}
            onChange={(e) => updateFormData({ fund_location: e.target.value })}
            placeholder="e.g., Portugal, Luxembourg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cmvm_id">CMVM ID</Label>
          <Input
            id="cmvm_id"
            value={formData.cmvm_id}
            onChange={(e) => updateFormData({ cmvm_id: e.target.value })}
            placeholder="e.g., 12345"
          />
          <p className="text-xs text-muted-foreground">
            Portuguese securities regulator registration number
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="isin">ISIN</Label>
          <Input
            id="isin"
            value={formData.isin}
            onChange={(e) => updateFormData({ isin: e.target.value })}
            placeholder="e.g., PT00000000XX"
          />
          <p className="text-xs text-muted-foreground">
            International Securities Identification Number
          </p>
        </div>
      </div>
    </div>
  );
}
