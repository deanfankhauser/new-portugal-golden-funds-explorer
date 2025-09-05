import { Fund } from '../data/funds';

export class InvestmentFundStructuredDataService {
  static generateInvestmentFundSchema(fund: Fund): any {
    // Clean fees specification
    const cleanFeeString = (fee: string | number | undefined) => {
      if (!fee) return '';
      return String(fee).replace(/[^\d.,%-]/g, '').trim();
    };

    const feesSpec = [
      fund.managementFee ? `Mgmt: ${cleanFeeString(fund.managementFee)}%` : '',
      fund.performanceFee ? `Performance: ${cleanFeeString(fund.performanceFee)}%` : '',
      fund.subscriptionFee ? `Subscription: ${cleanFeeString(fund.subscriptionFee)}%` : '',
      fund.redemptionFee ? `Redemption: ${cleanFeeString(fund.redemptionFee)}%` : ''
    ].filter(Boolean).join('; ');

    return {
      "@context": "https://schema.org",
      "@type": "InvestmentFund",
      "name": fund.name,
      "url": `https://funds.movingto.com/${fund.id}`,
      "fundLegalName": fund.name,
      "feesAndCommissionsSpecification": feesSpec || "Contact fund for details",
      "auditor": fund.auditor || "Not specified",
      "custodian": fund.custodian || "Not specified", 
      "areaServed": "PT",
      "isAccessibleForFree": true,
      "description": fund.description,
      "provider": {
        "@type": "Organization",
        "name": fund.managerName
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