
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { funds } from '../data/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Card, CardContent } from "@/components/ui/card";
import { User, ChevronRight } from 'lucide-react';
import FundListItem from '@/components/FundListItem';
import { Helmet } from 'react-helmet';

const FundManager = () => {
  const { name } = useParams<{ name: string }>();
  
  // Decode the URL-encoded manager name
  const decodedManagerName = name ? decodeURIComponent(name) : '';
  
  // Find all funds managed by this manager
  const managerFunds = funds.filter(fund => 
    fund.managerName.toLowerCase() === decodedManagerName.toLowerCase()
  );
  
  // If no funds found, return an empty state
  if (managerFunds.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <Header />
        <main className="flex-1 py-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <h1 className="text-3xl font-bold mb-6">Fund Manager Not Found</h1>
            <p className="text-gray-600">
              We couldn't find a fund manager with the name "{decodedManagerName}".
            </p>
            <Link to="/" className="text-[#EF4444] hover:underline mt-4 inline-block">
              Return to homepage
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Helmet>
        <title>{managerFunds[0].managerName} Golden Visa Investment Funds</title>
        <meta name="description" content={`Discover the different Golden Visa Investment Funds managed by ${managerFunds[0].managerName} and compare with other funds.`} />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-6">
            <Link to="/" className="text-gray-600 hover:text-[#EF4444] transition-colors flex items-center gap-1 mb-4">
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to funds
            </Link>
          </div>
          
          <Card className="border border-gray-100 shadow-md mb-10">
            <CardContent className="p-6">
              <div className="flex items-center mb-5">
                <User className="w-6 h-6 mr-2 text-[#EF4444]" />
                <h1 className="text-3xl font-bold">{managerFunds[0].managerName}</h1>
              </div>
              
              <div className="bg-slate-50 p-5 rounded-lg border border-slate-100">
                {managerFunds[0].managerLogo && (
                  <img 
                    src={managerFunds[0].managerLogo} 
                    alt={managerFunds[0].managerName}
                    className="w-20 h-20 object-contain rounded-md shadow-sm border border-slate-100 bg-white p-2 mb-4"
                  />
                )}
                <p className="text-lg text-gray-600">
                  {managerFunds[0].managerName} manages {managerFunds.length} fund{managerFunds.length > 1 ? 's' : ''} with a combined 
                  size of {managerFunds.reduce((sum, fund) => sum + fund.fundSize, 0)} million EUR.
                </p>
              </div>
            </CardContent>
          </Card>
          
          <h2 className="text-2xl font-bold mb-6">Funds Managed by {managerFunds[0].managerName}</h2>
          
          <div className="space-y-4">
            {managerFunds.map(fund => (
              <FundListItem key={fund.id} fund={fund} />
            ))}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundManager;
