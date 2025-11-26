import { supabase } from '@/integrations/supabase/client';

export class FundVerificationService {
  /**
   * Mark a fund as verified
   */
  static async verifyFund(fundId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('funds')
        .update({
          is_verified: true,
          verified_at: new Date().toISOString(),
          verified_by: userData.user.id
        })
        .eq('id', fundId);

      if (error) throw error;

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action_type: 'FUND_VERIFIED',
        p_target_type: 'fund',
        p_target_id: fundId,
        p_details: { verified_at: new Date().toISOString() }
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Remove verification from a fund
   */
  static async unverifyFund(fundId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('funds')
        .update({
          is_verified: false,
          verified_at: null,
          verified_by: null
        })
        .eq('id', fundId);

      if (error) throw error;

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action_type: 'FUND_UNVERIFIED',
        p_target_type: 'fund',
        p_target_id: fundId,
        p_details: { unverified_at: new Date().toISOString() }
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Bulk verify multiple funds
   */
  static async bulkVerifyFunds(fundIds: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        return { success: false, error: 'Not authenticated' };
      }

      const { error } = await supabase
        .from('funds')
        .update({
          is_verified: true,
          verified_at: new Date().toISOString(),
          verified_by: userData.user.id
        })
        .in('id', fundIds);

      if (error) throw error;

      // Log bulk activity
      await supabase.rpc('log_admin_activity', {
        p_action_type: 'BULK_FUND_VERIFIED',
        p_target_type: 'funds',
        p_target_id: `bulk_${fundIds.length}`,
        p_details: { fund_ids: fundIds, count: fundIds.length }
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Bulk unverify multiple funds
   */
  static async bulkUnverifyFunds(fundIds: string[]): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('funds')
        .update({
          is_verified: false,
          verified_at: null,
          verified_by: null
        })
        .in('id', fundIds);

      if (error) throw error;

      // Log bulk activity
      await supabase.rpc('log_admin_activity', {
        p_action_type: 'BULK_FUND_UNVERIFIED',
        p_target_type: 'funds',
        p_target_id: `bulk_${fundIds.length}`,
        p_details: { fund_ids: fundIds, count: fundIds.length }
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Toggle quiz eligibility for a fund
   */
  static async toggleQuizEligibility(fundId: string, isEligible: boolean): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase
        .from('funds')
        .update({
          is_quiz_eligible: isEligible
        })
        .eq('id', fundId);

      if (error) throw error;

      // Log admin activity
      await supabase.rpc('log_admin_activity', {
        p_action_type: isEligible ? 'FUND_QUIZ_ENABLED' : 'FUND_QUIZ_DISABLED',
        p_target_type: 'fund',
        p_target_id: fundId,
        p_details: { is_quiz_eligible: isEligible }
      });

      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
}
