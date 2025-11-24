import React from 'react';

interface ManagerAboutSectionProps {
  managerName: string;
  about: string;
}

const ManagerAboutSection: React.FC<ManagerAboutSectionProps> = ({ managerName, about }) => {
  return (
    <div>
      <h2 className="text-3xl font-semibold text-foreground mb-6">
        About {managerName}
      </h2>
      
      <div className="prose prose-lg max-w-none">
        <p className="text-foreground/80 leading-relaxed text-lg whitespace-pre-wrap font-normal">
          {about}
        </p>
      </div>
    </div>
  );
};

export default ManagerAboutSection;
