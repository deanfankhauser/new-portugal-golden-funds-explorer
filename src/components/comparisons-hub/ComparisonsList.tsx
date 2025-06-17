
import React from 'react';
import { Link } from 'react-router-dom';
import { generateFundComparisons } from '../../data/services/comparison-service';
import { Button } from '@/components/ui/button';
import { GitCompare } from 'lucide-react';

const ComparisonsList = () => {
  const comparisons = generateFundComparisons();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-4">Available Fund Comparisons</h2>
        <p className="text-gray-600">
          Compare Portugal Golden Visa investment funds side by side to make informed decisions.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {comparisons.slice(0, 12).map((comparison) => (
          <div key={comparison.slug} className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <GitCompare className="h-5 w-5 text-[#EF4444]" />
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  Comparison
                </span>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  {comparison.fund1.name} vs {comparison.fund2.name}
                </h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span>{comparison.fund1.category} vs {comparison.fund2.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Min Investment:</span>
                    <span>€{comparison.fund1.minimumInvestment.toLocaleString()} vs €{comparison.fund2.minimumInvestment.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <Link to={`/compare/${comparison.slug}`}>
                <Button className="w-full bg-[#EF4444] hover:bg-[#EF4444]/90 text-white">
                  Compare Funds
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {comparisons.length > 12 && (
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Showing first 12 comparisons out of {comparisons.length} total available comparisons.
          </p>
        </div>
      )}
    </div>
  );
};

export default ComparisonsList;
