import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Check, X, Loader2, Building2, User, TrendingUp, Receipt, Shield, ExternalLink } from 'lucide-react';

interface SubmissionDetailModalProps {
  submission: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: () => void;
  onReject: () => void;
  isProcessing: boolean;
}

export function SubmissionDetailModal({
  submission,
  open,
  onOpenChange,
  onApprove,
  onReject,
  isProcessing,
}: SubmissionDetailModalProps) {
  if (!submission) return null;

  const formatCurrency = (amount: number | null, currency: string = 'EUR') => {
    if (!amount) return 'Not specified';
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercent = (value: number | null) => {
    if (value === null || value === undefined) return 'Not specified';
    return `${value}%`;
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">Submission Details</DialogTitle>
            <Badge variant={
              submission.status === 'pending' ? 'outline' :
              submission.status === 'approved' ? 'default' : 'destructive'
            }>
              {submission.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Company Section */}
          <section>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Building2 className="h-4 w-4" />
              <h3 className="font-semibold text-foreground">Company Information</h3>
            </div>
            <div className="grid grid-cols-[auto,1fr] gap-4 items-start">
              {submission.company_logo_url ? (
                <img
                  src={submission.company_logo_url}
                  alt={submission.company_name}
                  className="w-16 h-16 object-contain rounded-lg border bg-white"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg border bg-muted flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-2">
                <div>
                  <p className="font-semibold text-lg">{submission.company_name}</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.company_city}, {submission.company_country} · {submission.entity_type || 'SCR'}
                  </p>
                </div>
                {submission.company_website && (
                  <a
                    href={submission.company_website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    {submission.company_website}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{submission.company_description}</p>
          </section>

          <Separator />

          {/* Contact Section */}
          <section>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <User className="h-4 w-4" />
              <h3 className="font-semibold text-foreground">Primary Contact</h3>
            </div>
            <div className="flex items-start gap-4">
              <Avatar className="h-14 w-14">
                {submission.contact_photo_url ? (
                  <AvatarImage src={submission.contact_photo_url} alt={submission.contact_name} />
                ) : null}
                <AvatarFallback className="text-sm">{getInitials(submission.contact_name)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="font-semibold">{submission.contact_name}</p>
                <p className="text-sm text-muted-foreground">{submission.contact_role}</p>
                {submission.contact_linkedin && (
                  <a
                    href={submission.contact_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    LinkedIn Profile
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {submission.contact_bio && (
                  <p className="text-sm text-muted-foreground mt-2">{submission.contact_bio}</p>
                )}
              </div>
            </div>
          </section>

          <Separator />

          {/* Fund Details Section */}
          <section>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <TrendingUp className="h-4 w-4" />
              <h3 className="font-semibold text-foreground">Fund Details</h3>
            </div>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-lg">{submission.fund_name}</p>
                <Badge variant="secondary" className="mt-1">{submission.category}</Badge>
                {submission.gv_eligible && (
                  <Badge variant="outline" className="ml-2 mt-1">Golden Visa Eligible</Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{submission.fund_description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Minimum Investment</p>
                  <p className="font-semibold">{formatCurrency(submission.minimum_investment, submission.currency)}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Currency</p>
                  <p className="font-semibold">{submission.currency || 'EUR'}</p>
                </div>
                {submission.lock_up_period_months && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Lock-up Period</p>
                    <p className="font-semibold">{submission.lock_up_period_months} months</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          <Separator />

          {/* Fees & Terms Section */}
          <section>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Receipt className="h-4 w-4" />
              <h3 className="font-semibold text-foreground">Fees & Terms</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Management Fee</p>
                <p className="font-semibold">{formatPercent(submission.management_fee)}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Performance Fee</p>
                <p className="font-semibold">{formatPercent(submission.performance_fee)}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Target Return (Min)</p>
                <p className="font-semibold">{formatPercent(submission.target_return_min)}</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Target Return (Max)</p>
                <p className="font-semibold">{formatPercent(submission.target_return_max)}</p>
              </div>
            </div>
          </section>

          {/* Regulatory Section */}
          {(submission.regulated_by || submission.fund_location || submission.cmvm_id || submission.isin) && (
            <>
              <Separator />
              <section>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <Shield className="h-4 w-4" />
                  <h3 className="font-semibold text-foreground">Regulatory Information</h3>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {submission.regulated_by && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Regulated By</p>
                      <p className="font-semibold">{submission.regulated_by}</p>
                    </div>
                  )}
                  {submission.fund_location && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Fund Location</p>
                      <p className="font-semibold">{submission.fund_location}</p>
                    </div>
                  )}
                  {submission.cmvm_id && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">CMVM ID</p>
                      <p className="font-semibold">{submission.cmvm_id}</p>
                    </div>
                  )}
                  {submission.isin && (
                    <div className="bg-muted/50 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">ISIN</p>
                      <p className="font-semibold">{submission.isin}</p>
                    </div>
                  )}
                </div>
              </section>
            </>
          )}

          {/* Additional Notes */}
          {submission.additional_notes && (
            <>
              <Separator />
              <section>
                <h3 className="font-semibold text-foreground mb-2">Additional Notes</h3>
                <p className="text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
                  {submission.additional_notes}
                </p>
              </section>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          {submission.status === 'pending' ? (
            <>
              <Button variant="outline" onClick={onReject} disabled={isProcessing}>
                <X className="h-4 w-4 mr-2" />
                Reject
              </Button>
              <Button onClick={onApprove} disabled={isProcessing}>
                {isProcessing ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Check className="h-4 w-4 mr-2" />
                )}
                Approve
              </Button>
            </>
          ) : (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
