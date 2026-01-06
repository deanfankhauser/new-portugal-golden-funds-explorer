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
    <section className="py-12 sm:py-16 bg-gradient-to-b from-muted/10 via-muted/20 to-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            How verification works
          </h2>
          <p className="text-muted-foreground">
            Our process for reviewing funds listed on the platform.
          </p>
        </div>

        {/* Steps with connecting line */}
        <div className="relative">
          {/* Connecting line - desktop only */}
          <div className="hidden sm:block absolute top-7 left-1/2 -translate-x-1/2 w-[calc(100%-120px)] h-0.5 bg-border" />
          
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-6 relative">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <div key={index} className="text-center relative">
                  {/* Step circle */}
                  <div className="relative z-10 mx-auto mb-4">
                    <div className="w-14 h-14 rounded-full bg-card border-2 border-primary/20 flex items-center justify-center mx-auto shadow-sm">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  
                  <h3 className="text-base font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Link */}
        <div className="text-center mt-10">
          <Link
            to="/verification-program"
            className="inline-flex items-center gap-1.5 text-primary font-medium hover:underline"
          >
            Learn more about our verification process
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowVerificationWorks;
