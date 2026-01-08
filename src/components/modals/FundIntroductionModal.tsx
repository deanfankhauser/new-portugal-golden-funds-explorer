import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { supabase } from '@/integrations/supabase/client';
import { analytics } from '@/utils/analytics';

const fundIntroSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().trim().email('Please enter a valid email').max(255, 'Email must be less than 255 characters'),
  whatsapp: z.string().trim().max(50, 'WhatsApp must be less than 50 characters').optional().or(z.literal('')),
  nationality: z.string().trim().min(1, 'Nationality is required').max(100, 'Nationality must be less than 100 characters'),
  isUsPerson: z.enum(['yes', 'no'], { required_error: 'Please select an option' }),
  message: z.string().trim().max(1000, 'Message must be less than 1000 characters').optional().or(z.literal(''))
});

type FundIntroFormData = z.infer<typeof fundIntroSchema>;

interface FundIntroductionModalProps {
  isOpen: boolean;
  onClose: () => void;
  fundName?: string;
}

const FundIntroductionModal: React.FC<FundIntroductionModalProps> = ({
  isOpen,
  onClose,
  fundName
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm<FundIntroFormData>({
    resolver: zodResolver(fundIntroSchema),
    defaultValues: {
      isUsPerson: undefined
    }
  });

  const isUsPerson = watch('isUsPerson');

  const onSubmit = async (data: FundIntroFormData) => {
    setIsSubmitting(true);
    try {
      const subject = fundName 
        ? `Fund Introduction Request: ${fundName}`
        : 'Fund Introduction Request';
      
      const messageBody = `
Fund Introduction Request

Full Name: ${data.fullName}
Email: ${data.email}
WhatsApp: ${data.whatsapp || 'Not provided'}
Nationality: ${data.nationality}
US Person: ${data.isUsPerson === 'yes' ? 'Yes' : 'No'}
${fundName ? `Fund of Interest: ${fundName}` : ''}

Message:
${data.message || 'No additional message provided.'}

---
Source: cta_banner
Intent: fund_introduction
      `.trim();

      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: data.fullName,
          email: data.email,
          subject,
          message: messageBody
        }
      });

      if (error) throw error;

      analytics.trackEvent('cta_banner_fund_intro_submit', {
        fund_name: fundName || 'general',
        source: 'cta_banner',
        intent: 'fund_introduction'
      });

      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error('Error submitting fund introduction request:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Request a fund introduction
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-foreground mb-2">Thanks — we'll be in touch shortly.</p>
            <p className="text-sm text-muted-foreground">A member of our team will reach out to discuss your fund introduction.</p>
            <Button onClick={handleClose} className="mt-6">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name *</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="Your full name"
                className={errors.fullName ? 'border-destructive' : ''}
              />
              {errors.fullName && (
                <p className="text-xs text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="your@email.com"
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="whatsapp">WhatsApp (optional)</Label>
              <Input
                id="whatsapp"
                {...register('whatsapp')}
                placeholder="+1 234 567 8900"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nationality">Nationality *</Label>
              <Input
                id="nationality"
                {...register('nationality')}
                placeholder="e.g. American, British, etc."
                className={errors.nationality ? 'border-destructive' : ''}
              />
              {errors.nationality && (
                <p className="text-xs text-destructive">{errors.nationality.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Are you a US person? *</Label>
              <RadioGroup
                value={isUsPerson}
                onValueChange={(value) => setValue('isUsPerson', value as 'yes' | 'no')}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="us-no" />
                  <Label htmlFor="us-no" className="font-normal cursor-pointer">No</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="us-yes" />
                  <Label htmlFor="us-yes" className="font-normal cursor-pointer">Yes</Label>
                </div>
              </RadioGroup>
              {errors.isUsPerson && (
                <p className="text-xs text-destructive">{errors.isUsPerson.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message (optional)</Label>
              <Textarea
                id="message"
                {...register('message')}
                placeholder="Any specific questions or requirements..."
                rows={3}
              />
              {errors.message && (
                <p className="text-xs text-destructive">{errors.message.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit request'
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FundIntroductionModal;
