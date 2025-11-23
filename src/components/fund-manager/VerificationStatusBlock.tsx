import React from 'react';
import { Shield, AlertCircle } from 'lucide-react';

interface VerificationStatusBlockProps {
  isVerified: boolean;
  managerName: string;
}

const VerificationStatusBlock: React.FC<VerificationStatusBlockProps> = ({ isVerified, managerName }) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-muted/30 border-y border-border">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-start gap-4">
          {isVerified ? (
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <Shield className="h-6 w-6 text-success" />
            </div>
          ) : (
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
              <AlertCircle className="h-6 w-6 text-amber-600" />
            </div>
          )}
          
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-foreground mb-3">Verification Status</h2>
            
            {isVerified ? (
              <div className="space-y-3">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Movingto has conducted a documentation review and basic due diligence on {managerName}. 
                  This verification confirms that the manager is properly registered with CMVM and has provided 
                  accurate regulatory information.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong>Important:</strong> This verification does not constitute investment advice or a recommendation 
                  to invest. All investment decisions should be made after thorough independent research and professional 
                  consultation with qualified advisors.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Movingto has not yet conducted independent verification of {managerName}. The information displayed 
                  on this page is provided by the fund manager or compiled from public sources.
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  <strong>Important:</strong> This information is for general informational purposes only and does not 
                  constitute investment advice. We recommend conducting thorough due diligence and consulting with 
                  qualified financial and legal advisors before making any investment decisions.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerificationStatusBlock;
