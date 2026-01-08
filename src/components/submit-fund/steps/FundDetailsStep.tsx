import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { FundSubmissionData } from '@/hooks/useFundSubmission';

interface FundDetailsStepProps {
  formData: FundSubmissionData;
  updateFormData: (updates: Partial<FundSubmissionData>) => void;
}

const CATEGORIES = [
  'Venture Capital',
  'Private Equity',
  'Infrastructure',
  'Debt',
  'Clean Energy',
  'Credit',
  'Crypto',
  'Other',
];

const CURRENCIES = [
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'USD', label: 'USD ($)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'CHF', label: 'CHF' },
];

export default function FundDetailsStep({ formData, updateFormData }: FundDetailsStepProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fund_name">
            Fund Name <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fund_name"
            value={formData.fund_name}
            onChange={(e) => updateFormData({ fund_name: e.target.value })}
            placeholder="e.g., Acme Growth Fund I"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="fund_description">
            Fund Description <span className="text-destructive">*</span>
          </Label>
          <Textarea
            id="fund_description"
            value={formData.fund_description}
            onChange={(e) => updateFormData({ fund_description: e.target.value })}
            placeholder="Describe the fund's investment strategy, target sectors, and value proposition..."
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-destructive">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) => updateFormData({ category: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <Select
            value={formData.currency}
            onValueChange={(value) => updateFormData({ currency: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="minimum_investment">
            Minimum Investment <span className="text-destructive">*</span>
          </Label>
          <Input
            id="minimum_investment"
            type="number"
            value={formData.minimum_investment || ''}
            onChange={(e) => updateFormData({ minimum_investment: parseInt(e.target.value) || 0 })}
            placeholder="e.g., 100000"
          />
          <p className="text-xs text-muted-foreground">
            Enter amount in {formData.currency || 'EUR'}
          </p>
        </div>

        <div className="space-y-2 flex items-center justify-between p-4 border rounded-lg">
          <div>
            <Label htmlFor="gv_eligible" className="font-medium">
              GV-intended (manager-stated) <span className="text-destructive">*</span>
            </Label>
            <p className="text-sm text-muted-foreground">
              Is this fund marketed for Portugal's Golden Visa program?
            </p>
          </div>
          <Switch
            id="gv_eligible"
            checked={formData.gv_eligible}
            onCheckedChange={(checked) => updateFormData({ gv_eligible: checked })}
          />
        </div>
      </div>
    </div>
  );
}
