
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useComparison } from '../contexts/ComparisonContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, X, Info } from 'lucide-react';
import { formatCurrency } from '../components/fund-details/utils/formatters';
import ComparisonTable from '../components/comparison/ComparisonTable';
import EmptyComparison from '../components/comparison/EmptyComparison';

const ComparisonPage = () => {
  const navigate = useNavigate();
  const { compareFunds, removeFromComparison } = useComparison();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="mb-6 flex justify-between items-center">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className="flex items-center hover:bg-[#f0f0f0] hover:text-black"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-0">Fund Comparison</h1>
        </div>

        {compareFunds.length === 0 ? (
          <EmptyComparison />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex flex-wrap justify-between items-center mb-6">
              <p className="text-xl text-gray-700">
                {compareFunds.length === 1 
                  ? "1 fund selected" 
                  : `${compareFunds.length} funds selected`}
              </p>
              <Button 
                variant="outline"
                className="text-gray-600 border-gray-300"
                onClick={() => navigate('/')}
              >
                Add more funds
              </Button>
            </div>

            {/* Comparison info box */}
            <div className="bg-blue-50 p-4 rounded-lg mb-6 flex items-start gap-3">
              <Info className="text-blue-600 w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-blue-800 mb-1">About Fund Comparison</h3>
                <p className="text-sm text-blue-700">
                  This tool allows you to compare different investment funds side by side. 
                  Highlighted cells indicate differences between funds. Status refers to whether the fund is currently 
                  accepting new investments. Structure type (Open-ended/Closed-ended) is shown in the details.
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {compareFunds.map(fund => (
                  <div 
                    key={fund.id} 
                    className="relative bg-gray-50 rounded-lg p-4 border"
                  >
                    <button 
                      onClick={() => removeFromComparison(fund.id)}
                      className="absolute top-2 right-2 text-gray-500 hover:text-[#EF4444]"
                      aria-label="Remove from comparison"
                    >
                      <X size={18} />
                    </button>
                    <h3 className="font-medium text-lg mb-2">{fund.name}</h3>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{fund.description}</p>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => navigate(`/funds/${fund.id}`)}
                      className="mt-2 w-full"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <ComparisonTable funds={compareFunds} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default ComparisonPage;
