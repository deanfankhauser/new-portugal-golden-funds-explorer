import React from 'react';
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
import { Bookmark, ArrowLeft, Heart } from 'lucide-react';
import { PageLoader } from '../components/common/LoadingSkeleton';

const SavedFunds = () => {
  const navigate = useNavigate();
  const { user } = useEnhancedAuth();
  const { savedFunds, loading: savedLoading } = useSavedFunds();
  const { getFundById, loading: fundsLoading } = useRealTimeFunds();

  // Redirect if not authenticated
  if (!user && !savedLoading) {
    navigate('/investor-auth');
    return null;
  }

  const loading = savedLoading || fundsLoading;

  // Get the actual fund objects for saved fund IDs
  const savedFundObjects = savedFunds
    .map(saved => getFundById(saved.fund_id))
    .filter(fund => fund !== undefined);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageSEO 
        pageType="category"
        categoryName="Saved Funds"
      />
      
      <Header />
      
      <main className="flex-1 py-6 md:py-8">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Header Section */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Funds</span>
              </Button>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Saved Funds</h1>
                  <p className="text-muted-foreground">
                    {savedFundObjects.length} saved fund{savedFundObjects.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <PageLoader key={i} />
              ))}
            </div>
          ) : savedFundObjects.length === 0 ? (
            <Card className="border border-border">
              <CardContent className="py-16 px-8 text-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-muted rounded-full">
                    <Bookmark className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">No Saved Funds</h3>
                  <p className="text-muted-foreground max-w-md">
                    You haven't saved any funds yet. Browse funds and click the heart icon to save them here.
                  </p>
                  <Button
                    onClick={() => navigate('/')}
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