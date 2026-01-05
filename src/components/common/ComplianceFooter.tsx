import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

interface ComplianceFooterProps {
  variant?: 'prominent' | 'subtle';
}

const ComplianceFooter: React.FC<ComplianceFooterProps> = ({ variant = 'prominent' }) => {
  if (variant === 'subtle') {
    return (
      <div className="bg-muted/50 border-t border-border py-3 px-4">
        <p className="text-xs text-muted-foreground text-center max-w-4xl mx-auto">
          Movingto provides standardized fund data for discovery; we do not provide financial advice.{' '}
          <Link to="/disclaimer" className="underline hover:text-foreground transition-colors">
            Learn more
          </Link>
          . Consult a licensed advisor before investing.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 text-slate-100 py-4 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-start gap-3">
          <div className="p-1.5 bg-gold-verified/20 rounded-md flex-shrink-0 mt-0.5">
            <AlertTriangle className="w-4 h-4 text-gold-verified" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium text-slate-100">
              Important Disclosure
            </p>
            <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
              Movingto provides standardized fund data for discovery purposes only; we do not provide financial, 
              legal, or tax advice. Fund information is sourced from public filings and manager submissions. 
              Past performance does not guarantee future results. Investment in funds involves risk, including 
              potential loss of principal.{' '}
              <Link 
                to="/disclaimer" 
                className="text-gold-verified hover:underline font-medium"
              >
                Read full disclaimer
              </Link>
              . Consult a licensed financial advisor before making investment decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplianceFooter;
