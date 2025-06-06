import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuizForm, { QuizFormData } from '../components/quiz/QuizForm';
import QuizResults from '../components/quiz/QuizResults';
import { getRecommendations } from '../utils/quizRecommendationEngine';
import { Fund } from '../data/types/funds';
import { Helmet } from 'react-helmet';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardCheck, Sparkles, Target, TrendingUp } from 'lucide-react';
import { analytics } from '../utils/analytics';
import { StructuredDataService } from '../services/structuredDataService';
import { EnhancedStructuredDataService } from '../services/enhancedStructuredDataService';
import { SEOService } from '../services/seoService';
import { URL_CONFIG } from '../utils/urlConfig';

const FundQuiz = () => {
  const [recommendations, setRecommendations] = useState<(Fund & { score: number })[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const currentUrl = `${URL_CONFIG.BASE_URL}/fund-quiz`;
    
    // Initialize comprehensive SEO
    SEOService.initializeSEO(currentUrl);

    // Generate structured data schemas
    const schemas = [
      // Quiz/Assessment schema
      {
        '@context': 'https://schema.org',
        '@type': 'Quiz',
        'name': 'Fund Recommendation Quiz',
        'description': 'Personalized Portugal Golden Visa fund recommendations based on your investment profile',
        'url': currentUrl,
        'educationalLevel': 'Advanced',
        'about': {
          '@type': 'Thing',
          'name': 'Portugal Golden Visa Investment Funds'
        },
        'provider': {
          '@type': 'Organization',
          'name': 'Movingto'
        }
      },
      // WebApplication schema
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Golden Visa Fund Recommendation Quiz',
        'description': 'Get personalized Portugal Golden Visa fund recommendations tailored to your profile',
        'url': currentUrl,
        'applicationCategory': 'Investment Assessment Tool',
        'operatingSystem': 'Web Browser',
        'provider': {
          '@type': 'Organization',
          'name': 'Movingto'
        }
      },
      // FAQ schema for quiz questions
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How does the fund recommendation quiz work?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'Our quiz analyzes your risk appetite, investment timeline, budget, and citizenship to recommend the most suitable Portugal Golden Visa funds.'
            }
          },
          {
            '@type': 'Question',
            'name': 'How many fund recommendations will I receive?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'You will receive up to 5 personalized fund recommendations ranked by compatibility with your investment profile.'
            }
          }
        ]
      },
      // Add enhanced schemas
      EnhancedStructuredDataService.generateWebSiteSchema(),
      EnhancedStructuredDataService.generateOrganizationSchema()
    ];

    StructuredDataService.addStructuredData(schemas, 'fund-quiz');

    return () => {
      StructuredDataService.removeStructuredData('fund-quiz');
    };
  }, []);

  const onSubmit = async (data: QuizFormData) => {
    setIsProcessing(true);
    
    // Track quiz start
    analytics.trackEvent('quiz_start', {
      risk_appetite: data.riskAppetite,
      ticket_size: data.ticketSize,
      investment_horizon: data.investmentHorizon
    });
    
    // Add a small delay to show processing state
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const recommendations = getRecommendations(data);
    setRecommendations(recommendations);
    setShowResults(true);
    setIsProcessing(false);

    // Track quiz completion
    analytics.trackQuizCompletion(
      recommendations.map(r => r.name),
      {
        riskTolerance: data.riskAppetite,
        investmentAmount: data.ticketSize,
        investmentHorizon: data.investmentHorizon
      }
    );
  };

  const resetQuiz = () => {
    setShowResults(false);
    setRecommendations([]);
    setIsProcessing(false);
    
    // Track quiz reset
    analytics.trackEvent('quiz_reset');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const fallbackImage = 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg';
  const currentUrl = `${URL_CONFIG.BASE_URL}/fund-quiz`;
  const optimizedTitle = 'Fund Recommendation Quiz | Get Personalized Golden Visa Fund Matches | Movingto';
  const optimizedDescription = 'Take our investor profile quiz to get personalized Portugal Golden Visa fund recommendations based on your risk appetite and investment goals.';

  if (isProcessing) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Helmet>
          <title>Processing Your Results | Portugal Golden Visa Investment Funds</title>
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>
        
        <Header />
        
        <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center py-10 sm:py-12">
              <CardContent>
                <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mx-auto mb-4 sm:mb-6"></div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3 sm:mb-4">Analyzing Your Investment Profile</h2>
                <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base px-2 sm:px-0">
                  We're matching your preferences with our database of Portugal Golden Visa funds...
                </p>
                <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <Target className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Evaluating risk compatibility</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Calculating potential returns</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>Generating personalized recommendations</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Helmet>
        <title>{optimizedTitle}</title>
        <meta name="description" content={optimizedDescription} />
        <meta name="author" content="Dean Fankhauser, CEO" />
        <meta name="robots" content="index, follow, max-image-preview:large" />
        
        {/* Canonical URL */}
        <link rel="canonical" href={currentUrl} />
        
        {/* Open Graph meta tags */}
        <meta property="og:title" content={optimizedTitle} />
        <meta property="og:description" content={optimizedDescription} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={currentUrl} />
        <meta property="og:image" content={fallbackImage} />
        <meta property="og:site_name" content="Movingto Portugal Golden Visa Funds" />
        
        {/* Twitter Card meta tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@movingtoio" />
        <meta name="twitter:title" content={optimizedTitle} />
        <meta name="twitter:description" content={optimizedDescription} />
        <meta name="twitter:image" content={fallbackImage} />
      </Helmet>
      
      <Header />
      
      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 flex-1">
        <div className="max-w-5xl mx-auto">
          {!showResults ? (
            <>
              <div className="text-center mb-10 sm:mb-12">
                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="p-3 sm:p-4 bg-blue-100 rounded-full">
                    <ClipboardCheck className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
                  </div>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4 text-gray-800 px-2 sm:px-0">
                  Fund Recommendation Quiz
                </h1>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-0">
                  Get personalized Portugal Golden Visa fund recommendations tailored to your investment profile, 
                  risk tolerance, and financial goals in just a few minutes.
                </p>
              </div>

              {/* Benefits Cards */}
              <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-10 sm:mb-12">
                <Card className="text-center p-4 sm:p-6">
                  <Target className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Personalized Matching</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Our algorithm matches funds based on your specific risk profile and investment goals
                  </p>
                </Card>
                <Card className="text-center p-4 sm:p-6">
                  <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Optimized Returns</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    Find funds that offer the best potential returns within your comfort zone
                  </p>
                </Card>
                <Card className="text-center p-4 sm:p-6">
                  <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">Expert Curation</h3>
                  <p className="text-xs sm:text-sm text-gray-600">
                    All recommendations come from our carefully vetted portfolio of Golden Visa funds
                  </p>
                </Card>
              </div>

              <QuizForm onSubmit={onSubmit} />
            </>
          ) : (
            <QuizResults 
              recommendations={recommendations} 
              onResetQuiz={resetQuiz} 
              formatCurrency={formatCurrency}
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default FundQuiz;
