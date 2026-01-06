// Fee type content configuration for specialized tag pages and the fees hub

export const FEE_TYPE_SLUGS = [
  'management-fee',
  'performance-fee',
  'subscription-fee',
  'redemption-fee',
  'exit-fee'
] as const;

export type FeeTypeSlug = typeof FEE_TYPE_SLUGS[number];

export const isFeeTypeSlug = (slug: string): slug is FeeTypeSlug => {
  return FEE_TYPE_SLUGS.includes(slug as FeeTypeSlug);
};

interface FeeTypeContent {
  title: string;
  metaTitle: string;
  metaDescription: string;
  definition: string;
  howItWorks: string[];
  verifyChecklist: string[];
  faqs: { question: string; answer: string }[];
}

export const FEE_TYPE_CONTENT: Record<FeeTypeSlug, FeeTypeContent> = {
  'management-fee': {
    title: 'Management Fee: Portugal Golden Visa Funds (2026)',
    metaTitle: 'Management Fee in Portugal Golden Visa Funds (2026) | Movingto Funds',
    metaDescription: 'Compare funds by management fee. See disclosed fee ranges, how the fee works, and which documents to verify before subscribing to the €500k route.',
    definition: 'An annual fee charged as a percentage of assets under management (AUM), covering the fund manager\'s operational costs and compensation.',
    howItWorks: [
      'Management fees are typically calculated as a percentage of Net Asset Value (NAV) or committed capital, charged annually.',
      'The fee covers fund administration, portfolio management, reporting, and regulatory compliance costs.',
      'Rates for Portugal Golden Visa funds typically range from 0.5% to 2.5% annually, depending on strategy and complexity.',
      'Some funds quote "all-in" fees (including admin/depositary), while others list these separately—always clarify the total annual cost.'
    ],
    verifyChecklist: [
      'Fee base: Is it calculated on NAV, committed capital, or invested capital?',
      'Calculation frequency: Monthly, quarterly, or annually?',
      'What\'s included: Does it cover admin, depositary, and audit fees, or are these extra?',
      'Share class differences: Different minimums may have different fee rates',
      'Fee changes: Can the fee increase during the fund\'s life?'
    ],
    faqs: [
      {
        question: 'What is a typical management fee for Golden Visa funds?',
        answer: 'Management fees typically range from 1% to 2% annually for most Portugal Golden Visa funds. Venture capital and private equity funds tend to be at the higher end (1.5-2.5%), while debt and real estate funds often charge lower rates (0.75-1.5%).'
      },
      {
        question: 'Are admin and depositary fees included in the management fee?',
        answer: 'It depends on the fund. Some quote "all-in" management fees that include administration and depositary costs, while others list these as separate charges. Always ask for the Total Expense Ratio (TER) to understand the full annual cost.'
      },
      {
        question: 'Can management fees change over time?',
        answer: 'Management fees are typically fixed for the life of the fund, but some funds reserve the right to adjust fees with investor consent. Check the fund documents for any fee adjustment clauses.'
      },
      {
        question: 'How does the management fee affect my returns?',
        answer: 'Management fees directly reduce your net returns. A 2% annual fee on a €500k investment costs €10,000 per year. Over a 6-year hold period, this can significantly impact total returns—always compare funds on a net-of-fees basis.'
      },
      {
        question: 'Where can I verify the management fee?',
        answer: 'The official management fee is disclosed in the fund\'s prospectus or Information Memorandum. You can also check the CMVM register for regulated funds. We source our data from these official documents.'
      },
      {
        question: 'Is the management fee negotiable?',
        answer: 'For standard Golden Visa subscriptions (€500k), fees are typically fixed. However, larger commitments may qualify for institutional share classes with lower fees. Some funds offer fee discounts for early subscribers.'
      }
    ]
  },
  'performance-fee': {
    title: 'Performance Fee: Portugal Golden Visa Funds (2026)',
    metaTitle: 'Performance Fee in Portugal Golden Visa Funds (2026) | Movingto Funds',
    metaDescription: 'Compare funds by performance fee structure. Understand hurdle rates, high-water marks, and catch-up provisions before investing in Golden Visa funds.',
    definition: 'A fee charged on investment gains above a specified threshold, aligning manager interests with investor returns.',
    howItWorks: [
      'Performance fees are typically charged as a percentage (often 20%) of profits above a hurdle rate or high-water mark.',
      'The hurdle rate is a minimum return threshold that must be met before performance fees apply (e.g., 6% annually).',
      'High-water marks ensure managers only earn performance fees on new gains, not recovered losses.',
      'Some funds use "catch-up" provisions where the manager receives a larger share of returns once the hurdle is met.'
    ],
    verifyChecklist: [
      'Performance fee rate: What percentage of profits does the manager take?',
      'Hurdle rate: Is there a minimum return before fees apply? What rate?',
      'High-water mark: Are performance fees only on new gains above previous peaks?',
      'Calculation timing: When are performance fees crystallized (annually, at exit)?',
      'Catch-up provisions: Does the manager catch up on deferred fees?'
    ],
    faqs: [
      {
        question: 'What is a typical performance fee?',
        answer: 'The industry standard is 20% of profits, but rates range from 10% to 25% depending on the fund strategy. Some funds charge no performance fee at all, particularly debt-focused funds with lower return profiles.'
      },
      {
        question: 'What is a hurdle rate?',
        answer: 'A hurdle rate is the minimum annual return (e.g., 6% or 8%) that must be achieved before the manager can charge performance fees. This protects investors from paying for modest returns.'
      },
      {
        question: 'What is a high-water mark?',
        answer: 'A high-water mark ensures you only pay performance fees on new profits above your previous highest value. If the fund drops and recovers, you don\'t pay fees on the recovery portion.'
      },
      {
        question: 'Can I pay performance fees even if returns are modest?',
        answer: 'Without a hurdle rate, yes—you could pay performance fees on any positive return. Funds with proper hurdle rates and high-water marks provide better investor protection.'
      },
      {
        question: 'When are performance fees calculated?',
        answer: 'This varies by fund. Some calculate annually, others only at exit or when gains are realized. Annual crystallization can result in paying fees even if later years underperform.'
      },
      {
        question: 'Are performance fees negotiable?',
        answer: 'Performance fee terms are typically fixed in the fund documents. However, some funds offer different share classes with varying fee structures for larger commitments.'
      }
    ]
  },
  'subscription-fee': {
    title: 'Subscription & Entry Fees: Portugal Golden Visa Funds (2026)',
    metaTitle: 'Entry & Subscription Fees in Portugal Golden Visa Funds (2026) | Movingto Funds',
    metaDescription: 'Understand subscription and entry fees for Golden Visa funds. Compare one-time costs, setup charges, and how they affect your investment.',
    definition: 'A one-time fee charged when you subscribe to or enter a fund, typically calculated as a percentage of your investment amount.',
    howItWorks: [
      'Subscription fees are charged upfront when you invest, reducing your initial capital in the fund.',
      'Rates typically range from 0% to 3% of the investment amount for Portugal Golden Visa funds.',
      'Some funds waive subscription fees entirely, while others use them to cover onboarding and legal costs.',
      'Entry fees are different from setup fees—always clarify what\'s included and what\'s charged separately.'
    ],
    verifyChecklist: [
      'Fee percentage: What is the exact subscription fee rate?',
      'What\'s included: Does it cover legal, KYC, and account setup costs?',
      'Separate charges: Are there additional one-time fees (setup, legal, etc.)?',
      'Payment timing: Is the fee deducted from your investment or paid separately?',
      'Early bird discounts: Are there reduced fees for early subscribers?'
    ],
    faqs: [
      {
        question: 'What is a typical subscription fee?',
        answer: 'Many Portugal Golden Visa funds charge 0-2% subscription fees. Some premium funds charge up to 3%, while others have eliminated entry fees entirely to attract investors.'
      },
      {
        question: 'Is the subscription fee deducted from my €500k investment?',
        answer: 'This varies by fund. Some deduct the fee from your investment (so €500k minus fee goes into the fund), while others require you to pay it separately on top of the €500k.'
      },
      {
        question: 'Are there other one-time fees besides the subscription fee?',
        answer: 'Yes, some funds charge separate setup fees, legal fees, or KYC/AML verification costs. Always ask for a complete breakdown of all one-time charges.'
      },
      {
        question: 'Can subscription fees be negotiated?',
        answer: 'For standard subscriptions, fees are typically fixed. However, some funds offer reduced fees for early-stage subscribers or for larger commitments above the minimum.'
      },
      {
        question: 'How does the subscription fee affect my investment?',
        answer: 'A 2% subscription fee on €500k means €10,000 is taken upfront. This reduces your capital working in the fund from day one, impacting your total return over the holding period.'
      }
    ]
  },
  'redemption-fee': {
    title: 'Redemption & Exit Fees: Portugal Golden Visa Funds (2026)',
    metaTitle: 'Redemption & Exit Fees in Portugal Golden Visa Funds (2026) | Movingto Funds',
    metaDescription: 'Compare redemption and exit fees across Golden Visa funds. Understand liquidity costs, early redemption penalties, and exit timing.',
    definition: 'Fees charged when you withdraw your investment from a fund, either as a percentage of redemption value or as a penalty for early exit.',
    howItWorks: [
      'Redemption fees compensate the fund for liquidating positions to meet your withdrawal request.',
      'Some funds charge declining fees: higher for early redemption, lower or zero after the lock-up period.',
      'Exit fees may be waived entirely after the minimum holding period (typically 5-6 years for Golden Visa).',
      'The fee structure varies significantly—some funds have no exit fees, others charge up to 5% for early redemption.'
    ],
    verifyChecklist: [
      'Exit fee schedule: Does the fee decline over time? What are the rates?',
      'Lock-up period: How long before you can redeem without penalty?',
      'Redemption windows: When can you actually exit (quarterly, annually)?',
      'Notice period: How much advance notice is required for redemption?',
      'Fee-free exit: Are there circumstances where no exit fee applies?'
    ],
    faqs: [
      {
        question: 'What is a typical redemption fee?',
        answer: 'Redemption fees vary widely. Some funds charge 0% after the lock-up period, while others charge 1-3% on all redemptions. Early redemption penalties can reach 5% or more in the first years.'
      },
      {
        question: 'What is the difference between redemption fee and exit fee?',
        answer: 'These terms are often used interchangeably. Redemption fee typically refers to the cost of withdrawing during normal redemption windows, while exit fee may refer to penalties for early or off-cycle redemptions.'
      },
      {
        question: 'Can I redeem my investment before the Golden Visa holding period ends?',
        answer: 'Technically yes, but early redemption may jeopardize your Golden Visa application and incur penalty fees. Most investors hold for the minimum required period (currently 5 years for investments made under the current rules).'
      },
      {
        question: 'How do redemption windows work?',
        answer: 'Many funds allow redemptions only at specific intervals (quarterly or annually) with advance notice (30-90 days). Open-ended funds with daily NAV may offer more frequent redemption opportunities.'
      },
      {
        question: 'Are redemption fees negotiable?',
        answer: 'Redemption fee schedules are typically fixed in fund documents. However, understanding the schedule upfront helps you plan your exit timing to minimize costs.'
      }
    ]
  },
  'exit-fee': {
    title: 'Exit Fees: Portugal Golden Visa Funds (2026)',
    metaTitle: 'Exit Fees in Portugal Golden Visa Funds (2026) | Movingto Funds',
    metaDescription: 'Understand exit fee structures for Golden Visa funds. Compare costs of exiting investments and plan your liquidity strategy.',
    definition: 'Fees charged when you exit or redeem your investment, particularly relevant for closed-end funds with defined investment periods.',
    howItWorks: [
      'Exit fees may apply when redeeming before the fund\'s maturity or outside normal redemption windows.',
      'Closed-end funds often return capital at maturity without exit fees, but early exit penalties may be substantial.',
      'Some funds distinguish between voluntary exit (with fee) and mandatory return of capital (no fee).',
      'The fee structure should be evaluated alongside the fund\'s liquidity terms and expected hold period.'
    ],
    verifyChecklist: [
      'Exit fee structure: Flat rate, declining schedule, or penalty-based?',
      'Maturity terms: When does the fund naturally wind down and return capital?',
      'Early exit options: Can you exit before maturity, and at what cost?',
      'Secondary market: Is there a secondary market for selling your units?',
      'Tax implications: How are exit fees treated for tax purposes?'
    ],
    faqs: [
      {
        question: 'Is exit fee the same as redemption fee?',
        answer: 'They\'re related but not identical. Exit fee often refers specifically to fees charged at the end of an investment or when leaving a closed-end fund, while redemption fees apply to ongoing withdrawal requests from open-ended funds.'
      },
      {
        question: 'Do all funds charge exit fees?',
        answer: 'No. Many funds, especially open-ended structures with daily NAV, charge no exit fees after the lock-up period. However, closed-end funds and private equity structures may have exit costs or carry provisions at maturity.'
      },
      {
        question: 'What happens if the fund returns capital before I\'m ready?',
        answer: 'When a fund winds down and returns capital, this is typically fee-free as it\'s a mandatory distribution, not a voluntary exit. However, you\'ll need to reinvest if you still need qualifying Golden Visa assets.'
      },
      {
        question: 'Can I sell my fund units to another investor?',
        answer: 'Some funds facilitate secondary market transfers, though this can be complex and may incur transfer fees. Liquidity in the secondary market is typically limited for Golden Visa funds.'
      },
      {
        question: 'How do exit fees affect my total return?',
        answer: 'Exit fees directly reduce your final payout. A 2% exit fee on a €500k position is €10,000. Always factor exit costs into your return projections when comparing funds.'
      }
    ]
  }
};

export const FEES_HUB_FAQS = [
  {
    question: 'What fees do Portugal Golden Visa funds typically charge?',
    answer: 'Most funds charge a combination of: management fees (1-2% annually), performance fees (0-20% of profits above a hurdle), and potentially subscription/redemption fees (0-3%). The total cost varies significantly by fund type and strategy.'
  },
  {
    question: 'Are fund fees negotiable?',
    answer: 'For standard €500k Golden Visa subscriptions, fee terms are typically fixed. However, larger commitments may qualify for institutional share classes with reduced fees. Some funds offer early-bird discounts for initial subscribers.'
  },
  {
    question: 'What is the difference between management and admin fees?',
    answer: 'Management fees compensate the fund manager for investment decisions and oversight. Admin fees cover operational costs like accounting, legal compliance, and reporting. Some funds bundle these together, others list them separately.'
  },
  {
    question: 'What is a performance fee?',
    answer: 'A performance fee is a share of investment profits (typically 20%) paid to the manager when returns exceed a specified threshold (hurdle rate). It aligns manager incentives with investor returns but increases costs when funds perform well.'
  },
  {
    question: 'Are entry and exit fees common?',
    answer: 'Entry (subscription) fees range from 0-3% and are charged upfront. Exit (redemption) fees vary widely—some funds have none after the lock-up period, while others charge declining fees. Always check both when comparing total costs.'
  },
  {
    question: 'How do fees impact my returns?',
    answer: 'Fees compound over time and directly reduce net returns. A fund with 2% annual fees versus 1% annual fees can result in tens of thousands of euros difference over a 6-year holding period on a €500k investment.'
  },
  {
    question: 'Where can I verify fund fees?',
    answer: 'Official fees are disclosed in the fund prospectus, Information Memorandum, or Key Information Document (KID). For CMVM-regulated funds, fee information may also be available on the regulator\'s website.'
  },
  {
    question: 'Why do fee structures vary so much between fund types?',
    answer: 'Fee structures reflect strategy complexity and return profiles. Venture capital and private equity funds charge higher fees due to active management and deal sourcing. Debt funds typically have lower fees matching their lower-risk, lower-return profiles.'
  }
];
