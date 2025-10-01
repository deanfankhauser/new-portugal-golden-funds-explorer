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
      "feesAndCommissionsSpecification": feesSpec || "Contact fund for details",
      "auditor": fund.auditor || "Not specified",
      "custodian": fund.custodian || "Not specified",
      "areaServed": {
        "@type": "Country",
        "name": "Portugal",
        "alternateName": "PT"
      },
      "isAccessibleForFree": true,
      "provider": {
        "@type": "Organization",
        "name": fund.managerName,
        "url": URL_CONFIG.buildManagerUrl(fund.managerName)
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
        "validFrom": fund.datePublished || new Date().toISOString().split('T')[0]
      }
    };

    // Add geographic allocation if available
    if (fund.geographicAllocation && fund.geographicAllocation.length > 0) {
      schema.spatialCoverage = fund.geographicAllocation.map(geo => ({
        "@type": "Place",
        "name": geo.region,
        "geo": {
          "@type": "GeoCoordinates",
          "addressCountry": geo.region.includes('Portugal') ? 'PT' : 'International'
        }
      }));
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

    // Add fund size/AUM
    if (fund.fundSize) {
      schema.potentialAction = {
        "@type": "InvestAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": URL_CONFIG.buildFundUrl(fund.id),
          "actionPlatform": [
            "http://schema.org/DesktopWebPlatform",
            "http://schema.org/MobileWebPlatform"
          ]
        },
        "result": {
          "@type": "MonetaryAmount",
          "currency": "EUR",
          "minValue": fund.minimumInvestment
        }
      };
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