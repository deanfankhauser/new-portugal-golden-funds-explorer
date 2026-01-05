import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, FileText, ShieldCheck, MessageCircle } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: 'We collect core documents',
    description: 'Funds submit prospectus, registry extracts, and custodian confirmation.',
  },
  {
    icon: ShieldCheck,
    title: 'We verify key facts',
    description: 'We check registration, exposure, structure, and document consistency.',
  },
  {
    icon: MessageCircle,
    title: 'You can request an intro',
    description: 'Browse verified funds and reach out directly to fund managers.',
  },
];

const HowVerificationWorks: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            How verification works
          </h2>
          <p className="text-muted-foreground">
            Our process for reviewing funds listed on the platform.
          </p>
        </div>

        {/* Steps */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          {steps.map((step, index) => {
            const IconComponent = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center mx-auto mb-4">
                  <IconComponent className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm font-medium text-muted-foreground mb-2">
                  Step {index + 1}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>

        {/* Link + Disclosure */}
        <div className="text-center">
          <Link
            to="/verification-program"
            className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline mb-4"
          >
            Learn more about our verification process
            <ArrowRight className="h-4 w-4" />
          </Link>
          <p className="text-xs text-muted-foreground/70">
            Verification is informational and not investment advice.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HowVerificationWorks;
