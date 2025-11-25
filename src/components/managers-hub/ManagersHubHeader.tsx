
import React from 'react';
import { Users } from 'lucide-react';

const ManagersHubHeader = () => {
  return (
    <div className="bg-card p-6 rounded-lg shadow-sm mb-8">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-center" itemProp="name">
        Portugal Golden Visa Fund Managers
      </h1>
      
      <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-center" itemProp="description">
        Explore all fund managers offering Golden Visa eligible investment funds in Portugal
      </p>
    </div>
  );
};

export default ManagersHubHeader;
