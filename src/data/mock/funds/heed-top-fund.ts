import { Fund } from '../../types/funds';

export const heedTopFund: Fund = {
  id: 'heed-top-fund',
  name: 'Heed Top Investment Fund',
  description: 'A CMVM-regulated, open-ended alternative investment fund that invests primarily in Portuguese bonds and equities, with flexibility to allocate to ETFs, other funds, and international securities for diversification.',
  tags: [
    'Regulated',
    'Golden Visa Eligible', 
    'Open Ended',
    'Bonds',
    'Equities',
    'Liquid',
    'Daily NAV',
    'No Lock-Up',
    'Portugal',
    'Balanced',
    'Tax Free'
  ],
  category: 'Balanced',
  minimumInvestment: 100000,
  fundSize: 90, // Based on €90M raised from Golden Visa clients
  managementFee: 1.5,
  performanceFee: 20,
  subscriptionFee: 2,
  redemptionFee: 5, // if within 365 days
  term: 99, // Open-ended
  managerName: 'Heed Capital SGOIC, S.A.',
  returnTarget: '5% annually',
  fundStatus: 'Open',
  established: 2004, // Approximately 20 years ago
  regulatedBy: 'CMVM',
  pficStatus: "Not provided",
  cmvmId: "Not provided",
  navFrequency: "Daily",
  eligibilityBasis: {
    portugalAllocation: 75,
    maturityYears: 0, // Open-ended
    realEstateExposure: "None",
    managerAttestation: true
  },
  location: 'Portugal',
  detailedDescription: `Heed Top is a CMVM-regulated, open-ended alternative investment fund designed to deliver consistent, moderate returns through a diversified investment approach. The fund invests at least 60% in bonds and equities of Portuguese commercial companies, with the remainder allocated to corporate and subordinated bonds, ETFs, equities, and other investment funds for enhanced diversification.

The fund follows a prudent investment strategy with strict risk limits, including maximum 65% exposure to equity-related instruments and maximum 15% exposure per issuer (35% for sovereign OECD/EU securities). With daily liquidity and redemption proceeds paid within 4-5 business days, the fund offers flexibility while targeting 5% annual returns net of fees.

Managed by Heed Capital SGOIC, S.A., an independent asset manager with over €350M under management and a 20+ year track record, the fund is fully compliant for Golden Visa investments and regulated by CMVM.`,
  geographicAllocation: [
    { region: 'Portugal', percentage: 75 },
    { region: 'Other EU', percentage: 15 },
    { region: 'International', percentage: 10 }
  ],
  team: [
    {
      name: 'Pedro Alves',
      position: 'CIO & Fund Manager',
      bio: 'Chief Investment Officer and Fund Manager for Heed Top Investment Fund'
    },
    {
      name: 'Joaquim Luiz Gomes',
      position: 'CEO & Chairman',
      bio: 'Chief Executive Officer and Chairman of Heed Capital SGOIC, S.A.'
    },
    {
      name: 'Nuno Pinto',
      position: 'CFO & Board Member',
      bio: 'Chief Financial Officer and Board Member'
    },
    {
      name: 'Gustavo Caiuby Guimarães',
      position: 'Commercial Director & Board Member',
      bio: 'Commercial Director and Board Member'
    }
  ],
  redemptionTerms: {
    frequency: 'Daily',
    redemptionOpen: true,
    noticePeriod: 0,
    earlyRedemptionFee: 5, // if within 365 days
    minimumHoldingPeriod: 0,
    notes: 'Redemption proceeds paid in 4-5 business days. 5% redemption fee applies if redeemed within 365 days.'
  },
  faqs: [
    {
      question: 'What is the minimum investment amount?',
      answer: '€100,000 per investor. For Golden Visa applicants, the minimum investment is €500,000 in eligible funds.'
    },
    {
      question: 'What is the expected return?',
      answer: 'The fund targets 5% per annum net of fees, with an accumulation policy (no income distributions).'
    },
    {
      question: 'How liquid is the fund?',
      answer: 'The fund offers daily subscriptions and redemptions, with redemption proceeds paid within 4-5 business days.'
    },
    {
      question: 'What are the tax implications?',
      answer: 'Non-residents are exempt from Portuguese tax on income and capital gains. Portuguese residents are taxed at 28% on both.'
    },
    {
      question: 'Is this fund Golden Visa eligible?',
      answer: 'Yes, the fund is fully compliant for the €500,000 Golden Visa investment route.'
    },
    {
      question: 'What is the asset allocation strategy?',
      answer: 'At least 60% in bonds and equities of Portuguese commercial companies, with the remainder in corporate bonds, ETFs, and other diversified instruments.'
    }
  ]
};