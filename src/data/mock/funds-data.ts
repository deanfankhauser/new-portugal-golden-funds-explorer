import { Fund } from '../types/funds';

// Sample fund data
export const fundsData: Fund[] = [
  {
    id: "horizon-fund",
    name: "Horizon Fund",
    description: "Fund investment in Fixed Income and Digital Assets with access to Golden Visa in Portugal",
    category: "Mixed",
    tags: ['Golden Visa Eligible', 'Bonds', 'Crypto', 'Liquid', 'Low Risk', 'Regulated', 'Open Ended', 'Bitcoin', 'Ethereum', 'Solana'],
    minimumInvestment: 100000,
    fundSize: 100,
    managementFee: 2,
    performanceFee: 20,
    subscriptionFee: 0,
    redemptionFee: 2,
    term: 6,
    managerName: "Octanova SCR, S.A.",
    returnTarget: "15-20% projected IRR",
    fundStatus: "Open",
    websiteUrl: "https://example.com/horizon-fund",
    established: 2023,
    regulatedBy: "Octanova SCR, S.A. (registered with CMVM)",
    location: "Portugal",
    detailedDescription: "Horizon Fund is the first Golden-Visa-eligible SCR vehicle in Portugal, offering a blended strategy of 65% investment-grade Portuguese corporate bonds and 35% large-cap digital assets (e.g. Bitcoin, Ethereum). As an open-ended fund with monthly subscriptions and redemptions, it provides both liquidity and stability: bond holdings generate steady income while crypto allocations capture growth potential. A robust risk-management framework—including stop-loss triggers, liquidity buffers and independent oversight—helps control volatility. Early redemptions (within 5 years) incur a 2% fee to align investor horizons, after which redemptions are processed daily. Managed by Octanova SCR with seasoned fixed income and blockchain experts, Horizon Fund targets a 15–20% IRR over a six-year term, with full transparency via quarterly reports and annual audited statements.",
    geographicAllocation: [
      { region: "Portugal", percentage: 35 },
      { region: "USA", percentage: 65 }
    ],
    team: [
      { 
        name: "Marcello Cavalcanti", 
        position: "Managing Team",
        photoUrl: "https://randomuser.me/api/portraits/men/35.jpg",
        linkedinUrl: "https://linkedin.com/in/marcello-cavalcanti"
      },
      { 
        name: "Sónia Magalhaes", 
        position: "Managing Team",
        photoUrl: "https://randomuser.me/api/portraits/women/42.jpg",
        linkedinUrl: "https://linkedin.com/in/sonia-magalhaes"
      },
      { 
        name: "Luis Freire", 
        position: "Managing Team",
        photoUrl: "https://randomuser.me/api/portraits/men/28.jpg",
        linkedinUrl: "https://linkedin.com/in/luis-freire"
      },
      { 
        name: "Henrique Anjos", 
        position: "Managing Team",
        photoUrl: "https://randomuser.me/api/portraits/men/56.jpg",
        linkedinUrl: "https://linkedin.com/in/henrique-anjos"
      }
    ],
    documents: [
      { title: "Fund Prospectus", url: "https://example.com/horizon-fund-prospectus.pdf" },
      { title: "Investment Strategy", url: "https://example.com/horizon-fund-strategy.pdf" },
      { title: "Risk Management Framework", url: "https://example.com/horizon-fund-risk.pdf" }
    ],
    redemptionTerms: {
      frequency: "Monthly",
      redemptionOpen: true,
      noticePeriod: 0,
      earlyRedemptionFee: 2,
      minimumHoldingPeriod: 60, // 5 years in months
      notes: "Fees apply on any redemption within the first five years; thereafter redemptions processed daily"
    }
  },
  {
    id: "optimize-golden-opportunities",
    name: "Optimize Portugal Golden Opportunities Fund",
    description: "Open-ended UCITS-compliant balanced fund investing in Portuguese listed equities and bonds, offering daily liquidity and eligibility for the Portuguese Golden Visa.",
    category: "Balanced",
    tags: [
      'Golden Visa Eligible', 
      'Equities', 
      'Bonds', 
      'Balanced', 
      'Liquid', 
      'UCITS', 
      'PFIC-Compliant', 
      'QEF Eligible',
      'Daily NAV',
      'No Lock-Up',
      'Open Ended'
    ],
    minimumInvestment: 500000,
    fundSize: 0, // N/A in the provided data
    managementFee: 0, // N/A in the provided data
    performanceFee: 0, // N/A in the provided data
    subscriptionFee: 0, // N/A in the provided data
    redemptionFee: 0,
    term: 0, // Perpetual (open-ended)
    managerName: "Optimize Investment Partners",
    returnTarget: "Past performance: +4.2% (2022), +17.3% (2023), +6.3% (2024), +8.4% YTD (Apr 2025)",
    fundStatus: "Open",
    websiteUrl: "https://example.com/optimize-golden-opportunities",
    established: 2008, // Using the founding date of the manager
    regulatedBy: "CMVM (Portuguese Securities Supervisor); SEC; FINRA",
    location: "Portugal",
    detailedDescription: "Optimize Portugal Golden Opportunities Fund is a UCITS-compliant, open-ended vehicle designed for Golden Visa investors, blending a 75% allocation to Portuguese listed equities with 25% in bonds to achieve lower volatility and attractive long-term capital appreciation. The fund provides daily NAV and processing of subscriptions/redemptions within five business days, with no lock-up period or redemption fees. Investors benefit from PFIC compliance and the ability for U.S. persons to elect QEF treatment. The minimum investment of €500,000 (€505,255 including taxes and commissions) must be maintained for five years to satisfy Golden Visa requirements. Past performance (net of fees) includes +4.2% in 2022, +17.3% in 2023, +6.3% in 2024, and +8.4% year-to-date through April 30, 2025.",
    geographicAllocation: [
      { region: "Portugal", percentage: 100 }
    ],
    documents: [
      { title: "Fund Prospectus", url: "https://example.com/optimize-prospectus.pdf" },
      { title: "Performance Report", url: "https://example.com/optimize-performance.pdf" },
      { title: "UCITS Compliance", url: "https://example.com/optimize-ucits.pdf" }
    ],
    redemptionTerms: {
      frequency: "Daily",
      redemptionOpen: true,
      noticePeriod: 5, // 5 business days for processing
      earlyRedemptionFee: 0,
      minimumHoldingPeriod: 60, // 5 years in months (for Golden Visa)
      notes: "No lock-up, no penalties, full liquidity subject to business-day processing. The minimum investment must be maintained for five years to satisfy Golden Visa requirements."
    }
  },
  {
    id: "3cc-golden-income",
    name: "3CC Portugal Golden Income Fund",
    description: "Open-ended Alternative Investment Fund focused on capital preservation with 70% exposure to Portuguese corporate bonds and 30% to global equities & digital assets, offering daily liquidity and eligibility for the Portuguese Golden Visa.",
    category: "Multi-Asset",
    tags: [
      'Golden Visa Eligible', 
      'Bonds', 
      'Equities', 
      'Capital Preservation', 
      'Low Risk', 
      'Liquid', 
      'Daily NAV', 
      'Bitcoin', 
      'Ethereum', 
      'Solana'
    ],
    minimumInvestment: 100000, // Share Class A minimum
    fundSize: 25, // Current AUM in millions
    managementFee: 1.5, // Share Class A
    performanceFee: 20,
    subscriptionFee: 0,
    redemptionFee: 5, // Year 1 rate
    term: 0, // Perpetual (open-ended)
    managerName: "3 Comma Capital SCR, S.A.",
    returnTarget: "10% p.a. expected ROI",
    fundStatus: "Open",
    websiteUrl: "https://example.com/3cc-golden-income",
    established: 2025, // April 2025
    regulatedBy: "CMVM (Portuguese Securities Market Authority)",
    location: "Portugal",
    detailedDescription: "3CC Portugal Golden Income Fund is an open-ended alternative investment vehicle managed by 3 Comma Capital SCR, S.A., structured to satisfy Portuguese Golden Visa requirements by allocating 70% to investment-grade Portuguese corporate bonds and 30% to growth assets—including global equities and digital assets such as Bitcoin, Ethereum, and Solana. Launched in April 2025, it provides daily liquidity with no subscription fee or lock-up. Share Class A (accumulation) requires a €100,000 minimum investment; Class D (distribution) requires €300,000. Both must be held for five years for residency eligibility. Fees comprise a 1.50% management fee for Class A (1.75% for Class D), a 20% performance fee over a 5% high-water mark, and redemption fees tapering from 5% in year 1 to 0% after 5 years + 1 day. The fund targets a 10% p.a. return, currently manages over €25 million (aiming for €50 million), and issues quarterly reports and annual audited statements.",
    geographicAllocation: [
      { region: "Portugal (Bonds)", percentage: 70 },
      { region: "Global Equities", percentage: 15 },
      { region: "Digital Assets", percentage: 15 }
    ],
    team: [
      { 
        name: "Patrick Hable", 
        position: "Co-founder / Anchor Investor / Partner",
        photoUrl: "https://randomuser.me/api/portraits/men/41.jpg",
        linkedinUrl: "https://linkedin.com/in/patrick-hable"
      },
      { 
        name: "Duarte Caldas", 
        position: "Investment Principal",
        photoUrl: "https://randomuser.me/api/portraits/men/42.jpg",
        linkedinUrl: "https://linkedin.com/in/duarte-caldas"
      },
      { 
        name: "José Carlos Monteiro", 
        position: "Head of Operations",
        photoUrl: "https://randomuser.me/api/portraits/men/43.jpg",
        linkedinUrl: "https://linkedin.com/in/jose-carlos-monteiro"
      },
      { 
        name: "Samuel Cavaco", 
        position: "PE/VC Analyst",
        photoUrl: "https://randomuser.me/api/portraits/men/44.jpg",
        linkedinUrl: "https://linkedin.com/in/samuel-cavaco"
      },
      { 
        name: "Nuno Serafim", 
        position: "Co-founder / Managing Partner / CIO",
        photoUrl: "https://randomuser.me/api/portraits/men/45.jpg",
        linkedinUrl: "https://linkedin.com/in/nuno-serafim"
      },
      { 
        name: "Diana Pereira", 
        position: "Analyst",
        photoUrl: "https://randomuser.me/api/portraits/women/46.jpg",
        linkedinUrl: "https://linkedin.com/in/diana-pereira"
      },
      { 
        name: "Pedro Cerdeira", 
        position: "Partner / Head of VC",
        photoUrl: "https://randomuser.me/api/portraits/men/47.jpg",
        linkedinUrl: "https://linkedin.com/in/pedro-cerdeira"
      },
      { 
        name: "David Duarte", 
        position: "Investment Director",
        photoUrl: "https://randomuser.me/api/portraits/men/48.jpg",
        linkedinUrl: "https://linkedin.com/in/david-duarte"
      },
      { 
        name: "Alexandre Cunha Elias", 
        position: "Business Development Director",
        photoUrl: "https://randomuser.me/api/portraits/men/49.jpg",
        linkedinUrl: "https://linkedin.com/in/alexandre-cunha-elias"
      }
    ],
    documents: [
      { title: "Fund Prospectus", url: "https://example.com/3cc-golden-income-prospectus.pdf" },
      { title: "Performance Report", url: "https://example.com/3cc-golden-income-performance.pdf" },
      { title: "Risk Management Framework", url: "https://example.com/3cc-golden-income-risk.pdf" }
    ],
    redemptionTerms: {
      frequency: "Daily",
      redemptionOpen: true,
      noticePeriod: 5, // 5 business days for processing
      earlyRedemptionFee: 5, // Year 1 rate
      minimumHoldingPeriod: 60, // 5 years in months for Golden Visa
      notes: "Redemption fees taper from 5% in year 1 to 0% after 5 years + 1 day. No lock-up; full liquidity subject to standard processing."
    }
  },
  {
    id: "portugal-golden-fund-1",
    name: "Lisboa Real Estate Growth Fund",
    description: "A fund focused on premium real estate development in Lisbon's historic center and emerging neighborhoods.",
    category: "Real Estate",
    tags: ['Real Estate', 'Low Risk'],
    minimumInvestment: 500000,
    fundSize: 50, // 50 million EUR
    managementFee: 2,
    performanceFee: 20,
    subscriptionFee: 1.5,
    redemptionFee: 2,
    term: 7,
    managerName: "Lisbon Capital Partners",
    returnTarget: "6-8% annually",
    fundStatus: "Open",
    websiteUrl: "https://example.com/lisboa-fund",
    established: 2018,
    regulatedBy: "CMVM (Portuguese Securities Market Commission)",
    location: "Lisbon, Portugal",
    detailedDescription: "The Lisboa Real Estate Growth Fund invests in premium residential and commercial properties in Lisbon's historic center and emerging neighborhoods. The fund targets properties with renovation potential to create value through modernization while preserving historical elements. With a careful selection process, the fund focuses on properties in strategic locations with high rental demand from both locals and the international community. The fund managers have over 20 years of experience in the Portuguese real estate market and maintain a conservative approach to leverage, generally not exceeding 50% loan-to-value across the portfolio. All properties are managed by a dedicated property management team ensuring high occupancy rates and premium rental yields.",
    geographicAllocation: [
      { region: "Portugal", percentage: 85 },
      { region: "Spain", percentage: 15 }
    ],
    team: [
      { 
        name: "António Silva", 
        position: "Fund Manager",
        bio: "Over 20 years of experience in Portuguese real estate investment. Previously worked at CBRE and Savills.",
        photoUrl: "https://randomuser.me/api/portraits/men/22.jpg",
        linkedinUrl: "https://linkedin.com/in/antonio-silva"
      },
      { 
        name: "Maria Fernandes", 
        position: "Investment Director",
        bio: "15 years experience in real estate development and asset management across Southern Europe.",
        photoUrl: "https://randomuser.me/api/portraits/women/17.jpg",
        linkedinUrl: "https://linkedin.com/in/maria-fernandes"
      },
      { 
        name: "João Pereira", 
        position: "Legal Counsel",
        bio: "Specialized in Portuguese real estate law and Golden Visa regulations.",
        photoUrl: "https://randomuser.me/api/portraits/men/45.jpg",
        linkedinUrl: "https://linkedin.com/in/joao-pereira"
      }
    ],
    documents: [
      { title: "Fund Prospectus", url: "https://example.com/lisboa-fund-prospectus.pdf" },
      { title: "Annual Report 2024", url: "https://example.com/lisboa-fund-annual-report-2024.pdf" },
      { title: "Golden Visa Eligibility", url: "https://example.com/lisboa-fund-golden-visa-eligibility.pdf" }
    ],
    redemptionTerms: {
      frequency: "Annual",
      redemptionOpen: true,
      noticePeriod: 90,
      earlyRedemptionFee: 3,
      minimumHoldingPeriod: 24,
      notes: "Redemptions processed on the last business day of each calendar year, subject to fund liquidity."
    }
  },
  {
    id: "portugal-golden-fund-2",
    name: "Porto Innovation Ventures",
    description: "A venture capital fund investing in tech startups across Northern Portugal with a focus on sustainability and innovation.",
    category: "Venture Capital",
    tags: ['Venture Capital', 'Technology', 'High Risk', 'Sustainability'],
    minimumInvestment: 500000,
    fundSize: 25,
    managementFee: 2.5,
    performanceFee: 25,
    subscriptionFee: 2,
    redemptionFee: 3,
    term: 8,
    managerName: "NorthStar Venture Management",
    returnTarget: "12-18% annually",
    fundStatus: "Open",
    websiteUrl: "https://example.com/porto-ventures",
    established: 2020,
    regulatedBy: "CMVM (Portuguese Securities Market Commission)",
    location: "Porto, Portugal",
    detailedDescription: "Porto Innovation Ventures invests in early and growth-stage technology companies based in Northern Portugal. The fund specifically targets startups working in green tech, artificial intelligence, med-tech, and digital transformation. The investment strategy involves taking minority stakes in promising companies with proven products and initial market traction, typically at Series A or B funding rounds. The fund provides not just capital but also strategic guidance, industry connections, and operational support to accelerate growth. The management team includes former successful tech entrepreneurs and experienced venture capitalists with strong networks across Europe and the United States to help portfolio companies scale internationally.",
    geographicAllocation: [
      { region: "Portugal", percentage: 70 },
      { region: "Other EU Countries", percentage: 30 }
    ],
    team: [
      { 
        name: "Luís Carvalho", 
        position: "Managing Partner",
        bio: "Serial tech entrepreneur with two successful exits. Angel investor in over 30 startups.",
        photoUrl: "https://randomuser.me/api/portraits/men/32.jpg",
        linkedinUrl: "https://linkedin.com/in/luis-carvalho"
      },
      { 
        name: "Sofia Almeida", 
        position: "Investment Partner",
        bio: "Previously at Atomico and Accel Partners. Specialized in SaaS and AI investments.",
        photoUrl: "https://randomuser.me/api/portraits/women/26.jpg",
        linkedinUrl: "https://linkedin.com/in/sofia-almeida"
      },
      { 
        name: "Eduardo Martins", 
        position: "Technical Partner",
        bio: "Former CTO of a unicorn startup. Expert in software architecture and technical due diligence.",
        photoUrl: "https://randomuser.me/api/portraits/men/58.jpg",
        linkedinUrl: "https://linkedin.com/in/eduardo-martins"
      }
    ],
    documents: [
      { title: "Fund Prospectus", url: "https://example.com/porto-ventures-prospectus.pdf" },
      { title: "Investment Strategy", url: "https://example.com/porto-ventures-strategy.pdf" },
      { title: "Portfolio Companies", url: "https://example.com/porto-ventures-portfolio.pdf" }
    ],
    redemptionTerms: {
      frequency: "End of Term",
      redemptionOpen: false,
      noticePeriod: 180,
      earlyRedemptionFee: 5,
      minimumHoldingPeriod: 36,
      notes: "Early redemptions may be allowed in exceptional circumstances at the discretion of the fund manager."
    }
  },
  {
    id: "portugal-golden-fund-3",
    name: "Algarve Tourism & Hospitality Fund",
    description: "A fund specializing in premium tourism assets along Portugal's southern coast, from boutique hotels to high-end resorts.",
    category: "Real Estate",
    tags: ['Real Estate', 'Tourism', 'Medium Risk'],
    minimumInvestment: 500000,
    fundSize: 40,
    managementFee: 1.8,
    performanceFee: 18,
    subscriptionFee: 1,
    redemptionFee: 1.5,
    term: 6,
    managerName: "Southern Hospitality Investments",
    returnTarget: "7-9% annually",
    fundStatus: "Open",
    websiteUrl: "https://example.com/algarve-fund",
    established: 2019,
    regulatedBy: "CMVM (Portuguese Securities Market Commission)",
    location: "Faro, Portugal",
    detailedDescription: "The Algarve Tourism & Hospitality Fund focuses on acquiring, developing, and managing premium tourism-related assets across Portugal's sought-after southern coast. The fund invests in boutique hotels, luxury resorts, high-end vacation rentals, and select tourism experiences. With Portugal's tourism sector showing consistent growth year-over-year (outside the pandemic period), the fund capitalizes on increasing demand for upscale accommodations from both European and global travelers. The investment strategy focuses on properties with strong year-round potential to minimize seasonal fluctuations. The management team brings extensive experience from international hospitality groups and has implemented industry-leading sustainability practices across all properties to appeal to the growing eco-conscious luxury travel segment.",
    geographicAllocation: [
      { region: "Algarve, Portugal", percentage: 75 },
      { region: "Lisbon Coast, Portugal", percentage: 15 },
      { region: "Southern Spain", percentage: 10 }
    ],
    team: [
      { 
        name: "Ricardo Santos", 
        position: "CEO & Fund Manager",
        bio: "25+ years in luxury hospitality development across Mediterranean markets.",
        photoUrl: "https://randomuser.me/api/portraits/men/72.jpg",
        linkedinUrl: "https://linkedin.com/in/ricardo-santos"
      },
      { 
        name: "Helena Costa", 
        position: "Head of Acquisitions",
        bio: "Expert in tourism property valuation with experience at Four Seasons and Marriott development.",
        photoUrl: "https://randomuser.me/api/portraits/women/42.jpg",
        linkedinUrl: "https://linkedin.com/in/helena-costa"
      },
      { 
        name: "Miguel Ferreira", 
        position: "Operations Director",
        bio: "Former Regional Director for a major international hotel chain in Southern Europe.",
        photoUrl: "https://randomuser.me/api/portraits/men/62.jpg",
        linkedinUrl: "https://linkedin.com/in/miguel-ferreira"
      }
    ],
    documents: [
      { title: "Fund Prospectus", url: "https://example.com/algarve-fund-prospectus.pdf" },
      { title: "Tourism Market Analysis", url: "https://example.com/algarve-fund-market-analysis.pdf" },
      { title: "Sustainability Report", url: "https://example.com/algarve-fund-sustainability.pdf" }
    ],
    redemptionTerms: {
      frequency: "Quarterly",
      redemptionOpen: true,
      noticePeriod: 60,
      earlyRedemptionFee: 2.5,
      minimumHoldingPeriod: 12,
      notes: "Quarterly redemption windows subject to a maximum of 10% of fund NAV per quarter."
    }
  }
];
