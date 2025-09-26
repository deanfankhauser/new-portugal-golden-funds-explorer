import React, { lazy, Suspense } from 'react';
import { Fund } from '../../data/funds';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, PieChart, Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load tab components
const FundOverviewTab = lazy(() => import('./tabs/FundOverviewTab'));
const FundStructureTab = lazy(() => import('./tabs/FundStructureTab'));
const FundTeamTab = lazy(() => import('./tabs/FundTeamTab'));


// Tab content loading skeleton
const TabContentSkeleton = () => (
  <div className="space-y-6 animate-fade-in">
    <div className="space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </div>
  </div>
);

interface FundTabsLazySectionProps {
  fund: Fund;
}

const FundTabsLazySection: React.FC<FundTabsLazySectionProps> = ({ fund }) => {
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
        <Suspense fallback={<TabContentSkeleton />}>
          <FundOverviewTab fund={fund} />
        </Suspense>
      </TabsContent>
      
      <TabsContent value="structure">
        <Suspense fallback={<TabContentSkeleton />}>
          <FundStructureTab fund={fund} />
        </Suspense>
      </TabsContent>
      
      <TabsContent value="team">
        <Suspense fallback={<TabContentSkeleton />}>
          <FundTeamTab fund={fund} />
        </Suspense>
      </TabsContent>
    </Tabs>
  );
};

export default FundTabsLazySection;