
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BarChart3, ExternalLink, Star, TrendingUp } from 'lucide-react';
import { buildContactUrl, openExternalLink } from "../../utils/urlHelpers";

const ComparisonUpgradeCTA: React.FC = () => {
  const handleUpgradeClick = () => {
    // Comparison upgrade CTA clicked
    openExternalLink(buildContactUrl('comparison-upgrade-cta'));
  };

  return (
    <Card className="border-2 border-[#EF4444]/20 bg-gradient-to-r from-[#EF4444]/5 to-[#DC2626]/5">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="bg-[#EF4444] p-2 rounded-lg">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-800 mb-2">
              Want Advanced Fund Comparison?
            </h4>
            <p className="text-gray-600 text-sm mb-3">
              Get access to detailed performance analytics, risk assessments, and side-by-side fund analysis tools
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-full border">
                <Star className="h-3 w-3 text-[#EF4444]" />
                Historical Performance
              </span>
              <span className="inline-flex items-center gap-1 text-xs bg-white px-2 py-1 rounded-full border">
                <TrendingUp className="h-3 w-3 text-[#EF4444]" />
                Risk Analysis
              </span>
            </div>
            <Button 
              size="sm"
              className="bg-[#EF4444] hover:bg-[#DC2626] text-white"
              onClick={handleUpgradeClick}
            >
              Upgrade to Premium
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ComparisonUpgradeCTA;
