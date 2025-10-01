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

    return {
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
      "areaServed": "PT",
      "isAccessibleForFree": true,
      "provider": {
        "@type": "Organization",
        "name": fund.managerName,
        "url": URL_CONFIG.buildManagerUrl(fund.managerName)
      },
      "offers": {
        "@type": "Offer",
        "priceSpecification": {
          "@type": "PriceSpecification",
          "minPrice": fund.minimumInvestment || 0,
          "priceCurrency": "EUR"
        }
      }
    };
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