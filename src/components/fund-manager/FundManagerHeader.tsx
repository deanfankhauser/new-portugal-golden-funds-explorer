
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { User } from 'lucide-react';
import { FundManagerData } from '../../hooks/useFundManagerStructuredData';
import OptimizedImage from '../common/OptimizedImage';
import { ImageOptimizationService } from '../../services/imageOptimizationService';

interface FundManagerHeaderProps {
  managerData: FundManagerData;
}

const FundManagerHeader: React.FC<FundManagerHeaderProps> = ({ managerData }) => {
  // Generate placeholder logo if none provided
  const logoSrc = managerData.logo || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&h=200&fit=crop&auto=format';
  const logoAlt = `${managerData.name} company logo`;

  return (
    <Card className="border border-gray-100 shadow-md mb-10" role="banner" aria-labelledby="manager-header-title">
      <CardContent className="p-6">
        <div className="flex items-center mb-5">
          <User className="w-6 h-6 mr-2 text-[#EF4444]" aria-hidden="true" />
          <h1 className="text-3xl font-bold" id="manager-header-title">
            {managerData.name}
          </h1>
        </div>
        
        <div className="bg-slate-50 p-5 rounded-lg border border-slate-100" role="group" aria-label="Manager overview">
          {managerData.logo && (
            <div className="mb-4">
              <OptimizedImage 
                src={logoSrc}
                alt={logoAlt}
                width={80}
                height={80}
                className="w-20 h-20 object-contain rounded-md shadow-sm border border-slate-100 bg-white p-2"
                priority={true}
              />
            </div>
          )}
          <p className="text-lg text-gray-600" aria-label={`Manager summary: ${managerData.name} manages ${managerData.fundsCount} funds with total size of ${managerData.totalFundSize} million euros`}>
            {managerData.name} manages {managerData.fundsCount} fund{managerData.fundsCount > 1 ? 's' : ''} with a combined 
            size of {managerData.totalFundSize} million EUR.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundManagerHeader;
