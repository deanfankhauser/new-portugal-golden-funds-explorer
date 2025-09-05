export class ContentGatingService {
  
  // Determine if specific fund metrics should be gated
  static shouldGateMetric(metricType: string, isAuthenticated: boolean): boolean {
    // No gating - all metrics are public
    return false;
  }

  // Determine if fund comparison features should be gated
  static shouldGateComparison(isAuthenticated: boolean): boolean {
    // No gating - comparison always available
    return false;
  }

  // Determine if advanced filtering should be gated
  static shouldGateAdvancedFilters(isAuthenticated: boolean): boolean {
    // No gating - advanced filters always available
    return false;
  }

  // Determine if specific sorting options should be gated
  static shouldGateSorting(sortField: string, isAuthenticated: boolean): boolean {
    // No gating - all sorting is available
    return false;
  }

  // Get public metrics that are always visible for SEO
  static getPublicMetrics() {
    return [
      'minimumInvestment',
      'fundSize',
      'established',
      'term',
      'category',
      'managerName',
      'location',
      'fundStatus',
      'returnTarget' // Basic target return is public
    ];
  }

  // Get preview metrics (limited view for non-authenticated users)
  static getPreviewMetrics() {
    return [
      ...this.getPublicMetrics(),
      'basicRisk', // Simplified risk level
      'investmentFocus' // General investment strategy
    ];
  }

  // Get public filter options (always available)
  static getPublicFilterOptions() {
    return [
      'search', // Basic search is always public
      'name', // Name-based sorting
      'minInvestment' // Basic investment amount sorting
    ];
  }

  // Get gated content message
  static getGatedMessage(contentType: string): string {
    const messages = {
      fees: "Detailed fee analysis available to MovingTo clients",
      comparison: "Advanced comparison tools require client access",
      calculator: "ROI calculator available to MovingTo clients",
      documents: "Due diligence documents available to MovingTo clients",
      analytics: "Detailed analytics available to MovingTo clients",
      filters: "Advanced filtering options available to MovingTo clients",
      sorting: "Advanced sorting features available to MovingTo clients"
    };

    return messages[contentType] || "This feature requires MovingTo client access";
  }

  // Format public fund data for SEO (no sensitive info)
  static formatPublicFundData(fund: any) {
    return {
      id: fund.id,
      name: fund.name,
      description: fund.description,
      category: fund.category,
      managerName: fund.managerName,
      location: fund.location,
      minimumInvestment: fund.minimumInvestment,
      fundSize: fund.fundSize,
      established: fund.established,
      term: fund.term,
      fundStatus: fund.fundStatus,
      returnTarget: fund.returnTarget,
      websiteUrl: fund.websiteUrl,
      tags: fund.tags,
      // Simplified versions for public consumption
      riskLevel: this.simplifyRiskLevel(fund.tags),
      investmentFocus: this.getInvestmentFocus(fund.category, fund.tags)
    };
  }

  // Simplify risk level for public display
  private static simplifyRiskLevel(tags: string[]): string {
    if (tags.some(tag => tag.includes('Low-risk'))) return 'Conservative';
    if (tags.some(tag => tag.includes('High-risk'))) return 'Growth-Oriented';
    return 'Balanced';
  }

  // Get general investment focus for public display
  private static getInvestmentFocus(category: string, tags: string[]): string {
    if (category.includes('Real Estate')) return 'Real Estate & Development';
    if (category.includes('Tech')) return 'Technology & Innovation';
    if (category.includes('Renewable')) return 'Sustainable Energy';
    if (tags.some(tag => tag.includes('Diversified'))) return 'Diversified Portfolio';
    return 'Mixed Assets';
  }

  // Determine if table columns should be gated
  static shouldGateTableColumn(columnType: string, isAuthenticated: boolean): boolean {
    // No gating - all table columns are available
    return false;
  }

  // Get table column gating message
  static getTableColumnGatingMessage(columnType: string): string {
    const messages = {
      score: "Fund scores available to MovingTo clients",
      performance: "Performance data available to MovingTo clients",
      managementFee: "Fee information available to MovingTo clients",
      performanceFee: "Detailed fee structure available to MovingTo clients",
      detailedMetrics: "Advanced metrics available to MovingTo clients",
      riskScore: "Risk analysis available to MovingTo clients"
    };

    return messages[columnType] || "This data requires MovingTo client access";
  }

  // Get public table data (what's always visible in fund tables)
  static getPublicTableColumns() {
    return [
      'rank',
      'name',
      'manager',
      'category',
      'minimumInvestment',
      'fundStatus'
    ];
  }

  // Get gated table columns (require authentication)
  static getGatedTableColumns() {
    return [
      'score',
      'performance',
      'managementFee',
      'performanceFee',
      'detailedMetrics',
      'riskScore'
    ];
  }
}
