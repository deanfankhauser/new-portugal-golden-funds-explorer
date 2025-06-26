
import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Calculator, Shield, TrendingUp, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

const MethodologySection: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-purple-500" />
          Index Methodology
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="space-y-4">
            <p className="text-gray-600">
              The Movingto Score is a comprehensive evaluation system that ranks Golden Visa investment funds 
              based on four key criteria. Our methodology provides investors with an objective, data-driven 
              assessment to help identify the most suitable investment opportunities.
            </p>
            
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {isOpen ? 'Hide' : 'Show'} Detailed Methodology
                {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Performance (40%)</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Evaluates target returns, historical performance, fund status, and growth potential.
                        Higher target returns and open fund status receive better scores.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Regulatory Quality (25%)</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Assesses regulatory oversight, compliance standards, and jurisdictional quality.
                        CMVM regulation, EU compliance, and UCITS eligibility boost scores.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="bg-red-100 p-2 rounded-lg">
                      <DollarSign className="h-5 w-5 text-red-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Fee Structure (20%)</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Analyzes management fees, performance fees, and total cost of ownership.
                        Lower fees result in higher scores, with bonuses for no-fee structures.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg">
                      <Shield className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Investor Protection (15%)</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Reviews liquidity, capital preservation measures, fund size stability, and manager experience.
                        Daily NAV, no lock-up periods, and established managers receive higher ratings.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">Scoring Scale</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-semibold text-green-600">85-100:</span>
                    <div className="text-gray-600">Excellent</div>
                  </div>
                  <div>
                    <span className="font-semibold text-blue-600">70-84:</span>
                    <div className="text-gray-600">Very Good</div>
                  </div>
                  <div>
                    <span className="font-semibold text-yellow-600">55-69:</span>
                    <div className="text-gray-600">Good</div>
                  </div>
                  <div>
                    <span className="font-semibold text-red-600">Below 55:</span>
                    <div className="text-gray-600">Fair</div>
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-500 italic">
                * Methodology updated January 2025. Scores are calculated based on publicly available information 
                and should be used as a starting point for investment research. Past performance does not guarantee future results.
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default MethodologySection;
