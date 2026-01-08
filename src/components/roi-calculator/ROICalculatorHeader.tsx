import React from 'react';
import { Link } from 'react-router-dom';

const ROICalculatorHeader: React.FC = () => {
  return (
    <div className="max-w-2xl mx-auto text-center mb-12">
      <h1 className="text-3xl md:text-4xl font-semibold text-foreground tracking-tight mb-4">
        Portugal Golden Visa ROI Calculator
      </h1>
      <p className="text-base text-muted-foreground leading-relaxed">
        Estimate potential returns on Portugal Golden Visa investment funds. Select a fund, adjust parameters, and calculate projected ROI.{' '}
        <Link to="/funds" className="text-primary hover:underline underline-offset-4">
          Browse funds
        </Link>
      </p>
    </div>
  );
};

export default ROICalculatorHeader;
