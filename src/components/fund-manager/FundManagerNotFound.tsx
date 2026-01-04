import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';
import Header from '../Header';
import Footer from '../Footer';
import PageSEO from '../common/PageSEO';

interface FundManagerNotFoundProps {
  managerName: string;
}

/**
 * FundManagerNotFound - Shown when a manager exists but has no funds
 * 
 * Uses positive messaging to avoid soft 404 signals while applying noindex
 * to prevent search engines from indexing thin content pages.
 */
const FundManagerNotFound: React.FC<FundManagerNotFoundProps> = ({ managerName }) => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted/20">
      {/* PageSEO with empty funds array triggers noindex */}
      <PageSEO pageType="manager" managerName={managerName} funds={[]} />
      <Header />
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-card rounded-lg shadow-sm border border-border/40 p-10 text-center max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold mb-3">
              {managerName} - Fund Manager
            </h1>
            <p className="text-muted-foreground mb-6">
              This manager profile is being updated with new fund listings. 
              Browse our complete list of verified fund managers and their active Portugal Golden Visa funds.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                onClick={() => navigate('/managers')}
                size="lg"
              >
                Browse All Managers
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                size="lg"
              >
                Browse All Funds
              </Button>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FundManagerNotFound;
