import React from 'react';
import { Building2 } from 'lucide-react';

interface ManagerAboutSectionProps {
  managerName: string;
  about: string;
}

const ManagerAboutSection: React.FC<ManagerAboutSectionProps> = ({ managerName, about }) => {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-3xl font-semibold text-foreground">
          About {managerName}
        </h2>
      </div>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-wrap font-normal">
          {about}
        </p>
      </div>
    </div>
  );
};

export default ManagerAboutSection;
