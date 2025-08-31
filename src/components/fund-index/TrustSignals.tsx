
import React, { useEffect } from 'react';
import { Users, Briefcase, Linkedin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';

const TrustSignals: React.FC = () => {
  // Remove component-level schema injection - ConsolidatedSEOService handles page-level schemas

  return (
    <Card itemScope itemType="https://schema.org/AboutPage">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" itemProp="name">
          <Users className="h-5 w-5 text-accent" />
          Index Created By
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6" itemProp="mainEntity" itemScope itemType="https://schema.org/ItemList">
        <div className="space-y-4">
          <div 
            className="flex items-start gap-4 p-4 bg-accent/5 rounded-lg"
            itemScope 
            itemType="https://schema.org/Person"
            itemProp="itemListElement"
          >
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage 
                src="https://media.licdn.com/dms/image/v2/D4D03AQGgefb70xI_jQ/profile-displayphoto-shrink_400_400/B4DZWiqmgTHIAk-/0/1742190832011?e=1756339200&v=beta&t=9RZf7wDSUtYygvqQSQVOnqz-pFLVr57Vrj0LHNMLSyI"
                alt="Dean Fankhauser"
                itemProp="image"
              />
              <AvatarFallback className="bg-accent/10 text-accent">DF</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-foreground mb-1" itemProp="name">Dean Fankhauser</h4>
                  <p className="text-sm text-accent font-medium mb-2" itemProp="jobTitle">CEO of Movingto</p>
                  <meta itemProp="worksFor" content="Movingto" />
                  <meta itemProp="sameAs" content="https://www.linkedin.com/in/deanfankhauser/" />
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
                    itemProp="sameAs"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground" itemProp="description">
                Created and designed this comprehensive fund index to help investors make informed decisions about Golden Visa investment opportunities.
              </p>
            </div>
          </div>
          
          <div 
            className="flex items-start gap-4 p-4 bg-success/5 rounded-lg"
            itemScope 
            itemType="https://schema.org/Person"
            itemProp="itemListElement"
          >
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage 
                src="https://media.licdn.com/dms/image/v2/D4D03AQF5SIWptiK7qA/profile-displayphoto-shrink_400_400/B4DZXbzj9pG4Ak-/0/1743149482206?e=1756339200&v=beta&t=g5d5b_pY2vd_ehQFqWmu8RPOK4IZDCP72ZY14wKYQ88"
                alt="Anna Luisa Lacerda"
                itemProp="image"
              />
              <AvatarFallback className="bg-success/10 text-success">AL</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-foreground mb-1" itemProp="name">Anna Luisa Lacerda</h4>
                  <p className="text-sm text-success font-medium mb-2" itemProp="jobTitle">Licensed Portuguese Lawyer</p>
                  <meta itemProp="worksFor" content="Movingto" />
                  <meta itemProp="sameAs" content="https://www.linkedin.com/in/annaluisalmb/" />
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
                    itemProp="sameAs"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                  </a>
                </Button>
              </div>
              <p className="text-sm text-muted-foreground" itemProp="description">
                Conducted comprehensive due diligence on all funds included in this index, ensuring regulatory compliance and accuracy of information.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-muted-foreground pt-4 border-t border-border" itemScope itemType="https://schema.org/CreativeWork">
          <span itemProp="text">
            All fund data has been professionally reviewed and verified through official regulatory sources. 
            The index is updated regularly to maintain accuracy and relevance.
          </span>
          <meta itemProp="dateModified" content={new Date().toISOString()} />
        </div>
      </CardContent>
    </Card>
  );
};

export default TrustSignals;
