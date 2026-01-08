import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, Building2, User, Briefcase, DollarSign, Shield, Check, X } from 'lucide-react';
import { FundSubmissionData } from '@/hooks/useFundSubmission';

interface ReviewSubmitStepProps {
  formData: FundSubmissionData;
  onEditStep: (step: number) => void;
}

function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

function SectionCard({ 
  title, 
  icon: Icon, 
  step, 
  onEdit, 
  children 
}: { 
  title: string; 
  icon: React.ComponentType<{ className?: string }>; 
  step: number; 
  onEdit: (step: number) => void; 
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-5 w-5 text-primary" />
            <CardTitle className="text-base">{title}</CardTitle>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onEdit(step)}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {children}
      </CardContent>
    </Card>
  );
}

function DataRow({ label, value, highlight = false }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-border/50 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm text-right max-w-[60%] ${highlight ? 'font-medium text-primary' : ''}`}>
        {value || <span className="text-muted-foreground/50">—</span>}
      </span>
    </div>
  );
}

export default function ReviewSubmitStep({ formData, onEditStep }: ReviewSubmitStepProps) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Please review all information before submitting. You can click the edit button on any section to make changes.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Company Info */}
        <SectionCard title="Company" icon={Building2} step={0} onEdit={onEditStep}>
          <div className="space-y-1">
            <DataRow label="Name" value={formData.company_name} highlight />
            <DataRow label="Website" value={formData.company_website} />
            <DataRow label="Location" value={`${formData.company_city}, ${formData.company_country}`} />
            <DataRow label="Entity Type" value={formData.entity_type} />
            {formData.company_logo_url && (
              <div className="pt-2">
                <img 
                  src={formData.company_logo_url} 
                  alt="Logo" 
                  className="h-12 object-contain rounded border bg-white"
                />
              </div>
            )}
          </div>
        </SectionCard>

        {/* Contact Info */}
        <SectionCard title="Contact Person" icon={User} step={1} onEdit={onEditStep}>
          <div className="space-y-1">
            <DataRow label="Name" value={formData.contact_name} highlight />
            <DataRow label="Role" value={formData.contact_role} />
            <DataRow label="LinkedIn" value={formData.contact_linkedin ? 'Provided' : null} />
            <DataRow label="Bio" value={formData.contact_bio ? 'Provided' : null} />
            <DataRow 
              label="Photo" 
              value={formData.contact_photo_url ? (
                <Check className="h-4 w-4 text-green-600" />
              ) : (
                <span className="text-xs">Will show initials</span>
              )} 
            />
          </div>
        </SectionCard>

        {/* Fund Details */}
        <SectionCard title="Fund Details" icon={Briefcase} step={2} onEdit={onEditStep}>
          <div className="space-y-1">
            <DataRow label="Name" value={formData.fund_name} highlight />
            <DataRow label="Category" value={formData.category} />
            <DataRow label="Min Investment" value={formatCurrency(formData.minimum_investment, formData.currency)} />
            <DataRow label="Currency" value={formData.currency} />
            <DataRow 
              label="GV-intended" 
              value={formData.gv_eligible ? (
                <Badge variant="default" className="bg-green-600">Yes (manager-stated)</Badge>
              ) : (
                <Badge variant="secondary">No</Badge>
              )} 
            />
          </div>
        </SectionCard>

        {/* Fees & Terms */}
        <SectionCard title="Fees & Terms" icon={DollarSign} step={3} onEdit={onEditStep}>
          <div className="space-y-1">
            <DataRow 
              label="Management Fee" 
              value={formData.management_fee != null ? `${formData.management_fee}%` : null} 
            />
            <DataRow 
              label="Performance Fee" 
              value={formData.performance_fee != null ? `${formData.performance_fee}%` : null} 
            />
            <DataRow 
              label="Target Return" 
              value={
                formData.target_return_min || formData.target_return_max
                  ? `${formData.target_return_min ?? '—'}% - ${formData.target_return_max ?? '—'}%`
                  : null
              } 
            />
            <DataRow 
              label="Lock-up Period" 
              value={formData.lock_up_period_months ? `${formData.lock_up_period_months} months` : null} 
            />
          </div>
        </SectionCard>

        {/* Regulatory */}
        <SectionCard title="Regulatory" icon={Shield} step={4} onEdit={onEditStep}>
          <div className="space-y-1">
            <DataRow label="Regulated By" value={formData.regulated_by} />
            <DataRow label="Fund Domicile" value={formData.fund_location} />
            <DataRow label="CMVM ID" value={formData.cmvm_id} />
            <DataRow label="ISIN" value={formData.isin} />
          </div>
        </SectionCard>
      </div>

      {/* Fund Description */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Fund Description</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => onEditStep(2)}>
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {formData.fund_description}
          </p>
        </CardContent>
      </Card>

      {/* Additional Notes */}
      <div className="space-y-2">
        <Label htmlFor="additional_notes">Additional Notes (Optional)</Label>
        <Textarea
          id="additional_notes"
          value={formData.additional_notes}
          onChange={() => {}} // This would need to be connected to updateFormData
          placeholder="Any additional information you'd like us to know..."
          rows={3}
          disabled
        />
      </div>
    </div>
  );
}
