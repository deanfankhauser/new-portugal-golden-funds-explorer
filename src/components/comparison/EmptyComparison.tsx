
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const EmptyComparison = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-10 text-center">
      <h2 className="text-2xl font-bold mb-4">No Funds Selected for Comparison</h2>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        You haven't selected any funds to compare yet. Browse our collection of Portugal Golden Visa eligible funds
        and click the "Compare" button to add them to your comparison list.
      </p>
      <Button
        onClick={() => navigate('/')}
        className="bg-[#EF4444] hover:bg-[#EF4444]/90"
      >
        Browse Funds
      </Button>
    </div>
  );
};

export default EmptyComparison;
