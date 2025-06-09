
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { funds } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ChevronRight } from 'lucide-react';
import PageSEO from '../components/common/PageSEO';
import FundManagerHeader from '../components/fund-manager/FundManagerHeader';
import FundManagerContent from '../components/fund-manager/FundManagerContent';
import FundManagerNotFound from '../components/fund-manager/FundManagerNotFound';
import { slugToManager } from '../lib/utils';
import { getAllFundManagers } from '../data/services/managers-service';

interface FundManagerData {
  name: string;
  logo?: string;
  fundsCount: number;
  totalFundSize: number;
  funds: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    minimumInvestment: number;
    fundSize: number;
    returnTarget: string;
  }>;
}

const FundManager = () => {
  const { name } = useParams<{ name: string }>();
  
  // Decode the URL-encoded manager name
  const decodedManagerName = name ? decodeURIComponent(name) : '';
  
  // Try to find manager by exact match first (for old URLs)
  let managerFunds = funds.filter(fund => 
    fund.managerName.toLowerCase() === decodedManagerName.toLowerCase()
  );
  
  // If no exact match found, try slug-to-manager conversion (for new URLs)
  if (managerFunds.length === 0 && name) {
    const convertedManagerName = slugToManager(name);
    
    // Get all available managers and find closest match
    const allManagers = getAllFundManagers();
    const exactMatch = allManagers.find(manager => 
      manager.name.toLowerCase() === convertedManagerName.toLowerCase()
    );
    
    if (exactMatch) {
      managerFunds = funds.filter(fund => 
        fund.managerName.toLowerCase() === exactMatch.name.toLowerCase()
      );
    } else {
      // Try partial matching for better compatibility
      const partialMatch = allManagers.find(manager => 
        manager.name.toLowerCase().includes(convertedManagerName.toLowerCase()) ||
        convertedManagerName.toLowerCase().includes(manager.name.toLowerCase())
      );
      
      if (partialMatch) {
        managerFunds = funds.filter(fund => 
          fund.managerName.toLowerCase() === partialMatch.name.toLowerCase()
        );
      }
    }
  }
  
  // If no funds found, return an empty state
  if (managerFunds.length === 0) {
    return <FundManagerNotFound managerName={decodedManagerName} />;
  }

  // Prepare manager data for structured data
  const managerData: FundManagerData = {
    name: managerFunds[0].managerName,
    logo: managerFunds[0].managerLogo,
    fundsCount: managerFunds.length,
    totalFundSize: managerFunds.reduce((sum, fund) => sum + fund.fundSize, 0),
    funds: managerFunds.map(fund => ({
      id: fund.id,
      name: fund.name,
      description: fund.description,
      category: fund.category,
      minimumInvestment: fund.minimumInvestment,
      fundSize: fund.fundSize,
      returnTarget: fund.returnTarget
    }))
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <PageSEO pageType="manager" managerName={managerFunds[0].managerName} />
      
      <Header />
      
      <main className="flex-1 py-6 sm:py-8 md:py-10">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
          <div className="mb-4 sm:mb-6">
            <Link to="/" className="text-gray-600 hover:text-[#EF4444] transition-colors flex items-center gap-1 mb-3 sm:mb-4 text-sm sm:text-base">
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 rotate-180" />
              Back to funds
            </Link>
          </div>
          
          <FundManagerHeader managerData={managerData} />
          <FundManagerContent managerFunds={managerFunds} managerName={managerFunds[0].managerName} />
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundManager;
