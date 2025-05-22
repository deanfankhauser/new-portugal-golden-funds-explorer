
import React from 'react';
import { Fund } from '../../data/funds';
import FundCategory from './FundCategory';
import FeeStructure from './FeeStructure';
import GeographicAllocation from './GeographicAllocation';
import FundManager from './FundManager';
import TeamSection from './TeamSection';
import FundDescription from './FundDescription';
import DocumentsSection from './DocumentsSection';
import IntroductionButton from './IntroductionButton';
import RedemptionTerms from './RedemptionTerms';
import { formatPercentage } from './utils/formatters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PieChart, Users } from 'lucide-react';

interface FundTabsSectionProps {
  fund: Fund;
}

const FundTabsSection: React.FC<FundTabsSectionProps> = ({ fund }) => {
  return (
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
  );
};

export default FundTabsSection;
