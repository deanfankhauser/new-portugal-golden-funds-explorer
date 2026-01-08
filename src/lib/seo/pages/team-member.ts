import { SEOData } from '../types';
import { optimizeTitle, optimizeDescription } from '../utils';
import { URL_CONFIG } from '@/utils/urlConfig';
import { getSitewideSchemas } from '../schemas';
import { checkTeamMemberIndexability } from '@/lib/indexability';

export interface TeamMemberSEOParams {
  name: string;
  role: string;
  bio?: string;
  slug: string;
  companyName?: string;
  photoUrl?: string;
  linkedinUrl?: string;
}

export function getTeamMemberSeo(member: TeamMemberSEOParams): SEOData {
  const indexability = checkTeamMemberIndexability(member);
  
  const memberName = member.name || 'Team Member';
  const memberRole = member.role || 'Team Member';
  
  // Title per new format: "{Name} | {Role} | Movingto Funds"
  const title = `${memberName} | ${memberRole} | Movingto Funds`;
  
  // Description per new format
  const description = `${memberName} is ${memberRole} at Movingto Funds, focused on fund data, disclosures, and platform operations for Portugal Golden Visa investors.`;

  return {
    title: optimizeTitle(title),
    description: optimizeDescription(description),
    url: URL_CONFIG.buildUrl(`/team/${member.slug}`),
    canonical: URL_CONFIG.buildUrl(`/team/${member.slug}`),
    robots: indexability.robots,
    keywords: [
      memberName,
      memberRole,
      'fund team member',
      'investment professional',
      'Portugal fund management',
      'Golden Visa fund professional'
    ].filter(Boolean),
    structuredData: getTeamMemberStructuredData(member)
  };
}

function getTeamMemberStructuredData(member: TeamMemberSEOParams): any {
  const memberUrl = URL_CONFIG.buildUrl(`/team/${member.slug}`);
  
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': URL_CONFIG.BASE_URL },
      { '@type': 'ListItem', 'position': 2, 'name': 'Team', 'item': URL_CONFIG.buildUrl('/team') },
      { '@type': 'ListItem', 'position': 3, 'name': member.name, 'item': memberUrl }
    ]
  };

  const personSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': member.name,
    'jobTitle': member.role,
    'url': memberUrl,
    'knowsAbout': [
      'Portugal Golden Visa Legislation',
      'Investment Fund Management',
      'CMVM Regulation',
      'Portuguese Residency by Investment'
    ]
  };

  if (member.photoUrl) {
    personSchema.image = member.photoUrl;
  }

  if (member.bio) {
    personSchema.description = member.bio;
  }

  if (member.companyName) {
    personSchema.worksFor = {
      '@type': 'Organization',
      'name': member.companyName
    };
    
    // Add hasCredential for fund managers
    personSchema.hasCredential = {
      '@type': 'EducationalOccupationalCredential',
      'credentialCategory': 'Professional License',
      'name': 'Fund Management Certification',
      'recognizedBy': {
        '@type': 'Organization',
        'name': 'CMVM - Comissão do Mercado de Valores Mobiliários'
      }
    };
  }

  if (member.linkedinUrl) {
    personSchema.sameAs = [member.linkedinUrl];
  }

  return [
    ...getSitewideSchemas(),
    breadcrumbSchema,
    personSchema
  ];
}
