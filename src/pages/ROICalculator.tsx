
import React, { useState, useEffect } from 'react';
import { Fund } from '../data/types/funds';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ROICalculatorHeader from '../components/roi-calculator/ROICalculatorHeader';
import ROICalculatorForm from '../components/roi-calculator/ROICalculatorForm';
import ROICalculatorResults from '../components/roi-calculator/ROICalculatorResults';
import ROICalculatorEmailGate from '../components/roi-calculator/ROICalculatorEmailGate';
import { useAuth } from '@/contexts/AuthContext';
import { StructuredDataService } from '../services/structuredDataService';
import { EnhancedStructuredDataService } from '../services/enhancedStructuredDataService';
import { SEOService } from '../services/seoService';
import { URL_CONFIG } from '../utils/urlConfig';
import PageSEO from '../components/common/PageSEO';

const ROICalculatorPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [selectedFund, setSelectedFund] = useState<Fund | null>(null);
  const [results, setResults] = useState<{
    totalValue: number;
    totalReturn: number;
    annualizedReturn: number;
  } | null>(null);

  const handleEmailSubmit = async (email: string) => {
    setIsSubmittingEmail(true);
    // Simulate API call - in real app, you'd send this to your backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Email captured:', email);
    setEmailSubmitted(true);
    setIsSubmittingEmail(false);
  };

  const handleResultsCalculated = (calculatedResults: {
    totalValue: number;
    totalReturn: number;
    annualizedReturn: number;
  }) => {
    setResults(calculatedResults);
  };

  useEffect(() => {
    const currentUrl = `${URL_CONFIG.BASE_URL}/roi-calculator`;
    
    // Initialize comprehensive SEO
    SEOService.initializeSEO(currentUrl);

    // Generate structured data schemas
    const schemas = [
      // WebApplication schema for the calculator
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        'name': 'Golden Visa Fund ROI Calculator',
        'description': 'Calculate potential returns on Portuguese Golden Visa fund investments',
        'url': currentUrl,
        'applicationCategory': 'FinanceApplication',
        'operatingSystem': 'Web Browser',
        'provider': {
          '@type': 'Organization',
          'name': 'Movingto'
        },
        'offers': {
          '@type': 'Offer',
          'price': '0',
          'priceCurrency': 'EUR',
          'availability': 'https://schema.org/InStock'
        }
      },
      // SoftwareApplication schema
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'ROI Calculator for Golden Visa Funds',
        'description': 'Interactive calculator to project investment returns for Portugal Golden Visa funds',
        'url': currentUrl,
        'applicationCategory': 'Investment Calculator',
        'operatingSystem': 'Web',
        'provider': {
          '@type': 'Organization',
          'name': 'Movingto'
        }
      },
      // FAQ schema for calculator questions
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': [
          {
            '@type': 'Question',
            'name': 'How accurate is the ROI calculator?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'The calculator provides estimates based on fund targets. Actual returns may vary and are not guaranteed.'
            }
          },
          {
            '@type': 'Question',
            'name': 'What funds can I calculate returns for?',
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': 'You can calculate returns for all Portugal Golden Visa eligible funds in our database.'
            }
          }
        ]
      },
      // Add enhanced schemas
      EnhancedStructuredDataService.generateWebSiteSchema(),
      EnhancedStructuredDataService.generateOrganizationSchema()
    ];

    StructuredDataService.addStructuredData(schemas, 'roi-calculator');

    return () => {
      StructuredDataService.removeStructuredData('roi-calculator');
    };
  }, []);

  const showEmailGate = !isAuthenticated && !emailSubmitted && (selectedFund && results);

  return (
    <div className="min-h-screen bg-gray-50">
      <PageSEO pageType="roi-calculator" />
      
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <ROICalculatorHeader />

        <div className="max-w-4xl mx-auto">
          {showEmailGate ? (
            <ROICalculatorEmailGate
              onEmailSubmit={handleEmailSubmit}
              isSubmittingEmail={isSubmittingEmail}
            />
          ) : (
            <>
              <ROICalculatorForm
                onResultsCalculated={handleResultsCalculated}
                selectedFund={selectedFund}
                setSelectedFund={setSelectedFund}
              />
              
              {results && (isAuthenticated || emailSubmitted) && (
                <ROICalculatorResults results={results} />
              )}
            </>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ROICalculatorPage;
