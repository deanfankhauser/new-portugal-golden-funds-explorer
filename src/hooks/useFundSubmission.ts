import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface FundSubmissionData {
  // Company Info
  company_name: string;
  company_description: string;
  company_website: string;
  company_city: string;
  company_country: string;
  company_logo_url: string;
  entity_type: string;
  
  // Contact Info
  contact_name: string;
  contact_role: string;
  contact_bio: string;
  contact_photo_url: string;
  contact_linkedin: string;
  
  // Fund Info
  fund_name: string;
  fund_description: string;
  category: string;
  minimum_investment: number;
  currency: string;
  gv_eligible: boolean;
  
  // Fees & Terms
  management_fee: number | null;
  performance_fee: number | null;
  target_return_min: number | null;
  target_return_max: number | null;
  lock_up_period_months: number | null;
  
  // Regulatory
  regulated_by: string;
  fund_location: string;
  cmvm_id: string;
  isin: string;
  
  // Additional
  additional_notes: string;
}

export const initialFormData: FundSubmissionData = {
  company_name: '',
  company_description: '',
  company_website: '',
  company_city: '',
  company_country: '',
  company_logo_url: '',
  entity_type: 'SCR',
  contact_name: '',
  contact_role: '',
  contact_bio: '',
  contact_photo_url: '',
  contact_linkedin: '',
  fund_name: '',
  fund_description: '',
  category: '',
  minimum_investment: 0,
  currency: 'EUR',
  gv_eligible: false,
  management_fee: null,
  performance_fee: null,
  target_return_min: null,
  target_return_max: null,
  lock_up_period_months: null,
  regulated_by: '',
  fund_location: '',
  cmvm_id: '',
  isin: '',
  additional_notes: '',
};

export function useFundSubmission() {
  const [formData, setFormData] = useState<FundSubmissionData>(initialFormData);
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const updateFormData = (updates: Partial<FundSubmissionData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (step: number) => {
    setCurrentStep(step);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 0: // Company Info
        return !!(
          formData.company_name &&
          formData.company_description &&
          formData.company_website &&
          formData.company_city &&
          formData.company_country &&
          formData.company_logo_url
        );
      case 1: // Contact Info
        return !!(
          formData.contact_name &&
          formData.contact_role
        );
      case 2: // Fund Details
        return !!(
          formData.fund_name &&
          formData.fund_description &&
          formData.category &&
          formData.minimum_investment > 0
        );
      case 3: // Fees & Terms (optional)
        return true;
      case 4: // Regulatory (optional)
        return true;
      case 5: // Review
        return true;
      default:
        return true;
    }
  };

  const submitForm = async (): Promise<boolean> => {
    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error('You must be logged in to submit a fund');
        return false;
      }

      // Insert submission
      const { data: submission, error: insertError } = await supabase
        .from('fund_submissions')
        .insert({
          user_id: user.id,
          company_name: formData.company_name,
          company_description: formData.company_description,
          company_website: formData.company_website,
          company_city: formData.company_city,
          company_country: formData.company_country,
          company_logo_url: formData.company_logo_url,
          entity_type: formData.entity_type || 'SCR',
          contact_name: formData.contact_name,
          contact_role: formData.contact_role,
          contact_bio: formData.contact_bio || null,
          contact_photo_url: formData.contact_photo_url || null,
          contact_linkedin: formData.contact_linkedin || null,
          fund_name: formData.fund_name,
          fund_description: formData.fund_description,
          category: formData.category,
          minimum_investment: formData.minimum_investment,
          currency: formData.currency || 'EUR',
          gv_eligible: formData.gv_eligible,
          management_fee: formData.management_fee,
          performance_fee: formData.performance_fee,
          target_return_min: formData.target_return_min,
          target_return_max: formData.target_return_max,
          lock_up_period_months: formData.lock_up_period_months,
          regulated_by: formData.regulated_by || null,
          fund_location: formData.fund_location || null,
          cmvm_id: formData.cmvm_id || null,
          isin: formData.isin || null,
          additional_notes: formData.additional_notes || null,
        })
        .select('id')
        .single();

      if (insertError) {
        console.error('Error inserting submission:', insertError);
        toast.error('Failed to submit. Please try again.');
        return false;
      }

      // Trigger notification edge function
      try {
        await supabase.functions.invoke('notify-fund-submission', {
          body: {
            submissionId: submission.id,
            companyName: formData.company_name,
            fundName: formData.fund_name,
            contactName: formData.contact_name,
            contactEmail: user.email,
          },
        });
      } catch (notifyError) {
        console.error('Error sending notification:', notifyError);
        // Don't fail the submission if notification fails
      }

      setIsSubmitted(true);
      toast.success('Your fund has been submitted for review!');
      return true;
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('An unexpected error occurred. Please try again.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(0);
    setIsSubmitted(false);
  };

  return {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep: goToStep,
    nextStep,
    prevStep,
    validateStep,
    submitForm,
    resetForm,
    isSubmitting,
    isSubmitted,
  };
}
