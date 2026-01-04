
import React from 'react';
import { Fund } from '../../data/types/funds';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PieChart, Users } from 'lucide-react';
import FundOverviewTab from './tabs/FundOverviewTab';
import FundStructureTab from './tabs/FundStructureTab';
import FundTeamTab from './tabs/FundTeamTab';


interface FundTabsSectionProps {
  fund: Fund;
}

const FundTabsSection: React.FC<FundTabsSectionProps> = ({ fund }) => {
  return (
    <Tabs defaultValue="overview" className="w-full animate-fade-in">
      <TabsList className="grid w-full grid-cols-3 mb-6 md:mb-8 h-auto">
        <TabsTrigger value="overview" className="text-xs sm:text-sm md:text-base px-2 py-2 md:py-3">
          <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Overview</span>
          <span className="sm:hidden">Info</span>
        </TabsTrigger>
        <TabsTrigger value="structure" className="text-xs sm:text-sm md:text-base px-2 py-2 md:py-3">
          <PieChart className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          <span className="hidden sm:inline">Structure</span>
          <span className="sm:hidden">Data</span>
        </TabsTrigger>
        <TabsTrigger value="team" className="text-xs sm:text-sm md:text-base px-2 py-2 md:py-3">
          <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
          Team
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
    </Tabs>
  );
};

export default FundTabsSection;
