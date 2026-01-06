import React from 'react';
import FAQTableOfContents from './FAQTableOfContents';
import FAQCluster, { FAQItem } from './FAQCluster';

// Cluster 1: Eligibility & Fund Rules
const eligibilityFaqs: FAQItem[] = [
  {
    question: "What is a qualifying Portugal Golden Visa fund?",
    answer: "A qualifying Golden Visa fund is a Portuguese-regulated investment or venture capital fund that meets the €500,000 fund route rules—structured so the investment supports the Portuguese economy rather than direct property ownership.",
    bullets: [
      "The fund must be regulated and supervised in Portugal with proper documentation for your ARI application file.",
      "The fund's strategy and underlying investments must align with Golden Visa eligibility rules after the 2023 changes.",
      "Verify the fund has clear evidence of Portuguese economic contribution."
    ],
    links: [
      { label: "Browse Funds", href: "/" },
      { label: "Verified Funds", href: "/verified-funds" },
      { label: "Verification Program", href: "/verification-program" }
    ]
  },
  {
    question: "Is real estate still allowed for Portugal Golden Visa?",
    answer: "Direct real estate purchase is no longer an eligible Golden Visa route. Portugal removed property-based paths in 2023.",
    bullets: [
      "Some funds invest in operating companies (including hospitality operators)—this is different from buying a property deed directly.",
      "What matters for eligibility is the legal structure and what the fund actually invests in.",
      "This is exactly where investor due diligence and legal review matters most."
    ]
  },
  {
    question: "What is the minimum investment for the fund route?",
    answer: "The qualifying amount is €500,000 for the Portugal Golden Visa fund option.",
    bullets: [
      "A fund may list a lower subscription minimum, but you still need to reach the €500,000 program threshold with your qualifying investment.",
      "Some investors split investments across multiple qualifying funds to reach the threshold."
    ]
  },
  {
    question: "Does a fund investing in hotels or hospitality qualify?",
    answer: "It depends on the legal structure. Funds investing in operating companies (hotel operators, hospitality businesses) may qualify, while direct real estate ownership does not.",
    bullets: [
      "The distinction is between owning a company that operates a hotel vs. owning the property directly.",
      "Always verify with the fund manager and your legal counsel before investing."
    ]
  },
  {
    question: "What does 'regulated fund' mean in Portugal?",
    answer: "A regulated fund is one that is supervised by Portuguese financial authorities and has proper documentation that can be evidenced in your ARI application file.",
    bullets: [
      "Look for CMVM (Portuguese Securities Market Commission) registration or similar regulatory oversight.",
      "The fund should be able to provide official documentation confirming its regulatory status."
    ],
    links: [
      { label: "Verified Funds", href: "/verified-funds" }
    ]
  }
];

// Cluster 2: Fees, Lock-ups & Liquidity
const feesFaqs: FAQItem[] = [
  {
    question: "What fees do Golden Visa funds typically charge?",
    answer: "Golden Visa funds typically charge multiple fee types that add up over the investment period. Understanding total cost is critical for comparing funds accurately.",
    bullets: [
      "Subscription/entry fees: one-time fee when you invest (typically 0-3%)",
      "Management fees: annual fee on assets under management (typically 1-2.5%)",
      "Performance fees: percentage of profits above a threshold (typically 15-20%)",
      "Administration, depositary, and custody fees: ongoing operational costs",
      "Redemption/exit fees: charged when you exit the fund",
      "Underlying SPV or deal fees: often overlooked but can add up"
    ],
    links: [
      { label: "ROI Calculator", href: "/roi-calculator" }
    ]
  },
  {
    question: "What is a management fee vs performance fee?",
    answer: "Management fee is an annual percentage charged on your invested capital regardless of performance. Performance fee is a percentage of profits charged only when the fund exceeds a return threshold.",
    bullets: [
      "Example: A 2% management fee on €500,000 = €10,000 per year",
      "Example: A 20% performance fee on €50,000 profit = €10,000",
      "Management fees are charged every year; performance fees only when there are gains"
    ]
  },
  {
    question: "What is a lock-up period and how long is typical?",
    answer: "A lock-up period is when you cannot redeem your investment from the fund. For Golden Visa funds, lock-ups are typically 6-10 years.",
    bullets: [
      "Lock-up aligns with the fund's investment strategy (PE/VC investments need time to mature)",
      "Your Golden Visa residency requirement is typically 5 years, but fund lock-up often extends beyond this",
      "Lock-up and exit mechanics matter more than marketing 'target returns'"
    ]
  },
  {
    question: "Are redemptions guaranteed or 'best efforts'?",
    answer: "Most Golden Visa fund redemptions are 'best efforts'—meaning the fund will try to honor redemption requests but does not guarantee it.",
    bullets: [
      "Review fund documentation carefully for redemption language",
      "Secondary market transfers may be restricted or require fund manager approval",
      "'Best efforts' means liquidity is not guaranteed"
    ]
  },
  {
    question: "Can I sell my fund units to someone else?",
    answer: "Secondary transfers are usually restricted or require fund manager approval. This is not like selling publicly traded stocks.",
    bullets: [
      "Some funds explicitly prohibit secondary transfers",
      "Others allow transfers only to approved investors",
      "There may be transfer fees or notice periods required"
    ]
  },
  {
    question: "How do I estimate my all-in cost over 5 years?",
    answer: "Add together: subscription fees + (5 × annual management fees) + estimated performance fees + admin/custody fees + exit fees.",
    bullets: [
      "Example: 2% entry + 2% mgmt × 5 years + 20% performance on estimated gains + 1% exit",
      "Total fees can exceed 15-20% of your initial investment over the full period",
      "Use our calculator to model different scenarios"
    ],
    links: [
      { label: "ROI Calculator", href: "/roi-calculator" }
    ]
  }
];

// Cluster 3: Process Steps & Timeline
const processFaqs: FAQItem[] = [
  {
    question: "What is the real timeline for Portugal Golden Visa via funds?",
    answer: "There isn't a single clean timeline. Processing backlogs have materially impacted timelines, with ongoing reforms and digitization efforts targeting backlog resolution.",
    bullets: [
      "Fund subscription and documentation: 2-4 weeks",
      "ARI application preparation: 2-6 weeks",
      "Application submission: depends on appointment availability",
      "Biometrics appointment: variable wait times",
      "Approval and card issuance: historically 3-12 months, currently longer due to backlogs",
      "Renewals at year 2 and 4 of the 5-year period"
    ]
  },
  {
    question: "What documents do I need for a fund subscription?",
    answer: "Fund subscriptions require comprehensive KYC (Know Your Customer) and AML (Anti-Money Laundering) documentation.",
    bullets: [
      "Valid passport and proof of identity",
      "Proof of address (recent utility bill or bank statement)",
      "Source of funds documentation (employment, business, inheritance, etc.)",
      "Bank statements showing fund availability",
      "Tax identification from your home country"
    ]
  },
  {
    question: "Do I need a Portuguese bank account and NIF?",
    answer: "Yes, you will need a NIF (Número de Identificação Fiscal) which is a Portuguese tax identification number. A Portuguese bank account is typically required as well.",
    bullets: [
      "NIF can be obtained with or without a fiscal representative",
      "Some funds may accept wire transfers from foreign accounts, but a Portuguese account simplifies the process",
      "Your lawyer can help set up both before your fund subscription"
    ]
  },
  {
    question: "What does 'proof of investment' look like for the ARI file?",
    answer: "Your ARI application needs clear documentation proving you made a qualifying €500,000 investment in an eligible fund.",
    bullets: [
      "Signed fund subscription agreement",
      "Bank transfer confirmation showing €500,000 sent to the fund",
      "Confirmation letter from the fund manager acknowledging your investment",
      "Fund's regulatory documentation proving eligibility"
    ]
  },
  {
    question: "What are common reasons applications get delayed?",
    answer: "Delays typically stem from documentation issues, verification processes, and appointment scheduling backlogs.",
    bullets: [
      "Incomplete or inconsistent documentation",
      "Source of funds verification taking longer than expected",
      "Missing translations or apostilles",
      "Appointment scheduling backlogs at immigration services",
      "Payment reconciliation issues between fund and application"
    ]
  }
];

// Cluster 4: Family Members
const familyFaqs: FAQItem[] = [
  {
    question: "Can I include my spouse and children?",
    answer: "Yes—Portugal Golden Visa is commonly used for families. Your spouse and dependent children can be included in your application.",
    bullets: [
      "Spouse or partner (including civil unions recognized in Portugal)",
      "Dependent children under 18",
      "Dependent children 18+ who are students or financially dependent",
      "Dependent parents in some circumstances",
      "Each family member requires proper documentation (marriage certificates, birth certificates, school enrollment letters, etc.)"
    ]
  },
  {
    question: "Are there additional fees for family members?",
    answer: "Yes, each family member added to the application incurs additional government fees, though no additional investment is required.",
    bullets: [
      "Government processing fees per family member",
      "Legal fees for document preparation",
      "Document authentication and translation costs",
      "The €500,000 investment covers the entire family—no additional investment required per person"
    ]
  }
];

// Cluster 5: Holding Period & Exit
const exitFaqs: FAQItem[] = [
  {
    question: "How long do I need to hold the investment?",
    answer: "You generally need to maintain the qualifying investment through the Golden Visa residency period (5-year path is common), but the fund's own term can be longer—often 6-10 years.",
    bullets: [
      "Dropping below €500,000 during the residency period can jeopardize your status",
      "Fund lock-up periods may extend beyond your 5-year residency timeline",
      "Plan for the longer of: residency requirement OR fund lock-up"
    ]
  },
  {
    question: "What happens if I want to exit early?",
    answer: "Most Golden Visa funds are not built for 'exit whenever you want.' Early exit can create both financial and immigration risks.",
    bullets: [
      "Many funds have hard lock-ups with no early exit option",
      "Limited redemption windows may only occur annually or less frequently",
      "Secondary transfers usually require approval and may be restricted",
      "Exiting before obtaining permanent residency or citizenship can invalidate your Golden Visa"
    ],
    links: [
      { label: "Compare Fund Alternatives", href: "/" }
    ]
  },
  {
    question: "What are the ongoing residency obligations?",
    answer: "Golden Visa holders must meet minimum residency requirements and maintain their qualifying investment throughout the 5-year period.",
    bullets: [
      "Minimum 7 days physical presence per year (averaged over the period)",
      "Maintain the €500,000 qualifying investment",
      "Renew residence permit at years 2 and 4",
      "Comply with Portuguese tax obligations if you become tax resident"
    ]
  },
  {
    question: "What happens at fund maturity?",
    answer: "When the fund reaches its term, it will wind down and distribute remaining assets to investors. By this time, you should have obtained permanent residency or citizenship.",
    bullets: [
      "Fund distributions are typically made as the underlying investments are sold",
      "Final distributions occur when the fund fully winds down",
      "Timing may not align perfectly with your residency milestones"
    ]
  }
];

// Cluster 6: Citizenship & Legal Uncertainty
const citizenshipFaqs: FAQItem[] = [
  {
    question: "Is the citizenship timeline still 5 years?",
    answer: "The historical baseline has been eligibility for citizenship after 5 years of legal residency, but Portugal has had active political and legal debate about nationality rules. In late 2025, the Constitutional Court found parts of proposed nationality law amendments unconstitutional.",
    bullets: [
      "The 5-year path has been the standard historical baseline",
      "Political discussions about changing requirements have been ongoing",
      "Legal challenges have created uncertainty about future rules",
      "Applicants should rely on their immigration lawyer for the latest position on their specific filing dates",
      "Requirements and processing times may change"
    ]
  },
  {
    question: "What are the language requirements for citizenship?",
    answer: "Portugal requires A2-level Portuguese language proficiency for citizenship applications. This is a basic conversational level.",
    bullets: [
      "A2 is considered 'elementary' proficiency",
      "You can demonstrate this through an official exam",
      "Some applicants study Portuguese during their 5-year residency period",
      "Requirements may be waived in certain circumstances—consult your lawyer"
    ]
  }
];

// Cluster 7: US Persons
const usPersonsFaqs: FAQItem[] = [
  {
    question: "Can US citizens invest in Portugal Golden Visa funds?",
    answer: "Yes, US citizens can invest, but some funds refuse US persons due to regulatory complexity. Not all funds accept US investors.",
    bullets: [
      "FATCA (Foreign Account Tax Compliance Act) creates reporting requirements",
      "PFIC (Passive Foreign Investment Company) rules create complex US tax treatment",
      "Some fund managers choose to exclude US persons rather than handle the compliance burden"
    ],
    links: [
      { label: "Funds Accepting US Persons", href: "/funds/us-citizens" }
    ]
  },
  {
    question: "What is a 'US Person' and why do some funds refuse them?",
    answer: "The SEC and IRS definition of 'US Person' includes US citizens, green card holders, and certain others with US tax obligations. The regulatory burden makes some funds unwilling to accept them.",
    bullets: [
      "US citizens living anywhere in the world",
      "US permanent residents (green card holders)",
      "Certain US tax residents",
      "PFIC reporting can be expensive and complex for US investors",
      "Funds must comply with FATCA reporting to avoid penalties"
    ]
  },
  {
    question: "What US tax considerations apply?",
    answer: "US persons investing in foreign funds face complex tax considerations. This is general information only—consult a US tax advisor for your specific situation.",
    bullets: [
      "PFIC rules may apply, creating unfavorable tax treatment",
      "FATCA reporting requirements",
      "FBAR (Foreign Bank Account Report) filing if foreign accounts exceed $10,000",
      "Potential state tax implications",
      "Always work with a tax advisor experienced in international investments"
    ]
  }
];

// Cluster 8: Due Diligence & Comparison
const compareFaqs: FAQItem[] = [
  {
    question: "How do I compare Golden Visa funds properly?",
    answer: "Ignore the glossy marketing materials and compare these factors in this order of priority:",
    bullets: [
      "1. Eligibility fit: Does the fund clearly qualify under post-2023 rules? Avoid anything with eligibility ambiguity.",
      "2. Total fees: Management + performance + entry/exit + admin + custody. Compare apples to apples.",
      "3. Liquidity reality: Lock-up period, redemption windows, secondary transfer rules, 'best efforts' language.",
      "4. Manager incentives and conflicts: Related-party deals, valuation policy, leverage usage.",
      "5. Evidence pack quality: How cleanly can you document the investment for your ARI process?"
    ],
    links: [
      { label: "Compare Funds", href: "/" },
      { label: "Verified Funds", href: "/verified-funds" }
    ]
  },
  {
    question: "What red flags should I watch for?",
    answer: "Be cautious of funds with unclear eligibility, excessive related-party transactions, or marketing that sounds too good to be true.",
    bullets: [
      "Unclear or inconsistent eligibility documentation",
      "Unusually high projected returns with 'guaranteed' language",
      "Complex structures that obscure where money actually goes",
      "Related-party transactions between fund and manager's other entities",
      "Pressure to invest quickly without time for due diligence"
    ]
  },
  {
    question: "Should I use a lawyer or advisor?",
    answer: "Yes. The Golden Visa process involves immigration law, investment structuring, and tax implications across multiple jurisdictions.",
    bullets: [
      "Immigration lawyer: Essential for the ARI application and residency process",
      "Tax advisor: Important for understanding tax implications in your home country and Portugal",
      "Financial advisor: Helpful for evaluating fund investments (though many investors do this themselves)",
      "Look for advisors with specific Portugal Golden Visa experience"
    ],
    links: [
      { label: "Contact Us", href: "/contact" }
    ]
  }
];

const FAQsContent = () => {
  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-card p-8 rounded-xl border border-border mb-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
          Portugal Golden Visa Funds FAQ (2026)
        </h1>
        <p className="text-muted-foreground text-lg mb-4">
          Everything you need to know about the €500,000 fund investment route. Real estate paths were removed in 2023—this guide focuses exclusively on regulated PE/VC fund investments.
        </p>
        <p className="text-sm text-muted-foreground">
          Last updated: January 2026
        </p>
      </div>

      {/* Main Content with TOC Sidebar */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sticky TOC - Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-64 flex-shrink-0">
          <FAQTableOfContents />
        </aside>

        {/* FAQ Clusters */}
        <div className="flex-1 min-w-0">
          {/* Mobile TOC */}
          <div className="lg:hidden mb-8">
            <FAQTableOfContents />
          </div>

          <FAQCluster id="eligibility" title="Eligibility & Fund Rules" faqs={eligibilityFaqs} />
          <FAQCluster id="fees" title="Fees, Lock-ups & Liquidity" faqs={feesFaqs} />
          <FAQCluster id="process" title="Process Steps & Timeline" faqs={processFaqs} />
          <FAQCluster id="family" title="Family Members" faqs={familyFaqs} />
          <FAQCluster id="exit" title="Holding Period & Exit" faqs={exitFaqs} />
          <FAQCluster id="citizenship" title="Citizenship & Legal Uncertainty" faqs={citizenshipFaqs} />
          <FAQCluster id="us-persons" title="US Persons" faqs={usPersonsFaqs} />
          <FAQCluster id="compare" title="Due Diligence & Comparison" faqs={compareFaqs} />
        </div>
      </div>
    </div>
  );
};

export default FAQsContent;
