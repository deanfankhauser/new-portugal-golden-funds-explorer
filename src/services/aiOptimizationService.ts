
import { Fund } from '../data/funds';

export class AIOptimizationService {
  
  // Generate machine-readable fund summary for AI parsing
  static generateFundSummary(fund: Fund): string {
    return `FUND_SUMMARY: ${fund.name}
CATEGORY: ${fund.category}
MINIMUM_INVESTMENT: €${fund.minimumInvestment.toLocaleString()}
TARGET_RETURN: ${fund.returnTarget}
MANAGEMENT_FEE: ${fund.managementFee}%
PERFORMANCE_FEE: ${fund.performanceFee}%
FUND_SIZE: €${fund.fundSize}M
TERM: ${fund.term === 0 ? 'Perpetual' : `${fund.term} years`}
STATUS: ${fund.fundStatus}
MANAGER: ${fund.managerName}
ESTABLISHED: ${fund.established}
LOCATION: ${fund.location}
DESCRIPTION: ${fund.description}
TAGS: ${fund.tags.join(', ')}
GOLDEN_VISA_ELIGIBLE: Yes
MINIMUM_HOLD_PERIOD: 5 years`;
  }

  // Generate comparison matrix in machine-readable format
  static generateComparisonMatrix(funds: Fund[]): string {
    const headers = ['FUND_NAME', 'MIN_INVESTMENT', 'TARGET_RETURN', 'MGMT_FEE', 'PERF_FEE', 'FUND_SIZE', 'CATEGORY', 'STATUS'];
    
    const rows = funds.map(fund => [
      fund.name,
      `€${fund.minimumInvestment.toLocaleString()}`,
      fund.returnTarget,
      `${fund.managementFee}%`,
      `${fund.performanceFee}%`,
      `€${fund.fundSize}M`,
      fund.category,
      fund.fundStatus
    ]);

    const matrix = [headers, ...rows];
    return matrix.map(row => row.join('\t')).join('\n');
  }

  // Generate comprehensive text alternatives for visual content
  static generateAccessibilityText(fund: Fund): {
    logoAlt: string;
    chartAlt: string;
    summaryAlt: string;
  } {
    return {
      logoAlt: `${fund.managerName} logo - Fund manager for ${fund.name}`,
      chartAlt: `Performance chart for ${fund.name} showing target return of ${fund.returnTarget} with management fee of ${fund.managementFee}%`,
      summaryAlt: `Investment summary: ${fund.name} requires minimum €${fund.minimumInvestment.toLocaleString()} investment, targets ${fund.returnTarget} return, managed by ${fund.managerName}`
    };
  }

  // Generate key metrics extraction for AI systems
  static extractKeyMetrics(fund: Fund): Record<string, any> {
    return {
      fund_id: fund.id,
      fund_name: fund.name,
      category: fund.category,
      minimum_investment_eur: fund.minimumInvestment,
      target_return: fund.returnTarget,
      management_fee_percent: fund.managementFee,
      performance_fee_percent: fund.performanceFee,
      fund_size_millions_eur: fund.fundSize,
      term_years: fund.term,
      status: fund.fundStatus,
      manager_name: fund.managerName,
      established_year: fund.established,
      location: fund.location,
      golden_visa_eligible: true,
      minimum_hold_period_years: 5,
      tags: fund.tags,
      risk_level: this.calculateRiskLevel(fund),
      investment_focus: this.determineInvestmentFocus(fund),
      liquidity_rating: this.calculateLiquidityRating(fund)
    };
  }

  // Calculate risk level based on fund characteristics
  private static calculateRiskLevel(fund: Fund): 'Low' | 'Medium' | 'High' {
    if (fund.tags.includes('Low-risk') || fund.category === 'Real Estate') {
      return 'Low';
    }
    if (fund.tags.includes('High-risk') || fund.category === 'Venture Capital' || fund.category === 'Private Equity') {
      return 'High';
    }
    return 'Medium';
  }

  // Determine primary investment focus
  private static determineInvestmentFocus(fund: Fund): string {
    if (fund.category === 'Real Estate') return 'Real Estate';
    if (fund.category === 'Clean Energy (Solar & Battery Storage)') return 'Renewable Energy';
    if (fund.category === 'Infrastructure') return 'Infrastructure';
    if (fund.category === 'Venture Capital' || fund.category === 'Private Equity') return 'Equity';
    return 'Diversified';
  }

  // Calculate liquidity rating
  private static calculateLiquidityRating(fund: Fund): 'Low' | 'Medium' | 'High' {
    if (fund.term === 0) return 'High'; // Perpetual funds
    if (fund.term <= 5) return 'Medium';
    return 'Low';
  }

  // Generate investment process flowchart description
  static generateProcessFlowchart(): string {
    return `PORTUGAL_GOLDEN_VISA_INVESTMENT_PROCESS:
1. RESEARCH_PHASE: Browse qualified investment funds → Compare options → Review documentation
2. SELECTION_PHASE: Choose fund → Contact fund manager → Complete due diligence
3. INVESTMENT_PHASE: Transfer €500,000 minimum → Receive investment confirmation → Obtain investment certificate
4. APPLICATION_PHASE: Gather documents → Submit Golden Visa application → Pay government fees
5. PROCESSING_PHASE: Wait 8-12 months → Respond to requests → Attend appointments if required
6. APPROVAL_PHASE: Receive residence permit → Plan Portugal visits → Maintain investment for 5 years
7. RENEWAL_PHASE: Renew permit every 2 years → Consider permanent residency after 5 years → Apply for citizenship after 6 years if desired`;
  }

  // Generate glossary for financial terms
  static generateFinancialGlossary(): Record<string, string> {
    return {
      'Management Fee': 'Annual fee charged by fund managers for operating the fund, typically 1-3% of invested capital',
      'Performance Fee': 'Fee charged when fund performance exceeds specified targets, usually 10-20% of excess returns',
      'Minimum Investment': 'Smallest amount required to invest in a fund, €500,000 for Golden Visa eligibility',
      'Target Return': 'Expected annual return percentage that the fund aims to achieve',
      'Fund Size': 'Total amount of capital managed by the fund, measured in millions of euros',
      'Net Asset Value (NAV)': 'Per-share value of fund calculated by dividing total assets minus liabilities by number of shares',
      'Lock-up Period': 'Time period during which investors cannot redeem their investment',
      'Redemption': 'Process of selling fund shares back to the fund manager',
      'Golden Visa': 'Portuguese residence permit obtained through qualifying investment',
      'Due Diligence': 'Investigation and evaluation of investment opportunity before committing funds',
      'Subscription': 'Process of purchasing shares in an investment fund',
      'Hurdle Rate': 'Minimum return threshold before performance fees are charged',
      'High Water Mark': 'Highest NAV level reached, used to calculate performance fees',
      'Diversification': 'Investment strategy spreading risk across different assets or sectors'
    };
  }
}
