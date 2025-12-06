// URL utility functions for consistent external link handling

export const UTM_PARAMS = {
  source: 'funds-app',
  medium: 'cta',
  campaign: 'consultation'
};

export const buildContactUrl = (utmContent?: string) => {
  const baseUrl = 'https://www.movingto.com/contact/contact-movingto';
  const params = new URLSearchParams({
    utm_source: UTM_PARAMS.source,
    utm_medium: UTM_PARAMS.medium,
    utm_campaign: UTM_PARAMS.campaign,
    ...(utmContent && { utm_content: utmContent })
  });
  
  return `${baseUrl}?${params.toString()}`;
};

export const buildBookingUrl = (fundId?: string, fundName?: string) => {
  const params = new URLSearchParams({
    utm_source: UTM_PARAMS.source,
    utm_medium: UTM_PARAMS.medium,
    utm_campaign: UTM_PARAMS.campaign,
    utm_content: 'fund_cta',
    ...(fundId && { fund_id: fundId }),
    ...(fundName && { fund_name: fundName })
  });
  
  return `https://www.movingto.com/contact/contact-movingto?${params.toString()}`;
};

export const buildShareUrl = (fundName: string, fundUrl: string, fundDescription?: string) => {
  const subject = `Investment Opportunity: ${fundName}`;
  const body = `Hi,

I wanted to share this investment fund with you:

${fundName}
${fundDescription || 'Check out the details at the link below.'}

View full details: ${fundUrl}

Let me know what you think!`;

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:?subject=${encodedSubject}&body=${encodedBody}`;
};

export const openExternalLink = (url: string, target = '_blank') => {
  window.open(url, target, 'noopener,noreferrer');
};

export const buildMailtoUrl = (email: string, subject: string, body: string) => {
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${email}?subject=${encodedSubject}&body=${encodedBody}`;
};
