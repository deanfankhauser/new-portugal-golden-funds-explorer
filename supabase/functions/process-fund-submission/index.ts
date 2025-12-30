import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";
import {
  generateFundSubmissionApprovalEmail,
  generateFundSubmissionRejectionEmail,
  COMPANY_INFO,
} from "../_shared/email-templates.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ProcessSubmissionRequest {
  submissionId: string;
  action: "approve" | "reject";
  rejectionReason?: string;
  adminUserId: string;
}

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-z0-9\s-]/g, "") // Remove special characters
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove consecutive hyphens
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const postmarkToken = Deno.env.get("POSTMARK_SERVER_TOKEN");

    if (!postmarkToken) {
      console.error("Missing POSTMARK_SERVER_TOKEN");
      return new Response(
        JSON.stringify({ error: "Email service not configured" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const requestData: ProcessSubmissionRequest = await req.json();
    const { submissionId, action, rejectionReason, adminUserId } = requestData;

    console.log("Processing submission:", { submissionId, action });

    // Fetch the submission
    const { data: submission, error: fetchError } = await supabase
      .from("fund_submissions")
      .select("*")
      .eq("id", submissionId)
      .single();

    if (fetchError || !submission) {
      console.error("Error fetching submission:", fetchError);
      return new Response(
        JSON.stringify({ error: "Submission not found" }),
        { status: 404, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get submitter's email from auth
    const { data: userData } = await supabase.auth.admin.getUserById(submission.user_id);
    const contactEmail = userData?.user?.email || "";

    if (action === "reject") {
      // Update submission status
      const { error: updateError } = await supabase
        .from("fund_submissions")
        .update({
          status: "rejected",
          rejection_reason: rejectionReason,
          reviewed_by: adminUserId,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", submissionId);

      if (updateError) {
        console.error("Error updating submission:", updateError);
        return new Response(
          JSON.stringify({ error: "Failed to update submission" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Send rejection email
      const rejectionEmail = generateFundSubmissionRejectionEmail({
        companyName: submission.company_name,
        fundName: submission.fund_name,
        contactName: submission.contact_name,
        rejectionReason: rejectionReason || "Your submission did not meet our current requirements.",
        recipientEmail: contactEmail,
      });

      await fetch("https://api.postmarkapp.com/email", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "X-Postmark-Server-Token": postmarkToken,
        },
        body: JSON.stringify({
          From: `${COMPANY_INFO.tradingName} <${COMPANY_INFO.email}>`,
          To: contactEmail,
          Subject: "Fund Submission Update - Movingto Funds",
          HtmlBody: rejectionEmail.html,
          TextBody: rejectionEmail.text,
          MessageStream: "outbound",
        }),
      });

      console.log("Rejection processed for submission:", submissionId);

      return new Response(
        JSON.stringify({ success: true, action: "rejected" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // APPROVAL PROCESS
    console.log("Approving submission:", submissionId);

    // 1. Create or find company profile
    let profileId: string;
    
    // Check if profile already exists for this user
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("user_id", submission.user_id)
      .maybeSingle();

    if (existingProfile) {
      profileId = existingProfile.id;
      // Update existing profile with company info
      const { error: updateProfileError } = await supabase
        .from("profiles")
        .update({
          company_name: submission.company_name,
          description: submission.company_description,
          website: submission.company_website,
          city: submission.company_city,
          country: submission.company_country,
          logo_url: submission.company_logo_url,
          entity_type: submission.entity_type,
        })
        .eq("id", profileId);

      if (updateProfileError) {
        console.error("Error updating profile:", updateProfileError);
      }
    } else {
      // Create new profile
      const { data: newProfile, error: profileError } = await supabase
        .from("profiles")
        .insert({
          user_id: submission.user_id,
          email: contactEmail,
          company_name: submission.company_name,
          description: submission.company_description,
          website: submission.company_website,
          city: submission.company_city,
          country: submission.company_country,
          logo_url: submission.company_logo_url,
          entity_type: submission.entity_type,
          first_name: submission.contact_name.split(" ")[0],
          last_name: submission.contact_name.split(" ").slice(1).join(" "),
        })
        .select("id")
        .single();

      if (profileError) {
        console.error("Error creating profile:", profileError);
        return new Response(
          JSON.stringify({ error: "Failed to create company profile" }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      profileId = newProfile.id;
    }

    // 2. Create team member
    const teamMemberSlug = generateSlug(submission.contact_name);
    const { data: teamMember, error: teamMemberError } = await supabase
      .from("team_members")
      .insert({
        profile_id: profileId,
        name: submission.contact_name,
        role: submission.contact_role,
        slug: teamMemberSlug,
        bio: submission.contact_bio,
        photo_url: submission.contact_photo_url,
        linkedin_url: submission.contact_linkedin,
        email: contactEmail,
      })
      .select("id")
      .single();

    if (teamMemberError) {
      console.error("Error creating team member:", teamMemberError);
      // Continue anyway, this is not critical
    }

    // 3. Create fund
    const fundSlug = generateSlug(submission.fund_name);
    const { data: fund, error: fundError } = await supabase
      .from("funds")
      .insert({
        id: fundSlug,
        name: submission.fund_name,
        description: submission.fund_description,
        manager_name: submission.company_name,
        category: submission.category,
        minimum_investment: submission.minimum_investment,
        currency: submission.currency || "EUR",
        gv_eligible: submission.gv_eligible,
        management_fee: submission.management_fee,
        performance_fee: submission.performance_fee,
        expected_return_min: submission.target_return_min,
        expected_return_max: submission.target_return_max,
        lock_up_period_months: submission.lock_up_period_months,
        regulated_by: submission.regulated_by,
        location: submission.fund_location,
        cmvm_id: submission.cmvm_id,
        isin: submission.isin,
        status: "Open",
        is_verified: false,
      })
      .select("id")
      .single();

    if (fundError) {
      console.error("Error creating fund:", fundError);
      return new Response(
        JSON.stringify({ error: "Failed to create fund: " + fundError.message }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // 4. Link team member to fund
    if (teamMember) {
      const { error: linkError } = await supabase
        .from("fund_team_members")
        .insert({
          fund_id: fund.id,
          team_member_id: teamMember.id,
          fund_role: submission.contact_role,
        });

      if (linkError) {
        console.error("Error linking team member to fund:", linkError);
      }
    }

    // 5. Assign user to company profile
    const { error: assignmentError } = await supabase
      .from("manager_profile_assignments")
      .insert({
        profile_id: profileId,
        user_id: submission.user_id,
        status: "active",
        permissions: {
          can_edit_profile: true,
          can_edit_funds: true,
          can_manage_team: true,
          can_view_analytics: true,
        },
        notes: "Auto-assigned via fund submission approval",
      });

    if (assignmentError && !assignmentError.message.includes("duplicate")) {
      console.error("Error creating assignment:", assignmentError);
    }

    // 6. Update submission with created entities
    const { error: updateError } = await supabase
      .from("fund_submissions")
      .update({
        status: "approved",
        reviewed_by: adminUserId,
        reviewed_at: new Date().toISOString(),
        created_profile_id: profileId,
        created_fund_id: fund.id,
        created_team_member_id: teamMember?.id,
      })
      .eq("id", submissionId);

    if (updateError) {
      console.error("Error updating submission:", updateError);
    }

    // 7. Send approval email
    const companySlug = encodeURIComponent(submission.company_name);
    const fundUrl = `${COMPANY_INFO.website}/${fund.id}`;
    const companyUrl = `${COMPANY_INFO.website}/manager/${companySlug}`;
    const dashboardUrl = `${COMPANY_INFO.website}/dashboard`;

    const approvalEmail = generateFundSubmissionApprovalEmail({
      companyName: submission.company_name,
      fundName: submission.fund_name,
      contactName: submission.contact_name,
      fundUrl,
      companyUrl,
      dashboardUrl,
      recipientEmail: contactEmail,
    });

    await fetch("https://api.postmarkapp.com/email", {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": postmarkToken,
      },
      body: JSON.stringify({
        From: `${COMPANY_INFO.tradingName} <${COMPANY_INFO.email}>`,
        To: contactEmail,
        Subject: "Your Fund is Now Live! 🎉 - Movingto Funds",
        HtmlBody: approvalEmail.html,
        TextBody: approvalEmail.text,
        MessageStream: "outbound",
      }),
    });

    console.log("Approval completed for submission:", submissionId);

    return new Response(
      JSON.stringify({
        success: true,
        action: "approved",
        createdEntities: {
          profileId,
          fundId: fund.id,
          teamMemberId: teamMember?.id,
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in process-fund-submission:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
