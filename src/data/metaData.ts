export interface PageMetaData {
  title: string;
  description: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  twitterTitle: string;
  twitterDescription: string;
  imageAlt?: string;
}

// Homepage meta data
export const HOMEPAGE_META: PageMetaData = {
  title: "Portugal Golden Visa Investment Funds | Eligible Investments 2025",
  description: "Explore our Portugal Golden Visa Investment Funds List for 2025. Find eligible investment funds to secure residency with a €500,000 investment. Start your journey today!",
  keywords: "Portugal Golden Visa, Investment Funds, EU Residency, Golden Visa 2025, Portugal Investment, Residency by Investment",
  ogTitle: "Portugal Golden Visa Investment Funds Directory 2025",
  ogDescription: "Complete directory of eligible investment funds for Portugal Golden Visa program. Compare 11 qualified funds and start your residency journey.",
  twitterTitle: "Portugal Golden Visa Investment Funds Directory 2025",
  twitterDescription: "Complete directory of eligible investment funds for Portugal Golden Visa program. Compare 11 qualified funds and start your residency journey.",
  imageAlt: "Portugal Golden Visa Investment Funds Directory"
};

// Fund-specific meta data by fund ID
export const FUND_META_DATA: Record<string, PageMetaData> = {
  "3cc-golden-income": {
    title: "3CC Golden Income Fund | Portugal Golden Visa Investment",
    description: "Invest in 3CC Golden Income Fund for Portugal Golden Visa. €500,000 minimum investment, 5-year lock-up period. Secure your EU residency today.",
    keywords: "3CC Golden Income Fund, Portugal Golden Visa, Real Estate Investment, EU Residency, €500,000 Investment",
    ogTitle: "3CC Golden Income Fund - Portugal Golden Visa Investment",
    ogDescription: "Secure your Portugal Golden Visa with 3CC Golden Income Fund. Real estate focused investment with €500,000 minimum.",
    twitterTitle: "3CC Golden Income Fund - Portugal Golden Visa",
    twitterDescription: "Secure your Portugal Golden Visa with 3CC Golden Income Fund. Real estate focused investment with €500,000 minimum.",
    imageAlt: "3CC Golden Income Fund - Portugal Golden Visa Investment"
  },
  "growth-blue-fund": {
    title: "Growth Blue Fund | Portugal Golden Visa Private Equity Investment",
    description: "Growth Blue Fund offers private equity investment for Portugal Golden Visa. €500,000 minimum, diversified portfolio for EU residency.",
    keywords: "Growth Blue Fund, Portugal Golden Visa, Private Equity, EU Residency, Investment Fund",
    ogTitle: "Growth Blue Fund - Portugal Golden Visa Private Equity",
    ogDescription: "Achieve Portugal Golden Visa through Growth Blue Fund's private equity investment strategy. €500,000 minimum investment.",
    twitterTitle: "Growth Blue Fund - Portugal Golden Visa",
    twitterDescription: "Achieve Portugal Golden Visa through Growth Blue Fund's private equity investment strategy. €500,000 minimum investment.",
    imageAlt: "Growth Blue Fund - Portugal Golden Visa Private Equity Investment"
  },
  "horizon-fund": {
    title: "Horizon Fund | Portugal Golden Visa Real Estate Investment",
    description: "Horizon Fund specializes in real estate investments for Portugal Golden Visa. €500,000 minimum investment for EU residency.",
    keywords: "Horizon Fund, Portugal Golden Visa, Real Estate Investment, EU Residency, Property Investment",
    ogTitle: "Horizon Fund - Portugal Golden Visa Real Estate",
    ogDescription: "Invest in Portuguese real estate through Horizon Fund for Golden Visa eligibility. €500,000 minimum investment.",
    twitterTitle: "Horizon Fund - Portugal Golden Visa",
    twitterDescription: "Invest in Portuguese real estate through Horizon Fund for Golden Visa eligibility. €500,000 minimum investment.",
    imageAlt: "Horizon Fund - Portugal Golden Visa Real Estate Investment"
  },
  "lince-growth-fund": {
    title: "Lince Growth Fund | Portugal Golden Visa Growth Investment",
    description: "Lince Growth Fund offers growth-focused investment for Portugal Golden Visa. €500,000 minimum with diversified growth strategy.",
    keywords: "Lince Growth Fund, Portugal Golden Visa, Growth Investment, EU Residency, Diversified Portfolio",
    ogTitle: "Lince Growth Fund - Portugal Golden Visa Growth Investment",
    ogDescription: "Secure Portugal Golden Visa with Lince Growth Fund's diversified growth investment strategy. €500,000 minimum.",
    twitterTitle: "Lince Growth Fund - Portugal Golden Visa",
    twitterDescription: "Secure Portugal Golden Visa with Lince Growth Fund's diversified growth investment strategy. €500,000 minimum.",
    imageAlt: "Lince Growth Fund - Portugal Golden Visa Growth Investment"
  },
  "lince-yield-fund": {
    title: "Lince Yield Fund | Portugal Golden Visa Income Investment",
    description: "Lince Yield Fund focuses on income generation for Portugal Golden Visa investors. €500,000 minimum investment for EU residency.",
    keywords: "Lince Yield Fund, Portugal Golden Visa, Income Investment, EU Residency, Yield Strategy",
    ogTitle: "Lince Yield Fund - Portugal Golden Visa Income Investment",
    ogDescription: "Generate income while securing Portugal Golden Visa through Lince Yield Fund. €500,000 minimum investment.",
    twitterTitle: "Lince Yield Fund - Portugal Golden Visa",
    twitterDescription: "Generate income while securing Portugal Golden Visa through Lince Yield Fund. €500,000 minimum investment.",
    imageAlt: "Lince Yield Fund - Portugal Golden Visa Income Investment"
  },
  "mercurio-fund-ii": {
    title: "Mercurio Fund II | Portugal Golden Visa Investment Opportunity",
    description: "Mercurio Fund II offers investment opportunities for Portugal Golden Visa. €500,000 minimum investment for EU residency eligibility.",
    keywords: "Mercurio Fund II, Portugal Golden Visa, Investment Opportunity, EU Residency, Alternative Investment",
    ogTitle: "Mercurio Fund II - Portugal Golden Visa Investment",
    ogDescription: "Secure Portugal Golden Visa through Mercurio Fund II investment opportunities. €500,000 minimum investment required.",
    twitterTitle: "Mercurio Fund II - Portugal Golden Visa",
    twitterDescription: "Secure Portugal Golden Visa through Mercurio Fund II investment opportunities. €500,000 minimum investment required.",
    imageAlt: "Mercurio Fund II - Portugal Golden Visa Investment"
  },
  "optimize-golden-opportunities": {
    title: "Optimize Golden Opportunities | Portugal Golden Visa Fund",
    description: "Optimize Golden Opportunities Fund for Portugal Golden Visa investment. €500,000 minimum, optimized for Golden Visa eligibility.",
    keywords: "Optimize Golden Opportunities, Portugal Golden Visa, Optimized Investment, EU Residency, Golden Visa Fund",
    ogTitle: "Optimize Golden Opportunities - Portugal Golden Visa Fund",
    ogDescription: "Optimize your Portugal Golden Visa investment with specialized fund designed for residency eligibility. €500,000 minimum.",
    twitterTitle: "Optimize Golden Opportunities - Portugal Golden Visa",
    twitterDescription: "Optimize your Portugal Golden Visa investment with specialized fund designed for residency eligibility. €500,000 minimum.",
    imageAlt: "Optimize Golden Opportunities - Portugal Golden Visa Fund"
  },
  "portugal-investment-1": {
    title: "Portugal Investment Fund 1 | Golden Visa Investment",
    description: "Portugal Investment Fund 1 offers direct investment for Golden Visa eligibility. €500,000 minimum for EU residency through Portuguese investments.",
    keywords: "Portugal Investment Fund 1, Golden Visa, Direct Investment, EU Residency, Portuguese Investment",
    ogTitle: "Portugal Investment Fund 1 - Golden Visa Investment",
    ogDescription: "Direct Portuguese investment through Portugal Investment Fund 1 for Golden Visa eligibility. €500,000 minimum investment.",
    twitterTitle: "Portugal Investment Fund 1 - Golden Visa",
    twitterDescription: "Direct Portuguese investment through Portugal Investment Fund 1 for Golden Visa eligibility. €500,000 minimum investment.",
    imageAlt: "Portugal Investment Fund 1 - Golden Visa Investment"
  },
  "portugal-liquid-opportunities": {
    title: "Portugal Liquid Opportunities | Golden Visa Liquid Investment",
    description: "Portugal Liquid Opportunities Fund offers liquid investment options for Golden Visa. €500,000 minimum with enhanced liquidity features.",
    keywords: "Portugal Liquid Opportunities, Golden Visa, Liquid Investment, EU Residency, Flexible Investment",
    ogTitle: "Portugal Liquid Opportunities - Golden Visa Liquid Investment",
    ogDescription: "Liquid investment options for Portugal Golden Visa through specialized opportunities fund. €500,000 minimum investment.",
    twitterTitle: "Portugal Liquid Opportunities - Golden Visa",
    twitterDescription: "Liquid investment options for Portugal Golden Visa through specialized opportunities fund. €500,000 minimum investment.",
    imageAlt: "Portugal Liquid Opportunities - Golden Visa Liquid Investment"
  },
  "solar-future-fund": {
    title: "Solar Future Fund | Portugal Golden Visa Green Investment",
    description: "Solar Future Fund offers sustainable green investment for Portugal Golden Visa. €500,000 minimum in renewable energy projects.",
    keywords: "Solar Future Fund, Portugal Golden Visa, Green Investment, Renewable Energy, Sustainable Investment, EU Residency",
    ogTitle: "Solar Future Fund - Portugal Golden Visa Green Investment",
    ogDescription: "Sustainable Portugal Golden Visa investment through Solar Future Fund's renewable energy projects. €500,000 minimum.",
    twitterTitle: "Solar Future Fund - Portugal Golden Visa",
    twitterDescription: "Sustainable Portugal Golden Visa investment through Solar Future Fund's renewable energy projects. €500,000 minimum.",
    imageAlt: "Solar Future Fund - Portugal Golden Visa Green Investment"
  },
  "steady-growth-investment": {
    title: "Steady Growth Investment | Portugal Golden Visa Stable Fund",
    description: "Steady Growth Investment Fund provides stable growth for Portugal Golden Visa. €500,000 minimum with conservative growth strategy.",
    keywords: "Steady Growth Investment, Portugal Golden Visa, Stable Fund, Conservative Growth, EU Residency",
    ogTitle: "Steady Growth Investment - Portugal Golden Visa Stable Fund",
    ogDescription: "Stable growth strategy for Portugal Golden Visa through conservative investment approach. €500,000 minimum investment.",
    twitterTitle: "Steady Growth Investment - Portugal Golden Visa",
    twitterDescription: "Stable growth strategy for Portugal Golden Visa through conservative investment approach. €500,000 minimum investment.",
    imageAlt: "Steady Growth Investment - Portugal Golden Visa Stable Fund"
  }
};

// Tag-specific meta data
export const TAG_META_DATA: Record<string, PageMetaData> = {
  "crypto": {
    title: "Crypto Golden Visa Funds | Portugal Digital Asset Investment",
    description: "Explore cryptocurrency and digital asset Golden Visa funds for Portugal residency. Compare crypto-focused investment options with €500,000 minimum.",
    keywords: "Crypto Golden Visa, Portugal, Digital Assets, Cryptocurrency Investment, EU Residency, Blockchain Investment",
    ogTitle: "Crypto Golden Visa Funds - Portugal Digital Asset Investment",
    ogDescription: "Secure Portugal Golden Visa through cryptocurrency and digital asset investment funds. Compare crypto-focused options.",
    twitterTitle: "Crypto Golden Visa Funds - Portugal",
    twitterDescription: "Secure Portugal Golden Visa through cryptocurrency and digital asset investment funds. Compare crypto-focused options.",
    imageAlt: "Crypto Golden Visa Investment Funds"
  },
  "high-yield": {
    title: "High Yield Golden Visa Funds | Portugal High Return Investment",
    description: "High yield Golden Visa investment funds for Portugal residency. Compare high-return investment options with €500,000 minimum investment.",
    keywords: "High Yield Golden Visa, Portugal, High Return Investment, EU Residency, Income Generation",
    ogTitle: "High Yield Golden Visa Funds - Portugal High Return Investment",
    ogDescription: "Maximize returns with high yield Golden Visa investment funds for Portugal residency. Compare high-return options.",
    twitterTitle: "High Yield Golden Visa Funds - Portugal",
    twitterDescription: "Maximize returns with high yield Golden Visa investment funds for Portugal residency. Compare high-return options.",
    imageAlt: "High Yield Golden Visa Investment Funds"
  },
  "real-estate": {
    title: "Real Estate Golden Visa Funds | Portugal Property Investment",
    description: "Real estate focused Golden Visa investment funds for Portugal residency. Compare property investment options with €500,000 minimum.",
    keywords: "Real Estate Golden Visa, Portugal, Property Investment, EU Residency, Real Estate Funds",
    ogTitle: "Real Estate Golden Visa Funds - Portugal Property Investment",
    ogDescription: "Invest in Portuguese real estate through Golden Visa funds for EU residency. Compare property-focused investment options.",
    twitterTitle: "Real Estate Golden Visa Funds - Portugal",
    twitterDescription: "Invest in Portuguese real estate through Golden Visa funds for EU residency. Compare property-focused investment options.",
    imageAlt: "Real Estate Golden Visa Investment Funds"
  },
  "private-equity": {
    title: "Private Equity Golden Visa Funds | Portugal PE Investment",
    description: "Private equity Golden Visa investment funds for Portugal residency. Compare PE investment options with €500,000 minimum investment.",
    keywords: "Private Equity Golden Visa, Portugal, PE Investment, EU Residency, Alternative Investment",
    ogTitle: "Private Equity Golden Visa Funds - Portugal PE Investment",
    ogDescription: "Secure Portugal Golden Visa through private equity investment funds. Compare PE-focused investment options.",
    twitterTitle: "Private Equity Golden Visa Funds - Portugal",
    twitterDescription: "Secure Portugal Golden Visa through private equity investment funds. Compare PE-focused investment options.",
    imageAlt: "Private Equity Golden Visa Investment Funds"
  },
  "green-energy": {
    title: "Green Energy Golden Visa Funds | Portugal Sustainable Investment",
    description: "Green energy and sustainable Golden Visa investment funds for Portugal residency. Compare eco-friendly options with €500,000 minimum.",
    keywords: "Green Energy Golden Visa, Portugal, Sustainable Investment, Renewable Energy, EU Residency, ESG Investment",
    ogTitle: "Green Energy Golden Visa Funds - Portugal Sustainable Investment",
    ogDescription: "Sustainable Portugal Golden Visa investment through green energy and renewable projects. Compare eco-friendly options.",
    twitterTitle: "Green Energy Golden Visa Funds - Portugal",
    twitterDescription: "Sustainable Portugal Golden Visa investment through green energy and renewable projects. Compare eco-friendly options.",
    imageAlt: "Green Energy Golden Visa Investment Funds"
  }
};

// Category-specific meta data
export const CATEGORY_META_DATA: Record<string, PageMetaData> = {
  "real-estate": {
    title: "Real Estate Golden Visa Funds | Portugal Property Investment",
    description: "Browse real estate category Golden Visa investment funds for Portugal residency. Property-focused funds with €500,000 minimum investment.",
    keywords: "Real Estate Golden Visa, Portugal Property Investment, Real Estate Funds, EU Residency",
    ogTitle: "Real Estate Golden Visa Funds - Portugal Property Investment",
    ogDescription: "Property investment funds for Portugal Golden Visa eligibility. Browse real estate category options.",
    twitterTitle: "Real Estate Golden Visa Funds - Portugal",
    twitterDescription: "Property investment funds for Portugal Golden Visa eligibility. Browse real estate category options.",
    imageAlt: "Real Estate Golden Visa Investment Funds"
  },
  "private-equity": {
    title: "Private Equity Golden Visa Funds | Portugal PE Investment",
    description: "Browse private equity category Golden Visa investment funds for Portugal residency. PE-focused funds with €500,000 minimum investment.",
    keywords: "Private Equity Golden Visa, Portugal PE Investment, Private Equity Funds, EU Residency",
    ogTitle: "Private Equity Golden Visa Funds - Portugal PE Investment",
    ogDescription: "Private equity investment funds for Portugal Golden Visa eligibility. Browse PE category options.",
    twitterTitle: "Private Equity Golden Visa Funds - Portugal",
    twitterDescription: "Private equity investment funds for Portugal Golden Visa eligibility. Browse PE category options.",
    imageAlt: "Private Equity Golden Visa Investment Funds"
  },
  "mixed": {
    title: "Mixed Golden Visa Funds | Portugal Diversified Investment",
    description: "Browse mixed category Golden Visa investment funds for Portugal residency. Diversified funds with €500,000 minimum investment.",
    keywords: "Mixed Golden Visa Funds, Portugal Diversified Investment, Mixed Funds, EU Residency",
    ogTitle: "Mixed Golden Visa Funds - Portugal Diversified Investment",
    ogDescription: "Diversified mixed investment funds for Portugal Golden Visa eligibility. Browse mixed category options.",
    twitterTitle: "Mixed Golden Visa Funds - Portugal",
    twitterDescription: "Diversified mixed investment funds for Portugal Golden Visa eligibility. Browse mixed category options.",
    imageAlt: "Mixed Golden Visa Investment Funds"
  }
};

// Static pages meta data
export const STATIC_PAGES_META: Record<string, PageMetaData> = {
  "about": {
    title: "About Us | Portugal Golden Visa Investment Funds Directory",
    description: "Learn about our mission to help investors find the best Portugal Golden Visa investment funds. Expert guidance for EU residency through investment.",
    keywords: "About Portugal Golden Visa, Investment Fund Directory, EU Residency Experts, Golden Visa Guidance",
    ogTitle: "About Us - Portugal Golden Visa Investment Funds Directory",
    ogDescription: "Expert guidance for Portugal Golden Visa investment funds and EU residency through investment.",
    twitterTitle: "About Us - Portugal Golden Visa Directory",
    twitterDescription: "Expert guidance for Portugal Golden Visa investment funds and EU residency through investment.",
    imageAlt: "About Portugal Golden Visa Investment Directory"
  },
  "faqs": {
    title: "FAQs | Portugal Golden Visa Investment Funds",
    description: "Frequently asked questions about Portugal Golden Visa investment funds. Get answers about eligibility, requirements, and investment process.",
    keywords: "Portugal Golden Visa FAQ, Investment Fund Questions, EU Residency FAQ, Golden Visa Requirements",
    ogTitle: "FAQs - Portugal Golden Visa Investment Funds",
    ogDescription: "Get answers to common questions about Portugal Golden Visa investment funds and EU residency requirements.",
    twitterTitle: "FAQs - Portugal Golden Visa",
    twitterDescription: "Get answers to common questions about Portugal Golden Visa investment funds and EU residency requirements.",
    imageAlt: "Portugal Golden Visa FAQs"
  },
  "roi-calculator": {
    title: "ROI Calculator | Portugal Golden Visa Investment Returns",
    description: "Calculate potential returns on Portugal Golden Visa investment funds. Free ROI calculator for EU residency investment planning.",
    keywords: "Portugal Golden Visa ROI Calculator, Investment Returns, EU Residency Calculator, Golden Visa Returns",
    ogTitle: "ROI Calculator - Portugal Golden Visa Investment Returns",
    ogDescription: "Calculate potential returns on your Portugal Golden Visa investment with our free ROI calculator.",
    twitterTitle: "ROI Calculator - Portugal Golden Visa",
    twitterDescription: "Calculate potential returns on your Portugal Golden Visa investment with our free ROI calculator.",
    imageAlt: "Portugal Golden Visa ROI Calculator"
  },
  "fund-quiz": {
    title: "Fund Quiz | Find Your Perfect Portugal Golden Visa Investment",
    description: "Take our fund quiz to find the perfect Portugal Golden Visa investment fund for your needs. Personalized recommendations for EU residency.",
    keywords: "Portugal Golden Visa Quiz, Fund Finder, Investment Quiz, EU Residency Quiz, Golden Visa Recommendations",
    ogTitle: "Fund Quiz - Find Your Perfect Portugal Golden Visa Investment",
    ogDescription: "Discover the ideal Portugal Golden Visa investment fund with our personalized quiz and recommendations.",
    twitterTitle: "Fund Quiz - Portugal Golden Visa",
    twitterDescription: "Discover the ideal Portugal Golden Visa investment fund with our personalized quiz and recommendations.",
    imageAlt: "Portugal Golden Visa Fund Quiz"
  }
};

// Manager-specific meta data by manager name slug
export const MANAGER_META_DATA: Record<string, PageMetaData> = {
  "lince-capital": {
    title: "Lince Capital | Portugal Golden Visa Fund Manager Profile",
    description: "Lince Capital manages 2 Golden Visa investment funds for Portugal residency. Explore Growth and Yield funds with €500,000 minimum investment.",
    keywords: "Lince Capital, Portugal Golden Visa, Fund Manager, Investment Funds, EU Residency",
    ogTitle: "Lince Capital - Portugal Golden Visa Fund Manager",
    ogDescription: "Leading fund manager for Portugal Golden Visa investments. Manage Growth and Yield funds for EU residency.",
    twitterTitle: "Lince Capital - Golden Visa Fund Manager",
    twitterDescription: "Leading fund manager for Portugal Golden Visa investments. Manage Growth and Yield funds for EU residency.",
    imageAlt: "Lince Capital - Portugal Golden Visa Fund Manager"
  },
  "3cc-fund-management": {
    title: "3CC Fund Management | Portugal Golden Visa Fund Manager",
    description: "3CC Fund Management specializes in Golden Visa investment funds for Portugal residency. Real estate focused investments with €500,000 minimum.",
    keywords: "3CC Fund Management, Portugal Golden Visa, Real Estate Funds, Investment Manager, EU Residency",
    ogTitle: "3CC Fund Management - Portugal Golden Visa Specialist",
    ogDescription: "Real estate focused Golden Visa investment funds for Portugal residency. €500,000 minimum investment.",
    twitterTitle: "3CC Fund Management - Golden Visa",
    twitterDescription: "Real estate focused Golden Visa investment funds for Portugal residency. €500,000 minimum investment.",
    imageAlt: "3CC Fund Management - Portugal Golden Visa Specialist"
  },
  "optimize-investment-partners": {
    title: "Optimize Investment Partners | Portugal Golden Visa Manager",
    description: "Optimize Investment Partners offers specialized Golden Visa investment funds for Portugal residency. Optimized investment strategies.",
    keywords: "Optimize Investment Partners, Portugal Golden Visa, Investment Manager, EU Residency, Optimized Funds",
    ogTitle: "Optimize Investment Partners - Golden Visa Manager",
    ogDescription: "Specialized Golden Visa investment funds optimized for Portugal residency eligibility.",
    twitterTitle: "Optimize Investment Partners - Golden Visa",
    twitterDescription: "Specialized Golden Visa investment funds optimized for Portugal residency eligibility.",
    imageAlt: "Optimize Investment Partners - Golden Visa Manager"
  },
  "growth-blue-partners": {
    title: "Growth Blue Partners | Portugal Golden Visa Fund Manager",
    description: "Growth Blue Partners manages private equity funds for Portugal Golden Visa eligibility. Professional investment management for EU residency.",
    keywords: "Growth Blue Partners, Portugal Golden Visa, Private Equity, Fund Manager, EU Residency",
    ogTitle: "Growth Blue Partners - Golden Visa Fund Manager",
    ogDescription: "Private equity investment management for Portugal Golden Visa eligibility and EU residency.",
    twitterTitle: "Growth Blue Partners - Golden Visa",
    twitterDescription: "Private equity investment management for Portugal Golden Visa eligibility and EU residency.",
    imageAlt: "Growth Blue Partners - Golden Visa Fund Manager"
  },
  "horizon-capital": {
    title: "Horizon Capital | Portugal Golden Visa Investment Manager",
    description: "Horizon Capital specializes in real estate investment funds for Portugal Golden Visa. Professional management for EU residency investments.",
    keywords: "Horizon Capital, Portugal Golden Visa, Real Estate Investment, Fund Manager, EU Residency",
    ogTitle: "Horizon Capital - Golden Visa Investment Manager",
    ogDescription: "Real estate investment funds managed by Horizon Capital for Portugal Golden Visa eligibility.",
    twitterTitle: "Horizon Capital - Golden Visa",
    twitterDescription: "Real estate investment funds managed by Horizon Capital for Portugal Golden Visa eligibility.",
    imageAlt: "Horizon Capital - Golden Visa Investment Manager"
  },
  "mercurio-capital": {
    title: "Mercurio Capital | Portugal Golden Visa Fund Manager",
    description: "Mercurio Capital offers investment opportunities for Portugal Golden Visa eligibility. Professional fund management for EU residency.",
    keywords: "Mercurio Capital, Portugal Golden Visa, Investment Manager, Fund Management, EU Residency",
    ogTitle: "Mercurio Capital - Golden Visa Fund Manager",
    ogDescription: "Professional investment fund management for Portugal Golden Visa eligibility and EU residency.",
    twitterTitle: "Mercurio Capital - Golden Visa",
    twitterDescription: "Professional investment fund management for Portugal Golden Visa eligibility and EU residency.",
    imageAlt: "Mercurio Capital - Golden Visa Fund Manager"
  },
  "portugal-fund-management": {
    title: "Portugal Fund Management | Golden Visa Investment Manager",
    description: "Portugal Fund Management offers direct investment funds for Golden Visa eligibility. Specialized Portuguese investment management.",
    keywords: "Portugal Fund Management, Golden Visa, Portuguese Investment, Fund Manager, EU Residency",
    ogTitle: "Portugal Fund Management - Golden Visa Manager",
    ogDescription: "Direct Portuguese investment funds for Golden Visa eligibility managed by local experts.",
    twitterTitle: "Portugal Fund Management - Golden Visa",
    twitterDescription: "Direct Portuguese investment funds for Golden Visa eligibility managed by local experts.",
    imageAlt: "Portugal Fund Management - Golden Visa Manager"
  },
  "solar-future-capital": {
    title: "Solar Future Capital | Green Energy Golden Visa Manager",
    description: "Solar Future Capital manages sustainable investment funds for Portugal Golden Visa. Green energy investments for EU residency.",
    keywords: "Solar Future Capital, Portugal Golden Visa, Green Energy, Sustainable Investment, EU Residency",
    ogTitle: "Solar Future Capital - Green Golden Visa Manager",
    ogDescription: "Sustainable green energy investment funds for Portugal Golden Visa and EU residency.",
    twitterTitle: "Solar Future Capital - Green Golden Visa",
    twitterDescription: "Sustainable green energy investment funds for Portugal Golden Visa and EU residency.",
    imageAlt: "Solar Future Capital - Green Golden Visa Manager"
  },
  "steady-growth-partners": {
    title: "Steady Growth Partners | Portugal Golden Visa Manager",
    description: "Steady Growth Partners offers stable investment funds for Portugal Golden Visa. Conservative growth strategies for EU residency.",
    keywords: "Steady Growth Partners, Portugal Golden Visa, Stable Investment, Conservative Growth, EU Residency",
    ogTitle: "Steady Growth Partners - Golden Visa Manager",
    ogDescription: "Stable, conservative investment funds for Portugal Golden Visa eligibility and EU residency.",
    twitterTitle: "Steady Growth Partners - Golden Visa",
    twitterDescription: "Stable, conservative investment funds for Portugal Golden Visa eligibility and EU residency.",
    imageAlt: "Steady Growth Partners - Golden Visa Manager"
  }
};
