// URL utility functions for consistent external link handling

export const UTM_PARAMS = {
  source: 'funds-app',
  medium: 'cta',
  campaign: 'consultation'
};

export const buildContactUrl = (utmContent?: string) => {
  const baseUrl = 'https://movingto.com/contact/contact-movingto';
  const params = new URLSearchParams({
    utm_source: UTM_PARAMS.source,
    utm_medium: UTM_PARAMS.medium,
    utm_campaign: UTM_PARAMS.campaign,
    ...(utmContent && { utm_content: utmContent })
  });
  
  return `${baseUrl}?${params.toString()}`;
};

export const openExternalLink = (url: string, target = '_blank') => {
  window.open(url, target, 'noopener,noreferrer');
};

export const buildMailtoUrl = (email: string, subject: string, body: string) => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
};