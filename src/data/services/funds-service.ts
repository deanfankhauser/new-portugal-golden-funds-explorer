
import { Fund } from '../types/funds';
import { fundsData } from '../mock/funds-data';

// Function to get a fund by ID
export const getFundById = (id: string): Fund | undefined => {
  return fundsData.find(fund => fund.id === id);
};

// Function to search funds
export const searchFunds = (query: string): Fund[] => {
  const lowerCaseQuery = query.toLowerCase();
  return fundsData.filter(fund => 
    fund.name.toLowerCase().includes(lowerCaseQuery) ||
    fund.description.toLowerCase().includes(lowerCaseQuery) ||
    fund.managerName.toLowerCase().includes(lowerCaseQuery)
  );
};

// Export all funds for direct access
export const funds = fundsData;
