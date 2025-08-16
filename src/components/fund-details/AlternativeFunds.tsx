
import React from 'react';
import { Link } from 'react-router-dom';
import { Fund } from '../../data/funds';
import { findAlternativeFunds } from '../../data/services/alternative-funds-service';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, TrendingUp, Clock, Users } from 'lucide-react';

interface AlternativeFundsProps {
  currentFund: Fund;
}

const AlternativeFunds: React.FC<AlternativeFundsProps> = ({ currentFund }) => {
  const alternativeFunds = findAlternativeFunds(currentFund);

  if (alternativeFunds.length === 0) {
    return null;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Closing Soon':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Closed':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl text-gray-900">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          Alternative Fund Suggestions
        </CardTitle>
        <p className="text-gray-600">
          If this fund is full or doesn't meet your requirements, here are similar options:
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {alternativeFunds.map((fund) => (
            <div key={fund.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{fund.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{fund.description}</p>
                </div>
                <Badge className={`ml-3 ${getStatusColor(fund.fundStatus)}`}>
                  {fund.fundStatus}
                </Badge>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4 text-sm">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">Min: {formatCurrency(fund.minimumInvestment)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{fund.returnTarget}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{fund.term} years</span>
                </div>
                <div className="text-gray-600">
                  {fund.category}
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">
                  Managed by {fund.managerName}
                </span>
                <Link to={`/${fund.id}`}>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    View Details
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
         <div className="mt-6 pt-4 border-t border-gray-200">
           <div className="flex justify-between items-center">
             <Link 
               to={`/${currentFund.id}/alternatives`}
               className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
             >
               See all alternatives
               <ArrowRight className="w-4 h-4" />
             </Link>
             
             <a 
               href="https://movingto.com/contact/contact-movingto" 
               target="_blank" 
               rel="noopener noreferrer"
             >
               <Button size="sm" className="bg-[#EF4444] hover:bg-[#DC2626] text-white">
                 Get Expert Guidance
               </Button>
             </a>
           </div>
         </div>
      </CardContent>
    </Card>
  );
};

export default AlternativeFunds;
