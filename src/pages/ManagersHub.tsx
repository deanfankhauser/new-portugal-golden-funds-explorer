
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Grid } from "lucide-react";
import Footer from '../components/Footer';
import Header from '../components/Header';
import { cn } from "@/lib/utils";
import { getAllFundManagers, getFundsCountByManager, getTotalFundSizeByManager } from '../data/services/managers-service';
import { StructuredDataService } from '../services/structuredDataService';

const ManagersHub = () => {
  const managers = getAllFundManagers();

  useEffect(() => {
    // Set page title for SEO
    document.title = 'Investment Fund Managers | Portugal Golden Visa Funds';
    
    // Set meta description for SEO
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Explore all fund managers offering Golden Visa eligible investment funds in Portugal. Compare different management companies and their investment strategies.'
      );
    }

    // Generate structured data schemas
    const schemas = [
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': 'https://portugalvisafunds.com/managers'
        },
        'name': 'Golden Visa Fund Managers Directory',
        'description': 'Explore all fund managers offering Golden Visa eligible investment funds in Portugal. Compare different management companies and their investment strategies.',
        'numberOfItems': managers.length,
        'mainEntity': {
          '@type': 'ItemList',
          'numberOfItems': managers.length,
          'itemListElement': managers.map((manager, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
              '@type': 'Organization',
              'name': manager.name,
              'url': `https://portugalvisafunds.com/manager/${encodeURIComponent(manager.name)}`,
              'logo': manager.logo,
              'serviceType': 'Investment Fund Management',
              'areaServed': {
                '@type': 'Place',
                'name': 'Portugal'
              },
              'additionalProperty': [
                {
                  '@type': 'PropertyValue',
                  'name': 'Number of Funds',
                  'value': getFundsCountByManager(manager.name)
                },
                {
                  '@type': 'PropertyValue',
                  'name': 'Total Fund Size',
                  'value': `${getTotalFundSizeByManager(manager.name)} Million EUR`
                }
              ]
            }
          }))
        },
        'breadcrumb': {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            {
              '@type': 'ListItem',
              'position': 1,
              'name': 'Home',
              'item': 'https://portugalvisafunds.com'
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Fund Managers',
              'item': 'https://portugalvisafunds.com/managers'
            }
          ]
        }
      }
    ];

    // Add structured data using our service
    StructuredDataService.addStructuredData(schemas, 'managers-hub');

    // Scroll to top on page load
    window.scrollTo(0, 0);

    // Cleanup function
    return () => {
      StructuredDataService.removeStructuredData('managers-hub');
    };
  }, [managers.length]);

  return (
    <>
      <Helmet>
        <title>Investment Fund Managers | Portugal Golden Visa Funds</title>
        <meta 
          name="description" 
          content="Explore all fund managers offering Golden Visa eligible investment funds in Portugal. Compare different management companies and their investment strategies." 
        />
      </Helmet>

      <Header />

      <main className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Fund Managers</h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Explore all fund managers offering Golden Visa eligible investment funds in Portugal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {managers.map((manager) => {
            const fundsCount = getFundsCountByManager(manager.name);
            const totalFundSize = getTotalFundSizeByManager(manager.name);

            return (
              <Link 
                key={manager.name}
                to={`/manager/${encodeURIComponent(manager.name)}`}
                className="block hover:no-underline"
              >
                <Card className={cn(
                  "h-full transition-all hover:shadow-md",
                  "hover:border-primary/50"
                )}>
                  <CardHeader className="pb-2 sm:pb-3">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Grid size={16} className="text-primary sm:w-[18px] sm:h-[18px]" />
                      <span className="text-sm sm:text-base">{manager.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-1">
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-500">Funds:</span>
                        <span className="font-medium">{fundsCount}</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm">
                        <span className="text-gray-500">Total fund size:</span>
                        <span className="font-medium">€{totalFundSize} million</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ManagersHub;
