/**
 * Single source of truth for company entity details
 * Used across frontend components, SEO schemas, and emails
 */
export const COMPANY_INFO = {
  legalName: 'Moving To Global Pty Ltd',
  tradingName: 'Movingto Funds',
  address: {
    city: 'Melbourne',
    state: 'Victoria',
    country: 'Australia',
    countryCode: 'AU'
  },
  website: 'https://funds.movingto.com',
  email: 'info@movingto.com',
  foundingDate: '2024-01-01',
  socialLinks: {
    facebook: 'https://www.facebook.com/groups/zoark',
    linkedin: 'https://www.linkedin.com/company/90556445',
    twitter: 'https://twitter.com/movingtoio'
  },
  logo: {
    url: '/lovable-uploads/c5481949-8ec2-43f1-a77f-8d6cce1eec0e.png',
    width: 512,
    height: 512
  }
} as const;

export type CompanyInfo = typeof COMPANY_INFO;
