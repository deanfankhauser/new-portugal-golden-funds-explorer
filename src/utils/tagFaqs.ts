import { Fund } from '@/data/types/funds';
import { isTagGVEligible } from '@/data/services/gv-eligibility-service';
import { pluralize } from '@/utils/textHelpers';

export interface TagFAQ {
  question: string;
  answer: string;
}

// Custom FAQs for specific tags (add more as needed)
const CUSTOM_TAG_FAQS: Record<string, TagFAQ[]> = {
  'bonds': [
    {
      question: 'What are Bonds Golden Visa funds (Portugal Golden Visa investment funds)?',
      answer: 'Bonds Golden Visa funds are Portugal Golden Visa investment funds (often called Golden Visa funds) that primarily invest in bonds or bond-like fixed income instruments. These can include government bonds, corporate bonds, or credit-linked structures depending on the fund mandate. If the fund qualifies for the Portugal Golden Visa fund route, an investor subscribes to the fund units (not individual bonds) and uses the investment evidence for their Golden Visa application, subject to legal confirmation of eligibility.'
    },
    {
      question: 'How many Bonds Golden Visa funds are marketed for Golden Visa?',
      answer: 'The number can change as funds are added, updated, or reclassified. On this page, we list the funds currently tagged Bonds that are presented as Golden Visa funds based on manager disclosures and available documentation. Golden Visa eligibility must still be confirmed by Portuguese legal counsel before investing in any specific Portugal Golden Visa investment fund.'
    },
    {
      question: 'What is the minimum investment for Bonds Golden Visa funds?',
      answer: 'For the Portugal Golden Visa fund route, the commonly referenced minimum is €500,000 invested into qualifying Portugal Golden Visa investment funds (Golden Visa funds), subject to current rules and legal interpretation. Some bonds-focused funds may set higher minimum subscription amounts depending on strategy and demand.'
    },
    {
      question: 'Are Bonds Golden Visa funds safe investments?',
      answer: 'Bonds-focused Golden Visa funds are often perceived as lower volatility than equity strategies, but they are not risk-free. Key risks include interest rate risk (bond prices can fall when rates rise), credit/default risk, concentration risk, liquidity risk, and how the fund values less-liquid instruments. The "safety" of a bonds-focused Portugal Golden Visa investment fund depends on credit quality, duration, diversification, and fees—not the "bonds" label.'
    },
    {
      question: 'How long do I need to hold my investment in Bonds Golden Visa funds?',
      answer: "For the Portugal Golden Visa, you generally need to maintain the qualifying investment throughout the required residence period until you reach a stage where you can exit under the program rules. However, fund liquidity and redemption terms are separate from visa rules. Many Portugal Golden Visa investment funds have lock-ups, limited redemption windows, or fund terms. Always check the fund's lock-up, redemption frequency, and notice periods—and confirm the Golden Visa holding requirement with Portuguese legal counsel."
    },
    {
      question: 'Can I include family members in my Portugal Golden Visa application if I invest in Golden Visa funds?',
      answer: 'In many cases, yes—Portugal Golden Visa applications often allow family members to be included, but eligibility depends on relationship and dependency rules and can change over time. This is a legal question: confirm your family eligibility and documentation requirements with Portuguese legal counsel as part of your Golden Visa process.'
    },
    {
      question: 'Is this investment advice?',
      answer: 'No. Movingto Funds provides information and introductions for Golden Visa funds and Portugal Golden Visa investment funds. We do not provide investment advice or recommend any specific fund. Always obtain independent financial advice and Portuguese legal advice before investing.'
    }
  ],
  'capital-growth': [
    {
      question: 'What are Capital Growth Golden Visa funds (Portugal Golden Visa investment funds)?',
      answer: 'Capital Growth Golden Visa funds are Portugal Golden Visa investment funds (often called Golden Visa funds) that primarily target capital appreciation rather than steady income. In practice, this usually means equity-heavy strategies such as private equity, venture capital, growth equity, or thematic funds aiming to increase the value of underlying holdings over time. If the fund qualifies for the Portugal Golden Visa fund route, investors subscribe to the fund units and use the investment evidence for their Golden Visa application, subject to legal confirmation of eligibility.'
    },
    {
      question: 'How many Capital Growth funds are marketed for Golden Visa?',
      answer: 'The number can change as new Golden Visa funds are added, reclassified, or updated. This tag page shows the funds currently labeled Capital Growth and presented as Portugal Golden Visa investment funds based on manager disclosures and available documentation. Golden Visa eligibility must still be confirmed by Portuguese legal counsel before investing in any specific fund.'
    },
    {
      question: 'What is the minimum investment for Capital Growth Golden Visa funds?',
      answer: 'For the Portugal Golden Visa fund route, the commonly referenced minimum is €500,000 invested into qualifying Portugal Golden Visa investment funds (Golden Visa funds), subject to current rules and legal interpretation. Some capital growth strategies (especially VC/growth equity) may set higher minimum subscriptions depending on the fund.'
    },
    {
      question: 'Are Capital Growth Golden Visa funds safe investments?',
      answer: '"Capital growth" usually means higher risk and higher variability of outcomes compared to income-focused strategies. Capital Growth Golden Visa funds can be illiquid, valuations may move slowly (or be updated infrequently), and returns depend on exits (selling portfolio companies/assets). Key risks include market risk, concentration risk, manager execution risk, long time horizons, and limited liquidity. These can be excellent Portugal Golden Visa investment funds for investors comfortable with risk and time—just don\'t confuse "regulated" with "guaranteed."'
    },
    {
      question: 'How long do I need to hold my investment in Capital Growth Golden Visa funds?',
      answer: "There are two separate timelines: Golden Visa rules require you to generally maintain the qualifying investment throughout the required residence period until you can exit under the program rules. Fund terms often include multi-year lock-ups and long fund terms (often with extensions). Always check the fund's lock-up, redemption mechanics, and term—and confirm the Golden Visa holding requirement with Portuguese legal counsel."
    },
    {
      question: 'Can I include family members in my Portugal Golden Visa application if I invest in Golden Visa funds?',
      answer: 'In many cases, yes—Portugal Golden Visa applications often allow family members to be included, but eligibility depends on relationship and dependency rules and can change over time. This is a legal question: confirm who you can include and what documents you need with Portuguese legal counsel.'
    },
    {
      question: 'Is this investment advice?',
      answer: 'No. Movingto Funds provides information and introductions for Golden Visa funds and Portugal Golden Visa investment funds. We do not provide investment advice or recommend any specific fund. Always obtain independent financial advice and Portuguese legal advice before investing.'
    }
  ],
  'capital-preservation': [
    {
      question: 'What are Capital Preservation Golden Visa investment funds?',
      answer: 'Capital Preservation Golden Visa funds are Portugal Golden Visa investment funds (often called Golden Visa funds) that aim to reduce volatility and protect principal relative to higher-risk growth strategies. In practice, these funds often focus on more defensive approaches such as diversified private credit, shorter-duration fixed income, secured lending, or lower-volatility multi-asset mandates. If the fund qualifies for the Portugal Golden Visa fund route, investors subscribe to fund units and use the investment evidence for their Golden Visa application, subject to legal confirmation of eligibility.'
    },
    {
      question: 'How many Capital Preservation funds are marketed for Golden Visa?',
      answer: 'The number changes as funds are added, updated, or reclassified. This tag page lists the funds currently tagged Capital Preservation and presented as Portugal Golden Visa investment funds based on manager disclosures and available documentation. Golden Visa eligibility must still be confirmed by Portuguese legal counsel before investing in any specific fund.'
    },
    {
      question: 'What is the minimum investment for Capital Preservation Golden Visa funds?',
      answer: 'For the Portugal Golden Visa fund route, the commonly referenced minimum is €500,000 invested into qualifying Portugal Golden Visa investment funds (Golden Visa funds), subject to current rules and legal interpretation. Some capital preservation strategies may set higher minimum subscriptions depending on the fund.'
    },
    {
      question: 'Are Capital Preservation Golden Visa funds safe investments?',
      answer: '"Capital preservation" usually means lower risk, not no risk. Even defensive Golden Visa funds can lose value due to credit defaults, interest rate moves, liquidity constraints, concentration risk, or poor underwriting/manager execution. Also, "regulated" does not mean "guaranteed." If your priority is protecting principal, compare each Portugal Golden Visa investment fund by underlying assets, diversification, leverage, valuation methodology, liquidity terms, and fees—not by the label alone.'
    },
    {
      question: 'How long do I need to hold my investment in Capital Preservation Golden Visa funds?',
      answer: "There are two timelines: Golden Visa rules require you to generally maintain the qualifying investment throughout the required residence period until you can exit under the program rules. Fund terms for capital preservation Portugal Golden Visa investment funds may still have lock-ups and controlled redemption windows, depending on what they invest in. Always check the fund's lock-up, redemption frequency, notice periods, and fund term—and confirm holding requirements with Portuguese legal counsel."
    },
    {
      question: 'Can I include family members in my Capital Preservation Golden Visa application?',
      answer: 'In many cases, yes—Portugal Golden Visa applications often allow family members to be included, but eligibility depends on relationship and dependency rules and can change over time. This is a legal question: confirm who you can include and what documents you\'ll need with Portuguese legal counsel as part of your Golden Visa process.'
    }
  ],
  'ai-driven': [
    {
      question: 'What are AI-Driven Golden Visa investment funds?',
      answer: 'AI-Driven Golden Visa funds are Portugal Golden Visa investment funds (often called Golden Visa funds) that have an AI theme or invest in AI-related companies and infrastructure. "AI-driven" usually refers to the fund\'s investment focus (AI software, data, automation, semiconductors, compute infrastructure) rather than a guarantee that AI is used to run the fund. If the fund qualifies for the Portugal Golden Visa fund route, investors subscribe to fund units and use the investment evidence for their Golden Visa application, subject to legal confirmation of eligibility.'
    },
    {
      question: 'How many AI-Driven funds are marketed for Golden Visa?',
      answer: 'The number changes as funds are added, updated, or reclassified. This tag page lists the funds currently tagged AI-Driven and presented as Portugal Golden Visa investment funds based on manager disclosures and available documentation. Golden Visa eligibility must still be confirmed by Portuguese legal counsel before investing in any specific fund.'
    },
    {
      question: 'What is the minimum investment for AI-Driven Golden Visa funds?',
      answer: 'For the Portugal Golden Visa fund route, the commonly referenced minimum is €500,000 invested into qualifying Portugal Golden Visa investment funds (Golden Visa funds), subject to current rules and legal interpretation. Some AI-themed funds (often venture or growth strategies) may set higher minimum subscription amounts depending on the fund.'
    },
    {
      question: 'Are AI-Driven Golden Visa funds safe investments?',
      answer: '"AI-driven" does not mean "safe." AI-themed Golden Visa funds are often venture capital, growth equity, or thematic private equity strategies, which can be higher risk and less liquid than income-focused strategies. Key risks include valuation uncertainty, concentration risk, long time horizons, technology-cycle risk, and limited liquidity. Regulation and fund structure help with governance, but they do not guarantee returns or protect against loss in Portugal Golden Visa investment funds.'
    },
    {
      question: 'How long do I need to hold my investment in AI-Driven Golden Visa funds?',
      answer: "There are two timelines: Golden Visa rules require you to generally maintain the qualifying investment throughout the required residence period until you can exit under the program rules. Fund terms for many AI-driven Portugal Golden Visa investment funds include multi-year lock-ups and long fund terms (often with extensions), and liquidity may depend on exits rather than redemptions. Always check the fund's lock-up, redemption mechanics, and term—and confirm holding requirements with Portuguese legal counsel."
    },
    {
      question: 'Can I include family members in my AI-Driven Golden Visa application?',
      answer: 'In many cases, yes—Portugal Golden Visa applications often allow family members to be included, but eligibility depends on relationship and dependency rules and can change over time. This is a legal question: confirm who you can include and what documents you\'ll need with Portuguese legal counsel as part of your Golden Visa process.'
    }
  ]
};

function generateDefaultTagFAQs(tagName: string, funds: Fund[]): TagFAQ[] {
  const isEligible = isTagGVEligible(tagName as any);
  const fundWord = pluralize(funds.length, 'fund');
  const tagLower = tagName.toLowerCase();
  
  // Handle zero-count case with appropriate messaging
  const getCountAnswer = (): string => {
    if (funds.length === 0) {
      return `We are currently updating our ${tagLower} fund listings. Check back soon for the latest options, or explore related investment themes in the meantime.`;
    }
    return `Currently, there are ${funds.length} ${tagLower} ${fundWord} available in our directory that are marketed for the Portugal Golden Visa route (per manager statements). Each fund should be verified with Portuguese legal counsel to confirm eligibility.`;
  };
  
  return [
    {
      question: `What are ${tagName} Golden Visa investment funds?`,
      answer: isEligible 
        ? `${tagName} Golden Visa investment funds are specialized investment vehicles that focus on ${tagLower} sectors and are marketed for Portugal's Golden Visa program (per manager statements). These funds allow non-EU investors to potentially obtain Portuguese residency by investing €500,000 or more in ${tagLower} investment opportunities—subject to verification by Portuguese legal counsel.`
        : `${tagName} investment funds focus on ${tagLower} sectors but are NOT marketed for Portugal's Golden Visa program since October 2023. Real estate-linked funds were excluded from the Golden Visa program due to regulatory changes.`
    },
    {
      question: `How many ${tagName} funds are marketed for Golden Visa?`,
      answer: getCountAnswer()
    },
    {
      question: `What is the minimum investment for ${tagName} Golden Visa funds?`,
      answer: `Portugal Golden Visa fund route requires €500,000 total investment (post-October 2023 regulatory changes), with no real estate exposure permitted. Individual ${tagLower} fund subscription minimums may be lower, but total qualifying investment must reach €500,000. Eligibility must be confirmed with Portuguese legal counsel.`
    },
    {
      question: `Are ${tagName} Golden Visa funds safe investments?`,
      answer: `${tagName} funds marketed for the Golden Visa are regulated investment vehicles subject to oversight. While all investments carry risk, these funds must demonstrate their ability to support Portugal's economic development goals in the ${tagLower} sector. Consult with legal and financial advisors before investing.`
    },
    {
      question: `How long do I need to hold my investment in ${tagName} Golden Visa funds?`,
      answer: `For Golden Visa purposes, you must maintain your investment in ${tagName} funds for a minimum of 5 years. After this period, you may be eligible for permanent residency or citizenship, depending on other requirements such as language proficiency and time spent in Portugal. Confirm all requirements with Portuguese legal counsel.`
    },
    {
      question: `Can I include family members in my ${tagName} Golden Visa application?`,
      answer: `Yes, when investing in ${tagName} Golden Visa funds, you can include your spouse, dependent children under 26, and dependent parents over 65 in your application. This makes the investment particularly attractive for families seeking EU residency.`
    }
  ];
}

export function getTagFAQs(tagName: string, funds: Fund[] = []): TagFAQ[] {
  const normalizedTag = tagName.toLowerCase().trim();
  
  if (CUSTOM_TAG_FAQS[normalizedTag]) {
    return CUSTOM_TAG_FAQS[normalizedTag];
  }
  
  return generateDefaultTagFAQs(tagName, funds);
}
