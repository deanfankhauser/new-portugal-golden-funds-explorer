
import { fundsData } from '../mock/funds';

// Function to get all unique fund managers with funds count
export const getAllFundManagers = (): { name: string; logo?: string; fundsCount: number }[] => {
  const managersMap = new Map<string, { name: string; logo?: string; fundsCount: number }>();
  
  fundsData.forEach(fund => {
    const managerKey = fund.managerName.toLowerCase();
    if (!managersMap.has(managerKey)) {
      managersMap.set(managerKey, { 
        name: fund.managerName,
        logo: fund.managerLogo,
        fundsCount: 0
      });
    }
    // Increment the funds count for this manager
    const manager = managersMap.get(managerKey)!;
    manager.fundsCount++;
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
