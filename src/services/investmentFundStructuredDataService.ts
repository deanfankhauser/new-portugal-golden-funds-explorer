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

    // Generate keyword-rich description matching subheader pattern
    const getLiquidityText = () => {
      if (!fund.redemptionTerms?.frequency) return '';
      
      if (fund.redemptionTerms.frequency.toLowerCase().includes('daily')) {
        return ' with daily liquidity for investors';
      }
      
      if (fund.redemptionTerms.minimumHoldingPeriod) {
        return ` with ${fund.redemptionTerms.minimumHoldingPeriod}-month minimum holding period`;
      }
      
      return '';
    };

    const schemaDescription = fund.managerName && fund.category
      ? `${fund.name} is a CMVM-regulated Portugal Golden Visa investment fund managed by ${fund.managerName}, investing primarily in ${fund.category.toLowerCase()}${getLiquidityText()}.`
      : fund.description || `${fund.name} is a professionally managed investment fund in Portugal.`;

    // Build enhanced schema with additional properties
    const schema: any = {
      "@context": "https://schema.org",
      "@type": "InvestmentFund",
      "name": fund.name,
      "url": URL_CONFIG.buildFundUrl(fund.id),
      "fundLegalName": fund.name,
      "description": schemaDescription,
      "category": fund.category,
      "fundType": fund.tags?.some(tag => tag.toLowerCase().includes('open-end')) ? "Open-end fund" : "Investment Fund",
      "feesAndCommissionsSpecification": feesSpec || "Contact fund for details",
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
      }
    };

    // Add location/domicile if available
    if (fund.location) {
      schema.location = {
        "@type": "Place",
        "name": fund.location,
        "addressCountry": fund.location.includes('Portugal') ? 'PT' : undefined
      };
    }

    // Add offers section with holding period information
    const offerAdditionalProperties: any[] = [];
    
    if (fund.redemptionTerms?.minimumHoldingPeriod) {
      offerAdditionalProperties.push({
        "@type": "PropertyValue",
        "name": "Minimum Holding Period",
        "value": `${fund.redemptionTerms.minimumHoldingPeriod} months`
      });
    } else if (fund.redemptionTerms?.frequency?.toLowerCase().includes('daily')) {
      offerAdditionalProperties.push({
        "@type": "PropertyValue",
        "name": "Liquidity",
        "value": "Daily liquidity"
      });
    }

    schema.offers = {
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
        },
        ...(offerAdditionalProperties.length > 0 && { "additionalProperty": offerAdditionalProperties })
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

    // Add fund performance data if available - validate it's meaningful
    if (fund.returnTarget) {
      const isInvalidReturn = 
        fund.returnTarget === '0-0%' ||
        fund.returnTarget === '0-0% p.a.' ||
        fund.returnTarget === 'Not disclosed' ||
        fund.returnTarget === 'Unspecified' ||
        fund.returnTarget.trim() === '' ||
        /^0+[-–]0+/.test(fund.returnTarget); // matches "0-0", "00-00", etc.
      
      if (!isInvalidReturn) {
        schema.expectedReturn = fund.returnTarget;
      }
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

    // Golden Visa intended (manager-stated)
    const isGoldenVisaIntended = fund.tags?.includes('Golden Visa Eligible');
    additionalProperties.push({
      "@type": "PropertyValue",
      "name": "GV-intended (manager-stated)",
      "value": isGoldenVisaIntended ? "Yes" : "No"
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
    
    // Conditionally add auditor and custodian only if meaningful values exist
    if (fund.auditor && fund.auditor !== 'Not specified' && fund.auditor.trim() !== '') {
      schema.auditor = fund.auditor;
    }
    
    if (fund.custodian && fund.custodian !== 'Not specified' && fund.custodian.trim() !== '') {
      schema.custodian = fund.custodian;
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