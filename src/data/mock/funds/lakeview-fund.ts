import { Fund } from '../../types/funds';

export const lakeviewFund: Fund = {
  id: 'lakeview-fund',
  name: 'Lakeview Fund',
  managerName: 'Visadoro',
  managerLogo: undefined, // No logo provided
  category: 'Real Estate',
  tags: ['Real Estate', 'Tourism', 'Golden Visa Eligible', 'Portugal', 'Closed Ended'],
  description: 'Investment opportunity in the development of a 5-star luxury tourist complex in Portugal\'s West Region, near Óbidos, offering attractive projected returns and lifestyle benefits.',
  detailedDescription: `The Lakeview Fund provides investors with the opportunity to participate in the development of a premium 5-star luxury tourist complex strategically located in Portugal's West Region, just 20 minutes from the historic Óbidos Castle.

Project Specifications:
• Total Plot Area: 8,280.29 m²
• Construction Area: 2,898.10 m² per floor
• Number of Units: 42 luxury accommodations
• Parking Spaces: 50
• Total Project Cost: €25.2 million
• Estimated Completion: Q1 2028

Strategic Location Benefits:
• 4 golf courses within 5-15 minutes
• Atlantic beaches just 10 minutes away
• Premium surf spots within 10-30 minutes
• Óbidos Castle: 20 minutes
• Lisbon Airport: 1 hour
• Wave Garden: 10 minutes
• Local sport centres: 5-10 minutes

Unique Investor Benefits:
• Annual complimentary 7-day stays at the complex
• Golf club membership included
• Ownership rights option upon exit
• No age, education, or management experience requirements
• Minimal residency requirement (7 days per year)

The fund is managed by Visadoro, specialists in hospitality developments in prime Portuguese tourist regions, with expertise in facilitating Golden Visa investments and luxury tourism projects.`,
  minimumInvestment: 650000,
  fundSize: 27, // Estimated based on 42 units at €650k each (in millions)
  managementFee: 2.0, // Estimated standard rate
  performanceFee: 20, // Estimated standard rate
  subscriptionFee: undefined,
  redemptionFee: 0,
  term: 6, // Estimated based on completion timeline
  returnTarget: "10% IRR",
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
    minimumHoldingPeriod: 60, // 5 years for Golden Visa compliance
    notes: 'Investment period: 5 or 7 years depending on citizenship route. Ownership rights option upon exit.'
  },
  geographicAllocation: [
    { region: 'Portugal', percentage: 100 }
  ],
  team: [
    {
      name: 'Visadoro Development Team',
      position: 'Project Developer',
      bio: 'Specialists in hospitality developments in prime Portuguese tourist regions with expertise in Golden Visa investment facilitation'
    }
  ],
  documents: [
    {
      title: 'Project Development Plan',
      url: '#'
    },
    {
      title: 'Golden Visa Compliance Documentation',
      url: '#'
    },
    {
      title: 'Hospitality Complex Specifications',
      url: '#'
    },
    {
      title: 'Location & Amenities Overview',
      url: '#'
    }
  ],
  faqs: [
    {
      question: 'What makes the location of this development attractive?',
      answer: 'The complex is strategically located in Portugal\'s West Region with 4 golf courses within 5-15 minutes, Atlantic beaches 10 minutes away, and historic Óbidos Castle just 20 minutes away. Lisbon Airport is only 1 hour away, making it highly accessible for international tourists.'
    },
    {
      question: 'What lifestyle benefits do investors receive?',
      answer: 'Investors enjoy 7 days of complimentary stays per year at the luxury complex, golf club membership, and the option for ownership rights upon exit. There are no age, education, or management experience requirements.'
    },
    {
      question: 'When will the project be completed?',
      answer: 'The subscription window runs from August 2025 to May 2026, with estimated completion in Q1 2028. The project will develop 42 luxury units across 8,280.29 m² of prime land.'
    },
    {
      question: 'What are the Golden Visa requirements for this investment?',
      answer: 'The minimum investment is €650,000 with no interview requirement and no proof of financial means needed. Only a valid passport and medical insurance are required, with minimal residency requirement of 7 days per year.'
    },
    {
      question: 'What is the ownership option upon exit?',
      answer: 'Investors may opt for ownership rights upon exit, providing the flexibility to either take monetary returns or retain ownership of their investment in the luxury hospitality complex.'
    },
    {
      question: 'How many units are available for investment?',
      answer: 'The project offers 42 investment units in total, providing an exclusive opportunity for a limited number of investors to participate in this luxury hospitality development.'
    }
  ]
};