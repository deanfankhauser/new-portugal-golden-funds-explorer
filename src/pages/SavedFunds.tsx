import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundListItem from '../components/FundListItem';
import { useSavedFunds } from '../hooks/useSavedFunds';
import { useAllFunds } from '../hooks/useFundsQuery';
import { useEnhancedAuth } from '../contexts/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import FundListSkeleton from '../components/common/FundListSkeleton';
import { isDevelopment } from '@/lib/environment';

const SavedFunds = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useEnhancedAuth();
  const { savedFunds, loading: savedLoading } = useSavedFunds();
  const { data: allFunds, isLoading: fundsLoading, isError, isFetching } = useAllFunds();

  // Redirect if not authenticated (wait for auth to finish) - skip in dev mode
  if (!authLoading && !user && !isDevelopment()) {
    navigate('/auth');
    return null;
  }

  // Show loading during any loading/error state (allows React Query retry)
  const loading = savedLoading || fundsLoading || isFetching || isError;

  // Get the actual fund objects for saved fund IDs
  const savedFundObjects = useMemo(() => {
    if (!allFunds) return [];
    return savedFunds
      .map(saved => allFunds.find(fund => fund.id === saved.fund_id))
      .filter(fund => fund !== undefined);
  }, [savedFunds, allFunds]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO 
        pageType="saved-funds"
      />
      
      <Header />
      
      <main className="flex-1 py-12 md:py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Back Button */}
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground -ml-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Funds</span>
            </Button>
          </div>

          {/* Header Section */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight mb-3">
              My Watchlist
            </h1>
            <p className="text-base text-muted-foreground mb-4">
              {loading ? (
                'Loading your watchlist...'
              ) : (
                `${savedFundObjects.length} fund${savedFundObjects.length !== 1 ? 's' : ''} in watchlist`
              )}
            </p>
            
            {/* Link to Main Hub */}
            <div>
              <a 
                href="https://www.movingto.com/portugal-golden-visa-funds" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-accent hover:text-accent/80 font-medium transition-colors"
              >
                Browse All Portugal Golden Visa Funds
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <FundListSkeleton count={3} />
          ) : savedFundObjects.length === 0 ? (
            <Card className="border border-border/40 rounded-2xl shadow-sm">
              <CardContent className="py-20 px-8 text-center">
                <div className="flex flex-col items-center space-y-5 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-full bg-muted/30 flex items-center justify-center">
                    <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold text-foreground">Your watchlist is empty</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Start building your watchlist by adding funds that interest you. Click the "Add to watchlist" button on any fund profile to add it here.
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate('/')}
                    size="lg"
                    className="mt-4"
                  >
                    Browse Funds
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {savedFundObjects.map((fund) => (
                <FundListItem key={fund.id} fund={fund} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default SavedFunds;