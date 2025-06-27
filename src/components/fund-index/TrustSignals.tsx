
import React, { useEffect } from 'react';
import { Users, Briefcase, Linkedin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';

const TrustSignals: React.FC = () => {
  useEffect(() => {
    // Create Person schemas for authors
    const authorsSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Fund Index Authors',
      'description': 'Professional team behind the Golden Visa Fund Index',
      'itemListElement': [
        {
          '@type': 'ListItem',
          'position': 1,
          'item': {
            '@type': 'Person',
            'name': 'Dean Fankhauser',
            'jobTitle': 'CEO',
            'description': 'Created and designed this comprehensive fund index to help investors make informed decisions about Golden Visa investment opportunities.',
            'worksFor': {
              '@type': 'Organization',
              'name': 'Movingto',
              'url': 'https://movingto.com'
            },
            'sameAs': 'https://www.linkedin.com/in/deanfankhauser/',
            'image': 'https://media.licdn.com/dms/image/v2/D4D03AQGgefb70xI_jQ/profile-displayphoto-shrink_400_400/B4DZWiqmgTHIAk-/0/1742190832011?e=1756339200&v=beta&t=9RZf7wDSUtYygvqQSQVOnqz-pFLVr57Vrj0LHNMLSyI',
            'knowsAbout': [
              'Golden Visa Investment',
              'Portuguese Residency',
              'Investment Fund Analysis',
              'Financial Technology'
            ],
            'alumniOf': {
              '@type': 'Organization',
              'name': 'Business School'
            }
          }
        },
        {
          '@type': 'ListItem',
          'position': 2,
          'item': {
            '@type': 'Person',
            'name': 'Anna Luisa Lacerda',
            'jobTitle': 'Licensed Portuguese Lawyer',
            'description': 'Conducted comprehensive due diligence on all funds included in this index, ensuring regulatory compliance and accuracy of information.',
            'worksFor': {
              '@type': 'Organization',
              'name': 'Movingto',
              'url': 'https://movingto.com'
            },
            'sameAs': 'https://www.linkedin.com/in/annaluisalmb/',
            'image': 'https://media.licdn.com/dms/image/v2/D4D03AQF5SIWptiK7qA/profile-displayphoto-shrink_400_400/B4DZXbzj9pG4Ak-/0/1743149482206?e=1756339200&v=beta&t=g5d5b_pY2vd_ehQFqWmu8RPOK4IZDCP72ZY14wKYQ88',
            'knowsAbout': [
              'Portuguese Law',
              'Golden Visa Regulation',
              'Investment Fund Compliance',
              'Legal Due Diligence'
            ],
            'hasCredential': {
              '@type': 'EducationalOccupationalCredential',
              'name': 'Portuguese Bar License',
              'credentialCategory': 'Law License'
            }
          }
        }
      ]
    };

    // Create Review schema for the fund analysis process
    const reviewSchema = {
      '@context': 'https://schema.org',
      '@type': 'Review',
      'name': 'Professional Fund Index Analysis',
      'description': 'Comprehensive professional review and analysis of Golden Visa investment funds',
      'author': [
        {
          '@type': 'Person',
          'name': 'Dean Fankhauser'
        },
        {
          '@type': 'Person',
          'name': 'Anna Luisa Lacerda'
        }
      ],
      'datePublished': '2025-01-01',
      'dateModified': new Date().toISOString(),
      'reviewAspect': [
        'Fund Performance Analysis',
        'Regulatory Compliance Review',
        'Fee Structure Assessment',
        'Investor Protection Evaluation'
      ],
      'positiveNotes': [
        'Comprehensive due diligence process',
        'Regular updates and monitoring',
        'Professional legal review',
        'Transparent methodology'
      ]
    };

    // Remove existing schemas
    const existingAuthors = document.querySelector('script[data-schema="trust-signals-authors"]');
    const existingReview = document.querySelector('script[data-schema="trust-signals-review"]');
    if (existingAuthors) existingAuthors.remove();
    if (existingReview) existingReview.remove();

    // Add new schemas
    const authorsScript = document.createElement('script');
    authorsScript.type = 'application/ld+json';
    authorsScript.setAttribute('data-schema', 'trust-signals-authors');
    authorsScript.textContent = JSON.stringify(authorsSchema);
    document.head.appendChild(authorsScript);

    const reviewScript = document.createElement('script');
    reviewScript.type = 'application/ld+json';
    reviewScript.setAttribute('data-schema', 'trust-signals-review');
    reviewScript.textContent = JSON.stringify(reviewSchema);
    document.head.appendChild(reviewScript);

    // Cleanup
    return () => {
      const authorsCleanup = document.querySelector('script[data-schema="trust-signals-authors"]');
      const reviewCleanup = document.querySelector('script[data-schema="trust-signals-review"]');
      if (authorsCleanup) authorsCleanup.remove();
      if (reviewCleanup) reviewCleanup.remove();
    };
  }, []);

  return (
    <Card itemScope itemType="https://schema.org/AboutPage">
      <CardHeader>
        <CardTitle className="flex items-center gap-2" itemProp="name">
          <Users className="h-5 w-5 text-blue-500" />
          Index Created By
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6" itemProp="mainEntity" itemScope itemType="https://schema.org/ItemList">
        <div className="space-y-4">
          <div 
            className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg"
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
              <AvatarFallback className="bg-blue-100 text-blue-600">DF</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1" itemProp="name">Dean Fankhauser</h4>
                  <p className="text-sm text-blue-700 font-medium mb-2" itemProp="jobTitle">CEO of Movingto</p>
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
              <p className="text-sm text-gray-600" itemProp="description">
                Created and designed this comprehensive fund index to help investors make informed decisions about Golden Visa investment opportunities.
              </p>
            </div>
          </div>
          
          <div 
            className="flex items-start gap-4 p-4 bg-green-50 rounded-lg"
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
              <AvatarFallback className="bg-green-100 text-green-600">AL</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1" itemProp="name">Anna Luisa Lacerda</h4>
                  <p className="text-sm text-green-700 font-medium mb-2" itemProp="jobTitle">Licensed Portuguese Lawyer</p>
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
              <p className="text-sm text-gray-600" itemProp="description">
                Conducted comprehensive due diligence on all funds included in this index, ensuring regulatory compliance and accuracy of information.
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-xs text-gray-500 pt-4 border-t" itemScope itemType="https://schema.org/CreativeWork">
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
