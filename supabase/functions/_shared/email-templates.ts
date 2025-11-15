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

/**
 * Weekly Digest Email - Verified Funds
 */
export function generateWeeklyDigestEmail(data: {
  fundName: string;
  weeklyImpressions: number;
  weeklyLeads: number;
  managerName: string;
  fundUrl: string;
  recipientEmail: string;
}): { html: string; text: string } {
  const { fundName, weeklyImpressions, weeklyLeads, managerName, fundUrl, recipientEmail } = data;
  
  const bodyContent = `
    <p style="color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
      Hi ${managerName},
    </p>
    <p style="color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
      Here's your weekly performance summary for <strong>${fundName}</strong>:
    </p>
    
    ${generateContentCard(`
      <div style="display: flex; justify-content: space-around; text-align: center; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 150px; margin: 10px;">
          <div style="font-size: 36px; font-weight: 700; color: ${BRAND_COLORS.bordeaux}; margin-bottom: 8px;">
            👁️ ${weeklyImpressions.toLocaleString()}
          </div>
          <div style="font-size: 14px; color: ${BRAND_COLORS.textMuted}; text-transform: uppercase; letter-spacing: 0.5px;">
            Page Views
          </div>
        </div>
        <div style="flex: 1; min-width: 150px; margin: 10px;">
          <div style="font-size: 36px; font-weight: 700; color: ${BRAND_COLORS.bronze}; margin-bottom: 8px;">
            👥 ${weeklyLeads.toLocaleString()}
          </div>
          <div style="font-size: 14px; color: ${BRAND_COLORS.textMuted}; text-transform: uppercase; letter-spacing: 0.5px;">
            New Leads
          </div>
        </div>
      </div>
    `, 'bronze')}
    
    <h3 style="color: ${BRAND_COLORS.bordeaux}; font-size: 18px; margin: 30px 0 15px 0;">
      📈 Keep Your Profile Fresh
    </h3>
    <p style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.6; margin-bottom: 15px;">
      Regular updates to your fund profile and performance data directly impact your rankings on our platform. Funds with up-to-date information receive:
    </p>
    <ul style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.8; margin-bottom: 25px;">
      <li>Higher visibility in search results</li>
      <li>Better positioning in category rankings</li>
      <li>Increased investor confidence</li>
      <li>More quality leads</li>
    </ul>
    
    ${generateCTAButton('Update Fund Profile', fundUrl, 'bordeaux')}
    
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 1.6; margin-top: 30px; text-align: center;">
      Questions? Reply to this email or contact our support team.
    </p>
  `;
  
  const html = generateEmailWrapper('Weekly Performance Summary', bodyContent, recipientEmail);
  
  const text = generatePlainTextEmail(
    'Weekly Performance Summary',
    `Hi ${managerName},\n\nHere's your weekly performance summary for ${fundName}:\n\nPage Views: ${weeklyImpressions}\nNew Leads: ${weeklyLeads}\n\nKeep your profile fresh! Regular updates impact your rankings and lead to higher visibility, better positioning, and more quality leads.`,
    'Update Fund Profile',
    fundUrl
  );
  
  return { html, text };
}

/**
 * Weekly Digest Email - Unverified Funds
 */
export function generateWeeklyDigestEmailUnverified(data: {
  fundName: string;
  weeklyImpressions: number;
  weeklyLeads: number;
  managerName: string;
  fundUrl: string;
  recipientEmail: string;
}): { html: string; text: string } {
  const { fundName, weeklyImpressions, weeklyLeads, managerName, fundUrl, recipientEmail } = data;
  
  const bodyContent = `
    <p style="color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
      Hi ${managerName},
    </p>
    <p style="color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
      Here's your weekly performance summary for <strong>${fundName}</strong>:
    </p>
    
    ${generateContentCard(`
      <div style="display: flex; justify-content: space-around; text-align: center; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 150px; margin: 10px;">
          <div style="font-size: 36px; font-weight: 700; color: ${BRAND_COLORS.bordeaux}; margin-bottom: 8px;">
            👁️ ${weeklyImpressions.toLocaleString()}
          </div>
          <div style="font-size: 14px; color: ${BRAND_COLORS.textMuted}; text-transform: uppercase; letter-spacing: 0.5px;">
            Page Views
          </div>
        </div>
        <div style="flex: 1; min-width: 150px; margin: 10px;">
          <div style="font-size: 36px; font-weight: 700; color: ${BRAND_COLORS.bronze}; margin-bottom: 8px;">
            👥 ${weeklyLeads.toLocaleString()}
          </div>
          <div style="font-size: 14px; color: ${BRAND_COLORS.textMuted}; text-transform: uppercase; letter-spacing: 0.5px;">
            New Leads
          </div>
        </div>
      </div>
    `, 'bronze')}
    
    ${generateContentCard(`
      <h3 style="color: ${BRAND_COLORS.bronze}; font-size: 18px; margin: 0 0 15px 0;">
        ✨ Get 3x More Leads with Verification
      </h3>
      <p style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.6; margin-bottom: 15px;">
        Verified funds on our platform receive <strong>3x more investor enquiries</strong> on average. Verification shows:
      </p>
      <ul style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.8; margin-bottom: 20px;">
        <li><strong>CMVM registration</strong> - Regulatory compliance confirmed</li>
        <li><strong>Fund documentation</strong> - Prospectus and key facts verified</li>
        <li><strong>Performance data</strong> - Historical returns authenticated</li>
        <li><strong>Management team</strong> - Leadership credentials validated</li>
      </ul>
      <p style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.6; margin-bottom: 0;">
        Verification is free and takes 2-3 business days.
      </p>
    `, 'bronze')}
    
    ${generateCTAButton('Get Your Fund Verified', 'https://verify.movingto.com', 'bronze')}
    
    <h3 style="color: ${BRAND_COLORS.bordeaux}; font-size: 18px; margin: 30px 0 15px 0;">
      📈 Keep Your Profile Fresh
    </h3>
    <p style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.6; margin-bottom: 15px;">
      Regular updates to your fund profile and performance data directly impact your rankings. Updated profiles receive higher visibility and more quality leads.
    </p>
    
    ${generateCTAButton('Update Fund Profile', fundUrl, 'bordeaux')}
  `;
  
  const html = generateEmailWrapper('Weekly Performance Summary', bodyContent, recipientEmail);
  
  const text = generatePlainTextEmail(
    'Weekly Performance Summary',
    `Hi ${managerName},\n\nHere's your weekly performance summary for ${fundName}:\n\nPage Views: ${weeklyImpressions}\nNew Leads: ${weeklyLeads}\n\nGET 3X MORE LEADS: Verified funds receive 3x more enquiries. Verification confirms CMVM registration, fund docs, performance data, and management team. It's free and takes 2-3 days.\n\nVerify now: https://verify.movingto.com\n\nKeep your profile fresh! Regular updates impact your rankings.`,
    'Update Fund Profile',
    fundUrl
  );
  
  return { html, text };
}

/**
 * Monthly Performance Reminder - Verified Funds
 */
export function generateMonthlyPerformanceReminderEmail(data: {
  fundName: string;
  monthYear: string;
  managerName: string;
  fundUrl: string;
  recipientEmail: string;
}): { html: string; text: string } {
  const { fundName, monthYear, managerName, fundUrl, recipientEmail } = data;
  
  const bodyContent = `
    <p style="color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
      Hi ${managerName},
    </p>
    <p style="color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
      It's time to update the performance data for <strong>${fundName}</strong> for ${monthYear}.
    </p>
    
    ${generateContentCard(`
      <h3 style="color: ${BRAND_COLORS.bordeaux}; font-size: 18px; margin: 0 0 15px 0;">
        📊 Why Monthly Updates Matter
      </h3>
      <p style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.6; margin-bottom: 15px;">
        Keeping your performance data current is crucial for:
      </p>
      <ul style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.8; margin-bottom: 0;">
        <li><strong>Investor Confidence</strong> - Up-to-date returns show transparency</li>
        <li><strong>Higher Rankings</strong> - Fresh data improves platform visibility</li>
        <li><strong>Regulatory Compliance</strong> - Meet disclosure requirements</li>
        <li><strong>Competitive Edge</strong> - Stand out with current performance</li>
      </ul>
    `, 'bordeaux')}
    
    <h3 style="color: ${BRAND_COLORS.bronze}; font-size: 18px; margin: 30px 0 15px 0;">
      ⏱️ Update Takes Just 2 Minutes
    </h3>
    <p style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
      Simply add your latest NAV and return figures for ${monthYear}. Our system automatically calculates year-to-date and cumulative returns.
    </p>
    
    ${generateCTAButton('Update Performance Data', fundUrl, 'bordeaux')}
    
    <p style="color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 1.6; margin-top: 30px; text-align: center;">
      Need help? Reply to this email and our team will assist you.
    </p>
  `;
  
  const html = generateEmailWrapper(`Monthly Performance Update - ${monthYear}`, bodyContent, recipientEmail);
  
  const text = generatePlainTextEmail(
    `Monthly Performance Update - ${monthYear}`,
    `Hi ${managerName},\n\nIt's time to update the performance data for ${fundName} for ${monthYear}.\n\nWhy monthly updates matter:\n- Investor confidence through transparency\n- Higher platform rankings\n- Regulatory compliance\n- Competitive edge\n\nUpdating takes just 2 minutes. Add your latest NAV and return figures - we calculate the rest automatically.`,
    'Update Performance Data',
    fundUrl
  );
  
  return { html, text };
}

/**
 * Monthly Performance Reminder - Unverified Funds
 */
export function generateMonthlyPerformanceReminderEmailUnverified(data: {
  fundName: string;
  monthYear: string;
  managerName: string;
  fundUrl: string;
  recipientEmail: string;
}): { html: string; text: string } {
  const { fundName, monthYear, managerName, fundUrl, recipientEmail } = data;
  
  const bodyContent = `
    <p style="color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
      Hi ${managerName},
    </p>
    <p style="color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
      It's time to update the performance data for <strong>${fundName}</strong> for ${monthYear}.
    </p>
    
    ${generateContentCard(`
      <h3 style="color: ${BRAND_COLORS.bordeaux}; font-size: 18px; margin: 0 0 15px 0;">
        📊 Why Monthly Updates Matter
      </h3>
      <p style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.6; margin-bottom: 15px;">
        Keeping your performance data current is crucial for:
      </p>
      <ul style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.8; margin-bottom: 0;">
        <li><strong>Investor Confidence</strong> - Up-to-date returns show transparency</li>
        <li><strong>Higher Rankings</strong> - Fresh data improves platform visibility</li>
        <li><strong>Regulatory Compliance</strong> - Meet disclosure requirements</li>
        <li><strong>Competitive Edge</strong> - Stand out with current performance</li>
      </ul>
    `, 'bordeaux')}
    
    ${generateContentCard(`
      <h3 style="color: ${BRAND_COLORS.bronze}; font-size: 18px; margin: 0 0 15px 0;">
        ✨ Verified Funds Get 3x More Leads
      </h3>
      <p style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.6; margin-bottom: 15px;">
        Verification increases investor trust and dramatically boosts enquiries. Our verification process confirms:
      </p>
      <ul style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.8; margin-bottom: 20px;">
        <li><strong>CMVM registration</strong> - Regulatory compliance</li>
        <li><strong>Fund documentation</strong> - Prospectus verification</li>
        <li><strong>Performance data</strong> - Historical returns authenticated</li>
        <li><strong>Management credentials</strong> - Leadership validated</li>
      </ul>
      <p style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.6; margin-bottom: 0;">
        <strong>Free verification in 2-3 business days.</strong>
      </p>
    `, 'bronze')}
    
    ${generateCTAButton('Get Your Fund Verified', 'https://verify.movingto.com', 'bronze')}
    
    <h3 style="color: ${BRAND_COLORS.bordeaux}; font-size: 18px; margin: 30px 0 15px 0;">
      ⏱️ Update Takes Just 2 Minutes
    </h3>
    <p style="color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
      Simply add your latest NAV and return figures for ${monthYear}. Our system automatically calculates year-to-date and cumulative returns.
    </p>
    
    ${generateCTAButton('Update Performance Data', fundUrl, 'bordeaux')}
  `;
  
  const html = generateEmailWrapper(`Monthly Performance Update - ${monthYear}`, bodyContent, recipientEmail);
  
  const text = generatePlainTextEmail(
    `Monthly Performance Update - ${monthYear}`,
    `Hi ${managerName},\n\nIt's time to update the performance data for ${fundName} for ${monthYear}.\n\nWhy monthly updates matter: investor confidence, higher rankings, regulatory compliance, competitive edge.\n\nVERIFICATION BOOST: Verified funds get 3x more leads. We confirm CMVM registration, fund docs, performance, and management credentials. Free, takes 2-3 days.\n\nVerify: https://verify.movingto.com\n\nUpdate performance (2 min): Add NAV and returns - we calculate the rest.`,
    'Update Performance Data',
    fundUrl
  );
  
  return { html, text };
}
