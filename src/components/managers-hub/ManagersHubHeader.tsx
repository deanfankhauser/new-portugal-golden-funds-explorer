import React from 'react';

const ManagersHubHeader: React.FC = () => {
  return (
    <div className="mb-8">
      <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3" itemProp="name">
        Portugal Golden Visa Fund Managers
      </h1>
      
      <p className="text-muted-foreground max-w-2xl" itemProp="description">
        Explore fund managers offering Portugal Golden Visa eligible investment funds. 
        Compare strategies, track records, and connect directly.
      </p>
    </div>
  );
};

export default ManagersHubHeader;
