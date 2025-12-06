
import React from 'react';
import { Fund } from '../../data/types/funds';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, MapPin, DollarSign } from 'lucide-react';
import { isFundGVEligible } from '../../data/services/gv-eligibility-service';
import { getReturnTargetDisplay } from '../../utils/returnTarget';

interface FundManagerAboutProps {
  fund: Fund;
}

const FundManagerAbout: React.FC<FundManagerAboutProps> = ({ fund }) => {
  return (
    <Card className="border border-gray-100 shadow-sm">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <Link 
            to={`/${fund.id}`}
            className="text-xl font-bold text-foreground hover:text-primary transition-colors"
          >
            {fund.name}
          </Link>
          <Link 
            to={`/${fund.id}`}
            className="text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Established {fund.established}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2" />
            {fund.location}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <DollarSign className="w-4 h-4 mr-2" />
            €{fund.fundSize}M Fund Size
          </div>
        </div>

        <div className="mb-4">
          <Badge variant="outline" className="mr-2 mb-2">
            {fund.category}
          </Badge>
          <Badge 
            variant={fund.fundStatus === 'Open' ? 'default' : fund.fundStatus === 'Closing Soon' ? 'secondary' : 'destructive'}
            className="mr-2 mb-2"
          >
            {fund.fundStatus}
          </Badge>
          <Badge variant="outline">
            {getReturnTargetDisplay(fund)} Target Return
          </Badge>
        </div>

        <p className="text-gray-700 leading-relaxed mb-4">
          {fund.detailedDescription}
        </p>

        <div className="bg-slate-50 p-4 rounded-lg">
          <h4 className="font-semibold text-gray-900 mb-2">Investment Highlights</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• Minimum investment: €{fund.minimumInvestment.toLocaleString()}</li>
            <li>• Management fee: {fund.managementFee}% annually</li>
            <li>• Fund term: {fund.term} years</li>
            <li>• Regulated by: {fund.regulatedBy}</li>
            {isFundGVEligible(fund) && fund.isVerified && (
              <li>• ✅ Golden Visa eligible investment</li>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default FundManagerAbout;
