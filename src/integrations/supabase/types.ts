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
          ip_address: unknown
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
          ip_address?: unknown
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
          ip_address?: unknown
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
      category_editorial: {
        Row: {
          category_name: string
          category_slug: string
          created_at: string | null
          editorial_content: string
          id: string
          updated_at: string | null
        }
        Insert: {
          category_name: string
          category_slug: string
          created_at?: string | null
          editorial_content: string
          id?: string
          updated_at?: string | null
        }
        Update: {
          category_name?: string
          category_slug?: string
          created_at?: string | null
          editorial_content?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      contact_submissions: {
        Row: {
          admin_email_sent: boolean | null
          admin_email_sent_at: string | null
          created_at: string | null
          email: string
          error_message: string | null
          id: string
          message: string
          name: string
          postmark_message_id: string | null
          referrer: string | null
          subject: string
          updated_at: string | null
          user_agent: string | null
          user_email_sent: boolean | null
          user_email_sent_at: string | null
        }
        Insert: {
          admin_email_sent?: boolean | null
          admin_email_sent_at?: string | null
          created_at?: string | null
          email: string
          error_message?: string | null
          id?: string
          message: string
          name: string
          postmark_message_id?: string | null
          referrer?: string | null
          subject: string
          updated_at?: string | null
          user_agent?: string | null
          user_email_sent?: boolean | null
          user_email_sent_at?: string | null
        }
        Update: {
          admin_email_sent?: boolean | null
          admin_email_sent_at?: string | null
          created_at?: string | null
          email?: string
          error_message?: string | null
          id?: string
          message?: string
          name?: string
          postmark_message_id?: string | null
          referrer?: string | null
          subject?: string
          updated_at?: string | null
          user_agent?: string | null
          user_email_sent?: boolean | null
          user_email_sent_at?: string | null
        }
        Relationships: []
      }
      email_captures: {
        Row: {
          confirmation_token: string | null
          confirmed_at: string | null
          created_at: string | null
          email: string
          id: string
          referrer_url: string | null
          source: string
          status: string
          tags: Json | null
          updated_at: string | null
          user_agent: string | null
        }
        Insert: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          email: string
          id?: string
          referrer_url?: string | null
          source?: string
          status?: string
          tags?: Json | null
          updated_at?: string | null
          user_agent?: string | null
        }
        Update: {
          confirmation_token?: string | null
          confirmed_at?: string | null
          created_at?: string | null
          email?: string
          id?: string
          referrer_url?: string | null
          source?: string
          status?: string
          tags?: Json | null
          updated_at?: string | null
          user_agent?: string | null
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
      fund_enquiries: {
        Row: {
          closed_at: string | null
          contacted_at: string | null
          created_at: string | null
          email: string
          first_name: string
          fund_id: string | null
          id: string
          interest_areas: Json | null
          investment_amount_range: string | null
          last_name: string
          manager_name: string | null
          message: string
          notes: string | null
          phone: string | null
          referrer: string | null
          session_id: string | null
          status: string | null
          updated_at: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          closed_at?: string | null
          contacted_at?: string | null
          created_at?: string | null
          email: string
          first_name: string
          fund_id?: string | null
          id?: string
          interest_areas?: Json | null
          investment_amount_range?: string | null
          last_name: string
          manager_name?: string | null
          message: string
          notes?: string | null
          phone?: string | null
          referrer?: string | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          closed_at?: string | null
          contacted_at?: string | null
          created_at?: string | null
          email?: string
          first_name?: string
          fund_id?: string | null
          id?: string
          interest_areas?: Json | null
          investment_amount_range?: string | null
          last_name?: string
          manager_name?: string | null
          message?: string
          notes?: string | null
          phone?: string | null
          referrer?: string | null
          session_id?: string | null
          status?: string | null
          updated_at?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fund_enquiries_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_interactions: {
        Row: {
          created_at: string | null
          fund_id: string
          id: string
          interacted_at: string
          interaction_type: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          fund_id: string
          id?: string
          interacted_at?: string
          interaction_type: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          fund_id?: string
          id?: string
          interacted_at?: string
          interaction_type?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fund_interactions_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_lead_notification_emails: {
        Row: {
          created_at: string | null
          created_by: string | null
          email: string
          fund_id: string
          id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          email: string
          fund_id: string
          id?: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          email?: string
          fund_id?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_lead_notification_emails_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_manager_edits: {
        Row: {
          changes: Json
          created_at: string | null
          edit_type: string
          fund_id: string
          id: string
          manager_user_id: string
          previous_values: Json
        }
        Insert: {
          changes: Json
          created_at?: string | null
          edit_type: string
          fund_id: string
          id?: string
          manager_user_id: string
          previous_values: Json
        }
        Update: {
          changes?: Json
          created_at?: string | null
          edit_type?: string
          fund_id?: string
          id?: string
          manager_user_id?: string
          previous_values?: Json
        }
        Relationships: [
          {
            foreignKeyName: "fund_manager_edits_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_manager_email_logs: {
        Row: {
          click_count: number | null
          created_at: string | null
          email_type: string
          error_message: string | null
          first_click_at: string | null
          fund_id: string
          id: string
          is_verified_fund: boolean
          manager_email: string
          manager_name: string | null
          opened_at: string | null
          postmark_message_id: string | null
          sent_at: string
          subject: string
          test_mode: boolean | null
          updated_at: string | null
          weekly_impressions: number | null
          weekly_leads: number | null
        }
        Insert: {
          click_count?: number | null
          created_at?: string | null
          email_type: string
          error_message?: string | null
          first_click_at?: string | null
          fund_id: string
          id?: string
          is_verified_fund?: boolean
          manager_email: string
          manager_name?: string | null
          opened_at?: string | null
          postmark_message_id?: string | null
          sent_at?: string
          subject: string
          test_mode?: boolean | null
          updated_at?: string | null
          weekly_impressions?: number | null
          weekly_leads?: number | null
        }
        Update: {
          click_count?: number | null
          created_at?: string | null
          email_type?: string
          error_message?: string | null
          first_click_at?: string | null
          fund_id?: string
          id?: string
          is_verified_fund?: boolean
          manager_email?: string
          manager_name?: string | null
          opened_at?: string | null
          postmark_message_id?: string | null
          sent_at?: string
          subject?: string
          test_mode?: boolean | null
          updated_at?: string | null
          weekly_impressions?: number | null
          weekly_leads?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fund_manager_email_logs_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_managers: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          fund_id: string
          id: string
          notes: string | null
          permissions: Json | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          fund_id: string
          id?: string
          notes?: string | null
          permissions?: Json | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          fund_id?: string
          id?: string
          notes?: string | null
          permissions?: Json | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_managers_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fund_managers_user_id_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fund_managers_user_id_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "public_company_profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      fund_page_views: {
        Row: {
          created_at: string | null
          fund_id: string
          id: string
          referrer: string | null
          session_id: string
          user_agent: string | null
          user_id: string | null
          viewed_at: string
        }
        Insert: {
          created_at?: string | null
          fund_id: string
          id?: string
          referrer?: string | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Update: {
          created_at?: string | null
          fund_id?: string
          id?: string
          referrer?: string | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_page_views_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_rankings: {
        Row: {
          category_rank: number | null
          created_at: string | null
          fund_id: string
          id: string
          last_modified_by: string | null
          manual_rank: number
          notes: string | null
          updated_at: string | null
          visibility_boost: number | null
        }
        Insert: {
          category_rank?: number | null
          created_at?: string | null
          fund_id: string
          id?: string
          last_modified_by?: string | null
          manual_rank: number
          notes?: string | null
          updated_at?: string | null
          visibility_boost?: number | null
        }
        Update: {
          category_rank?: number | null
          created_at?: string | null
          fund_id?: string
          id?: string
          last_modified_by?: string | null
          manual_rank?: number
          notes?: string | null
          updated_at?: string | null
          visibility_boost?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fund_rankings_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: true
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
        ]
      }
      fund_submissions: {
        Row: {
          additional_notes: string | null
          category: string
          cmvm_id: string | null
          company_city: string
          company_country: string
          company_description: string
          company_logo_url: string
          company_name: string
          company_website: string
          contact_bio: string | null
          contact_linkedin: string | null
          contact_name: string
          contact_photo_url: string | null
          contact_role: string
          created_at: string | null
          created_fund_id: string | null
          created_profile_id: string | null
          created_team_member_id: string | null
          currency: string | null
          entity_type: string | null
          fund_description: string
          fund_location: string | null
          fund_name: string
          gv_eligible: boolean
          id: string
          isin: string | null
          lock_up_period_months: number | null
          management_fee: number | null
          minimum_investment: number
          performance_fee: number | null
          regulated_by: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          target_return_max: number | null
          target_return_min: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          additional_notes?: string | null
          category: string
          cmvm_id?: string | null
          company_city: string
          company_country: string
          company_description: string
          company_logo_url: string
          company_name: string
          company_website: string
          contact_bio?: string | null
          contact_linkedin?: string | null
          contact_name: string
          contact_photo_url?: string | null
          contact_role: string
          created_at?: string | null
          created_fund_id?: string | null
          created_profile_id?: string | null
          created_team_member_id?: string | null
          currency?: string | null
          entity_type?: string | null
          fund_description: string
          fund_location?: string | null
          fund_name: string
          gv_eligible?: boolean
          id?: string
          isin?: string | null
          lock_up_period_months?: number | null
          management_fee?: number | null
          minimum_investment: number
          performance_fee?: number | null
          regulated_by?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          target_return_max?: number | null
          target_return_min?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          additional_notes?: string | null
          category?: string
          cmvm_id?: string | null
          company_city?: string
          company_country?: string
          company_description?: string
          company_logo_url?: string
          company_name?: string
          company_website?: string
          contact_bio?: string | null
          contact_linkedin?: string | null
          contact_name?: string
          contact_photo_url?: string | null
          contact_role?: string
          created_at?: string | null
          created_fund_id?: string | null
          created_profile_id?: string | null
          created_team_member_id?: string | null
          currency?: string | null
          entity_type?: string | null
          fund_description?: string
          fund_location?: string | null
          fund_name?: string
          gv_eligible?: boolean
          id?: string
          isin?: string | null
          lock_up_period_months?: number | null
          management_fee?: number | null
          minimum_investment?: number
          performance_fee?: number | null
          regulated_by?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          target_return_max?: number | null
          target_return_min?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      fund_team_members: {
        Row: {
          assigned_at: string
          fund_id: string
          fund_role: string | null
          id: string
          team_member_id: string
        }
        Insert: {
          assigned_at?: string
          fund_id: string
          fund_role?: string | null
          id?: string
          team_member_id: string
        }
        Update: {
          assigned_at?: string
          fund_id?: string
          fund_role?: string | null
          id?: string
          team_member_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fund_team_members_fund_id_fkey"
            columns: ["fund_id"]
            isOneToOne: false
            referencedRelation: "funds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fund_team_members_team_member_id_fkey"
            columns: ["team_member_id"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
        ]
      }
      funds: {
        Row: {
          accepts_us_persons_source_url: string | null
          accepts_us_persons_status: string | null
          algo_rank: number | null
          auditor: string | null
          aum: number | null
          aum_as_of_date: string | null
          category: string | null
          cmvm_id: string | null
          created_at: string | null
          currency: string | null
          custodian: string | null
          description: string | null
          detailed_description: string | null
          eligibility_basis: Json | null
          expected_return_max: number | null
          expected_return_min: number | null
          facebook_url: string | null
          faqs: Json | null
          fatca_source_url: string | null
          fatca_stated: boolean | null
          final_rank: number | null
          geographic_allocation: Json | null
          gv_eligible: boolean | null
          historical_performance: Json | null
          hurdle_rate: number | null
          id: string
          inception_date: string | null
          instagram_url: string | null
          is_quiz_eligible: boolean | null
          is_verified: boolean | null
          isin: string | null
          last_data_review_date: string | null
          last_modified_by: string | null
          linkedin_url: string | null
          location: string | null
          lock_up_period_months: number | null
          management_fee: number | null
          manager_name: string | null
          manual_rank: number | null
          minimum_investment: number | null
          name: string
          nav_frequency: string | null
          news_rss_feed_url: string | null
          pdf_documents: Json | null
          performance_fee: number | null
          pfic_status: string | null
          realised_exits: number | null
          redemption_fee: number | null
          redemption_terms: Json | null
          regulated_by: string | null
          risk_band: string | null
          risk_level: string | null
          status: string | null
          subscription_fee: number | null
          tags: string[] | null
          team_members: Json | null
          tiktok_url: string | null
          total_distributions: number | null
          twitter_url: string | null
          typical_ticket: number | null
          updated_at: string | null
          us_compliant: boolean | null
          verified_at: string | null
          verified_by: string | null
          version: number | null
          website: string | null
          youtube_url: string | null
          youtube_video_url: string | null
        }
        Insert: {
          accepts_us_persons_source_url?: string | null
          accepts_us_persons_status?: string | null
          algo_rank?: number | null
          auditor?: string | null
          aum?: number | null
          aum_as_of_date?: string | null
          category?: string | null
          cmvm_id?: string | null
          created_at?: string | null
          currency?: string | null
          custodian?: string | null
          description?: string | null
          detailed_description?: string | null
          eligibility_basis?: Json | null
          expected_return_max?: number | null
          expected_return_min?: number | null
          facebook_url?: string | null
          faqs?: Json | null
          fatca_source_url?: string | null
          fatca_stated?: boolean | null
          final_rank?: number | null
          geographic_allocation?: Json | null
          gv_eligible?: boolean | null
          historical_performance?: Json | null
          hurdle_rate?: number | null
          id: string
          inception_date?: string | null
          instagram_url?: string | null
          is_quiz_eligible?: boolean | null
          is_verified?: boolean | null
          isin?: string | null
          last_data_review_date?: string | null
          last_modified_by?: string | null
          linkedin_url?: string | null
          location?: string | null
          lock_up_period_months?: number | null
          management_fee?: number | null
          manager_name?: string | null
          manual_rank?: number | null
          minimum_investment?: number | null
          name: string
          nav_frequency?: string | null
          news_rss_feed_url?: string | null
          pdf_documents?: Json | null
          performance_fee?: number | null
          pfic_status?: string | null
          realised_exits?: number | null
          redemption_fee?: number | null
          redemption_terms?: Json | null
          regulated_by?: string | null
          risk_band?: string | null
          risk_level?: string | null
          status?: string | null
          subscription_fee?: number | null
          tags?: string[] | null
          team_members?: Json | null
          tiktok_url?: string | null
          total_distributions?: number | null
          twitter_url?: string | null
          typical_ticket?: number | null
          updated_at?: string | null
          us_compliant?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          version?: number | null
          website?: string | null
          youtube_url?: string | null
          youtube_video_url?: string | null
        }
        Update: {
          accepts_us_persons_source_url?: string | null
          accepts_us_persons_status?: string | null
          algo_rank?: number | null
          auditor?: string | null
          aum?: number | null
          aum_as_of_date?: string | null
          category?: string | null
          cmvm_id?: string | null
          created_at?: string | null
          currency?: string | null
          custodian?: string | null
          description?: string | null
          detailed_description?: string | null
          eligibility_basis?: Json | null
          expected_return_max?: number | null
          expected_return_min?: number | null
          facebook_url?: string | null
          faqs?: Json | null
          fatca_source_url?: string | null
          fatca_stated?: boolean | null
          final_rank?: number | null
          geographic_allocation?: Json | null
          gv_eligible?: boolean | null
          historical_performance?: Json | null
          hurdle_rate?: number | null
          id?: string
          inception_date?: string | null
          instagram_url?: string | null
          is_quiz_eligible?: boolean | null
          is_verified?: boolean | null
          isin?: string | null
          last_data_review_date?: string | null
          last_modified_by?: string | null
          linkedin_url?: string | null
          location?: string | null
          lock_up_period_months?: number | null
          management_fee?: number | null
          manager_name?: string | null
          manual_rank?: number | null
          minimum_investment?: number | null
          name?: string
          nav_frequency?: string | null
          news_rss_feed_url?: string | null
          pdf_documents?: Json | null
          performance_fee?: number | null
          pfic_status?: string | null
          realised_exits?: number | null
          redemption_fee?: number | null
          redemption_terms?: Json | null
          regulated_by?: string | null
          risk_band?: string | null
          risk_level?: string | null
          status?: string | null
          subscription_fee?: number | null
          tags?: string[] | null
          team_members?: Json | null
          tiktok_url?: string | null
          total_distributions?: number | null
          twitter_url?: string | null
          typical_ticket?: number | null
          updated_at?: string | null
          us_compliant?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          version?: number | null
          website?: string | null
          youtube_url?: string | null
          youtube_video_url?: string | null
        }
        Relationships: []
      }
      manager_profile_assignments: {
        Row: {
          assigned_at: string | null
          assigned_by: string | null
          created_at: string | null
          id: string
          notes: string | null
          permissions: Json | null
          profile_id: string
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          permissions?: Json | null
          profile_id: string
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          assigned_at?: string | null
          assigned_by?: string | null
          created_at?: string | null
          id?: string
          notes?: string | null
          permissions?: Json | null
          profile_id?: string
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manager_profile_assignments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manager_profile_assignments_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      manager_profile_edits: {
        Row: {
          changes: Json
          created_at: string | null
          edit_type: string
          id: string
          manager_user_id: string
          previous_values: Json
          profile_id: string
        }
        Insert: {
          changes: Json
          created_at?: string | null
          edit_type: string
          id?: string
          manager_user_id: string
          previous_values: Json
          profile_id: string
        }
        Update: {
          changes?: Json
          created_at?: string | null
          edit_type?: string
          id?: string
          manager_user_id?: string
          previous_values?: Json
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "manager_profile_edits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "manager_profile_edits_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      page_errors: {
        Row: {
          created_at: string | null
          error_message: string | null
          error_type: string
          id: string
          page_path: string
          referrer: string | null
          session_id: string | null
          timestamp: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          error_type: string
          id?: string
          page_path: string
          referrer?: string | null
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          error_type?: string
          id?: string
          page_path?: string
          referrer?: string | null
          session_id?: string | null
          timestamp?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      page_performance_metrics: {
        Row: {
          cls: number | null
          created_at: string | null
          fcp: number | null
          fid: number | null
          id: string
          lcp: number | null
          page_path: string
          page_type: string
          session_id: string | null
          timestamp: string
          total_load_time: number | null
          ttfb: number | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          cls?: number | null
          created_at?: string | null
          fcp?: number | null
          fid?: number | null
          id?: string
          lcp?: number | null
          page_path: string
          page_type: string
          session_id?: string | null
          timestamp?: string
          total_load_time?: number | null
          ttfb?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          cls?: number | null
          created_at?: string | null
          fcp?: number | null
          fid?: number | null
          id?: string
          lcp?: number | null
          page_path?: string
          page_type?: string
          session_id?: string | null
          timestamp?: string
          total_load_time?: number | null
          ttfb?: number | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address: string | null
          annual_income_range: string | null
          assets_under_management: number | null
          avatar_url: string | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string
          date_of_birth: string | null
          description: string | null
          email: string
          entity_type: string | null
          facebook_url: string | null
          first_name: string | null
          founded_year: number | null
          id: string
          instagram_url: string | null
          investment_experience: string | null
          last_name: string | null
          license_number: string | null
          linkedin_url: string | null
          logo_url: string | null
          manager_about: string | null
          manager_faqs: Json | null
          manager_highlights: Json | null
          manager_name: string | null
          net_worth_range: string | null
          phone: string | null
          registration_number: string | null
          risk_tolerance: string | null
          team_members: Json | null
          tiktok_url: string | null
          twitter_url: string | null
          updated_at: string
          user_id: string
          website: string | null
          youtube_url: string | null
        }
        Insert: {
          address?: string | null
          annual_income_range?: string | null
          assets_under_management?: number | null
          avatar_url?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          description?: string | null
          email: string
          entity_type?: string | null
          facebook_url?: string | null
          first_name?: string | null
          founded_year?: number | null
          id?: string
          instagram_url?: string | null
          investment_experience?: string | null
          last_name?: string | null
          license_number?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          manager_about?: string | null
          manager_faqs?: Json | null
          manager_highlights?: Json | null
          manager_name?: string | null
          net_worth_range?: string | null
          phone?: string | null
          registration_number?: string | null
          risk_tolerance?: string | null
          team_members?: Json | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id: string
          website?: string | null
          youtube_url?: string | null
        }
        Update: {
          address?: string | null
          annual_income_range?: string | null
          assets_under_management?: number | null
          avatar_url?: string | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string
          date_of_birth?: string | null
          description?: string | null
          email?: string
          entity_type?: string | null
          facebook_url?: string | null
          first_name?: string | null
          founded_year?: number | null
          id?: string
          instagram_url?: string | null
          investment_experience?: string | null
          last_name?: string | null
          license_number?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          manager_about?: string | null
          manager_faqs?: Json | null
          manager_highlights?: Json | null
          manager_name?: string | null
          net_worth_range?: string | null
          phone?: string | null
          registration_number?: string | null
          risk_tolerance?: string | null
          team_members?: Json | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string
          user_id?: string
          website?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
      quiz_analytics: {
        Row: {
          abandoned_at_step: number | null
          answers: Json | null
          created_at: string | null
          event_type: string
          id: string
          referrer: string | null
          results_count: number | null
          session_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          abandoned_at_step?: number | null
          answers?: Json | null
          created_at?: string | null
          event_type: string
          id?: string
          referrer?: string | null
          results_count?: number | null
          session_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          abandoned_at_step?: number | null
          answers?: Json | null
          created_at?: string | null
          event_type?: string
          id?: string
          referrer?: string | null
          results_count?: number | null
          session_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      saved_funds: {
        Row: {
          created_at: string
          fund_id: string
          id: string
          saved_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          fund_id: string
          id?: string
          saved_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          fund_id?: string
          id?: string
          saved_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_audit_access_log: {
        Row: {
          access_type: string
          accessed_at: string | null
          id: string
          ip_address: unknown
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          access_type: string
          accessed_at?: string | null
          id?: string
          ip_address?: unknown
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          access_type?: string
          accessed_at?: string | null
          id?: string
          ip_address?: unknown
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
      team_invitations: {
        Row: {
          accepted_at: string | null
          created_at: string
          email: string
          expires_at: string
          id: string
          invitation_token: string
          inviter_user_id: string | null
          personal_message: string | null
          profile_id: string
          status: string
          used_by_user_id: string | null
        }
        Insert: {
          accepted_at?: string | null
          created_at?: string
          email: string
          expires_at?: string
          id?: string
          invitation_token?: string
          inviter_user_id?: string | null
          personal_message?: string | null
          profile_id: string
          status?: string
          used_by_user_id?: string | null
        }
        Update: {
          accepted_at?: string | null
          created_at?: string
          email?: string
          expires_at?: string
          id?: string
          invitation_token?: string
          inviter_user_id?: string | null
          personal_message?: string | null
          profile_id?: string
          status?: string
          used_by_user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "team_invitations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invitations_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          email: string | null
          id: string
          linkedin_url: string | null
          name: string
          photo_url: string | null
          profile_id: string
          role: string
          slug: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          linkedin_url?: string | null
          name: string
          photo_url?: string | null
          profile_id: string
          role: string
          slug: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          email?: string | null
          id?: string
          linkedin_url?: string | null
          name?: string
          photo_url?: string | null
          profile_id?: string
          role?: string
          slug?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_company_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_company_profiles: {
        Row: {
          assets_under_management: number | null
          city: string | null
          company_name: string | null
          country: string | null
          created_at: string | null
          description: string | null
          entity_type: string | null
          facebook_url: string | null
          founded_year: number | null
          id: string | null
          instagram_url: string | null
          license_number: string | null
          linkedin_url: string | null
          logo_url: string | null
          manager_about: string | null
          manager_faqs: Json | null
          manager_highlights: Json | null
          manager_name: string | null
          registration_number: string | null
          team_members: Json | null
          tiktok_url: string | null
          twitter_url: string | null
          updated_at: string | null
          user_id: string | null
          website: string | null
          youtube_url: string | null
        }
        Insert: {
          assets_under_management?: number | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          entity_type?: string | null
          facebook_url?: string | null
          founded_year?: number | null
          id?: string | null
          instagram_url?: string | null
          license_number?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          manager_about?: string | null
          manager_faqs?: Json | null
          manager_highlights?: Json | null
          manager_name?: string | null
          registration_number?: string | null
          team_members?: Json | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          youtube_url?: string | null
        }
        Update: {
          assets_under_management?: number | null
          city?: string | null
          company_name?: string | null
          country?: string | null
          created_at?: string | null
          description?: string | null
          entity_type?: string | null
          facebook_url?: string | null
          founded_year?: number | null
          id?: string | null
          instagram_url?: string | null
          license_number?: string | null
          linkedin_url?: string | null
          logo_url?: string | null
          manager_about?: string | null
          manager_faqs?: Json | null
          manager_highlights?: Json | null
          manager_name?: string | null
          registration_number?: string | null
          team_members?: Json | null
          tiktok_url?: string | null
          twitter_url?: string | null
          updated_at?: string | null
          user_id?: string | null
          website?: string | null
          youtube_url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      admin_assign_fund_managers: {
        Args: {
          _fund_id: string
          _manager_ids: string[]
          _notes?: string
          _permissions?: Json
          _status?: string
        }
        Returns: {
          inserted: boolean
          user_id: string
        }[]
      }
      admin_assign_profile_managers: {
        Args: {
          _manager_ids: string[]
          _notes?: string
          _permissions?: Json
          _profile_id: string
          _status?: string
        }
        Returns: {
          inserted: boolean
          user_id: string
        }[]
      }
      admin_list_profiles: {
        Args: never
        Returns: {
          company_name: string
          email: string
          first_name: string
          last_name: string
          manager_name: string
          user_id: string
        }[]
      }
      are_teammates: {
        Args: { user_id_1: string; user_id_2: string }
        Returns: boolean
      }
      assign_company_team_member: {
        Args: {
          _manager_id: string
          _notes?: string
          _permissions?: Json
          _profile_id: string
          _status?: string
        }
        Returns: {
          inserted: boolean
          user_id: string
        }[]
      }
      can_access_manager_sensitive_data: {
        Args: { manager_user_id?: string }
        Returns: boolean
      }
      can_user_edit_fund: {
        Args: { p_fund_id: string; p_user_id: string }
        Returns: boolean
      }
      can_user_edit_profile: {
        Args: { p_profile_id: string; p_user_id: string }
        Returns: boolean
      }
      can_user_manage_company_funds: {
        Args: { check_manager_name: string; check_user_id: string }
        Returns: boolean
      }
      can_user_view_profile: {
        Args: { _profile_id: string; _user_id: string }
        Returns: boolean
      }
      can_view_profile_assignments: {
        Args: { _profile: string; _user: string }
        Returns: boolean
      }
      check_sensitive_data_exposure: {
        Args: never
        Returns: {
          has_sensitive_columns: boolean
          sensitive_columns: string[]
          view_name: string
        }[]
      }
      cleanup_old_performance_data: { Args: never; Returns: undefined }
      copy_funds_to_develop: {
        Args: never
        Returns: {
          details: string
          operation: string
          record_count: number
          status: string
        }[]
      }
      find_user_by_email: { Args: { user_email: string }; Returns: string }
      get_admin_data_access_level: { Args: never; Returns: string }
      get_basic_manager_info: {
        Args: never
        Returns: {
          city: string
          company_name: string
          country: string
          description: string
          manager_name: string
          website: string
        }[]
      }
      get_database_schema_info: {
        Args: never
        Returns: {
          column_default: string
          column_name: string
          data_type: string
          is_nullable: string
          table_name: string
        }[]
      }
      get_email_campaign_stats: {
        Args: { days?: number }
        Returns: {
          avg_clicks_per_email: number
          click_rate: number
          email_type: string
          open_rate: number
          total_clicked: number
          total_opened: number
          total_sent: number
        }[]
      }
      get_fund_manager_sign_ins: {
        Args: never
        Returns: {
          company_name: string
          fund_id: string
          fund_name: string
          last_email_sent_at: string
          last_sign_in_at: string
          manager_email: string
          manager_name: string
          recent_impressions: number
          recent_leads: number
          team_members_count: number
          total_impressions: number
          total_leads: number
        }[]
      }
      get_funds_by_company_name: {
        Args: { company_name_param: string }
        Returns: {
          id: string
          name: string
        }[]
      }
      get_public_manager_profiles: {
        Args: never
        Returns: {
          assets_under_management: number
          city: string
          company_name: string
          country: string
          created_at: string
          description: string
          founded_year: number
          id: string
          license_number: string
          logo_url: string
          manager_about: string
          manager_faqs: Json
          manager_highlights: Json
          manager_name: string
          registration_number: string
          team_members: Json
          updated_at: string
          user_id: string
          website: string
        }[]
      }
      get_super_admin_emails: {
        Args: never
        Returns: {
          admin_name: string
          email: string
        }[]
      }
      get_team_members_by_company_name: {
        Args: { company_name_input: string }
        Returns: {
          bio: string
          email: string
          id: string
          linkedin_url: string
          name: string
          photo_url: string
          role: string
          slug: string
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
      is_user_admin: { Args: { check_user_id?: string }; Returns: boolean }
      log_admin_activity:
        | {
            Args: {
              p_action_type: string
              p_details?: Json
              p_target_id?: string
              p_target_type: string
            }
            Returns: undefined
          }
        | {
            Args: {
              p_action_type: string
              p_admin_user_id?: string
              p_details?: Json
              p_target_id?: string
              p_target_type: string
            }
            Returns: undefined
          }
      log_sensitive_data_access: {
        Args: {
          access_type: string
          accessed_user_id: string
          requested_fields?: string[]
        }
        Returns: boolean
      }
      mark_expired_invitations: { Args: never; Returns: undefined }
      migrate_fund_team_members: {
        Args: never
        Returns: {
          members_created: number
          members_linked: number
          members_migrated: number
          result_fund_id: string
        }[]
      }
      migrate_team_members_from_jsonb: {
        Args: never
        Returns: {
          company_name: string
          funds_linked: number
          members_migrated: number
          profile_id: string
        }[]
      }
      normalize_slug: { Args: { input_text: string }; Returns: string }
      normalize_slug_fixed: { Args: { input_text: string }; Returns: string }
      query: {
        Args: { query_text: string }
        Returns: {
          result: string
        }[]
      }
      request_sensitive_data_access: {
        Args: {
          justification: string
          requested_fields: string[]
          target_user_id: string
        }
        Returns: string
      }
      sync_database_functions_to_develop: {
        Args: never
        Returns: {
          function_definition: string
          function_name: string
          status: string
        }[]
      }
      unaccent: { Args: { "": string }; Returns: string }
      validate_historical_performance: {
        Args: { performance_data: Json }
        Returns: boolean
      }
    }
    Enums: {
      admin_role: "super_admin" | "moderator" | "admin"
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
      suggestion_status: ["pending", "approved", "rejected"],
    },
  },
} as const
