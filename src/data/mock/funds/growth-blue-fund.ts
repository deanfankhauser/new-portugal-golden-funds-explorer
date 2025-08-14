
import { Fund } from '../../types/funds';

export const growthBlueFund: Fund = {
  id: 'growth-blue-fund',
  name: 'Growth Blue Fund',
  description: 'Closed-ended private equity fund targeting profitable SMEs and mid-caps in the "Blue Economy," with €28 m anchor commitment from the European Investment Fund and eligibility for the Portuguese Golden Visa (minimum €100 000 investment).',
  tags: [
    'Golden Visa Eligible',
    'Private Equity',
    'SMEs',
    'Mid-Cap',
    'Sustainability',
    'Closed Ended',
  ],
  category: 'Private Equity',
  minimumInvestment: 100000,
  fundSize: 50,
  managementFee: 2.0,
  performanceFee: 20,
  term: 10,
  managerName: 'Growth Partners Capital, S.A.',
  returnTarget: 'IRR > 20% & > 3.3× MoM',
  fundStatus: 'Closed',
  established: 2024,
  regulatedBy: 'CMVM (Portuguese Securities Market Commission)',
  location: 'Portugal',
  detailedDescription: 'Growth Blue Fund, managed by Growth Partners Capital, is the only European private equity vehicle dedicated to sustainable ocean-resource businesses ("Blue Economy"), targeting profitable SMEs and mid-caps via growth and build-up strategies. With more than 85% of capital invested in Portugal and backed by a €28 m EIF anchor commitment, the fund combines rigorous due diligence, downside-protection deal structures (dividend preference, anti-dilution), and active portfolio management to achieve an IRR above 20% and 3.3× MoM over a ten-year horizon. The strategy emphasizes ESG integration, sector and geographic diversification, and a clear exit roadmap within a 5-year investment period followed by a 5-year harvest period.',
  geographicAllocation: [
    {
      region: 'Portugal',
      percentage: 85
    },
    {
      region: 'Other',
      percentage: 15
    }
  ],
  team: [
    {
      name: 'José María Cantero de Montes-Jovellar',
      position: 'Chairman & Managing Partner, GP Capital'
    },
    {
      name: 'Juan José Rodríguez Navarro',
      position: 'Board Member & Managing Partner, Growth Blue'
    },
    {
      name: 'Miguel Herédia',
      position: 'Board Member & Managing Partner, Growth Blue'
    },
    {
      name: 'Gonçalo Freire',
      position: 'Associate'
    },
    {
      name: 'Francisco Dias Lopes',
      position: 'Associate'
    },
    {
      name: 'Henrique Simão',
      position: 'Senior Analyst'
    },
    {
      name: 'Tomás de Almeida',
      position: 'Financial Manager'
    },
    {
      name: 'Carla Rodrigues',
      position: 'Financial Assistant'
    }
  ],
  redemptionTerms: {
    frequency: 'End of Term',
    redemptionOpen: false,
    minimumHoldingPeriod: 120, // 10 years in months
    notes: 'Capital is locked for the 10-year term; no secondary repurchase mechanism.'
  },
  faqs: [
    {
      question: 'What is the Growth Blue Fund?',
      answer: 'Growth Blue is a CMVM-regulated Private Equity fund managed by Growth Partners Capital that pursues a growth-equity strategy in Portugal\'s "Blue Economy," investing in profitable SMEs and mid-caps to generate both financial returns and sustainable ocean-resource impact.'
    },
    {
      question: 'What size of capital is the fund targeting and who are its anchor investors?',
      answer: 'The fund seeks €50 million of total commitments and has secured a €28 million anchor investment from the European Investment Fund (EIF), alongside commitments from national and international private investors.'
    },
    {
      question: 'What is the minimum investment commitment?',
      answer: 'Investors can join the fund with a minimum subscription of €100 000.'
    },
    {
      question: 'Who manages the fund and under what regulatory framework?',
      answer: 'Growth Partners Capital, S.A.—a CMVM-licensed Private Equity firm—is the fund manager, and Deloitte serves as the independent auditor.'
    },
    {
      question: "What are the fund's term and investment period?",
      answer: 'Growth Blue has a 10-year lifespan from the initial closing, with a 5-year investment window structured as three years plus two one-year extension options.'
    },
    {
      question: 'What fees and performance incentives apply?',
      answer: 'A 2 % annual management fee is charged on committed capital, and a 20 % carried-interest applies on profits above a 7 % preferred-return hurdle.'
    },
    {
      question: 'What target returns does the fund pursue?',
      answer: 'The fund aims for an internal rate of return (IRR) above 20 % per annum and a money-on-money multiple of 3.3× over its life, with annual dividend distributions to investors.'
    },
    {
      question: 'Where will the fund primarily invest its capital?',
      answer: 'Over 85 % of Growth Blue\'s investments will be in Portuguese SMEs and mid-caps, leveraging Portugal\'s strategic maritime position, large exclusive economic zone, and strong Blue-economy tradition.'
    },
    {
      question: 'Which sectors within the Blue Economy are targeted?',
      answer: 'Core areas include Offshore Renewable Energy, Seafood & Aquaculture, and the Blue Bioeconomy, plus related technologies—each chosen for Portugal\'s competitive advantage and strong growth prospects.'
    },
    {
      question: 'What profiles do target companies have, and what ticket sizes are typical?',
      answer: 'The fund invests in profitable SMEs and mid-caps with EBITDA above €2 million, deploying approximately €5 – 10 million per deal for large minority or controlling equity stakes.'
    },
    {
      question: 'How does Growth Blue create value in portfolio companies?',
      answer: 'Value is added through hands-on initiatives—100-day operational plans, cost and supplier optimization, professionalizing management, strategic planning, and support for scale-up and international expansion.'
    },
    {
      question: 'How are investments structured to protect downside?',
      answer: 'Deals include dividend and liquidation preferences, anti-dilution and non-competition clauses, board representation, drag-along/tag-along rights, and the fund employs no leverage at its own level.'
    },
    {
      question: 'What diversification and governance measures are in place?',
      answer: 'Single-company exposure is capped at 15 % and sector exposure at 30 %. ESG adoption, biannual investor reporting, a formal Guidance Committee, and thorough legal/financial/ESG due diligence underpin the governance framework.'
    },
    {
      question: 'How many transactions does the fund plan, and what does its current pipeline look like?',
      answer: 'Depending on final size, Growth Blue anticipates 8 – 10 transactions. It currently has at least three pipeline projects under negotiation or analysis, with tickets ranging from €3.5 million to €7 million.'
    },
    {
      question: "How are the GP's interests aligned with investors'?",
      answer: 'The management team commits up to 4 % of total fund capital alongside investors, and carried-interest catch-up mechanics ensure the GP only earns performance fees after investors achieve their preferred return.'
    }
  ]
};
