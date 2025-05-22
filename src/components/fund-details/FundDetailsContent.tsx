
import React from 'react';
import { Fund } from '../../data/funds';
import FundHeader from './FundHeader';
import FundMetrics from './FundMetrics';
import FundCategory from './FundCategory';
import FeeStructure from './FeeStructure';
import GeographicAllocation from './GeographicAllocation';
import FundManager from './FundManager';
import TeamSection from './TeamSection';
import FundDescription from './FundDescription';
import DocumentsSection from './DocumentsSection';
import IntroductionButton from './IntroductionButton';
import RedemptionTerms from './RedemptionTerms';
import { formatCurrency, formatPercentage } from './utils/formatters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PieChart, User, Users, AlertCircle, Flag } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface FundDetailsContentProps {
  fund: Fund;
}

const FundDetailsContent: React.FC<FundDetailsContentProps> = ({ fund }) => {
  // Helper function to get structure description based on fund characteristics
  const getFundStructureDescription = () => {
    if (fund.redemptionTerms?.frequency === 'Monthly' && fund.tags.includes('Open Ended')) {
      return "(Flexible, with monthly subscriptions & redemptions)";
    }
    if (fund.redemptionTerms?.frequency === 'Daily' && fund.tags.includes('Open Ended')) {
      if (fund.tags.includes('No Lock-Up')) {
        return "(Open-ended, with daily liquidity; no lock-up)";
      }
      return "(Open-ended, with daily liquidity)";
    }
    if (fund.tags.includes('Lock-Up') && fund.redemptionTerms?.minimumHoldingPeriod) {
      const lockupYears = Math.floor(fund.redemptionTerms.minimumHoldingPeriod / 12);
      const lockupMonths = fund.redemptionTerms.minimumHoldingPeriod % 12;
      const lockupText = lockupYears > 0 
        ? `${lockupYears} ${lockupYears === 1 ? 'year' : 'years'}${lockupMonths > 0 ? ` ${lockupMonths} ${lockupMonths === 1 ? 'month' : 'months'}` : ''}`
        : `${lockupMonths} ${lockupMonths === 1 ? 'month' : 'months'}`;
      return `(Open-ended with ${lockupText} lock-up)`;
    }
    if (fund.tags.includes('Closed Ended')) {
      return "(Closed-ended, fixed term investment)";
    }
    return "";
  };
  
  // Helper function to format target AUM and current AUM
  const formatFundSize = () => {
    // For 3CC fund with specific formatting
    if (fund.id === '3cc-golden-income') {
      return "Target €50 Million; Current >€25 Million";
    }
    // For funds with N/A fund size
    if (fund.fundSize === 0) {
      return "N/A";
    }
    // Default formatting
    return `${fund.fundSize} Million EUR`;
  };

  // Get the appropriate label for subscription status
  const getSubscriptionStatusLabel = () => {
    if (fund.fundStatus === 'Open') {
      return 'Accepting New Investments';
    } else if (fund.fundStatus === 'Closing Soon') {
      return 'Closing Soon for New Investments';
    } else {
      return 'Not Accepting New Investments';
    }
  };

  // Get the appropriate color for subscription status
  const getSubscriptionStatusColor = () => {
    if (fund.fundStatus === 'Open') {
      return 'bg-green-100 text-green-800';
    } else if (fund.fundStatus === 'Closing Soon') {
      return 'bg-amber-100 text-amber-800';
    } else {
      return 'bg-red-100 text-red-800';
    }
  };

  // Get the appropriate dot color for subscription status
  const getSubscriptionStatusDotColor = () => {
    if (fund.fundStatus === 'Open') {
      return 'bg-green-500';
    } else if (fund.fundStatus === 'Closing Soon') {
      return 'bg-amber-500';
    } else {
      return 'bg-red-500';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-shadow duration-300 hover:shadow-lg">
      {/* Fund Header Section with built-in CTA */}
      <FundHeader fund={fund} />

      <div className="p-6 md:p-10 space-y-10">
        {/* Status indicator for fund */}
        <div className="flex items-center justify-between">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${getSubscriptionStatusColor()}`}>
            <span className={`w-2 h-2 rounded-full ${getSubscriptionStatusDotColor()} animate-pulse`}></span>
            <span className="font-medium">{getSubscriptionStatusLabel()}</span>
            <span className="ml-1 text-xs font-normal">{getFundStructureDescription()}</span>
          </div>
          
          {/* Report Button */}
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-red-600 transition-colors"
            onClick={() => {
              window.location.href = `mailto:info@movingto.io?subject=Incorrect Information Report - ${fund.name}&body=I'd like to report incorrect information for fund: ${fund.name}`;
            }}
          >
            <Flag className="w-4 h-4 mr-2" />
            Report incorrect information
          </Button>
        </div>
        
        {/* Grid layout for key metrics */}
        <FundMetrics fund={fund} formatCurrency={formatCurrency} formatFundSize={formatFundSize} />
        
        {/* Main content with tabs */}
        <Tabs defaultValue="overview" className="w-full animate-fade-in">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="overview" className="text-sm md:text-base">
              <FileText className="w-4 h-4 mr-2 hidden md:inline" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="structure" className="text-sm md:text-base">
              <PieChart className="w-4 h-4 mr-2 hidden md:inline" />
              Structure
            </TabsTrigger>
            <TabsTrigger value="team" className="text-sm md:text-base">
              <Users className="w-4 h-4 mr-2 hidden md:inline" />
              Team
            </TabsTrigger>
            <TabsTrigger value="documents" className="text-sm md:text-base">
              <FileText className="w-4 h-4 mr-2 hidden md:inline" />
              Documents
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-8 animate-fade-in">
            {/* Fund Description */}
            <FundDescription description={fund.detailedDescription} />
            
            {/* Fund Manager Section */}
            <FundManager 
              managerName={fund.managerName} 
              managerLogo={fund.managerLogo} 
            />
            
            {/* Introduction Button (compact version in overview) */}
            <IntroductionButton variant="compact" />
          </TabsContent>
          
          <TabsContent value="structure" className="animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-8">
                {/* Fund Category Section */}
                <FundCategory category={fund.category} />

                {/* Fee Structure Section */}
                <FeeStructure fund={fund} formatPercentage={formatPercentage} />
                
                {/* Redemption Terms Section */}
                <RedemptionTerms redemptionTerms={fund.redemptionTerms} />
              </div>

              <div className="space-y-8">
                {/* Geographic Allocation Section */}
                <GeographicAllocation 
                  allocations={fund.geographicAllocation} 
                  formatPercentage={formatPercentage} 
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="team" className="animate-fade-in">
            {/* Team Section */}
            <TeamSection team={fund.team} />
          </TabsContent>
          
          <TabsContent value="documents" className="animate-fade-in">
            {/* Documents Section */}
            <DocumentsSection documents={fund.documents} />
          </TabsContent>
        </Tabs>
        
        {/* Investor Notice */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 flex items-start space-x-4">
          <AlertCircle className="text-blue-500 w-6 h-6 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-blue-700 mb-2">Important Notice for Investors</h3>
            <p className="text-blue-800 text-sm leading-relaxed">
              Investment in funds involves risks, including the possible loss of principal. Please read all fund documentation carefully before making any investment decisions. Past performance is not indicative of future results.
            </p>
          </div>
        </div>
        
        {/* Introduction Button (full version at bottom) */}
        <IntroductionButton variant="full" />
      </div>
    </div>
  );
};

export default FundDetailsContent;
