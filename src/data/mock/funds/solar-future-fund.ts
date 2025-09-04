
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
  fundStatus: "Open", // Changed from "Fundraising" to "Open" to match allowed values
  established: 0, // N/A, using 0 to represent not specified
  regulatedBy: "CMVM",
  pficStatus: "Not provided",
  cmvmId: "Not provided",
  navFrequency: "Quarterly",
  eligibilityBasis: {
    portugalAllocation: 100,
    maturityYears: 7,
    realEstateExposure: "None",
    managerAttestation: true
  },
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
      position: "Strategy Guide, Energy"
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
    frequency: "Daily", // Changed from "Continuous trading" to "Daily" to match allowed values
    redemptionOpen: true,
    noticePeriod: 0,
    earlyRedemptionFee: 0,
    minimumHoldingPeriod: 0,
    notes: "Investors receive 4% annual dividends from year 2 onward; units can be traded on the secondary market without penalty."
  },
  faqs: [
    {
      question: "What is the Solar Future Fund?",
      answer: "It's a CMVM-regulated climate fund investing in Portugal's energy transition, focused on solar energy-as-a-service projects under 1 MW and battery storage facilities to deliver stable, risk-adjusted returns."
    },
    {
      question: "What is the fund's target capital raise?",
      answer: "The Solar Future Fund is targeting a €20 million capital raise from investors."
    },
    {
      question: "What is the qualifying investment?",
      answer: "A one-time contribution of €500 000 qualifies as the minimum investment threshold."
    },
    {
      question: "What is the minimum subscription amount?",
      answer: "The fund's minimum subscription per ticket is set at €250 000."
    },
    {
      question: "What fees does the fund charge?",
      answer: "It applies a 2% per annum management fee, a one-time 1.5% subscription fee, and carried interest split of 20% to the fund manager and 80% to investors."
    },
    {
      question: "What is the preferred return?",
      answer: "The fund offers a preferred return of 5% to investors before any carried interest is applied."
    },
    {
      question: "What is the fund's investment strategy?",
      answer: "With capital preservation as its primary aim, the strategy prioritizes collateralized project financing, rapid capital deployment, collateralized contracts, high diversification across projects and geographies, dividend-yielding assets, low complexity execution, and straightforward exit mechanisms."
    },
    {
      question: "What types of assets and contracts does the fund target?",
      answer: "It invests in distributed solar installations under 1 MW per project, structured under Energy-as-a-Service (EaaS) contracts, alongside utility-scale battery storage to provide grid flexibility."
    },
    {
      question: "What returns can investors expect?",
      answer: "Investors anticipate a 4% annual cash dividend beginning in Year 2, with an excess profit distribution at maturity targeting a net 8% IRR over the life of the fund."
    },
    {
      question: "What is the fund's duration and cashflow structure?",
      answer: "The vehicle spans seven years (Year 0–7), with upfront capital deployment, preferential 4% dividends annually from Year 2, and full return of capital plus profit distribution at maturity."
    },
    {
      question: "Who manages and oversees the fund?",
      answer: "Investment strategy and investor support are provided by Tejo Ventures (General Partners Julian Johnson & Yann Rey), while Green One Capital fulfills regulated oversight and CMVM compliance."
    },
    {
      question: "What track record does the fund have to date?",
      answer: "Building on Fund One's success, the team deployed a €2.5 million tranche into 19 solar and battery projects (3 MW total) across Portugal in partnership with CleanWatts."
    },
    {
      question: "How does the fund mitigate risk?",
      answer: "Risk is mitigated through portfolio diversification across small-scale projects, collateralized financing and contracts, subscription-based revenue models, low market volatility in EaaS, and stringent regulatory oversight."
    },
    {
      question: "What are Renewable Energy Communities (RECs) and how do they work?",
      answer: "RECs pair an anchor client (e.g., schools, hospitals) under long-term PPAs with community members; excess clean energy is virtually allocated or sold back to the grid, creating local social and environmental benefits."
    },
    {
      question: "How does the fund contribute to sustainability and community impact?",
      answer: "In addition to its investments, the fund donates 1% of its revenue to ClientEarth—a global nonprofit using legal tools to protect the environment—and supports community-focused clean energy initiatives."
    }
  ]
};
