import React, { useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageSEO from '@/components/common/PageSEO';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { RotateCcw, Share2, Check, ArrowLeft, Edit } from 'lucide-react';
import FundListItem from '@/components/FundListItem';
import { QuizResultsSkeleton } from '@/components/quiz/QuizResultsSkeleton';
import { QuizNoResults } from '@/components/quiz/QuizNoResults';
import { useFundMatcherQuery, QuizAnswers as LegacyQuizAnswers } from '@/hooks/useFundMatcherQuery';
import { parseResultsParams, QuizAnswers } from '@/hooks/useQuizState';
import { useToast } from '@/hooks/use-toast';
import { trackQuizEventExtended } from '@/services/quizAnalyticsExtended';

// Map from URL params to legacy format for the existing query hook
function toLegacyAnswers(answers: QuizAnswers): LegacyQuizAnswers {
  const legacy: LegacyQuizAnswers = {};
  
  if (answers.risk) {
    legacy.riskTolerance = answers.risk;
  }
  
  if (answers.min) {
    const budgetMap: Record<string, LegacyQuizAnswers['budget']> = {
      '100k': 'under250k',
      '250k': 'under500k',
      '500k': '500k+',
      '500k+': '500k+',
    };
    legacy.budget = budgetMap[answers.min];
  }
  
  if (answers.timeline) {
    const timelineMap: Record<string, LegacyQuizAnswers['timeline']> = {
      '5yr': '3-5years',
      '6yr': '5plus',
      '8yr': '5plus',
      '10yr+': '5plus',
    };
    legacy.timeline = timelineMap[answers.timeline];
  }
  
  if (answers.income) {
    legacy.income = answers.income;
  }
  
  if (answers.risk === 'conservative') {
    legacy.strategy = 'safety';
  } else if (answers.risk === 'aggressive') {
    legacy.strategy = 'growth';
  } else if (answers.timeline === '5yr' || answers.timeline === '6yr') {
    legacy.strategy = 'fast_exit';
  } else {
    legacy.strategy = 'growth'; // Default to growth for moderate
  }
  
  return legacy;
}

const getAnswerLabel = (key: string, value: string): string => {
  const labels: Record<string, Record<string, string>> = {
    risk: {
      'conservative': 'Conservative',
      'moderate': 'Moderate',
      'aggressive': 'Aggressive'
    },
    min: {
      '100k': '€100K–€250K',
      '250k': '€250K–€500K',
      '500k': '€500K+',
      '500k+': '€500K+'
    },
    timeline: {
      '5yr': '5 years',
      '6yr': '6 years',
      '8yr': '8+ years',
      '10yr+': '10+ years'
    },
    nat: {
      'us': 'United States',
      'uk': 'United Kingdom',
      'eu': 'European Union',
      'other': 'Other'
    },
    income: {
      'yes': 'Yes, need distributions',
      'no': 'No, prefer accumulation'
    }
  };
  return labels[key]?.[value] || value;
};

const FundMatcherResults: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);
  
  const answers = useMemo(() => parseResultsParams(searchParams), [searchParams]);
  const legacyAnswers = useMemo(() => toLegacyAnswers(answers), [answers]);
  
  // Check if we have enough answers to run the query
  const hasAllAnswers = Object.keys(legacyAnswers).length >= 5;
  
  const { data: matchedFunds, isLoading, isFetched } = useFundMatcherQuery(
    hasAllAnswers ? legacyAnswers : ({} as LegacyQuizAnswers)
  );

  // Track result view
  useEffect(() => {
    if (isFetched && matchedFunds) {
      trackQuizEventExtended('quiz_result_view', {
        answers: legacyAnswers,
        resultsCount: matchedFunds.length,
      });
    }
  }, [isFetched, matchedFunds, legacyAnswers]);

  const handleShare = async () => {
    const shareUrl = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Portugal Golden Visa Fund Matches',
          text: `I found ${matchedFunds?.length || 0} matching funds using the Fund Matcher`,
          url: shareUrl,
        });
        trackQuizEventExtended('quiz_share', { answers: legacyAnswers, resultsCount: matchedFunds?.length });
        return;
      } catch (err) {
        // Fall through to clipboard
      }
    }
    
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Share this link to show your quiz results",
      });
      trackQuizEventExtended('quiz_share', { answers: legacyAnswers, resultsCount: matchedFunds?.length });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy link",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleRetake = () => {
    trackQuizEventExtended('quiz_retake', { answers: legacyAnswers });
  };

  // If no answers, redirect to quiz
  if (!hasAllAnswers && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <PageSEO pageType="fund-matcher-results" />
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">Complete the Quiz First</h1>
            <p className="text-muted-foreground mb-6">
              Take our 2-minute quiz to get personalized fund recommendations.
            </p>
            <Button asChild>
              <Link to="/fund-matcher">
                Start Fund Matcher Quiz
              </Link>
            </Button>
          </Card>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PageSEO pageType="fund-matcher-results" fundsCount={matchedFunds?.length || 0} />
      <Header />
      
      <main className="container mx-auto px-4 py-8 md:py-12">
        {/* Back Link */}
        <Link 
          to="/fund-matcher" 
          className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors"
          onClick={handleRetake}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Fund Matcher
        </Link>

        {isLoading ? (
          <QuizResultsSkeleton />
        ) : matchedFunds && matchedFunds.length > 0 ? (
          <div className="space-y-8">
            {/* Preferences Summary */}
            <Card className="p-6 bg-muted/30">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Your Preferences
                </h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                >
                  <Link to="/fund-matcher">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Preferences
                  </Link>
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {Object.entries(answers).map(([key, value]) => value && (
                  <div key={key}>
                    <p className="text-xs font-medium text-muted-foreground uppercase">
                      {key === 'nat' ? 'Nationality' : key === 'min' ? 'Budget' : key}
                    </p>
                    <p className="text-sm font-semibold mt-1">
                      {getAnswerLabel(key, value)}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Results Header */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold">
                We found {matchedFunds.length} matching fund{matchedFunds.length !== 1 ? 's' : ''}
              </h1>
              <p className="text-muted-foreground">
                Based on your preferences, here are the funds that match your criteria
              </p>
            </div>

            {/* Fund List */}
            <div className="grid gap-4">
              {matchedFunds.map((fund) => (
                <FundListItem key={fund.id} fund={fund} />
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t">
              <Button variant="outline" asChild onClick={handleRetake}>
                <Link to="/fund-matcher">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Start Over
                </Link>
              </Button>
              <Button variant="outline" onClick={handleShare}>
                {copied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Results
                  </>
                )}
              </Button>
              <Button asChild>
                <Link to="/">
                  View Full Directory
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <QuizNoResults 
            onReset={() => {}} 
            onClose={() => {}} 
            answers={legacyAnswers}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default FundMatcherResults;
