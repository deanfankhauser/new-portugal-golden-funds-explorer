
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FundScore } from '../../services/fundScoringService';
import { getFundById } from '../../data/funds';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';

interface TopFiveFundsProps {
  scores: FundScore[];
}

const TopFiveFunds: React.FC<TopFiveFundsProps> = ({ scores }) => {
  useEffect(() => {
    // Create comprehensive structured data for top 5 funds
    const topFundsSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      'name': 'Top 5 Golden Visa Investment Funds 2025',
      'description': 'The highest-rated Golden Visa investment funds in Portugal, ranked by comprehensive scoring methodology',
      'numberOfItems': scores.length,
      'itemListOrder': 'Descending',
      'dateModified': new Date().toISOString(),
      'author': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://www.movingto.com'
      },
      'itemListElement': scores.map((score, index) => {
        const fund = getFundById(score.fundId);
        if (!fund) return null;
        
        return {
          '@type': 'ListItem',
          'position': index + 1,
          'item': {
            '@type': 'FinancialProduct',
            'name': fund.name,
            'description': fund.description,
            'category': fund.category,
            'identifier': fund.id,
            'url': `https://funds.movingto.com/${fund.id}`,
            'aggregateRating': {
              '@type': 'AggregateRating',
              'ratingValue': score.movingtoScore,
              'bestRating': 100,
              'worstRating': 0,
              'ratingCount': 1,
              'reviewCount': 1
            },
            'offers': {
              '@type': 'Offer',
              'price': fund.minimumInvestment,
              'priceCurrency': 'EUR',
              'availability': fund.fundStatus === 'Open' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'
            },
            'provider': {
              '@type': 'Organization',
              'name': fund.managerName,
              'url': fund.websiteUrl
            },
            'additionalProperty': [
              {
                '@type': 'PropertyValue',
                'name': 'Management Fee',
                'value': `${fund.managementFee}%`
              },
              {
                '@type': 'PropertyValue',
                'name': 'Performance Score',
                'value': score.performanceScore
              },
              {
                '@type': 'PropertyValue',
                'name': 'Movingto Score',
                'value': score.movingtoScore
              }
            ]
          }
        };
      }).filter(Boolean)
    };

    // Add table schema for the top funds display
    const tableSchema = {
      '@context': 'https://schema.org',
      '@type': 'Table',
      'name': 'Top 5 Golden Visa Funds Comparison',
      'description': 'Comparison table of the top 5 Golden Visa investment funds with scores and key metrics',
      'about': 'Portugal Golden Visa Investment Funds',
      'caption': 'Rankings updated monthly based on performance, regulation compliance, and fee analysis'
    };

    // Remove existing schemas
    const existingTopFunds = document.querySelector('script[data-schema="top-five-funds"]');
    const existingTable = document.querySelector('script[data-schema="top-five-table"]');
    if (existingTopFunds) existingTopFunds.remove();
    if (existingTable) existingTable.remove();

    // Add new schemas
    const topFundsScript = document.createElement('script');
    topFundsScript.type = 'application/ld+json';
    topFundsScript.setAttribute('data-schema', 'top-five-funds');
    topFundsScript.textContent = JSON.stringify(topFundsSchema);
    document.head.appendChild(topFundsScript);

    const tableScript = document.createElement('script');
    tableScript.type = 'application/ld+json';
    tableScript.setAttribute('data-schema', 'top-five-table');
    tableScript.textContent = JSON.stringify(tableSchema);
    document.head.appendChild(tableScript);

    // Cleanup
    return () => {
      const topFundsCleanup = document.querySelector('script[data-schema="top-five-funds"]');
      const tableCleanup = document.querySelector('script[data-schema="top-five-table"]');
      if (topFundsCleanup) topFundsCleanup.remove();
      if (tableCleanup) tableCleanup.remove();
    };
  }, [scores]);

  return (
    <section 
      id="top-five" 
      itemScope 
      itemType="https://schema.org/Table"
      aria-labelledby="top-five-title"
    >
      <Card className="border border-gray-200 bg-white">
        <CardHeader className="border-b border-gray-200 bg-white">
          <CardTitle 
            id="top-five-title"
            className="text-xl font-semibold text-gray-900"
            itemProp="name"
          >
            Top 5 Funds
          </CardTitle>
          <p 
            className="text-sm text-gray-600 mt-1"
            itemProp="description"
          >
            Ranked by comprehensive scoring methodology
          </p>
        </CardHeader>
        <CardContent className="p-0" itemProp="mainEntity" itemScope itemType="https://schema.org/ItemList">
          <div className="divide-y divide-gray-200">
            {scores.map((score, index) => {
              const fund = getFundById(score.fundId);
              if (!fund) return null;

              return (
                <article 
                  key={score.fundId} 
                  className="p-6 hover:bg-gray-50 transition-colors"
                  itemScope 
                  itemType="https://schema.org/FinancialProduct"
                  itemProp="itemListElement"
                >
                  <meta itemProp="position" content={(index + 1).toString()} />
                  <meta itemProp="identifier" content={fund.id} />
                  <meta itemProp="category" content={fund.category} />
                  
                  <div className="flex items-center justify-between gap-6">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div className="flex-1 min-w-0">
                        <h3 
                          className="text-lg font-medium text-gray-900 truncate mb-1"
                          itemProp="name"
                        >
                          {fund.name}
                        </h3>
                        
                        <div className="flex items-center gap-6">
                          <div itemScope itemType="https://schema.org/AggregateRating">
                            <div 
                              className="text-xl font-semibold text-gray-900"
                              itemProp="ratingValue"
                            >
                              {score.movingtoScore}
                            </div>
                            <div className="text-xs text-gray-500">Score</div>
                            <meta itemProp="bestRating" content="100" />
                            <meta itemProp="worstRating" content="0" />
                            <meta itemProp="ratingCount" content="1" />
                          </div>
                          <div itemScope itemType="https://schema.org/PropertyValue">
                            <div 
                              className="text-lg font-medium text-gray-700"
                              itemProp="value"
                            >
                              {fund.managementFee}%
                            </div>
                            <div className="text-xs text-gray-500" itemProp="name">Mgmt Fee</div>
                          </div>
                        </div>
                        
                        <div itemScope itemType="https://schema.org/Offer">
                          <meta itemProp="price" content={fund.minimumInvestment.toString()} />
                          <meta itemProp="priceCurrency" content="EUR" />
                          <meta itemProp="availability" content={fund.fundStatus === 'Open' ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock'} />
                        </div>
                        
                        <div itemScope itemType="https://schema.org/Organization" itemProp="provider">
                          <meta itemProp="name" content={fund.managerName} />
                          <meta itemProp="url" content={fund.websiteUrl} />
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <Link 
                        to={`/${fund.id}`}
                        itemProp="url"
                      >
                        <Button className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
          
          <footer 
            className="p-6 border-t border-gray-200 bg-gray-50"
            itemProp="caption"
          >
            <p className="text-sm text-gray-600 text-center">
              Rankings updated monthly based on performance, regulation compliance, and fee analysis.
            </p>
          </footer>
        </CardContent>
      </Card>
    </section>
  );
};

export default TopFiveFunds;
