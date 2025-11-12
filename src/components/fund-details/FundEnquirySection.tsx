import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Fund } from '@/data/funds';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, CheckCircle2, Sparkles } from 'lucide-react';
import { z } from 'zod';
import confetti from 'canvas-confetti';

interface FundEnquirySectionProps {
  fund: Fund;
}

const INTEREST_AREAS = [
  'Investment strategy details',
  'Historical performance analysis',
  'Fee structure clarification',
  'Risk assessment discussion',
  'Golden Visa eligibility details',
  'Documentation review',
  'Schedule a consultation call',
];

const INVESTMENT_RANGES = [
  '€250K-€500K',
  '€500K-€1M',
  '€1M-€5M',
  '€5M+',
];

const enquirySchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  email: z.string().trim().email('Invalid email address').max(255),
  phone: z.string().trim().optional(),
  investmentAmountRange: z.string().min(1, 'Please select an investment range'),
  interestAreas: z.array(z.string()).min(1, 'Please select at least one interest area'),
  message: z.string().trim().min(10, 'Please provide more details (min 10 characters)').max(2000),
});

type EnquiryFormData = z.infer<typeof enquirySchema>;

export const FundEnquirySection: React.FC<FundEnquirySectionProps> = ({ fund }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState<EnquiryFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    investmentAmountRange: '',
    interestAreas: [],
    message: '',
  });
  const [errors, setErrors] = useState<Partial<Record<keyof EnquiryFormData, string>>>({});

  const triggerConfetti = () => {
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interestAreas: prev.interestAreas.includes(interest)
        ? prev.interestAreas.filter(i => i !== interest)
        : [...prev.interestAreas, interest],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const validation = enquirySchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof EnquiryFormData, string>> = {};
      validation.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof EnquiryFormData] = err.message;
        }
      });
      setErrors(fieldErrors);
      toast({
        title: 'Validation Error',
        description: 'Please check the form for errors',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('submit-fund-enquiry', {
        body: {
          fundId: fund.id,
          fundName: fund.name,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          investmentAmountRange: formData.investmentAmountRange,
          interestAreas: formData.interestAreas,
          message: formData.message,
          userId: session?.user?.id,
          sessionId: crypto.randomUUID(),
          referrer: document.referrer,
          userAgent: navigator.userAgent,
        },
      });

      if (error) throw error;

      // Trigger confetti celebration
      triggerConfetti();
      
      // Show success state
      setShowSuccess(true);

      toast({
        title: 'Enquiry Sent!',
        description: 'The fund manager will contact you within 24-48 hours.',
      });

      // Reset form after animation
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          investmentAmountRange: '',
          interestAreas: [],
          message: '',
        });
        setShowSuccess(false);
      }, 4000);
    } catch (error) {
      console.error('Error submitting enquiry:', error);
      toast({
        title: 'Submission Failed',
        description: error instanceof Error ? error.message : 'Please try again later',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card id="enquiry-form" className="bg-card border border-border/40 rounded-2xl shadow-sm scroll-mt-28 md:scroll-mt-24 relative">
      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-lg font-medium text-foreground animate-pulse">Sending your enquiry...</p>
          </div>
        </div>
      )}

      {/* Success Overlay */}
      {showSuccess && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-primary/10 backdrop-blur-sm z-50 flex items-center justify-center rounded-2xl animate-fade-in">
          <div className="flex flex-col items-center gap-6 text-center px-6">
            <div className="relative">
              <CheckCircle2 className="h-24 w-24 text-primary animate-scale-in" />
              <Sparkles className="h-8 w-8 text-primary absolute -top-2 -right-2 animate-pulse" />
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl font-bold text-foreground animate-fade-in">Success!</h3>
              <p className="text-lg text-muted-foreground animate-fade-in">
                Your enquiry has been sent to the fund manager
              </p>
              <p className="text-sm text-muted-foreground animate-fade-in">
                You'll receive a response within 24-48 hours
              </p>
            </div>
          </div>
        </div>
      )}
      
      <CardHeader className="p-10 pb-8">
        <CardTitle className="text-[32px] font-semibold tracking-tight leading-tight mb-3">Get in Touch with Fund Manager</CardTitle>
        <CardDescription className="text-base text-muted-foreground leading-relaxed">
          Enquire about <strong>{fund.name}</strong>. The fund manager will respond within 24-48 hours.
        </CardDescription>
      </CardHeader>

      <CardContent className="px-10 pb-10">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={e => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                className="px-4 py-4 text-lg font-semibold bg-muted/20 border-2 border-border/40 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10"
                disabled={isSubmitting}
              />
              {errors.firstName && <p className="text-sm text-destructive">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="lastName"
                placeholder="Smith"
                value={formData.lastName}
                onChange={e => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                className="px-4 py-4 text-lg font-semibold bg-muted/20 border-2 border-border/40 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10"
                disabled={isSubmitting}
              />
              {errors.lastName && <p className="text-sm text-destructive">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">
              Email <span className="text-destructive">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="john.smith@example.com"
              value={formData.email}
              onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="px-4 py-4 text-lg font-semibold bg-muted/20 border-2 border-border/40 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          {/* Phone (Optional) */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone (Optional)</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="+351 123 456 789"
              value={formData.phone}
              onChange={e => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              className="px-4 py-4 text-lg font-semibold bg-muted/20 border-2 border-border/40 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10"
              disabled={isSubmitting}
            />
          </div>

          {/* Investment Range */}
          <div className="space-y-2">
            <Label htmlFor="investmentRange">
              Investment Amount Range <span className="text-destructive">*</span>
            </Label>
            <Select 
              value={formData.investmentAmountRange} 
              onValueChange={value => setFormData(prev => ({ ...prev, investmentAmountRange: value }))}
              disabled={isSubmitting}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select investment range" />
              </SelectTrigger>
              <SelectContent>
                {INVESTMENT_RANGES.map(range => (
                  <SelectItem key={range} value={range}>{range}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.investmentAmountRange && (
              <p className="text-sm text-destructive">{errors.investmentAmountRange}</p>
            )}
          </div>

          {/* Interest Areas */}
          <div className="space-y-2">
            <Label>
              Areas of Interest <span className="text-destructive">*</span>
            </Label>
            <div className="space-y-2 p-6 bg-muted/20 border border-border/40 rounded-lg">
              {INTEREST_AREAS.map(area => (
                <div key={area} className="flex items-center space-x-2">
                  <Checkbox
                    id={area}
                    checked={formData.interestAreas.includes(area)}
                    onCheckedChange={() => handleInterestToggle(area)}
                    disabled={isSubmitting}
                  />
                  <label
                    htmlFor={area}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {area}
                  </label>
                </div>
              ))}
            </div>
            {errors.interestAreas && (
              <p className="text-sm text-destructive">{errors.interestAreas}</p>
            )}
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message">
              Your Message <span className="text-destructive">*</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us more about your investment goals and any specific questions you have..."
              value={formData.message}
              onChange={e => setFormData(prev => ({ ...prev, message: e.target.value }))}
              rows={5}
              className="resize-none px-4 py-4 text-lg bg-muted/20 border-2 border-border/40 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/10"
              disabled={isSubmitting}
            />
            {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
            <p className="text-xs text-muted-foreground">
              {formData.message.length}/2000 characters
            </p>
          </div>

          {/* Disclaimer */}
          <div className="px-4 py-3 bg-muted/20 border border-border/40 rounded-lg">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong>Disclaimer:</strong> This enquiry does not constitute investment advice or a commitment to invest. 
              All investments carry risk. Past performance does not guarantee future results. 
              By submitting this form, you agree to be contacted by the fund manager.
            </p>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full shadow-sm hover:shadow-md transition-all duration-200 hover:translate-y-[-1px] font-semibold px-7 py-3 rounded-lg h-12" 
            size="lg" 
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
        </form>
      </CardContent>
    </Card>
  );
};
