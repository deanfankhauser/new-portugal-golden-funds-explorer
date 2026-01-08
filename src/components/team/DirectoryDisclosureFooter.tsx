import React from 'react';
import { Link } from 'react-router-dom';
import { Info } from 'lucide-react';

export const DirectoryDisclosureFooter: React.FC = () => {
  return (
    <section className="py-8 mt-4">
      <div className="rounded-lg bg-muted/30 border p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">
              This profile is part of the Movingto Funds directory. Team members are employed 
              by fund managers, not Movingto. For inquiries, please contact the fund directly.
            </p>
            <Link 
              to="/disclaimer" 
              className="text-sm text-primary hover:underline inline-flex items-center gap-1"
            >
              Read full disclaimer
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
