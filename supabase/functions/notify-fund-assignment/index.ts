import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { ServerClient } from "npm:postmark@4.0.0";

const postmark = new ServerClient(Deno.env.get("POSTMARK_SERVER_TOKEN") as string);
const fromEmail = Deno.env.get("NOTIFICATION_FROM_EMAIL") || "noreply@movingto.com";

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

    // Construct HTML email
    const htmlBody = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Fund Assignment Notification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
          <table role="presentation" style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                  <!-- Header -->
                  <tr>
                    <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                      <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">
                        You've Been Assigned to Manage a Fund
                      </h1>
                    </td>
                  </tr>
                  
                  <!-- Body -->
                  <tr>
                    <td style="padding: 40px 30px;">
                      <p style="margin: 0 0 20px; color: #333333; font-size: 16px; line-height: 1.6;">
                        Hello <strong>${manager_name}</strong>,
                      </p>
                      
                      <p style="margin: 0 0 30px; color: #333333; font-size: 16px; line-height: 1.6;">
                        You have been assigned to manage the following fund on the Investment Funds Platform:
                      </p>
                      
                      <!-- Assignment Details Box -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f8f9fa; border-radius: 6px; margin-bottom: 30px;">
                        <tr>
                          <td style="padding: 25px;">
                            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                              <tr>
                                <td style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: 500;">Fund Name:</td>
                                <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">${fund_name}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: 500;">Fund ID:</td>
                                <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right;">${fund_id}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: 500;">Your Permissions:</td>
                                <td style="padding: 8px 0; color: #333333; font-size: 14px; font-weight: 600; text-align: right;">${permissionsText}</td>
                              </tr>
                              <tr>
                                <td style="padding: 8px 0; color: #666666; font-size: 14px; font-weight: 500;">Assignment Date:</td>
                                <td style="padding: 8px 0; color: #333333; font-size: 14px; text-align: right;">${formattedDate}</td>
                              </tr>
                              ${notes ? `
                              <tr>
                                <td colspan="2" style="padding: 15px 0 0; border-top: 1px solid #e0e0e0;">
                                  <p style="margin: 10px 0 0; color: #666666; font-size: 14px; font-weight: 500;">Notes from Admin:</p>
                                  <p style="margin: 8px 0 0; color: #333333; font-size: 14px; line-height: 1.5;">${notes}</p>
                                </td>
                              </tr>
                              ` : ''}
                            </table>
                          </td>
                        </tr>
                      </table>
                      
                      <!-- CTA Button -->
                      <table role="presentation" style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        <tr>
                          <td style="text-align: center;">
                            <a href="https://funds.movingto.com/manage-fund/${fund_id}" 
                               style="display: inline-block; padding: 14px 32px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">
                              Manage This Fund
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="margin: 0 0 15px; color: #333333; font-size: 16px; line-height: 1.6;">
                        <strong>What you can do:</strong>
                      </p>
                      
                      <ul style="margin: 0 0 30px; padding-left: 20px; color: #333333; font-size: 15px; line-height: 1.8;">
                        ${permissions.can_edit ? '<li>Update fund information and details</li>' : ''}
                        ${permissions.can_publish ? '<li>Publish changes to make them live</li>' : ''}
                        <li>View comprehensive fund analytics</li>
                        <li>Track fund performance metrics</li>
                        <li>Access investor inquiries</li>
                      </ul>
                      
                      <p style="margin: 0; color: #666666; font-size: 14px; line-height: 1.6;">
                        If you have any questions or need assistance, please don't hesitate to reach out to our support team.
                      </p>
                    </td>
                  </tr>
                  
                  <!-- Footer -->
                  <tr>
                    <td style="padding: 30px; background-color: #f8f9fa; text-align: center; border-top: 1px solid #e0e0e0;">
                      <p style="margin: 0 0 8px; color: #999999; font-size: 13px;">
                        Investment Funds Platform
                      </p>
                      <p style="margin: 0; color: #999999; font-size: 13px;">
                        <a href="https://funds.movingto.com" style="color: #667eea; text-decoration: none;">funds.movingto.com</a>
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `;

    // Plain text version
    const textBody = `
You've Been Assigned to Manage a Fund

Hello ${manager_name},

You have been assigned to manage the following fund on the Investment Funds Platform:

Fund Name: ${fund_name}
Fund ID: ${fund_id}
Your Permissions: ${permissionsText}
Assignment Date: ${formattedDate}
${notes ? `\nNotes from Admin: ${notes}` : ''}

Manage this fund: https://funds.movingto.com/manage-fund/${fund_id}

What you can do:
${permissions.can_edit ? '- Update fund information and details\n' : ''}${permissions.can_publish ? '- Publish changes to make them live\n' : ''}- View comprehensive fund analytics
- Track fund performance metrics
- Access investor inquiries

If you have any questions or need assistance, please don't hesitate to reach out to our support team.

---
Investment Funds Platform
https://funds.movingto.com
    `;

    // Send email via Postmark
    const emailResponse = await postmark.sendEmail({
      From: `Investment Funds Platform <${fromEmail}>`,
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
