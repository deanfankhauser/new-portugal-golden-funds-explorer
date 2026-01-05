import React from 'react';
import { ExternalLink, Linkedin, Award } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfessionalCardProps {
  name: string;
  role: string;
  photoUrl?: string;
  linkedinUrl?: string;
  credentialType?: 'cmvm' | 'bar' | 'cfa' | 'other';
  credentialUrl?: string;
  companyName?: string;
  variant?: 'compact' | 'full';
}

const CREDENTIAL_LABELS: Record<string, string> = {
  cmvm: 'CMVM Registered',
  bar: 'Bar Licensed',
  cfa: 'CFA Charterholder',
  other: 'Certified Professional',
};

const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  name,
  role,
  photoUrl,
  linkedinUrl,
  credentialType,
  credentialUrl,
  companyName,
  variant = 'compact'
}) => {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const credentialLabel = credentialType ? CREDENTIAL_LABELS[credentialType] : null;

  if (variant === 'compact') {
    return (
      <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg hover:bg-accent/5 transition-colors">
        <Avatar className="h-10 w-10 border border-border">
          <AvatarImage src={photoUrl} alt={name} />
          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-xs font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-foreground truncate">{name}</span>
            {linkedinUrl && (
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={`${name}'s LinkedIn profile`}
              >
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
          <span className="text-xs text-muted-foreground block truncate">{role}</span>
        </div>

        {credentialLabel && (
          <div className="flex items-center gap-1 px-2 py-1 bg-gold-verified/10 rounded-md">
            <Award className="w-3 h-3 text-gold-verified" />
            <span className="text-[10px] font-medium text-gold-verified whitespace-nowrap">
              {credentialLabel}
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-14 w-14 border-2 border-border">
          <AvatarImage src={photoUrl} alt={name} />
          <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-sm font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="text-base font-semibold text-foreground">{name}</h4>
            {linkedinUrl && (
              <a 
                href={linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label={`${name}'s LinkedIn profile`}
              >
                <Linkedin className="w-4 h-4" />
              </a>
            )}
          </div>
          
          <p className="text-sm text-muted-foreground">{role}</p>
          {companyName && (
            <p className="text-xs text-muted-foreground/70 mt-0.5">{companyName}</p>
          )}

          {credentialLabel && (
            <div className="mt-3 flex items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gold-verified/10 border border-gold-verified/20 rounded-md">
                <Award className="w-3.5 h-3.5 text-gold-verified" />
                <span className="text-xs font-medium text-gold-verified">
                  {credentialLabel}
                </span>
              </div>
              {credentialUrl && (
                <a 
                  href={credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                >
                  <span>View credentials</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalCard;

// Schema.org Person markup generator for SSR
export function generateProfessionalPersonSchema(professional: {
  name: string;
  role: string;
  photoUrl?: string;
  linkedinUrl?: string;
  companyName?: string;
  bio?: string;
  credentialType?: string;
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': professional.name,
    'jobTitle': professional.role,
    'knowsAbout': [
      'Portugal Golden Visa Legislation',
      'Investment Fund Management',
      'CMVM Regulation',
      'Portuguese Residency by Investment'
    ]
  };

  if (professional.photoUrl) {
    schema.image = professional.photoUrl;
  }

  if (professional.bio) {
    schema.description = professional.bio;
  }

  if (professional.linkedinUrl) {
    schema.sameAs = [professional.linkedinUrl];
  }

  if (professional.companyName) {
    schema.worksFor = {
      '@type': 'Organization',
      'name': professional.companyName
    };
  }

  if (professional.credentialType) {
    const credentialNames: Record<string, string> = {
      cmvm: 'CMVM Registration',
      bar: 'Bar License',
      cfa: 'CFA Charter',
    };
    
    schema.hasCredential = {
      '@type': 'EducationalOccupationalCredential',
      'credentialCategory': 'Professional License',
      'name': credentialNames[professional.credentialType] || 'Professional Certification',
      'recognizedBy': {
        '@type': 'Organization',
        'name': professional.credentialType === 'cmvm' ? 'CMVM' : 'Professional Regulatory Body'
      }
    };
  }

  return schema;
}
