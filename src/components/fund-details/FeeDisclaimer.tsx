import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from 'lucide-react';

const FeeDisclaimer: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('2025');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString('en-US', { 
      month: 'long', 
      year: 'numeric' 
    }));
  }, []);

  return (
    <Alert className="bg-blue-50 border-blue-200 mt-4">
      <Info className="h-4 w-4 text-blue-600" />
      <AlertDescription className="text-sm">
        <strong className="text-blue-700">Fee Information:</strong> 
        <br />
        All fees and liquidity terms shown as of {currentDate}. 
        Confirm with manager + lawyer before investing.
      </AlertDescription>
    </Alert>
  );
};

export default FeeDisclaimer;