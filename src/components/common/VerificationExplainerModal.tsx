import React from 'react';
import { Shield, CheckCircle2, FileCheck, Award, Search, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { DialogFooter } from '@/components/ui/dialog';

interface VerificationExplainerModalProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const VerificationExplainerModal: React.FC<VerificationExplainerModalProps> = ({
  trigger,
  open,
  onOpenChange
}) => {
  const defaultTrigger = (
    <Button variant="ghost" size="sm" className="gap-2">
      <Shield className="w-4 h-4" />
      What does verification mean?
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-success" />
            </div>
            <div>
              <DialogTitle className="text-2xl">Fund Verification Explained</DialogTitle>
              <DialogDescription>
                Understanding our rigorous verification process
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* What is Verification */}
          <section>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              What is Fund Verification?
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Fund verification is our comprehensive process to confirm that investment funds meet 
              regulatory requirements, have accurate documentation, and comply with Portugal Golden Visa 
              regulations. Verified funds have passed our multi-step validation process.
            </p>
          </section>

          {/* Verification Process */}
          <section>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Our Verification Process
            </h3>
            
            <div className="grid gap-4">
              <Card className="border-2 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <FileCheck className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">1. Regulatory Compliance Check</h4>
                      <p className="text-sm text-muted-foreground">
                        We verify registration with CMVM (Portuguese Securities Market Commission) 
                        and confirm compliance with all applicable investment fund regulations.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Award className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">2. Documentation Review</h4>
                      <p className="text-sm text-muted-foreground">
                        Fund prospectuses, fact sheets, and legal documents are cross-referenced 
                        with official sources to ensure accuracy and legitimacy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">3. Data Accuracy Validation</h4>
                      <p className="text-sm text-muted-foreground">
                        All fund metrics, fees, terms, and performance data are validated against 
                        official sources and updated regularly.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold mb-1">4. Ongoing Monitoring</h4>
                      <p className="text-sm text-muted-foreground">
                        Verified funds are subject to periodic re-verification to ensure continued 
                        compliance and data accuracy.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Why It Matters */}
          <section>
            <h3 className="text-lg font-semibold mb-3">Why Verification Matters</h3>
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong className="text-foreground">Investor Protection:</strong> Reduces risk of 
                  fraudulent schemes and ensures funds operate within legal frameworks.
                </p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong className="text-foreground">Due Diligence Confidence:</strong> Save time 
                  on research by focusing on funds that have passed rigorous checks.
                </p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0 mt-0.5" />
                <p className="text-sm">
                  <strong className="text-foreground">Data Accuracy:</strong> Verified information 
                  means you can make investment decisions based on reliable, up-to-date data.
                </p>
              </div>
            </div>
          </section>

          {/* Unverified Funds */}
          <section>
            <h3 className="text-lg font-semibold mb-3">What About Unverified Funds?</h3>
            <p className="text-muted-foreground leading-relaxed">
              Unverified funds are not necessarily problematic, but they haven't completed our 
              verification process yet. This may be because they're newly listed, pending documentation 
              review, or awaiting regulatory confirmation. Always conduct your own due diligence for 
              any investment.
            </p>
          </section>

          {/* CTA */}
          <div className="bg-primary/5 rounded-lg p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">
              Looking for verified investment opportunities?
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" asChild>
            <Link to="/verification-program">
              Learn About Our Process
            </Link>
          </Button>
          <Button variant="default" asChild>
            <Link to="/verified-funds">
              View All Verified Funds
            </Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default VerificationExplainerModal;
