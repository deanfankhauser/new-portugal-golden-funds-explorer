
import React, { forwardRef } from 'react';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import EmailCapture from '../common/EmailCapture';

interface ROICalculatorEmailGateProps {
  onEmailSubmit: (email: string) => Promise<void>;
  isSubmittingEmail: boolean;
}

const ROICalculatorEmailGate = forwardRef<HTMLDivElement, ROICalculatorEmailGateProps>(({
  onEmailSubmit,
  isSubmittingEmail
}, ref) => {
  return (
    <div className="space-y-8">
      <Card ref={ref}>
        <CardHeader className="text-center">
          <CardTitle>Your ROI Calculation Is Ready!</CardTitle>
          <p className="text-gray-600">Enter your email to view your detailed investment projections</p>
        </CardHeader>
      </Card>
      
      <EmailCapture
        title="Get Your ROI Calculation"
        description="Enter your email to see your detailed return projections for Portugal Golden Visa funds."
        onEmailSubmit={onEmailSubmit}
        isSubmitting={isSubmittingEmail}
      />
    </div>
  );
});

ROICalculatorEmailGate.displayName = 'ROICalculatorEmailGate';

export default ROICalculatorEmailGate;
