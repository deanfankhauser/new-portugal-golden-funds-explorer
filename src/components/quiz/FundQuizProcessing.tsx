
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Target, TrendingUp, Sparkles } from 'lucide-react';
import Header from '../Header';
import Footer from '../Footer';
import PageSEO from '../common/PageSEO';

const FundQuizProcessing = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <PageSEO pageType="fund-quiz" />
      
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
};

export default FundQuizProcessing;
