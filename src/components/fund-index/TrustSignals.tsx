
import React from 'react';
import { Users, Briefcase, Linkedin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';

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
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage 
                src="https://media.licdn.com/dms/image/v2/D4D03AQGgefb70xI_jQ/profile-displayphoto-shrink_400_400/B4DZWiqmgTHIAk-/0/1742190832011?e=1756339200&v=beta&t=9RZf7wDSUtYygvqQSQVOnqz-pFLVr57Vrj0LHNMLSyI"
                alt="Dean Fankhauser"
              />
              <AvatarFallback className="bg-blue-100 text-blue-600">DF</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Dean Fankhauser</h4>
                  <p className="text-sm text-blue-700 font-medium mb-2">CEO of Movingto</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="ml-2"
                >
                  <a 
                    href="https://www.linkedin.com/in/deanfankhauser/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
              </div>
              <p className="text-sm text-gray-600">
                Created and designed this comprehensive fund index to help investors make informed decisions about Golden Visa investment opportunities.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage 
                src="https://media.licdn.com/dms/image/v2/D4D03AQF5SIWptiK7qA/profile-displayphoto-shrink_400_400/B4DZXbzj9pG4Ak-/0/1743149482206?e=1756339200&v=beta&t=g5d5b_pY2vd_ehQFqWmu8RPOK4IZDCP72ZY14wKYQ88"
                alt="Anna Luisa Lacerda"
              />
              <AvatarFallback className="bg-green-100 text-green-600">AL</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Anna Luisa Lacerda</h4>
                  <p className="text-sm text-green-700 font-medium mb-2">Licensed Portuguese Lawyer</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="ml-2"
                >
                  <a 
                    href="https://www.linkedin.com/in/annaluisalmb/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
              </div>
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
