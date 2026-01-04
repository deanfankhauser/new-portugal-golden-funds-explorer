import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Phone, Building2, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import confetti from 'canvas-confetti';

const INVESTMENT_RANGES = [
  '€100,000 - €250,000',
  '€250,000 - €500,000',
  '€500,000 - €1,000,000',
  '€1,000,000+'
];

const INTEREST_AREAS = [
  'Fund performance',
  'Investment strategy',
  'Fee structure',
  'Redemption terms',
  'Golden Visa eligibility',
  'General information'
];

const enquirySchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  investmentRange: z.string().min(1, 'Please select an investment range'),
  interestAreas: z.array(z.string()).min(1, 'Select at least one interest area'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  fundId: z.string().optional(),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

interface ManagerContactFormProps {
  managerName: string;
  companyName?: string;
}

const ManagerContactForm: React.FC<ManagerContactFormProps> = ({ managerName, companyName }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<Partial<EnquiryFormData>>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    investmentRange: '',
    interestAreas: [],
    message: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInterestToggle = (area: string) => {
    const current = formData.interestAreas || [];
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    setFormData({ ...formData, interestAreas: updated });
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = enquirySchema.parse(formData);
      setIsSubmitting(true);

      const { error } = await supabase.functions.invoke('submit-fund-enquiry', {
        body: {
          fundId: null, // General manager enquiry
          fundName: companyName || managerName,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
          email: validatedData.email,
          phone: validatedData.phone || null,
          investmentAmountRange: validatedData.investmentRange,
          interestAreas: validatedData.interestAreas,
          message: validatedData.message,
          sessionId: sessionStorage.getItem('session_id') || undefined,
          referrer: document.referrer || undefined,
          userAgent: navigator.userAgent,
        },
      });

      if (error) throw error;

      triggerConfetti();
      setShowSuccess(true);
      toast({
        title: 'Enquiry Submitted',
        description: 'Thank you! The fund manager will contact you shortly.',
      });

      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        investmentRange: '',
        interestAreas: [],
        message: '',
      });

      setTimeout(() => setShowSuccess(false), 5000);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path[0]) {
            fieldErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        toast({
          title: 'Error',
          description: 'Failed to submit enquiry. Please try again.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccess) {
    return (
      <Card className="border-success/50 bg-success/5">
        <CardContent className="pt-6 text-center">
          <div className="mb-4">
            <div className="w-16 h-16 bg-success/20 rounded-full mx-auto flex items-center justify-center">
              <Mail className="h-8 w-8 text-success" />
            </div>
          </div>
          <h3 className="text-2xl font-semibold mb-2">Thank you!</h3>
          <p className="text-muted-foreground mb-4">
            Your enquiry has been sent to {managerName}. They'll be in touch shortly.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Contact {companyName || managerName}
        </CardTitle>
        <CardDescription>
          Get in touch with the fund manager team to discuss investment opportunities
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                placeholder="John"
                className={errors.firstName ? 'border-destructive' : ''}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                placeholder="Smith"
                className={errors.lastName ? 'border-destructive' : ''}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Contact Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone (Optional)</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+351 123 456 789"
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Investment Range */}
          <div className="space-y-2">
            <Label htmlFor="investmentRange">Investment Range *</Label>
            <Select
              value={formData.investmentRange}
              onValueChange={value => setFormData({ ...formData, investmentRange: value })}
            >
              <SelectTrigger className={errors.investmentRange ? 'border-destructive' : ''}>
                <SelectValue placeholder="Select your investment range" />
              </SelectTrigger>
              <SelectContent>
                {INVESTMENT_RANGES.map(range => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.investmentRange && (
              <p className="text-sm text-destructive">{errors.investmentRange}</p>
            )}
          </div>

          {/* Interest Areas */}
          <div className="space-y-2">
            <Label>What are you interested in? *</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {INTEREST_AREAS.map(area => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={`interest-${area}`}
                    checked={formData.interestAreas?.includes(area)}
                    onCheckedChange={() => handleInterestToggle(area)}
                  />
                  <Label
                    htmlFor={`interest-${area}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {area}
                  </Label>
                </div>
              ))}
            </div>
            {errors.interestAreas && (
              <p className="text-sm text-destructive">{errors.interestAreas}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              placeholder="Tell us about your investment goals and any specific questions..."
              rows={4}
              className={errors.message ? 'border-destructive' : ''}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Enquiry'
            )}
          </Button>

          {/* Disclaimer */}
          <p className="text-xs text-muted-foreground">
            By submitting this form, you agree to be contacted by the fund manager. 
            Your information will be kept confidential.
          </p>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManagerContactForm;
