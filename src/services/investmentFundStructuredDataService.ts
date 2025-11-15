import { Fund } from '../data/types/funds';
import { URL_CONFIG } from '../utils/urlConfig';

export class InvestmentFundStructuredDataService {
  static generateInvestmentFundSchema(fund: Fund): any {
    // Clean fees specification
    const cleanFeeString = (fee: string | number | undefined) => {
      if (!fee) return '';
      return String(fee).replace(/[^\d.,%-]/g, '').trim();
    };

    const feesSpec = [
      fund.managementFee ? `Annual Management Fee: ${cleanFeeString(fund.managementFee)}% per annum` : '',
      fund.performanceFee ? `Performance Fee: ${cleanFeeString(fund.performanceFee)}% on returns above benchmark` : '',
      fund.subscriptionFee ? `Entry Fee: ${cleanFeeString(fund.subscriptionFee)}% on subscription` : '',
      fund.redemptionFee ? `Exit Fee: ${cleanFeeString(fund.redemptionFee)}% on redemption` : ''
    ].filter(Boolean).join('; ');

    // Build enhanced schema with additional properties
    const schema: any = {
      "@context": "https://schema.org",
      "@type": "InvestmentFund",
      "name": fund.name,
      "url": URL_CONFIG.buildFundUrl(fund.id),
      "fundLegalName": fund.name,
      "description": fund.description,
      "category": fund.category,
      "fundType": fund.tags?.some(tag => tag.toLowerCase().includes('open-end')) ? "Open-end fund" : "Investment Fund",
      "feesAndCommissionsSpecification": feesSpec || "Contact fund for details",
      "auditor": fund.auditor || "Not specified",
      "custodian": fund.custodian || "Not specified",
      "areaServed": {
        "@type": "Country",
        "name": "Portugal",
        "alternateName": "PT"
      },
      "isAccessibleForFree": false,
      "provider": {
        "@type": "Organization",
        "name": fund.managerName,
        "url": URL_CONFIG.buildManagerUrl(fund.managerName),
        "sameAs": fund.websiteUrl || URL_CONFIG.buildManagerUrl(fund.managerName)
      },
      "offers": {
        "@type": "Offer",
        "price": fund.minimumInvestment || 0,
        "priceCurrency": "EUR",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "minPrice": fund.minimumInvestment || 0,
          "priceCurrency": "EUR",
          "valueAddedTaxIncluded": false
        },
        "availability": fund.fundStatus === 'Open' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "validFrom": fund.datePublished || new Date().toISOString().split('T')[0],
        "seller": {
          "@type": "Organization",
          "name": fund.managerName,
          "url": URL_CONFIG.buildManagerUrl(fund.managerName)
        }
      }
    };
    
    // Add sameAs for fund website if available
    if (fund.websiteUrl) {
      schema.sameAs = fund.websiteUrl;
    }

    // Add geographic allocation if available
    if (fund.geographicAllocation && fund.geographicAllocation.length > 0) {
      schema.spatialCoverage = fund.geographicAllocation.map(geo => {
        const geoSchema: any = {
          "@type": "Place",
          "name": geo.region
        };
        
        // Add coordinates for Portugal (Lisbon as reference point)
        if (geo.region.includes('Portugal')) {
          geoSchema.geo = {
            "@type": "GeoCoordinates",
            "latitude": "38.7223",
            "longitude": "-9.1393",
            "addressCountry": "PT"
          };
        } else {
          geoSchema.geo = {
            "@type": "GeoCoordinates",
            "addressCountry": geo.region.includes('Portugal') ? 'PT' : 'International'
          };
        }
        
        return geoSchema;
      });
    }

    // Add fund performance data if available
    if (fund.returnTarget) {
      schema.expectedReturn = fund.returnTarget;
    }

    // Add compliance and regulatory info
    if (fund.cmvmId) {
      schema.identifier = {
        "@type": "PropertyValue",
        "name": "CMVM Registration",
        "value": fund.cmvmId
      };
    }

    // Add verification/trust signals
    if (fund.regulatedBy) {
      schema.recognizingAuthority = {
        "@type": "Organization",
        "name": fund.regulatedBy
      };
    }

    // Add dateModified for freshness signals
    if (fund.dateModified) {
      schema.dateModified = fund.dateModified;
    }
    if (fund.datePublished) {
      schema.datePublished = fund.datePublished;
    }

    // Add potentialAction for investment process
    schema.potentialAction = {
      "@type": "InvestAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": URL_CONFIG.buildFundUrl(fund.id),
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ],
        "description": "View detailed fund information and investment requirements"
      },
      "result": {
        "@type": "MonetaryAmount",
        "currency": "EUR",
        "minValue": fund.minimumInvestment,
        "description": `Minimum investment required: €${fund.minimumInvestment?.toLocaleString()}`
      }
    };

    // Build additionalProperty array for fund characteristics
    const additionalProperties: any[] = [];

    // Lock-up period
    if (fund.redemptionTerms?.minimumHoldingPeriod) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Lock-up Period",
        "value": `${fund.redemptionTerms.minimumHoldingPeriod} months`
      });
    } else if (fund.tags?.includes('No Lock-Up')) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Lock-up Period",
        "value": "No lock-up"
      });
    }

    // US investor eligibility
    const isUSInvestorFriendly = fund.tags?.some(tag => 
      tag === 'PFIC-Compliant' || 
      tag === 'QEF Eligible'
    );
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Open to US investors",
      "value": isUSInvestorFriendly ? "Yes" : "No"
    });

    // Golden Visa eligibility
    const isGoldenVisaEligible = fund.tags?.includes('Golden Visa Eligible');
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Golden Visa Eligible",
      "value": isGoldenVisaEligible ? "Yes" : "No"
    });

    // Fund status
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "Fund Status",
      "value": fund.fundStatus || "Open"
    });

    // Redemption frequency
    if (fund.redemptionTerms?.frequency) {
      additionalProperties.push({
        "@type": "PropertyValue",
        "name": "Redemption Frequency",
        "value": fund.redemptionTerms.frequency
      });
    }

    // Add to schema
    if (additionalProperties.length > 0) {
      schema.additionalProperty = additionalProperties;
    }
    
    // Add aggregateRating if we have performance data
    if (fund.historicalPerformance && typeof fund.historicalPerformance === 'object') {
      const performanceYears = Object.keys(fund.historicalPerformance).length;
      if (performanceYears > 0) {
        // Calculate a performance-based rating (simplified)
        const avgPerformance = Object.values(fund.historicalPerformance)
          .reduce((sum: number, data: any) => sum + (data?.returns || 0), 0) / performanceYears;
        
        const rating = Math.min(5, Math.max(1, 3 + (avgPerformance / 10))); // Base 3, adjusted by performance
        
        schema.aggregateRating = {
          "@type": "AggregateRating",
          "ratingValue": rating.toFixed(1),
          "bestRating": "5",
          "worstRating": "1",
          "ratingCount": performanceYears,
          "description": `Based on ${performanceYears} years of historical performance data`
        };
      }
    }

    return schema;
  }

  static generateFundListSchema(funds: Fund[], listType: string = "funds"): any {
    return {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": `${listType} - Investment Funds`,
      "numberOfItems": funds.length,
      "itemListElement": funds.map((fund, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "url": `https://funds.movingto.com/${fund.id}`,
        "name": fund.name
      }))
    };
  }
}