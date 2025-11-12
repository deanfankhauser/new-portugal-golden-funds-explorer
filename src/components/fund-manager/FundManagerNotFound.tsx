
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import Header from '../Header';
import Footer from '../Footer';

interface FundManagerNotFoundProps {
  managerName: string;
}

const FundManagerNotFound: React.FC<FundManagerNotFoundProps> = ({ managerName }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-card rounded-lg shadow-sm border border-border/40 p-10 text-center max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold mb-3">Fund Manager Not Found</h1>
            <p className="text-muted-foreground mb-6">
              We couldn't find a fund manager with the name "{managerName}".
            </p>
            <Button
              onClick={() => navigate('/')}
              size="lg"
            >
              Browse All Funds
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FundManagerNotFound;
