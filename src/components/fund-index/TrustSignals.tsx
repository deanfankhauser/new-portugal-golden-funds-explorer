
import React from 'react';
import { Users, Shield, Award, Star } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

const TrustSignals: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-500" />
          Why Trust Our Index
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">94%</div>
            <div className="text-sm text-gray-600">Success Rate</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">500+</div>
            <div className="text-sm text-gray-600">Clients Served</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-semibold text-gray-900">Client Testimonial</h4>
              <p className="text-sm text-gray-600 italic">
                "The Fund Index helped us identify the perfect investment for our Golden Visa application. 
                Clear, comprehensive, and incredibly valuable."
              </p>
              <div className="text-xs text-gray-500 mt-1">— Sarah M., UK Citizen</div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="outline" className="text-xs">
              <Award className="h-3 w-3 mr-1" />
              Regulatory Verified
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Star className="h-3 w-3 mr-1" />
              Expert Analysis
            </Badge>
            <Badge variant="outline" className="text-xs">
              <Shield className="h-3 w-3 mr-1" />
              Data Security
            </Badge>
          </div>
          
          <div className="text-xs text-gray-500 pt-2 border-t">
            All fund data is verified through official regulatory sources and updated monthly. 
            Our methodology is transparent and available for review.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustSignals;
