
import { FundTag, Fund } from '../types/funds';
import { funds } from './funds-service';

// Function to get all unique tags from funds (now includes investment tags)
export const getAllTags = (): FundTag[] => {
  const tagsSet = new Set<FundTag>();
  funds.forEach(fund => {
    fund.tags.forEach(tag => {
      tagsSet.add(tag);
    });
  });
  const sortedTags = Array.from(tagsSet).sort(); // Sort tags alphabetically for consistency
  
  // Debug logging
  console.log('Total unique tags found:', sortedTags.length);
  console.log('All tags:', sortedTags);
  
  return sortedTags;
};

// Function to get funds by tag (now works with investment tags)
export const getFundsByTag = (tag: FundTag): Fund[] => {
  console.log('Getting funds for tag:', tag);
  const matchingFunds = funds.filter(fund => fund.tags.includes(tag));
  console.log('Matching funds count:', matchingFunds.length);
  
  if (matchingFunds.length > 0) {
    console.log('Sample matching fund:', matchingFunds[0].name, 'tags:', matchingFunds[0].tags);
  }
  
  return matchingFunds;
};
