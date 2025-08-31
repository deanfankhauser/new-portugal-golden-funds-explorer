
import { funds } from '../data/funds';
import { QuizFormData } from '../components/quiz/QuizForm';
import { Fund } from '../data/types/funds';
import { isFundGVEligible } from '../data/services/gv-eligibility-service';

export const getRecommendations = (data: QuizFormData): (Fund & { score: number })[] => {
  let scoredFunds = funds.map(fund => {
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
    if (data.ticketSize === 'under-300k' && fund.minimumInvestment <= 300000) score += 2;
    if (data.ticketSize === '300k-500k' && fund.minimumInvestment >= 300000 && fund.minimumInvestment <= 500000) score += 2;
    if (data.ticketSize === 'over-500k' && fund.minimumInvestment >= 500000) score += 2;

    // Citizenship-based scoring
    const citizenshipTags = fund.tags.filter(tag => 
      tag.includes('U.S. citizens') || tag.includes('UK citizens') || 
      tag.includes('Australian citizens') || tag.includes('Canadian citizens') ||
      tag.includes('Chinese citizens')
    );

    if (data.citizenship === 'us' && citizenshipTags.some(tag => tag.includes('U.S. citizens'))) score += 3;
    if (data.citizenship === 'uk' && citizenshipTags.some(tag => tag.includes('UK citizens'))) score += 3;
    if (data.citizenship === 'australia' && citizenshipTags.some(tag => tag.includes('Australian citizens'))) score += 3;
    if (data.citizenship === 'canada' && citizenshipTags.some(tag => tag.includes('Canadian citizens'))) score += 3;
    if (data.citizenship === 'china' && citizenshipTags.some(tag => tag.includes('Chinese citizens'))) score += 3;

    // Golden Visa eligibility bonus
    if (isFundGVEligible(fund)) score += 1;

    return { ...fund, score };
  });

  // Sort by score and return top 5
  return scoredFunds
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};
