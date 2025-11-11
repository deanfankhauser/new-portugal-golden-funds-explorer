import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { ServerClient } from "npm:postmark@4.0.0";
import { 
  BRAND_COLORS, 
  COMPANY_INFO, 
  generateEmailWrapper, 
  generateCTAButton, 
  generateContentCard,
  generatePlainTextEmail 
} from "../_shared/email-templates.ts";

const postmark = new ServerClient(Deno.env.get("POSTMARK_SERVER_TOKEN") as string);
const fromEmail = Deno.env.get("NOTIFICATION_FROM_EMAIL") || COMPANY_INFO.email;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface FundAssignmentRequest {
  fund_id: string;
  fund_name: string;
  manager_email: string;
  manager_name: string;
  permissions: {
    can_edit: boolean;
    can_publish: boolean;
  };
  notes?: string;
  assigned_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const {
      fund_id,
      fund_name,
      manager_email,
      manager_name,
      permissions,
      notes,
      assigned_at,
    }: FundAssignmentRequest = await req.json();

    console.log("Sending fund assignment notification:", {
      fund_id,
      manager_email,
      manager_name,
    });

    // Validate required fields
    if (!fund_id || !fund_name || !manager_email || !manager_name || !permissions) {
      throw new Error("Missing required fields");
    }

    // Format permissions for display
    const permissionsList = [];
    if (permissions.can_edit) permissionsList.push("Edit fund details");
    if (permissions.can_publish) permissionsList.push("Publish changes");
    const permissionsText = permissionsList.length > 0 
      ? permissionsList.join(", ") 
      : "View only";

    // Format date
    const formattedDate = new Date(assigned_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Construct branded HTML email
    const bodyContent = `
      <p style="margin: 0 0 20px; color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6;">
        Hello <strong>${manager_name}</strong>,
      </p>
      
      <p style="margin: 0 0 30px; color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6;">
        You have been assigned to manage the following fund on ${COMPANY_INFO.tradingName}:
      </p>
      
      ${generateContentCard(`
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; font-weight: 500;">Fund Name:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 600; text-align: right;">${fund_name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; font-weight: 500;">Fund ID:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; text-align: right;">${fund_id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; font-weight: 500;">Your Permissions:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; font-weight: 600; text-align: right;">${permissionsText}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; font-weight: 500;">Assignment Date:</td>
            <td style="padding: 8px 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; text-align: right;">${formattedDate}</td>
          </tr>
          ${notes ? `
          <tr>
            <td colspan="2" style="padding: 15px 0 0; border-top: 1px solid #e0e0e0;">
              <p style="margin: 10px 0 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; font-weight: 500;">Notes from Admin:</p>
              <p style="margin: 8px 0 0; color: ${BRAND_COLORS.textDark}; font-size: 14px; line-height: 1.5;">${notes}</p>
            </td>
          </tr>
          ` : ''}
        </table>
      `, 'bordeaux')}
      
      ${generateCTAButton('Manage This Fund', `${COMPANY_INFO.website}/manage-fund/${fund_id}`, 'bordeaux')}
      
      <p style="margin: 0 0 15px; color: ${BRAND_COLORS.textDark}; font-size: 16px; line-height: 1.6;">
        <strong>What you can do:</strong>
      </p>
      
      <ul style="margin: 0 0 30px; padding-left: 20px; color: ${BRAND_COLORS.textDark}; font-size: 15px; line-height: 1.8;">
        ${permissions.can_edit ? '<li>Update fund information and details</li>' : ''}
        ${permissions.can_publish ? '<li>Publish changes to make them live</li>' : ''}
        <li>View comprehensive fund analytics</li>
        <li>Track fund performance metrics</li>
        <li>Access investor inquiries</li>
      </ul>
      
      <p style="margin: 0; color: ${BRAND_COLORS.textMuted}; font-size: 14px; line-height: 1.6;">
        If you have any questions or need assistance, please don't hesitate to reach out to our support team.
      </p>
    `;
    
    const htmlBody = generateEmailWrapper(
      "You've Been Assigned to Manage a Fund",
      bodyContent,
      manager_email
    );

    // Plain text version
    const textBody = generatePlainTextEmail(
      "You've Been Assigned to Manage a Fund",
      `Hello ${manager_name},

You have been assigned to manage the following fund:

Fund Name: ${fund_name}
Fund ID: ${fund_id}
Your Permissions: ${permissionsText}
Assignment Date: ${formattedDate}
${notes ? `\nNotes from Admin: ${notes}` : ''}

What you can do:
${permissions.can_edit ? '- Update fund information and details\n' : ''}${permissions.can_publish ? '- Publish changes to make them live\n' : ''}- View comprehensive fund analytics
- Track fund performance metrics
- Access investor inquiries

If you have any questions or need assistance, please don't hesitate to reach out to our support team.`,
      'Manage This Fund',
      `${COMPANY_INFO.website}/manage-fund/${fund_id}`
    );

    // Send email via Postmark
    const emailResponse = await postmark.sendEmail({
      From: `${COMPANY_INFO.tradingName} <${fromEmail}>`,
      To: manager_email,
      Subject: `You've Been Assigned to Manage ${fund_name}`,
      HtmlBody: htmlBody,
      TextBody: textBody,
      MessageStream: "outbound",
      Tag: "fund-assignment",
      Metadata: {
        fund_id: fund_id,
        manager_name: manager_name,
        permissions: JSON.stringify(permissions),
      },
    });

    console.log("Fund assignment notification sent successfully:", emailResponse);

    return new Response(
      JSON.stringify({
        success: true,
        messageId: emailResponse.MessageID,
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error: any) {
    console.error("Error in notify-fund-assignment function:", error);
    
    // Check for Postmark sender verification error
    if (error.statusCode === 422 && error.code === 400) {
      console.error(
        "❌ Sender email not verified in Postmark. Please verify the sender signature at https://account.postmarkapp.com/signatures",
        "\nCurrent From address:", fromEmail
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false,
        hint: error.statusCode === 422 ? "Sender email not verified in Postmark" : undefined,
        statusCode: error.statusCode,
      }),
      {
        status: error.statusCode || 500,
        headers: { 
          "Content-Type": "application/json", 
          ...corsHeaders 
        },
      }
    );
  }
};

serve(handler);
