
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid } from "lucide-react";
import { cn } from "@/lib/utils";
import { getFundsCountByManager, getTotalFundSizeByManager } from '../../data/services/managers-service';
import { managerToSlug } from '../../lib/utils';

interface ManagersListProps {
  managers: { name: string; logo?: string }[];
}

const ManagersList: React.FC<ManagersListProps> = ({ managers }) => {
  return (
    <section className="bg-card p-6 rounded-lg shadow-sm border border-border" aria-labelledby="managers-heading">
      <h2 id="managers-heading" className="text-2xl font-bold mb-6">Portugal Golden Visa Investment Fund Managers ({managers.length})</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {managers.map((manager) => {
          const fundsCount = getFundsCountByManager(manager.name);
          const totalFundSize = getTotalFundSizeByManager(manager.name);

          return (
            <Link 
              key={manager.name}
              to={`/manager/${managerToSlug(manager.name)}`}
              className="block hover:no-underline"
            >
              <Card className={cn(
                "h-full transition-all hover:shadow-md",
                "hover:border-primary/50"
              )}>
                <CardHeader className="pb-2 sm:pb-3">
                  <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    <Grid size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />
                    <span className="text-sm sm:text-base">{manager.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Funds:</span>
                      <span className="font-medium">{fundsCount}</span>
                    </div>
                    <div className="flex justify-between text-xs sm:text-sm">
                      <span className="text-muted-foreground">Total fund size:</span>
                      <span className="font-medium">€{totalFundSize} million</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
      
      <div className="mt-8 pt-4 border-t border-border">
        <p className="text-muted-foreground mb-4">
          Each fund manager brings unique expertise and investment strategies to the Portuguese market. Click on a manager to see all their funds and learn more about their approach.
        </p>
        <Link 
          to="/index" 
          className="text-primary hover:underline flex items-center"
        >
          Browse Portugal Golden Visa Investment Fund Index
        </Link>
      </div>
    </section>
  );
};

export default ManagersList;
