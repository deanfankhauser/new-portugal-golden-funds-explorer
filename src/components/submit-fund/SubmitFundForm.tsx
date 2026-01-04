import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Check, ArrowLeft, ArrowRight, Send, CheckCircle } from 'lucide-react';
import { useFundSubmission } from '@/hooks/useFundSubmission';
import CompanyInfoStep from './steps/CompanyInfoStep';
import ContactInfoStep from './steps/ContactInfoStep';
import FundDetailsStep from './steps/FundDetailsStep';
import FeesTermsStep from './steps/FeesTermsStep';
import RegulatoryStep from './steps/RegulatoryStep';
import ReviewSubmitStep from './steps/ReviewSubmitStep';
import { Link } from 'react-router-dom';

const STEPS = [
  { title: 'Company', description: 'Your company information' },
  { title: 'Contact', description: 'Primary contact details' },
  { title: 'Fund', description: 'Fund details' },
  { title: 'Fees', description: 'Fees & terms' },
  { title: 'Regulatory', description: 'Compliance info' },
  { title: 'Review', description: 'Submit your fund' },
];

export default function SubmitFundForm() {
  const {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    validateStep,
    submitForm,
    isSubmitting,
    isSubmitted,
  } = useFundSubmission();

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  if (isSubmitted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-12 pb-12 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-10 w-10 text-primary" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Submission Received!</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Thank you for submitting <strong>{formData.fund_name}</strong> from{' '}
            <strong>{formData.company_name}</strong>. Our team will review your submission
            within 2-3 business days.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            You'll receive an email notification once your submission is reviewed.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" asChild>
              <Link to="/">Return Home</Link>
            </Button>
            <Button asChild>
              <Link to="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <CompanyInfoStep formData={formData} updateFormData={updateFormData} />;
      case 1:
        return <ContactInfoStep formData={formData} updateFormData={updateFormData} />;
      case 2:
        return <FundDetailsStep formData={formData} updateFormData={updateFormData} />;
      case 3:
        return <FeesTermsStep formData={formData} updateFormData={updateFormData} />;
      case 4:
        return <RegulatoryStep formData={formData} updateFormData={updateFormData} />;
      case 5:
        return <ReviewSubmitStep formData={formData} onEditStep={setCurrentStep} />;
      default:
        return null;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      nextStep();
    }
  };

  const handleSubmit = async () => {
    await submitForm();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Submit Your Fund</h1>
        <p className="text-muted-foreground">
          List your investment fund on Movingto Funds and connect with qualified investors
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between">
          {STEPS.map((step, index) => (
            <button
              key={step.title}
              onClick={() => index < currentStep && setCurrentStep(index)}
              disabled={index > currentStep}
              className={`flex flex-col items-center gap-1 transition-colors ${
                index === currentStep
                  ? 'text-primary'
                  : index < currentStep
                  ? 'text-muted-foreground hover:text-primary cursor-pointer'
                  : 'text-muted-foreground/50 cursor-not-allowed'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-colors ${
                  index < currentStep
                    ? 'bg-primary border-primary text-primary-foreground'
                    : index === currentStep
                    ? 'border-primary text-primary'
                    : 'border-muted-foreground/30 text-muted-foreground/50'
                }`}
              >
                {index < currentStep ? <Check className="h-4 w-4" /> : index + 1}
              </div>
              <span className="text-xs font-medium hidden sm:block">{step.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Form Card */}
      <Card>
        <CardHeader>
          <CardTitle>{STEPS[currentStep].title}</CardTitle>
          <CardDescription>{STEPS[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep === STEPS.length - 1 ? (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                Submit for Review
              </>
            )}
          </Button>
        ) : (
          <Button onClick={handleNext} disabled={!validateStep(currentStep)}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}
