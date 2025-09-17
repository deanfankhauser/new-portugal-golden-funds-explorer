import React from 'react';
import MigrateFundsButton from '../components/admin/MigrateFundsButton';

const TempMigrationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Fund Data Migration</h1>
          <p className="text-muted-foreground">
            Migrate static fund data to see all 29 funds
          </p>
        </div>
        <MigrateFundsButton />
      </div>
    </div>
  );
};

export default TempMigrationPage;