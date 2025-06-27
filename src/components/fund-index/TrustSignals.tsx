
import React from 'react';
import { Users, Briefcase } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const TrustSignals: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5 text-blue-500" />
          Index Created By
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
            <div className="bg-blue-100 p-3 rounded-full flex-shrink-0">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Dean Fankhauser</h4>
              <p className="text-sm text-blue-700 font-medium mb-2">CEO of Movingto</p>
              <p className="text-sm text-gray-600">
                Created and designed this comprehensive fund index to help investors make informed decisions about Golden Visa investment opportunities.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
            <div className="bg-green-100 p-3 rounded-full flex-shrink-0">
              <Briefcase className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">Anna Luisa Lacerda</h4>
              <p className="text-sm text-green-700 font-medium mb-2">Licensed Portuguese Lawyer</p>
              <p className="text-sm text-gray-600">
                Conducted comprehensive due diligence on all funds included in this index, ensuring regulatory compliance and accuracy of information.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 pt-4 border-t">
          All fund data has been professionally reviewed and verified through official regulatory sources. 
          The index is updated regularly to maintain accuracy and relevance.
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustSignals;
