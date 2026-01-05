import React from 'react';
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
    </section>
  );
};

export default ManagersList;
