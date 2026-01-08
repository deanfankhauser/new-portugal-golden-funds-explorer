import { SEOData } from '../types';
import { getSitewideSchemas } from '../schemas';

export function getUSTaxGuideSeo(): SEOData {
  const baseUrl = 'https://funds.movingto.com';
  const pageUrl = `${baseUrl}/funds/us-tax-guide`;
  
  return {
    title: 'PFIC & FATCA Guide for US Investors | Portugal Golden Visa Funds (2026) | Movingto Funds',
    description: 'Comprehensive guide to PFIC and FATCA tax implications for US citizens investing in Portugal Golden Visa funds. Learn about QEF elections, reporting requirements, and how to work with tax advisors.',
    url: pageUrl,
    keywords: [
      'pfic portugal golden visa',
      'fatca golden visa funds',
      'us tax implications golden visa',
      'qef election portugal fund',
      'form 8621 golden visa',
      'fbar foreign investment fund',
      'us person golden visa investment',
      'pfic annual information statement',
      'excess distribution regime',
      'mark to market election pfic'
    ],
    structuredData: getUSTaxGuideStructuredData()
  };
}

export function getUSTaxGuideStructuredData(): any {
  const baseUrl = 'https://funds.movingto.com';
  const pageUrl = `${baseUrl}/funds/us-tax-guide`;

  const breadcrumbSchema = {
    '@type': 'BreadcrumbList',
    '@id': `${pageUrl}#breadcrumb`,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'For US Citizens',
        item: `${baseUrl}/funds/us-citizens`
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'PFIC & FATCA Tax Guide',
        item: pageUrl
      }
    ]
  };

  const articleSchema = {
    '@type': 'Article',
    '@id': `${pageUrl}#article`,
    headline: 'PFIC & FATCA Guide for US Investors in Portugal Golden Visa Funds',
    description: 'Comprehensive guide to understanding PFIC classification, QEF elections, FATCA reporting, and tax compliance for US citizens investing in Portugal Golden Visa funds.',
    url: pageUrl,
    datePublished: '2024-01-01T00:00:00Z',
    dateModified: new Date().toISOString(),
    author: {
      '@type': 'Organization',
      name: 'Movingto',
      url: 'https://funds.movingto.com'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Movingto',
      url: 'https://funds.movingto.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://funds.movingto.com/logo.png'
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': pageUrl
    }
  };

  const faqSchema = {
    '@type': 'FAQPage',
    '@id': `${pageUrl}#faq`,
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Can I avoid PFIC classification for my Golden Visa fund?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Generally, no. Most Portugal Golden Visa investment funds meet the PFIC definition because they are foreign corporations with predominantly passive income or assets. The focus should be on managing the tax consequences through elections (QEF or MTM) rather than trying to avoid the classification.'
        }
      },
      {
        '@type': 'Question',
        name: 'What if my fund doesn\'t provide a PFIC Annual Information Statement?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Without a PFIC Annual Information Statement, you cannot make a QEF election and will be subject to the default excess distribution regime. Before investing, confirm with the fund manager whether they provide this statement.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do I need to file Form 8621 if I hold funds in an IRA?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'PFIC investments held in qualified retirement accounts (traditional IRA, Roth IRA, 401(k)) are generally exempt from PFIC taxation and Form 8621 reporting. However, there are complexities around using IRA funds for Golden Visa investments.'
        }
      },
      {
        '@type': 'Question',
        name: 'What\'s the difference between FBAR and Form 8938?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'FBAR (FinCEN Form 114) is filed with the Treasury Department and reports foreign financial accounts over $10,000. Form 8938 is filed with your tax return and reports foreign financial assets over higher thresholds ($50,000+). You may need to file both.'
        }
      },
      {
        '@type': 'Question',
        name: 'What are the penalties for non-compliance?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Penalties can be severe: FBAR non-willful violations can be $12,500+ per account per year; willful violations can be the greater of $100,000 or 50% of account value. Form 8938 penalties start at $10,000 per form.'
        }
      }
    ]
  };

  return [
    {
      '@context': 'https://schema.org',
      '@graph': [
        breadcrumbSchema,
        articleSchema,
        faqSchema,
        ...getSitewideSchemas()
      ]
    }
  ];
}
