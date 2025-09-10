
import { funds } from '../data/funds';
import { QuizFormData } from '../components/quiz/QuizForm';
import { Fund } from '../data/types/funds';
import { getGVEligibleFunds } from '../data/services/gv-eligibility-service';

export const getRecommendations = (data: QuizFormData): (Fund & { score: number })[] => {
  // Only consider GV-eligible funds for quiz recommendations
  const gvEligibleFunds = getGVEligibleFunds(funds);
  
  let scoredFunds = gvEligibleFunds.map(fund => {
    let score = 0;

    // Risk appetite scoring
    const riskTags = fund.tags.filter(tag => 
      tag.includes('Low Risk') || tag.includes('Medium Risk') || tag.includes('High Risk') ||
      tag.includes('Low-risk') || tag.includes('Medium-risk') || tag.includes('High-risk')
    );
    
    if (data.riskAppetite === 'low' && riskTags.some(tag => tag.includes('Low'))) score += 3;
    if (data.riskAppetite === 'medium' && riskTags.some(tag => tag.includes('Medium'))) score += 3;
    if (data.riskAppetite === 'high' && riskTags.some(tag => tag.includes('High'))) score += 3;

    // Investment horizon scoring (based on fund term)
    if (data.investmentHorizon === 'short' && fund.term <= 5) score += 2;
    if (data.investmentHorizon === 'medium' && fund.term >= 5 && fund.term <= 10) score += 2;
    if (data.investmentHorizon === 'long' && fund.term >= 10) score += 2;

    // Ticket size scoring
    if (data.ticketSize === 'fund-minimums' && fund.minimumInvestment <= 300000) score += 2;
    if (data.ticketSize === '300k-500k' && fund.minimumInvestment >= 300000 && fund.minimumInvestment <= 500000) score += 2;
    if (data.ticketSize === 'over-500k' && fund.minimumInvestment >= 500000) score += 2;

    // Citizenship-based scoring using actual audience tags
    if (data.citizenship === 'us' && fund.tags.includes('Golden Visa funds for U.S. citizens')) score += 3;
    if (data.citizenship === 'uk' && fund.tags.includes('Golden Visa funds for UK citizens')) score += 3;
    if (data.citizenship === 'australia' && fund.tags.includes('Golden Visa funds for Australian citizens')) score += 3;
    if (data.citizenship === 'canada' && fund.tags.includes('Golden Visa funds for Canadian citizens')) score += 3;
    if (data.citizenship === 'china' && fund.tags.includes('Golden Visa funds for Chinese citizens')) score += 3;

    return { ...fund, score };
  });

  // Sort by score and return top 5
  return scoredFunds
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};
