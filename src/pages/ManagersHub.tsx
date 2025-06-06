
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
import { SEOService } from '../services/seoService';
import { URL_CONFIG } from '../utils/urlConfig';

const ManagersHub = () => {
  const managers = getAllFundManagers();
  const pageUrl = URL_CONFIG.buildUrl('managers');
  const title = 'Investment Fund Managers | Portugal Golden Visa Funds';
  const description = SEOService.optimizeMetaDescription(
    'Explore all fund managers offering Golden Visa eligible investment funds in Portugal. Compare different management companies and their investment strategies.',
    ['Golden Visa', 'Fund Managers', 'Portugal', 'Investment']
  );
  const socialImageUrl = 'https://pbs.twimg.com/profile_images/1763893053666768848/DnlafcQV_400x400.jpg';

  useEffect(() => {
    // Initialize comprehensive SEO setup
    SEOService.initializeSEO(pageUrl);

    // Generate enhanced structured data schemas
    const schemas = [
      // WebSite schema
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'Movingto',
        'url': URL_CONFIG.BASE_URL,
        'description': 'Find and compare the best Golden Visa investment funds in Portugal',
        'publisher': {
          '@type': 'Organization',
          'name': 'Movingto',
          'url': URL_CONFIG.BASE_URL
        },
        'potentialAction': {
          '@type': 'SearchAction',
          'target': `${URL_CONFIG.BASE_URL}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },

      // Organization schema
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'Movingto',
        'url': URL_CONFIG.BASE_URL,
        'logo': socialImageUrl,
        'description': 'Leading platform for Golden Visa investment fund comparison and research',
        'founder': {
          '@type': 'Person',
          'name': 'Dean Fankhauser'
        },
        'knowsAbout': ['Golden Visa', 'Portugal Investment', 'Investment Funds', 'Fund Managers'],
        'serviceArea': {
          '@type': 'Place',
          'name': 'Worldwide'
        }
      },

      // CollectionPage schema (enhanced)
      {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': pageUrl
        },
        'name': 'Golden Visa Fund Managers Directory',
        'description': description,
        'numberOfItems': managers.length,
        'author': {
          '@type': 'Person',
          'name': 'Dean Fankhauser',
          'jobTitle': 'CEO',
          'worksFor': {
            '@type': 'Organization',
            'name': 'Movingto'
          }
        },
        'publisher': {
          '@type': 'Organization',
          'name': 'Movingto',
          'url': URL_CONFIG.BASE_URL
        },
        'dateModified': new Date().toISOString(),
        'mainEntity': {
          '@type': 'ItemList',
          'numberOfItems': managers.length,
          'itemListElement': managers.map((manager, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'item': {
              '@type': 'Organization',
              'name': manager.name,
              'url': URL_CONFIG.buildManagerUrl(manager.name),
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
              'item': URL_CONFIG.BASE_URL
            },
            {
              '@type': 'ListItem',
              'position': 2,
              'name': 'Fund Managers',
              'item': pageUrl
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
  }, [managers.length, pageUrl, description]);

  return (
    <>
      <Helmet>
        {/* Basic Meta Tags */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="keywords" content="Golden Visa, Fund Managers, Portugal, Investment, Fund Management Companies" />
        <meta name="author" content="Dean Fankhauser, CEO" />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
        <link rel="canonical" href={pageUrl} />

        {/* Open Graph Meta Tags */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="Movingto" />
        <meta property="og:image" content={socialImageUrl} />
        <meta property="og:image:width" content="400" />
        <meta property="og:image:height" content="400" />
        <meta property="og:image:alt" content="Movingto - Golden Visa Investment Fund Managers" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter Card Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@movingtoio" />
        <meta name="twitter:creator" content="@movingtoio" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={socialImageUrl} />
        <meta name="twitter:image:alt" content="Movingto - Golden Visa Investment Fund Managers" />

        {/* Additional Meta Tags */}
        <meta name="theme-color" content="#EF4444" />
        <meta name="msapplication-TileColor" content="#EF4444" />
        <meta name="format-detection" content="telephone=no" />
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
