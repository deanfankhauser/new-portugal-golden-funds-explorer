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
      managers_business_info: {
        Row: {
          assets_under_management: number | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          description: string | null
          founded_year: number | null
          id: string | null
          logo_url: string | null
          manager_name: string | null
          website: string | null
        }
        Insert: {
          assets_under_management?: number | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string | null
          logo_url?: string | null
          manager_name?: string | null
          website?: string | null
        }
        Update: {
          assets_under_management?: number | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string | null
          logo_url?: string | null
          manager_name?: string | null
          website?: string | null
        }
        Relationships: []
      }
      managers_directory: {
        Row: {
          city: string | null
          company_name: string | null
          country: string | null
          description: string | null
          founded_year: number | null
          id: string | null
          logo_url: string | null
          manager_name: string | null
          website: string | null
        }
        Insert: {
          city?: string | null
          company_name?: string | null
          country?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string | null
          logo_url?: string | null
          manager_name?: string | null
          website?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string | null
          country?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string | null
          logo_url?: string | null
          manager_name?: string | null
          website?: string | null
        }
        Relationships: []
      }
      managers_public_view: {
        Row: {
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          description: string | null
          founded_year: number | null
          id: string | null
          logo_url: string | null
          manager_name: string | null
          website: string | null
        }
        Insert: {
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string | null
          logo_url?: string | null
          manager_name?: string | null
          website?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string | null
          logo_url?: string | null
          manager_name?: string | null
          website?: string | null
        }
        Relationships: []
      }
      public_managers: {
        Row: {
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          description: string | null
          founded_year: number | null
          id: string | null
          logo_url: string | null
          manager_name: string | null
          website: string | null
        }
        Insert: {
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string | null
          logo_url?: string | null
          manager_name?: string | null
          website?: string | null
        }
        Update: {
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          founded_year?: number | null
          id?: string | null
          logo_url?: string | null
          manager_name?: string | null
          website?: string | null
        }
        Relationships: []
      }
      security_status_audit: {
        Row: {
          details: string | null
          last_updated: string | null
          security_area: string | null
          status: string | null
        }
        Relationships: []
      }
      security_verification: {
        Row: {
          access_level: string | null
          security_status: string | null
          view_name: string | null
        }
        Relationships: []
      }
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
    }
    Enums: {
      manager_status: "pending" | "approved" | "suspended" | "rejected"
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
      manager_status: ["pending", "approved", "suspended", "rejected"],
    },
  },
} as const
