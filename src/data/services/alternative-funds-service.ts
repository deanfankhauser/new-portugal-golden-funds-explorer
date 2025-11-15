
import { Fund } from '../types/funds';

export const findAlternativeFunds = (allFunds: Fund[], currentFund: Fund, maxSuggestions: number = 3): Fund[] => {
  // Filter out the current fund
  const otherFunds = allFunds.filter(fund => fund.id !== currentFund.id);
  
  // Score funds based on similarity
  const scoredFunds = otherFunds.map(fund => {
    let score = 0;
    
    // Same category gets highest score
    if (fund.category === currentFund.category) {
      score += 10;
    }
    
    // Similar investment range
    const investmentDiff = Math.abs(fund.minimumInvestment - currentFund.minimumInvestment);
    if (investmentDiff <= 50000) {
      score += 5;
    } else if (investmentDiff <= 100000) {
      score += 3;
    }
    
    // Similar fund size
    const sizeDiff = Math.abs(fund.fundSize - currentFund.fundSize);
    if (sizeDiff <= 20) {
      score += 3;
    } else if (sizeDiff <= 50) {
      score += 2;
    }
    
    // Same manager
    if (fund.managerName === currentFund.managerName) {
      score += 4;
    }
    
    // Similar term length
    const termDiff = Math.abs(fund.term - currentFund.term);
    if (termDiff <= 1) {
      score += 2;
    }
    
    // Common tags
    const commonTags = fund.tags.filter(tag => currentFund.tags.includes(tag));
    score += commonTags.length * 0.5;
    
    // Prefer open funds
    if (fund.fundStatus === 'Open') {
      score += 3;
    } else if (fund.fundStatus === 'Closing Soon') {
      score += 1;
    }
    
    return { fund, score };
  });
  
  // Sort by score (highest first) and return top suggestions
  return scoredFunds
    .sort((a, b) => b.score - a.score)
    .slice(0, maxSuggestions)
    .map(item => item.fund)
    .filter((f): f is Fund => !!f && typeof (f as any).name === 'string');
};
