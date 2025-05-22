
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid } from "lucide-react";
import Footer from '../components/Footer';
import Header from '../components/Header';
import { cn } from "@/lib/utils";
import { getAllFundManagers, getFundsCountByManager, getTotalFundSizeByManager } from '../data/services/managers-service';

const ManagersHub = () => {
  const managers = getAllFundManagers();

  return (
    <>
      <Helmet>
        <title>Investment Fund Managers | Portugal Golden Visa Funds</title>
        <meta 
          name="description" 
          content="Explore all fund managers offering Golden Visa eligible investment funds in Portugal. Compare different management companies and their investment strategies." 
        />
      </Helmet>

      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Fund Managers</h1>
          <p className="text-gray-600">
            Explore all fund managers offering Golden Visa eligible investment funds in Portugal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {managers.map((manager) => {
            const fundsCount = getFundsCountByManager(manager.name);
            const totalFundSize = getTotalFundSizeByManager(manager.name);
            const managerSlug = manager.name.toLowerCase().replace(/\s+/g, '-');

            return (
              <Link 
                key={manager.name}
                to={`/manager/${encodeURIComponent(manager.name)}`}
                className="block hover:no-underline"
              >
                <Card className={cn(
                  "h-full transition-all hover:shadow-md",
                  "hover:border-primary/50"
                )}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Grid size={18} className="text-primary" />
                      <span>{manager.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Funds:</span>
                        <span className="font-medium">{fundsCount}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Total fund size:</span>
                        <span className="font-medium">€{totalFundSize} million</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ManagersHub;
