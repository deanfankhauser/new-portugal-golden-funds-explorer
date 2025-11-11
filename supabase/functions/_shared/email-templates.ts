/**
 * Shared Email Template Utilities
 * Provides consistent branding across all email communications
 * 
 * Trading Name: Movingto Funds
 * Legal Name: Moving To Global Pte Ltd
 */

export const BRAND_COLORS = {
  bordeaux: '#4B0F23',
  bordeauxLight: '#6B1533',
  bronze: '#A97155',
  bronzeLight: '#C99675',
  bone: '#EDEAE6',
  white: '#FFFFFF',
  textDark: '#333333',
  textMuted: '#666666',
  textLight: '#999999',
  bordeauxGradient: 'linear-gradient(135deg, #4B0F23 0%, #6B1533 100%)',
  bronzeGradient: 'linear-gradient(135deg, #A97155 0%, #C99675 100%)',
};

export const COMPANY_INFO = {
  tradingName: 'Movingto Funds',
  legalName: 'Moving To Global Pte Ltd',
  address: '160 Robinson Road, #14-04, Singapore Business Federation Center, Singapore, 068914',
  website: 'https://funds.movingto.com',
  email: 'noreply@movingto.com',
  logoUrl: 'https://funds.movingto.com/lovable-uploads/ab17d046-1cb9-44fd-aa6d-c4d338e11090.png',
};

/**
 * Generates a branded email header with logo and title
 */
export function generateEmailHeader(title: string): string {
  return `
    <div style="background: ${BRAND_COLORS.bordeauxGradient}; color: ${BRAND_COLORS.white}; padding: 40px 30px; text-align: center; border-radius: 8px 8px 0 0;">
      <img src="${COMPANY_INFO.logoUrl}" alt="${COMPANY_INFO.tradingName}" style="max-width: 180px; height: auto; margin-bottom: 20px; display: block; margin-left: auto; margin-right: auto;" />
      <h1 style="margin: 0; font-size: 26px; font-weight: 600; letter-spacing: -0.5px; color: ${BRAND_COLORS.white};">${title}</h1>
    </div>
  `;
}

/**
 * Generates a branded email footer with company information
 */
export function generateEmailFooter(recipientEmail?: string): string {
  return `
    <div style="background: ${BRAND_COLORS.bone}; padding: 30px; text-align: center; border-top: 2px solid ${BRAND_COLORS.bronze}; margin-top: 40px;">
      <p style="margin: 0 0 10px 0; color: ${BRAND_COLORS.bordeaux}; font-size: 16px; font-weight: 600;">
        ${COMPANY_INFO.tradingName}
      </p>
      <p style="margin: 0 0 5px 0; color: ${BRAND_COLORS.textMuted}; font-size: 12px;">
        ${COMPANY_INFO.legalName}
      </p>
      <p style="margin: 0 0 15px 0; color: ${BRAND_COLORS.textMuted}; font-size: 13px; line-height: 1.5;">
        ${COMPANY_INFO.address}
      </p>
      ${recipientEmail ? `<p style="margin: 15px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 12px;">This email was sent to ${recipientEmail}</p>` : ''}
      <p style="margin: 10px 0 0 0; color: ${BRAND_COLORS.textLight}; font-size: 12px;">
        <a href="${COMPANY_INFO.website}" style="color: ${BRAND_COLORS.bronze}; text-decoration: none;">Visit our platform</a>
      </p>
    </div>
  `;
}

/**
 * Generates a branded call-to-action button
 */
export function generateCTAButton(
  text: string, 
  url: string, 
  color: 'bordeaux' | 'bronze' = 'bordeaux'
): string {
  const bgColor = color === 'bordeaux' ? BRAND_COLORS.bordeaux : BRAND_COLORS.bronze;
  const hoverColor = color === 'bordeaux' ? BRAND_COLORS.bordeauxLight : BRAND_COLORS.bronzeLight;
  
  return `
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" style="background: ${bgColor}; color: ${BRAND_COLORS.white}; padding: 14px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; font-size: 16px; box-shadow: 0 4px 12px rgba(75, 15, 35, 0.2);">
        ${text}
      </a>
    </div>
  `;
}

/**
 * Generates a content card with branded border
 */
export function generateContentCard(
  content: string, 
  borderColor: 'bordeaux' | 'bronze' = 'bordeaux'
): string {
  const color = borderColor === 'bordeaux' ? BRAND_COLORS.bordeaux : BRAND_COLORS.bronze;
  
  return `
    <div style="background: ${BRAND_COLORS.white}; padding: 25px; border-radius: 8px; margin: 25px 0; border-left: 4px solid ${color}; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
      ${content}
    </div>
  `;
}

/**
 * Generates a complete branded email wrapper
 */
export function generateEmailWrapper(
  title: string,
  bodyContent: string,
  recipientEmail?: string
): string {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: ${BRAND_COLORS.white};">
        ${generateEmailHeader(title)}
        <div style="padding: 30px;">
          ${bodyContent}
        </div>
        ${generateEmailFooter(recipientEmail)}
      </div>
    </body>
    </html>
  `;
}

/**
 * Generates a text-only version of the email (for plain text fallback)
 */
export function generatePlainTextEmail(
  title: string,
  content: string,
  ctaText?: string,
  ctaUrl?: string
): string {
  let text = `${COMPANY_INFO.tradingName}\n`;
  text += `${'='.repeat(COMPANY_INFO.tradingName.length)}\n\n`;
  text += `${title}\n\n`;
  text += `${content}\n\n`;
  
  if (ctaText && ctaUrl) {
    text += `${ctaText}: ${ctaUrl}\n\n`;
  }
  
  text += `---\n`;
  text += `${COMPANY_INFO.legalName}\n`;
  text += `${COMPANY_INFO.address}\n`;
  text += `${COMPANY_INFO.website}\n`;
  
  return text;
}
