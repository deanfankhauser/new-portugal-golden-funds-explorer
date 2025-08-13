
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BarChart3, Shield, DollarSign, Users } from 'lucide-react';

const MethodologySection: React.FC = () => {
  useEffect(() => {
    // Create HowTo schema for fund selection methodology
    const howToSchema = {
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      'name': 'How to Evaluate Golden Visa Investment Funds',
      'description': 'Our comprehensive methodology for ranking and evaluating Golden Visa investment funds',
      'image': 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg',
      'totalTime': 'P30D',
      'estimatedCost': {
        '@type': 'MonetaryAmount',
        'currency': 'EUR',
        'value': '0'
      },
      'supply': [
        'Fund performance data',
        'Regulatory compliance records',
        'Fee structure analysis',
        'Investor protection measures'
      ],
      'tool': [
        'Financial analysis software',
        'Regulatory databases',
        'Legal compliance tools',
        'Performance tracking systems'
      ],
      'step': [
        {
          '@type': 'HowToStep',
          'position': 1,
          'name': 'Performance Analysis (40%)',
          'text': 'Evaluate fund performance metrics including returns, volatility, and consistency over time',
          'image': 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg'
        },
        {
          '@type': 'HowToStep',
          'position': 2,
          'name': 'Regulatory Quality Assessment (25%)',
          'text': 'Review regulatory compliance, licensing, and oversight by Portuguese authorities',
          'image': 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg'
        },
        {
          '@type': 'HowToStep',
          'position': 3,
          'name': 'Fee Structure Analysis (20%)',
          'text': 'Analyze management fees, performance fees, and other costs to determine value for investors',
          'image': 'https://pbs.twimg.com/profile_images/1763893053666766848/DnlafcQV_400x400.jpg'
        },
        {
          '@type': 'HowToStep',
          'position': 4,
          'name': 'Investor Protection Review (15%)',
          'text': 'Evaluate investor protection measures, transparency, and fund governance structures',
          'image': 'https://pbs.twimg.com/profile_images/1763893053666768/DnlafcQV_400x400.jpg'
        }
      ],
      'author': {
        '@type': 'Organization',
        'name': 'Movingto',
        'url': 'https://www.movingto.com'
      },
      'datePublished': '2025-01-01',
      'dateModified': new Date().toISOString()
    };

    // Create CreativeWork schema for the methodology
    const methodologySchema = {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      'name': 'Golden Visa Fund Ranking Methodology',
      'description': 'Comprehensive methodology for evaluating and ranking Golden Visa investment funds',
      'creator': {
        '@type': 'Organization',
        'name': 'Movingto'
      },
      'dateCreated': '2025-01-01',
      'dateModified': new Date().toISOString(),
      'license': 'https://creativecommons.org/licenses/by/4.0/',
      'inLanguage': 'en-US',
      'about': [
        'Investment Fund Analysis',
        'Golden Visa Compliance',
        'Financial Performance Evaluation',
        'Risk Assessment'
      ],
      'keywords': 'fund evaluation, investment analysis, Golden Visa, methodology, ranking criteria'
    };

    // Remove existing schemas
    const existingHowTo = document.querySelector('script[data-schema="methodology-howto"]');
    const existingMethodology = document.querySelector('script[data-schema="methodology-creative"]');
    if (existingHowTo) existingHowTo.remove();
    if (existingMethodology) existingMethodology.remove();

    // Add new schemas
    const howToScript = document.createElement('script');
    howToScript.type = 'application/ld+json';
    howToScript.setAttribute('data-schema', 'methodology-howto');
    howToScript.textContent = JSON.stringify(howToSchema);
    document.head.appendChild(howToScript);

    const methodologyScript = document.createElement('script');
    methodologyScript.type = 'application/ld+json';
    methodologyScript.setAttribute('data-schema', 'methodology-creative');
    methodologyScript.textContent = JSON.stringify(methodologySchema);
    document.head.appendChild(methodologyScript);

    // Cleanup
    return () => {
      const howToCleanup = document.querySelector('script[data-schema="methodology-howto"]');
      const methodologyCleanup = document.querySelector('script[data-schema="methodology-creative"]');
      if (howToCleanup) howToCleanup.remove();
      if (methodologyCleanup) methodologyCleanup.remove();
    };
  }, []);

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50" itemScope itemType="https://schema.org/HowTo">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-bold text-gray-900" itemProp="name">
          Our Ranking Methodology
        </CardTitle>
        <p className="text-gray-600 mt-2" itemProp="description">
          Our comprehensive methodology for evaluating and ranking Golden Visa investment funds
        </p>
        <meta itemProp="totalTime" content="P30D" />
        <meta itemProp="datePublished" content="2025-01-01" />
        <meta itemProp="dateModified" content={new Date().toISOString()} />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div 
            className="bg-blue-50 p-6 rounded-xl border border-blue-100"
            itemScope 
            itemType="https://schema.org/HowToStep"
            itemProp="step"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" itemProp="name">Performance (40%)</h3>
                <span className="text-sm text-blue-600 font-medium">Highest Weight</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed" itemProp="text">
              Evaluates fund performance metrics including returns, volatility, and consistency over time. 
              We analyze historical performance, risk-adjusted returns, and benchmark comparisons.
            </p>
            <meta itemProp="position" content="1" />
          </div>

          <div 
            className="bg-green-50 p-6 rounded-xl border border-green-100"
            itemScope 
            itemType="https://schema.org/HowToStep"
            itemProp="step"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-green-100 p-2 rounded-lg">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" itemProp="name">Regulatory Quality (25%)</h3>
                <span className="text-sm text-green-600 font-medium">Second Priority</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed" itemProp="text">
              Reviews regulatory compliance, licensing, and oversight by Portuguese authorities. 
              Includes assessment of fund registration, compliance history, and regulatory standing.
            </p>
            <meta itemProp="position" content="2" />
          </div>

          <div 
            className="bg-orange-50 p-6 rounded-xl border border-orange-100"
            itemScope 
            itemType="https://schema.org/HowToStep"
            itemProp="step"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-orange-100 p-2 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" itemProp="name">Fee Structure (20%)</h3>
                <span className="text-sm text-orange-600 font-medium">Cost Efficiency</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed" itemProp="text">
              Analyzes management fees, performance fees, and other costs to determine value for investors. 
              Compares fee structures across similar funds and assesses cost-effectiveness.
            </p>
            <meta itemProp="position" content="3" />
          </div>

          <div 
            className="bg-purple-50 p-6 rounded-xl border border-purple-100"
            itemScope 
            itemType="https://schema.org/HowToStep"
            itemProp="step"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="bg-purple-100 p-2 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900" itemProp="name">Investor Protection (15%)</h3>
                <span className="text-sm text-purple-600 font-medium">Safety Focus</span>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed" itemProp="text">
              Evaluates investor protection measures, transparency, and fund governance structures. 
              Reviews reporting standards, investor communication, and conflict of interest policies.
            </p>
            <meta itemProp="position" content="4" />
          </div>
        </div>

        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200" itemScope itemType="https://schema.org/PropertyValue">
          <h4 className="font-semibold text-gray-900 mb-3" itemProp="name">Scoring System</h4>
          <div className="space-y-2 text-sm text-gray-700" itemProp="value">
            <div className="flex justify-between">
              <span>Excellent (85-100):</span>
              <span className="font-medium text-green-600">Top-tier funds with outstanding metrics</span>
            </div>
            <div className="flex justify-between">
              <span>Very Good (70-84):</span>
              <span className="font-medium text-blue-600">Strong funds with solid performance</span>
            </div>
            <div className="flex justify-between">
              <span>Good (55-69):</span>
              <span className="font-medium text-yellow-600">Acceptable funds with room for improvement</span>
            </div>
            <div className="flex justify-between">
              <span>Fair (Below 55):</span>
              <span className="font-medium text-red-600">Funds requiring careful consideration</span>
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 pt-4 border-t">
          <p itemProp="disclaimer">
            Methodology updated regularly to reflect market changes and regulatory updates. 
            Scores are based on publicly available information and professional analysis.
          </p>
          <meta itemProp="license" content="https://creativecommons.org/licenses/by/4.0/" />
        </div>
      </CardContent>
    </Card>
  );
};

export default MethodologySection;
