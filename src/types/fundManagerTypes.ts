
export interface FundManagerData {
  name: string;
  logo?: string;
  fundsCount: number;
  totalFundSize: number | null; // in base EUR, null if not available
  funds: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    minimumInvestment: number;
    fundSize: number | null; // in base EUR, null if not available
    returnTarget: string;
  }>;
}
