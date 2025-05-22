
import { Fund } from "../../types/funds";

export const solarFutureFund: Fund = {
  id: "solar-future-fund",
  name: "Solar Future Fund",
  description: "Portugal Golden Visa–eligible climate fund investing in solar energy-as-a-service projects and battery storage, with expedited onboarding support and community integration, managed under CMVM regulation.",
  tags: [
    "Golden Visa Eligible",
    "Renewable Energy",
    "Solar",
    "Battery Storage",
    "Energy-as-a-Service",
    "Liquid",
    "Secondary Market",
    "12% Return",
    "5% Dividend",
    "Climate"
  ],
  category: "Clean Energy (Solar & Battery Storage)",
  minimumInvestment: 250000,
  fundSize: 20,
  managementFee: 2,
  performanceFee: 20,
  subscriptionFee: 1.5,
  redemptionFee: 0,
  term: 0, // N/A, using 0 to represent open-ended/no fixed term
  managerName: "Tejo Ventures & Green One Capital",
  returnTarget: "12% p.a.",
  fundStatus: "Fundraising",
  established: 0, // N/A, using 0 to represent not specified
  regulatedBy: "CMVM",
  location: "Portugal",
  detailedDescription: "Solar Future Fund is a CMVM-regulated vehicle tailored for Golden Visa investors, channeling capital into a diversified pipeline of solar energy-as-a-service and battery-storage projects across Portugal. Through \"Tejo 360,\" a digital platform, the fund streamlines legal, tax, banking, and government liaison services, while fostering a local community network for relocating families. The fund offers a one-time €500 000 qualifying investment (with a €250 000 minimum subscription), annual 4% dividends from year 2, and an anticipated 12% p.a. return. Capital is raised to a €20 million target, with units tradable on the secondary market for ongoing liquidity. Management fee is 2% p.a., subscription fee 1.5%, and a 5% preferred return precedes a 20% carried interest.",
  geographicAllocation: [
    {
      region: "Portugal",
      percentage: 100
    }
  ],
  team: [
    {
      name: "Julian Johnson",
      position: "General Partner, Tejo Ventures"
    },
    {
      name: "Yann Rey",
      position: "General Partner, Tejo Ventures"
    },
    {
      name: "Manuel Azevedo",
      position: "Strategy Advisor, Energy"
    },
    {
      name: "Pedro Oliveira Cardoso",
      position: "Executive Director"
    },
    {
      name: "Pedro Ventura",
      position: "Board Member, Green One Capital"
    },
    {
      name: "Paulo Sequeira Dinis",
      position: "Board Member, Green One Capital"
    },
    {
      name: "José Maria Leal Da Costa",
      position: "Associate, Green One Capital"
    }
  ],
  redemptionTerms: {
    frequency: "Continuous trading",
    redemptionOpen: true,
    noticePeriod: 0,
    earlyRedemptionFee: 0,
    minimumHoldingPeriod: 0,
    notes: "Investors receive 4% annual dividends from year 2 onward; units can be traded on the secondary market without penalty."
  }
};
