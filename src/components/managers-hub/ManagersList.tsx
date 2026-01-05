import React from 'react';
import { Link } from 'react-router-dom';
import ManagerCard, { EnrichedManager } from './ManagerCard';

interface ManagersListProps {
  managers: EnrichedManager[];
}

const ManagersList: React.FC<ManagersListProps> = ({ managers }) => {
  if (managers.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No fund managers found.
      </div>
    );
  }

  return (
    <section aria-labelledby="managers-heading">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {managers.map((manager) => (
          <ManagerCard key={manager.name} manager={manager} />
        ))}
      </div>
      
      <div className="mt-10 pt-6 border-t border-border text-center">
        <p className="text-muted-foreground mb-4">
          Looking for specific investment opportunities?
        </p>
        <Link 
          to="/" 
          className="text-primary hover:underline font-medium"
        >
          Browse All Funds →
        </Link>
      </div>
    </section>
  );
};

export default ManagersList;
