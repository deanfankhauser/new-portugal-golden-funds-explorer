// Extended Supabase Database type to include missing RPC functions without editing auto-generated types
import type { Database as BaseDatabase } from './types';

// Adds get_fund_manager_sign_ins to the Functions map
export type DatabaseExtended = BaseDatabase & {
  public: BaseDatabase['public'] & {
    Functions: BaseDatabase['public']['Functions'] & {
      get_fund_manager_sign_ins: {
        Args: Record<PropertyKey, never>;
        Returns: Array<{
          fund_id: string;
          fund_name: string;
          manager_name: string;
          company_name: string;
          manager_email: string;
          last_sign_in_at: string | null;
          last_email_sent_at: string | null;
          team_members_count: number;
          total_leads: number;
          recent_leads: number;
          total_impressions: number;
          recent_impressions: number;
        }>;
      };
    };
  };
};
