
import { fundsData } from '../mock/funds';

// Function to get all unique fund managers
export const getAllFundManagers = (): { name: string; logo?: string }[] => {
  const managersMap = new Map<string, { name: string; logo?: string }>();
  
  fundsData.forEach(fund => {
    if (!managersMap.has(fund.managerName.toLowerCase())) {
      managersMap.set(fund.managerName.toLowerCase(), { 
        name: fund.managerName,
        logo: fund.managerLogo
      });
    }
  });
  
  return Array.from(managersMap.values()).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
};

// Function to get funds by manager name
export const getFundsByManager = (managerName: string) => {
  return fundsData.filter(fund => 
    fund.managerName.toLowerCase() === managerName.toLowerCase()
  );
};

// Function to get count of funds by manager
export const getFundsCountByManager = (managerName: string): number => {
  return fundsData.filter(fund => 
    fund.managerName.toLowerCase() === managerName.toLowerCase()
  ).length;
};

// Function to get total fund size managed by a manager
export const getTotalFundSizeByManager = (managerName: string): number => {
  return fundsData
    .filter(fund => fund.managerName.toLowerCase() === managerName.toLowerCase())
    .reduce((sum, fund) => sum + fund.fundSize, 0);
};
