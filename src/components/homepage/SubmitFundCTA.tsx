import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Building2, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function SubmitFundCTA() {
  const benefits = [
    'Get listed in our verified fund directory',
    'Reach qualified investors seeking opportunities',
    'Full company profile with team members',
  ];

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-card border rounded-2xl p-6 sm:p-10 shadow-lg">
            <div className="flex flex-col lg:flex-row gap-8 items-center">
              {/* Left: Icon and content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 text-primary mb-4">
                  <Building2 className="h-7 w-7" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3">
                  List Your Fund
                </h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Are you a fund manager? Submit your fund to be featured in our directory and connect with qualified investors.
                </p>
                <ul className="space-y-2 mb-6">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Right: CTA */}
              <div className="flex-shrink-0">
                <Link to="/submit-fund">
                  <Button size="lg" className="group text-base px-8">
                    Submit Your Fund
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <p className="text-xs text-muted-foreground text-center mt-3">
                  Free submission · Review within 48 hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
