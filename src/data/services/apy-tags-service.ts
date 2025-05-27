
import { Fund, FundTag } from '../types/funds';

// Function to extract percentage from return target string
const extractPercentageFromReturn = (returnTarget: string): number | null => {
  // Look for percentage patterns like "8-10%", "5%", "12% annually", etc.
  const percentageMatch = returnTarget.match(/(\d+(?:\.\d+)?)-?(\d+(?:\.\d+)?)?%/);
  
  if (percentageMatch) {
    const firstNumber = parseFloat(percentageMatch[1]);
    const secondNumber = percentageMatch[2] ? parseFloat(percentageMatch[2]) : null;
    
    // If it's a range, take the average
    if (secondNumber) {
      return (firstNumber + secondNumber) / 2;
    }
    
    return firstNumber;
  }
  
  return null;
};

// Function to determine APY level based on fund's return target
export const generateAPYTags = (fund: Fund): FundTag[] => {
  const tags: FundTag[] = [];
  
  const expectedReturn = extractPercentageFromReturn(fund.returnTarget);
  
  // Only assign APY tags if we can extract a meaningful percentage
  if (expectedReturn !== null) {
    if (expectedReturn < 3) {
      tags.push('< 3% annual yield');
    } else if (expectedReturn >= 3 && expectedReturn <= 5) {
      tags.push('3-5% annual yield');
    } else if (expectedReturn > 5) {
      tags.push('> 5% annual yield');
    }
  }
  
  return tags;
};

// Function to get funds by APY level
export const getFundsByAPYLevel = (funds: Fund[], apyLevel: '< 3% annual yield' | '3-5% annual yield' | '> 5% annual yield'): Fund[] => {
  return funds.filter(fund => fund.tags.includes(apyLevel));
};
