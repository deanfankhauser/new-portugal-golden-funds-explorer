import { Fund } from '../../types/funds';

export const pelaTerraIIRegenerateFund: Fund = {
  id: 'pela-terra-ii-regenerate-fund',
  name: 'Pela Terra II Regenerate Fund',
  managerName: 'Pela Terra Capital SGOIC, S.A.',
  category: 'Private Equity',
  tags: ['Private Equity', 'Sustainability', 'Golden Visa Eligible', 'Portugal', 'Closed Ended', 'Climate'],
  description: 'A CMVM-regulated private equity fund investing in large-scale regenerative agriculture projects in Portugal, focusing on degraded land restoration and sustainable high-value crop production.',
  detailedDescription: `Pela Terra II Regenerate is a specialized impact-driven fund that combines financial performance with measurable environmental outcomes through regenerative agriculture investments in Portugal.

Investment Strategy:
• Acquire degraded or underutilized land in prime Portuguese agricultural regions
• Implement regenerative agriculture techniques to restore soil fertility and increase yields
• Partner with experienced local operators to ensure operational efficiency
• Target export markets for premium crops with strong global demand
• Focus on almonds, olives, and other Mediterranean crops using sustainable practices

Environmental Impact:
• Soil Regeneration: Increased organic matter and water retention
• Biodiversity Enhancement: Habitat creation for pollinators and local fauna
• Carbon Capture: Verified CO₂ sequestration through regenerative farming methods
• Community Development: Local employment and skill development in rural areas

Current Portfolio Examples:
• Alentejo Almond Farm – 300+ hectares under regenerative cultivation
• Olive Grove Rehabilitation – Restoring ancient groves for high-grade olive oil production

The fund is managed by Pela Terra Capital SGOIC, specialists in regenerative agriculture with decades of combined experience in farmland acquisition, development, and management, with a strong focus on ESG compliance and measurable environmental benefits.`,
  minimumInvestment: 100000,
  fundSize: 50, // Estimated fund size (in millions)
  managementFee: 2.0,
  performanceFee: 20,
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 10, // 10 years
  returnTarget: "8-10% IRR, ~2.0x MoIC",
  fundStatus: 'Open',
  websiteUrl: undefined,
  established: 2024,
  regulatedBy: 'CMVM',
  location: 'Portugal',
  redemptionTerms: {
    frequency: 'End of Term',
    redemptionOpen: false,
    noticePeriod: undefined,
    earlyRedemptionFee: undefined,
    minimumHoldingPeriod: 120, // 10 years in months
    notes: 'Closed-end fund with 10-year term and possible extensions'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 100 }
  ],
  team: [
    {
      name: 'Tiago Abecasis',
      position: 'Founder & CEO',
      bio: '20+ years in agribusiness with expertise in regenerative agriculture and carbon farming'
    },
    {
      name: 'José Freire',
      position: 'COO',
      bio: 'Specialist in regenerative farm operations with strong local operator network'
    },
    {
      name: 'Miguel Andrade',
      position: 'CFO',
      bio: 'Background in agricultural finance and investment with proven ability to scale projects from acquisition to export market readiness'
    }
  ],
  documents: [
    {
      title: 'Fund Prospectus',
      url: '#'
    },
    {
      title: 'ESG Impact Report',
      url: '#'
    },
    {
      title: 'Regenerative Agriculture Strategy',
      url: '#'
    },
    {
      title: 'Golden Visa Compliance Documentation',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'What is regenerative agriculture and how does it create value?',
      answer: 'Regenerative agriculture focuses on rebuilding soil health, increasing biodiversity, and sequestering carbon while producing high-value crops. This approach enhances long-term productivity and creates additional revenue streams through carbon credits and premium pricing for sustainable products.'
    },
    {
      question: 'What types of crops does the fund focus on?',
      answer: 'The fund primarily invests in almonds, olives, and other Mediterranean crops that are well-suited to Portugal\'s climate and have strong global export demand.'
    },
    {
      question: 'How does the fund measure environmental impact?',
      answer: 'The fund tracks multiple ESG metrics including soil regeneration (organic matter and water retention), biodiversity enhancement, verified CO₂ sequestration, and community development through local employment and skill development.'
    },
    {
      question: 'What is the Golden Visa process for this fund?',
      answer: 'The process involves due diligence & onboarding, fund subscription via €500,000 transfer, and Golden Visa application submission. The fund is fully compliant with Portuguese Golden Visa requirements.'
    },
    {
      question: 'What experience does the management team have?',
      answer: 'Pela Terra Capital SGOIC has decades of combined experience in farmland acquisition, development, and management, with specialized expertise in regenerative agriculture, carbon farming, and strong local operator networks.'
    },
    {
      question: 'How long is the investment commitment?',
      answer: 'The fund has a 10-year term with possible extensions, targeting 8-10% IRR and approximately 2.0x money-on-invested-capital over the fund life.'
    }
  ]
};