
import { Fund } from '../../types/funds';

export const mercurioFundII: Fund = {
  id: 'mercurio-fund-ii',
  name: 'Mercúrio Fund II, FCR',
  description: 'Closed-ended private equity and debt vehicle targeting mature Portuguese companies through special-situations equity and debt instruments, structured to satisfy Portuguese Golden Visa requirements.',
  tags: [
    'Golden Visa Eligible',
    'Private Equity',
    'Debt',
    'Special Situations',
    'SMEs',
    'Mid-Cap',
    'Closed Ended',
    'Long Term',
    'Portugal'
  ],
  category: 'Private Equity & Debt',
  minimumInvestment: 100000,
  fundSize: 0, // N/A - will be handled in display logic
  managementFee: 2.0,
  performanceFee: 20.0,
  subscriptionFee: 3.0,
  redemptionFee: 0,
  term: 10, // Until December 2033, approximately 10 years
  managerName: 'Oxy Capital – SGOIC, S.A.',
  returnTarget: 'Mid-teens per year (gross)',
  fundStatus: 'Open',
  established: 2024, // Estimated based on fundraising status
  regulatedBy: 'Oxy Capital – SGOIC, S.A. (CMVM No. 103588)',
  location: 'Portugal',
  detailedDescription: `Mercúrio Fund II is a Portuguese FCR-structured vehicle that invests in mature small- and mid-cap companies via flexible debt and equity instruments to promote growth, expansion, or consolidation. It follows a special-situations approach—providing liquidity and acquiring minority or majority stakes—while deploying excess cash into the Portugal Liquid Opportunities Fund for further upside.

The fund is designed to align with Golden Visa criteria by avoiding real-estate development, investing over 60% in Portugal-headquartered firms, and maintaining a minimum €100,000 subscription held through to December 2033.

Key features include:
• Closed-ended structure with fundraising open until May 2027
• Term ending December 2033
• Target returns in the mid-teens per year (gross)
• 5% IRR hurdle rate for performance fees
• Focus on special situations in mature Portuguese companies
• Excess cash deployment in Portugal Liquid Opportunities Fund`,
  geographicAllocation: [
    { region: 'Portugal', percentage: 60 },
    { region: 'Other', percentage: 40 }
  ],
  team: [
    { name: 'Miguel Lucas', position: 'Managing Partner' },
    { name: 'Guilherme Valadares Carreiro', position: 'Partner & Head of Golden Visa Initiatives' },
    { name: 'Tomás Sá', position: 'Partner' },
    { name: 'Igor Pereira', position: 'Partner' },
    { name: 'Gonçalo Mendes', position: 'Partner' },
    { name: 'Marco Henriques', position: 'Partner' },
    { name: 'Inês Borges de Carvalho', position: 'CFO' },
    { name: 'Pedro Rebêlo', position: 'CEO in Residence' },
    { name: 'Miguel Realista', position: 'Principal' },
    { name: 'Bernardo Gomes', position: 'Senior Associate' },
    { name: 'Sofia Lapa', position: 'Associate' },
    { name: 'Francisco Gião', position: 'Associate' },
    { name: 'Marta Mendes', position: 'Associate' },
    { name: 'Bárbara Silva', position: 'Financial Controller' },
    { name: 'André Paul', position: 'Analyst' },
    { name: 'João Silva', position: 'Analyst' },
    { name: 'Bernardo Henriques', position: 'Analyst' },
    { name: 'Bernardo Martins', position: 'Analyst' },
    { name: 'António Ferreira', position: 'Analyst' },
    { name: 'Pedro de Almeida', position: 'Analyst' },
    { name: 'Mariana Mello e Castro', position: 'Analyst' },
    { name: 'Rodrigo Neves', position: 'Analyst' }
  ],
  redemptionTerms: {
    frequency: 'End of Term',
    redemptionOpen: false,
    minimumHoldingPeriod: 120, // Through December 2033 (approximately 10 years)
    notes: 'Subscription window open until May 2027; excess cash is partly invested in Portugal Liquid Opportunities Fund.'
  },
  faqs: [
    {
      question: 'What is the investment approach of Mercúrio Fund II?',
      answer: 'The fund follows a special-situations approach, providing liquidity and acquiring minority or majority stakes in mature small- and mid-cap Portuguese companies through flexible debt and equity instruments.'
    },
    {
      question: 'How does this fund qualify for the Portuguese Golden Visa?',
      answer: 'The fund is structured to meet Golden Visa criteria by avoiding real-estate development, investing over 60% in Portugal-headquartered firms, and maintaining the minimum €100,000 subscription through December 2033.'
    },
    {
      question: 'What happens to excess cash in the fund?',
      answer: 'Excess cash is partly invested in the Portugal Liquid Opportunities Fund to provide additional upside potential for investors.'
    },
    {
      question: 'What is the hurdle rate for performance fees?',
      answer: 'The fund has a 5% IRR hurdle rate, meaning performance fees are only charged on profits above this threshold.'
    }
  ]
};
