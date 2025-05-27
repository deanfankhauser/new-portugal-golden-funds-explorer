
import React from 'react';
import { Fund } from '../../data/funds';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PieChart, Users } from 'lucide-react';
import FundOverviewTab from './tabs/FundOverviewTab';
import FundStructureTab from './tabs/FundStructureTab';
import FundTeamTab from './tabs/FundTeamTab';
import FundDocumentsTab from './tabs/FundDocumentsTab';

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
      
      <TabsContent value="overview">
        <FundOverviewTab fund={fund} />
      </TabsContent>
      
      <TabsContent value="structure">
        <FundStructureTab fund={fund} />
      </TabsContent>
      
      <TabsContent value="team">
        <FundTeamTab fund={fund} />
      </TabsContent>
      
      <TabsContent value="documents">
        <FundDocumentsTab fund={fund} />
      </TabsContent>
    </Tabs>
  );
};

export default FundTabsSection;
