import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PageSEO from '../components/common/PageSEO';
import FundListItem from '../components/FundListItem';
import { useSavedFunds } from '../hooks/useSavedFunds';
import { useRealTimeFunds } from '../hooks/useRealTimeFunds';
import { useEnhancedAuth } from '../contexts/EnhancedAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { PageLoader } from '../components/common/LoadingSkeleton';

const SavedFunds = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useEnhancedAuth();
  const { savedFunds, loading: savedLoading } = useSavedFunds();
  const { getFundById, loading: fundsLoading } = useRealTimeFunds();

  // Redirect if not authenticated (wait for auth to finish)
  if (!authLoading && !user) {
    navigate('/auth');
    return null;
  }

  const loading = savedLoading || fundsLoading;

  // Get the actual fund objects for saved fund IDs
  const savedFundObjects = useMemo(() => {
    return savedFunds
      .map(saved => getFundById(saved.fund_id))
      .filter(fund => fund !== undefined);
  }, [savedFunds, getFundById]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO 
        pageType="category"
        categoryName="Saved Funds"
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
              Saved Funds
            </h1>
            <p className="text-base text-muted-foreground">
              {loading ? (
                'Loading your saved funds...'
              ) : (
                `${savedFundObjects.length} saved fund${savedFundObjects.length !== 1 ? 's' : ''}`
              )}
            </p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-muted/20 rounded-xl animate-pulse" />
              ))}
            </div>
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
                    <h3 className="text-2xl font-semibold text-foreground">No saved funds yet</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Start building your watchlist by saving funds that interest you. Click the "Save" button on any fund profile to add it here.
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