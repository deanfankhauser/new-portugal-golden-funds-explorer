
import React from 'react';

const ROICalculatorHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Portugal Golden Visa Fund ROI Calculator
      </h1>
      <p className="text-lg text-gray-600 max-w-3xl mx-auto">
        Calculate potential returns on your Portuguese Golden Visa fund investment. 
        Select a fund and adjust parameters to see projected returns over your investment timeline.
      </p>
    </div>
  );
};

export default ROICalculatorHeader;
