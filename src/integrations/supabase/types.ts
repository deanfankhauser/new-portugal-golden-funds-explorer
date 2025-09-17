export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      account_deletion_requests: {
        Row: {
          created_at: string | null
          id: string
          processed_at: string | null
          requested_at: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          processed_at?: string | null
          requested_at?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_activity_log: {
        Row: {
          action_type: string
          admin_user_id: string
          created_at: string | null
          details: Json | null
          id: string
          ip_address: unknown | null
          target_id: string | null
          target_type: string
          user_agent: string | null
        }
        Insert: {
          action_type: string
          admin_user_id: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_id?: string | null
          target_type: string
          user_agent?: string | null
        }
        Update: {
          action_type?: string
          admin_user_id?: string
          created_at?: string | null
          details?: Json | null
          id?: string
          ip_address?: unknown | null
          target_id?: string | null
          target_type?: string
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_activity_log_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "admin_users"
            referencedColumns: ["id"]
          },
        ]
      }
      admin_users: {
        Row: {
          created_at: string
          granted_at: string
          granted_by: string
          id: string
          role: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          granted_at?: string
          granted_by: string
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          granted_at?: string
          granted_by?: string
          id?: string
          role?: Database["public"]["Enums"]["admin_role"]
          user_id?: string
        }
        Relationships: []
      }
      fund_edit_history: {
        Row: {
          admin_user_id: string
          applied_at: string
          changed_by: string
          changes: Json
          fund_id: string
          id: string
          suggestion_id: string | null
        }
        Insert: {
          admin_user_id: string
          applied_at?: string
          changed_by: string
          changes: Json
          fund_id: string
          id?: string
          suggestion_id?: string | null
        }
        Update: {
          admin_user_id?: string
          applied_at?: string
          changed_by?: string
          changes?: Json
          fund_id?: string
          id?: string
          suggestion_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fund_edit_history_suggestion_id_fkey"
            columns: ["suggestion_id"]
            isOneToOne: false
            referencedRelation: "fund_edit_suggestions"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_edit_suggestions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          created_at: string
          current_values: Json
          fund_id: string
          id: string
          rejection_reason: string | null
          status: Database["public"]["Enums"]["suggestion_status"]
          suggested_changes: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          current_values: Json
          fund_id: string
          id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          suggested_changes: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          current_values?: Json
          fund_id?: string
          id?: string
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["suggestion_status"]
          suggested_changes?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      funds: {
        Row: {
          aum: number | null
          category: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          detailed_description: string | null
          expected_return_max: number | null
          expected_return_min: number | null
          faqs: Json | null
          geographic_allocation: Json | null
          gv_eligible: boolean | null
          id: string
          inception_date: string | null
          last_modified_by: string | null
          lock_up_period_months: number | null
          management_fee: number | null
          manager_name: string | null
          minimum_investment: number | null
          name: string
          pdf_documents: Json | null
          performance_fee: number | null
          risk_level: string | null
          tags: string[] | null
          team_members: Json | null
          updated_at: string | null
          version: number | null
          website: string | null
        }
        Insert: {
          aum?: number | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          detailed_description?: string | null
          expected_return_max?: number | null
          expected_return_min?: number | null
          faqs?: Json | null
          geographic_allocation?: Json | null
          gv_eligible?: boolean | null
          id: string
          inception_date?: string | null
          last_modified_by?: string | null
          lock_up_period_months?: number | null
          management_fee?: number | null
          manager_name?: string | null
          minimum_investment?: number | null
          name: string
          pdf_documents?: Json | null
          performance_fee?: number | null
          risk_level?: string | null
          tags?: string[] | null
          team_members?: Json | null
          updated_at?: string | null
          version?: number | null
          website?: string | null
        }
        Update: {
          aum?: number | null
          category?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          detailed_description?: string | null
          expected_return_max?: number | null
          expected_return_min?: number | null
          faqs?: Json | null
          geographic_allocation?: Json | null
          gv_eligible?: boolean | null
          id?: string
          inception_date?: string | null
          last_modified_by?: string | null
          lock_up_period_months?: number | null
          management_fee?: number | null
          manager_name?: string | null
          minimum_investment?: number | null
          name?: string
          pdf_documents?: Json | null
          performance_fee?: number | null
          risk_level?: string | null
          tags?: string[] | null
          team_members?: Json | null
          updated_at?: string | null
          version?: number | null
          website?: string | null
        }
        Relationships: []
      }
      investor_profiles: {
        Row: {
          address: string | null
          annual_income_range: string | null
          avatar_url: string | null
          city: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          email: string
          first_name: string
          id: string
          investment_experience: string | null
          last_name: string
          net_worth_range: string | null
          phone: string | null
          risk_tolerance: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          annual_income_range?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email: string
          first_name: string
          id?: string
          investment_experience?: string | null
          last_name: string
          net_worth_range?: string | null
          phone?: string | null
          risk_tolerance?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          annual_income_range?: string | null
          avatar_url?: string | null
          city?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          email?: string
          first_name?: string
          id?: string
          investment_experience?: string | null
          last_name?: string
          net_worth_range?: string | null
          phone?: string | null
          risk_tolerance?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      manager_profiles: {
        Row: {
          address: string | null
          approved_at: string | null
          approved_by: string | null
          assets_under_management: number | null
          city: string | null
          company_name: string
          country: string | null
          created_at: string
          description: string | null
          email: string
          founded_year: number | null
          id: string
          license_number: string | null
          logo_url: string | null
          manager_name: string
          phone: string | null
          registration_number: string | null
          status: Database["public"]["Enums"]["manager_status"]
          updated_at: string
          user_id: string
          website: string | null
        }
        Insert: {
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          assets_under_management?: number | null
          city?: string | null
          company_name: string
          country?: string | null
          created_at?: string
          description?: string | null
          email: string
          founded_year?: number | null
          id?: string
          license_number?: string | null
          logo_url?: string | null
          manager_name: string
          phone?: string | null
          registration_number?: string | null
          status?: Database["public"]["Enums"]["manager_status"]
          updated_at?: string
          user_id: string
          website?: string | null
        }
        Update: {
          address?: string | null
          approved_at?: string | null
          approved_by?: string | null
          assets_under_management?: number | null
          city?: string | null
          company_name?: string
          country?: string | null
          created_at?: string
          description?: string | null
          email?: string
          founded_year?: number | null
          id?: string
          license_number?: string | null
          logo_url?: string | null
          manager_name?: string
          phone?: string | null
          registration_number?: string | null
          status?: Database["public"]["Enums"]["manager_status"]
          updated_at?: string
          user_id?: string
          website?: string | null
        }
        Relationships: []
      }
      security_audit_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          id: string
          justification: string
          object_name: string
          object_type: string
          reviewed_at: string
          reviewer: string
          risk_level: string
          security_feature: string
          status: string
        }
        Insert: {
          id?: string
          justification: string
          object_name: string
          object_type: string
          reviewed_at?: string
          reviewer?: string
          risk_level: string
          security_feature: string
          status?: string
        }
        Update: {
          id?: string
          justification?: string
          object_name?: string
          object_type?: string
          reviewed_at?: string
          reviewer?: string
          risk_level?: string
          security_feature?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_sensitive_data_exposure: {
        Args: Record<PropertyKey, never>
        Returns: {
          has_sensitive_columns: boolean
          sensitive_columns: string[]
          view_name: string
        }[]
      }
      copy_funds_to_develop: {
        Args: Record<PropertyKey, never>
        Returns: {
          details: string
          operation: string
          record_count: number
          status: string
        }[]
      }
      find_user_by_email: {
        Args: { user_email: string }
        Returns: string
      }
      get_database_schema_info: {
        Args: Record<PropertyKey, never>
        Returns: {
          column_default: string
          column_name: string
          data_type: string
          is_nullable: string
          table_name: string
        }[]
      }
      get_super_admin_emails: {
        Args: Record<PropertyKey, never>
        Returns: {
          admin_name: string
          email: string
        }[]
      }
      get_user_admin_role: {
        Args: { check_user_id?: string }
        Returns: Database["public"]["Enums"]["admin_role"]
      }
      get_users_identity: {
        Args: { p_user_ids: string[] }
        Returns: {
          display_name: string
          email: string
          user_id: string
        }[]
      }
      is_user_admin: {
        Args: { check_user_id?: string }
        Returns: boolean
      }
      log_admin_activity: {
        Args: {
          p_action_type: string
          p_details?: Json
          p_target_id?: string
          p_target_type: string
        }
        Returns: undefined
      }
      sync_database_functions_to_develop: {
        Args: Record<PropertyKey, never>
        Returns: {
          function_definition: string
          function_name: string
          status: string
        }[]
      }
    }
    Enums: {
      admin_role: "super_admin" | "moderator" | "admin"
      manager_status: "pending" | "approved" | "suspended" | "rejected"
      suggestion_status: "pending" | "approved" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      admin_role: ["super_admin", "moderator", "admin"],
      manager_status: ["pending", "approved", "suspended", "rejected"],
      suggestion_status: ["pending", "approved", "rejected"],
    },
  },
} as const
