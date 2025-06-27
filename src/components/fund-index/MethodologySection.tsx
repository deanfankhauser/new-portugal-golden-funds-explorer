
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, Shield, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

const MethodologySection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl font-bold text-gray-900">
          <div className="bg-purple-100 p-2 rounded-xl">
            <Calculator className="h-6 w-6 text-purple-600" />
          </div>
          Index Methodology
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed text-base">
              The Movingto Score is a comprehensive evaluation system that ranks Golden Visa investment funds 
              based on four key criteria. Our methodology provides investors with an objective, data-driven 
              assessment to help identify the most suitable investment opportunities.
            </p>
            
            <CollapsibleTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full justify-between h-12 text-base font-medium border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200"
              >
                {isOpen ? 'Hide' : 'Show'} Detailed Methodology
                <div className="bg-gray-100 p-1 rounded-lg">
                  {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-3 rounded-xl flex-shrink-0">
                        <TrendingUp className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">Performance (40%)</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Evaluates target returns, historical performance, fund status, and growth potential.
                          Higher target returns and open fund status receive better scores.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-green-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-green-100 p-3 rounded-xl flex-shrink-0">
                        <Shield className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">Regulatory Quality (25%)</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Assesses regulatory oversight, compliance standards, and jurisdictional quality.
                          CMVM regulation, EU compliance, and UCITS eligibility boost scores.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-red-100 p-3 rounded-xl flex-shrink-0">
                        <DollarSign className="h-6 w-6 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">Fee Structure (20%)</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Analyzes management fees, performance fees, and total cost of ownership.
                          Lower fees result in higher scores, with bonuses for no-fee structures.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-xl border border-purple-100 shadow-sm hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-start gap-4">
                      <div className="bg-purple-100 p-3 rounded-xl flex-shrink-0">
                        <Shield className="h-6 w-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-2">Investor Protection (15%)</h3>
                        <p className="text-gray-600 leading-relaxed">
                          Reviews liquidity, capital preservation measures, fund size stability, and manager experience.
                          Daily NAV, no lock-up periods, and established managers receive higher ratings.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-xl text-gray-900 mb-6 text-center">Scoring Scale</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-white rounded-xl border border-green-200 shadow-sm">
                    <div className="font-bold text-2xl text-green-600 mb-2">85-100</div>
                    <div className="font-semibold text-green-800">Excellent</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                    <div className="font-bold text-2xl text-blue-600 mb-2">70-84</div>
                    <div className="font-semibold text-blue-800">Very Good</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-yellow-200 shadow-sm">
                    <div className="font-bold text-2xl text-yellow-600 mb-2">55-69</div>
                    <div className="font-semibold text-yellow-800">Good</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-xl border border-red-200 shadow-sm">
                    <div className="font-bold text-2xl text-red-600 mb-2">Below 55</div>
                    <div className="font-semibold text-red-800">Fair</div>
                  </div>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl">
                <p className="text-sm text-amber-800 italic leading-relaxed">
                  <strong>Disclaimer:</strong> Methodology updated January 2025. Scores are calculated based on publicly available information 
                  and should be used as a starting point for investment research. Past performance does not guarantee future results.
                </p>
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default MethodologySection;
