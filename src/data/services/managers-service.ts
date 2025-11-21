import { Fund } from '../types/funds';

// Public manager data type (no sensitive information)
export interface PublicManagerData {
  id: string;
  user_id: string;
  company_name: string;
  manager_name: string;
  logo_url?: string;
  website?: string;
  description?: string;
  country?: string;
  city?: string;
  founded_year?: number;
  assets_under_management?: number;
  registration_number?: string;
  license_number?: string;
  created_at: string;
  updated_at: string;
}

// Function to get all approved managers from database (public safe data only)
export const getAllApprovedManagers = async (): Promise<PublicManagerData[]> => {
  try {
    // Lazy load supabase only when this function is called (not during SSG)
    const { supabase } = await import('../../integrations/supabase/client');
    
    const { data, error } = await supabase.rpc('get_public_manager_profiles');
    
    if (error) {
      console.error('Error fetching approved managers:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Error in getAllApprovedManagers:', error);
    return [];
  }
};

// Function to get all unique fund managers with funds count
export const getAllFundManagers = (funds: Fund[]): { name: string; fundsCount: number }[] => {
  const managersMap = new Map<string, { name: string; fundsCount: number }>();
  
  funds.forEach(fund => {
    const managerKey = fund.managerName.toLowerCase();
    if (!managersMap.has(managerKey)) {
      managersMap.set(managerKey, {
        name: fund.managerName,
        fundsCount: 0,
      });
    }
    const manager = managersMap.get(managerKey)!;
    manager.fundsCount++;
  });
  
  return Array.from(managersMap.values()).sort((a, b) => 
    a.name.localeCompare(b.name)
  );
};

// Function to get funds by manager name
export const getFundsByManager = (funds: Fund[], managerName: string): Fund[] => {
  return funds.filter(fund =>
    fund.managerName.toLowerCase() === managerName.toLowerCase()
  );
};

// Function to get count of funds by manager
export const getFundsCountByManager = (funds: Fund[], managerName: string): number => {
  return funds.filter(fund =>
    fund.managerName.toLowerCase() === managerName.toLowerCase()
  ).length;
};

// Function to get total fund size managed by a manager
export const getTotalFundSizeByManager = (funds: Fund[], managerName: string): number => {
  return funds
    .filter(fund => fund.managerName.toLowerCase() === managerName.toLowerCase())
    .reduce((sum, fund) => sum + fund.fundSize, 0);
};
