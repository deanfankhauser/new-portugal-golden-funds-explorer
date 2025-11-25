import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useEnhancedAuth } from '@/contexts/EnhancedAuthContext';
import { toast } from '@/hooks/use-toast';

export interface FundEditSuggestion {
  id: string;
  user_id: string;
  fund_id: string;
  suggested_changes: Record<string, any>;
  current_values: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  updated_at: string;
  approved_by?: string;
  approved_at?: string;
}

export const useFundEditing = () => {
  const { user, loading: authLoading } = useEnhancedAuth();
  const [loading, setLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const [pendingChanges, setPendingChanges] = useState<Record<string, Record<string, any>>>({});

  // Load pending changes from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('fundEditPendingChanges');
      if (stored) {
        try {
          setPendingChanges(JSON.parse(stored));
        } catch (error) {
          console.error('Error loading pending changes:', error);
        }
      }
      setIsHydrated(true);
    }
  }, []);

  // Save pending changes to localStorage
  const updatePendingChanges = useCallback((fundId: string, changes: Record<string, any>) => {
    setPendingChanges(prev => {
      const updated = { ...prev };
      if (Object.keys(changes).length === 0) {
        delete updated[fundId];
      } else {
        updated[fundId] = { ...prev[fundId], ...changes };
      }
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('fundEditPendingChanges', JSON.stringify(updated));
      }
      
      return updated;
    });
  }, []);

  // SSG compatibility - only enable after hydration
  const checkHydration = useCallback(() => {
    if (typeof window !== 'undefined' && !isHydrated) {
      setIsHydrated(true);
    }
  }, [isHydrated]);

  const submitFundEditSuggestion = useCallback(async (
    fundId: string,
    suggestedChanges: Record<string, any>,
    currentValues: Record<string, any>
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to submit suggestions');
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('fund_edit_suggestions')
        .insert({
          user_id: user.id,
          fund_id: fundId,
          suggested_changes: suggestedChanges,
          current_values: currentValues,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      // Send notification to super admins and thank you email to submitter
      try {
        console.log('Sending notification to super admins for new suggestion:', data.id);
        
        // Get submitter info from unified profiles table
        let submitterName = 'User';
        let userEmail: string | null = null;
        
        const { data: profile } = await supabase
          .from('profiles')
          .select('manager_name, company_name, first_name, last_name, email')
          .eq('user_id', user.id)
          .single();
        
        if (profile?.email) {
          userEmail = profile.email;
          
          // Determine display name based on profile type
          if (profile.manager_name && profile.company_name) {
            submitterName = `${profile.manager_name} (${profile.company_name})`;
          } else if (profile.first_name || profile.last_name) {
            submitterName = `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() || 'User';
          }
        }
        
        // Send admin notification
        const submitterType = profile?.manager_name ? 'Manager' : 'Investor';
        const notificationResult = await supabase.functions.invoke('notify-super-admins', {
          body: {
            suggestionId: data.id,
            fundId: fundId,
            submitterName: submitterName,
            submitterType: submitterType,
            changes: suggestedChanges
          }
        });
        
        if (notificationResult.error) {
          console.error('Failed to send admin notification:', notificationResult.error);
        } else {
          console.log('✅ Super admin notification sent successfully');
        }

        // Send thank you email to submitter
        if (userEmail) {
          const thankYouResult = await supabase.functions.invoke('send-notification-email', {
            body: {
              to: userEmail,
              subject: `Fund Edit Submission Received - ${fundId}`,
              fundId: fundId,
              status: 'submitted',
              managerName: submitterName
            }
          });
          
          if (thankYouResult.error) {
            console.error('Failed to send thank you email:', thankYouResult.error);
          } else {
            console.log('✅ Thank you email sent successfully');
          }
        }
      } catch (notificationError) {
        console.error('Error sending notifications:', notificationError);
        // Don't throw here - the suggestion was still created successfully
      }

      toast({
        title: "Suggestion Submitted! 🎉",
        description: "Your fund update suggestion has been submitted for review. We'll notify you once it's approved.",
      });

      // Store pending changes locally for immediate UI feedback
      updatePendingChanges(fundId, suggestedChanges);

      return data;
    } catch (error) {
      console.error('Error submitting fund edit suggestion:', error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit your suggestion. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  const getUserSuggestions = useCallback(async (fundId?: string) => {
    if (!user) return [];

    try {
      let query = supabase
        .from('fund_edit_suggestions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (fundId) {
        query = query.eq('fund_id', fundId);
      }

      const { data, error } = await query;
      if (error) throw error;

      return data as FundEditSuggestion[];
    } catch (error) {
      console.error('Error fetching user suggestions:', error);
      return [];
    }
  }, [user]);

  const checkIfUserIsAdmin = useCallback(async () => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  }, [user]);

  const clearPendingChangesForFund = useCallback((fundId: string) => {
    updatePendingChanges(fundId, {});
  }, [updatePendingChanges]);

  const clearAllPendingChanges = useCallback(() => {
    setPendingChanges({});
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fundEditPendingChanges');
    }
  }, []);

  const getAssignedFunds = useCallback(async () => {
    if (!user) return [];

    try {
      // Get all company profiles user is assigned to
      const { data: assignments, error: assignError } = await supabase
        .from('manager_profile_assignments')
        .select('profile_id')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (assignError) throw assignError;
      if (!assignments || assignments.length === 0) return [];

      // Get company names from profiles
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('company_name')
        .in('id', assignments.map(a => a.profile_id));

      if (profileError) throw profileError;
      if (!profiles || profiles.length === 0) return [];

      const companyNames = profiles.map(p => p.company_name).filter(Boolean);
      if (companyNames.length === 0) return [];

      // Get all funds for these companies
      const { data: funds, error: fundsError } = await supabase
        .from('funds')
        .select('id')
        .in('manager_name', companyNames);

      if (fundsError) throw fundsError;
      return funds?.map((f: any) => f.id) || [];
    } catch (error) {
      console.error('Error fetching assigned funds:', error);
      return [];
    }
  }, [user]);

  const canEditFund = useCallback(async (fundId: string) => {
    if (!user) {
      console.log('🔐 [canEditFund] No user authenticated');
      return false;
    }

    console.log('🔐 [canEditFund] Checking permission for user:', user.id, 'fund:', fundId);

    try {
      // 1. Check if user is admin (admin override)
      console.log('🔐 [canEditFund] Step 1: Checking admin status...');
      const { data: adminData, error: adminError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle();
      
      if (!adminError && adminData) {
        console.log('✅ [canEditFund] User is admin - access granted');
        return true;
      }
      console.log('ℹ️ [canEditFund] User is not admin, checking company permissions...');

      // 2. Get the fund's manager_name first
      console.log('🔐 [canEditFund] Step 2: Fetching fund details...');
      const { data: fundData, error: fundError } = await supabase
        .from('funds')
        .select('manager_name')
        .eq('id', fundId)
        .maybeSingle();

      if (fundError || !fundData) {
        console.error('❌ [canEditFund] Failed to fetch fund:', fundError);
        return false;
      }

      console.log('✓ [canEditFund] Fund manager_name:', fundData.manager_name);

      // 3. Check company-level permissions using manager_name
      console.log('🔐 [canEditFund] Step 3: Checking company permissions...');
      const { data: hasCompanyAccess, error: companyError } = await supabase.rpc(
        'can_user_manage_company_funds',
        {
          check_user_id: user.id,
          check_manager_name: fundData.manager_name,
        }
      );

      if (companyError) {
        console.error('❌ [canEditFund] Company permission check failed:', companyError);
        return false;
      }

      const hasAccess = !!hasCompanyAccess;
      console.log(hasAccess ? '✅ [canEditFund] Company access granted' : '❌ [canEditFund] No company access');
      
      return hasAccess;
    } catch (error) {
      console.error('❌ [canEditFund] Unexpected error:', error);
      return false;
    }
  }, [user]);

  // Explicit manager-only edit permission (no admin override)
  const canDirectEditAssigned = useCallback(async (fundId: string) => {
    if (!user) return false;
    
    try {
      // Get fund's manager_name
      const { data: fundData, error: fundError } = await supabase
        .from('funds')
        .select('manager_name')
        .eq('id', fundId)
        .maybeSingle();

      if (fundError || !fundData) {
        console.error('[canDirectEditAssigned] Failed to fetch fund:', fundError);
        return false;
      }

      // Check company-level permissions (no admin override for this check)
      const { data: hasCompanyAccess, error: companyError } = await supabase.rpc(
        'can_user_manage_company_funds',
        {
          check_user_id: user.id,
          check_manager_name: fundData.manager_name,
        }
      );

      if (companyError) {
        console.error('[canDirectEditAssigned] Permission check failed:', companyError);
        return false;
      }

      return !!hasCompanyAccess;
    } catch (error) {
      console.error('[canDirectEditAssigned] Error:', error);
      return false;
    }
  }, [user]);

  // Transform camelCase form fields to snake_case database columns
  const transformToDbFormat = useCallback((updates: Record<string, any>) => {
    const dbUpdates: Record<string, any> = {};
    
    // Direct field mappings (no transformation needed)
    if ('description' in updates) dbUpdates.description = updates.description;
    if ('category' in updates) dbUpdates.category = updates.category;
    if ('location' in updates) dbUpdates.location = updates.location;
    if ('currency' in updates) dbUpdates.currency = updates.currency;
    if ('tags' in updates) dbUpdates.tags = updates.tags;
    
    // CamelCase to snake_case conversions
    if ('detailedDescription' in updates) dbUpdates.detailed_description = updates.detailedDescription;
    if ('managerName' in updates) dbUpdates.manager_name = updates.managerName;
    if ('minimumInvestment' in updates) dbUpdates.minimum_investment = updates.minimumInvestment;
    if ('managementFee' in updates) dbUpdates.management_fee = updates.managementFee;
    if ('performanceFee' in updates) dbUpdates.performance_fee = updates.performanceFee;
    if ('subscriptionFee' in updates) dbUpdates.subscription_fee = updates.subscriptionFee;
    if ('redemptionFee' in updates) dbUpdates.redemption_fee = updates.redemptionFee;
    if ('hurdleRate' in updates) dbUpdates.hurdle_rate = updates.hurdleRate;
    if ('regulatedBy' in updates) dbUpdates.regulated_by = updates.regulatedBy;
    if ('cmvmId' in updates) dbUpdates.cmvm_id = updates.cmvmId;
    if ('auditor' in updates) dbUpdates.auditor = updates.auditor;
    if ('custodian' in updates) dbUpdates.custodian = updates.custodian;
    if ('navFrequency' in updates) dbUpdates.nav_frequency = updates.navFrequency;
    if ('pficStatus' in updates) dbUpdates.pfic_status = updates.pficStatus;
    if ('expectedReturnMin' in updates) dbUpdates.expected_return_min = updates.expectedReturnMin;
    if ('expectedReturnMax' in updates) dbUpdates.expected_return_max = updates.expectedReturnMax;
    if ('riskLevel' in updates) dbUpdates.risk_level = updates.riskLevel;
    if ('gvEligible' in updates) dbUpdates.gv_eligible = updates.gvEligible;
    if ('inceptionDate' in updates) dbUpdates.inception_date = updates.inceptionDate;
    
    // Field name changes
    if ('websiteUrl' in updates) dbUpdates.website = updates.websiteUrl;
    if ('team' in updates) dbUpdates.team_members = updates.team;
    if ('teamReferences' in updates) dbUpdates.team_members = updates.teamReferences;
    if ('documents' in updates) dbUpdates.pdf_documents = updates.documents;
    
    // Value transformations
    if ('term' in updates && updates.term !== null && updates.term !== undefined) {
      // Convert years to months
      dbUpdates.lock_up_period_months = Math.round(updates.term * 12);
    }
    
    if ('fundSize' in updates && updates.fundSize !== null && updates.fundSize !== undefined) {
      // Convert millions to actual amount
      dbUpdates.aum = updates.fundSize * 1000000;
    }
    
    if ('established' in updates && updates.established !== null && updates.established !== undefined) {
      // Convert year to inception_date (January 1st of that year)
      dbUpdates.inception_date = `${updates.established}-01-01`;
    }
    
    // JSONB fields (keep structure as-is)
    if ('geographicAllocation' in updates) dbUpdates.geographic_allocation = updates.geographicAllocation;
    if ('redemptionTerms' in updates) dbUpdates.redemption_terms = updates.redemptionTerms;
    if ('eligibilityBasis' in updates) dbUpdates.eligibility_basis = updates.eligibilityBasis;
    if ('historicalPerformance' in updates) dbUpdates.historical_performance = updates.historicalPerformance;
    if ('faqs' in updates) dbUpdates.faqs = updates.faqs;
    
    console.log('🔄 Field transformation:', {
      originalFields: Object.keys(updates),
      transformedFields: Object.keys(dbUpdates),
      updates,
      dbUpdates
    });
    
    return dbUpdates;
  }, []);

  const directUpdateFund = useCallback(async (
    fundId: string,
    updates: Record<string, any>
  ) => {
    if (!user) {
      throw new Error('User must be authenticated to update funds');
    }

    setLoading(true);
    try {
      console.log('🔐 [directUpdateFund] Starting update for fund:', fundId);
      console.log('👤 [directUpdateFund] User ID:', user.id);
      console.log('📝 [directUpdateFund] Updates to apply:', updates);
      
      // First check if user has permission
      console.log('🔍 [directUpdateFund] Checking edit permissions...');
      const canEdit = await canEditFund(fundId);
      console.log('✓ [directUpdateFund] Can edit:', canEdit);
      
      if (!canEdit) {
        throw new Error('You do not have permission to edit this fund');
      }

      // Transform to database format
      console.log('🔄 [directUpdateFund] Transforming to database format...');
      const dbUpdates = transformToDbFormat(updates);
      console.log('✓ [directUpdateFund] Transformed updates:', dbUpdates);

      // Update the fund directly
      console.log('💾 [directUpdateFund] Sending update to Supabase...');
      const { data: updateData, error: updateError } = await supabase
        .from('funds')
        .update(dbUpdates)
        .eq('id', fundId)
        .select();

      if (updateError) {
        console.error('❌ [directUpdateFund] Supabase update error:', updateError);
        throw updateError;
      }
      
      console.log('✅ [directUpdateFund] Update successful:', updateData);

      // Log the edit
      console.log('📋 [directUpdateFund] Logging edit to fund_manager_edits...');
      const { error: logError } = await supabase
        .from('fund_manager_edits' as any)
        .insert({
          fund_id: fundId,
          manager_user_id: user.id,
          changes: updates,
          previous_values: {}, // Could fetch current values first if needed
          edit_type: 'direct'
        } as any);

      if (logError) {
        console.error('⚠️ [directUpdateFund] Failed to log edit:', logError);
        // Don't throw - the update was successful
      } else {
        console.log('✓ [directUpdateFund] Edit logged successfully');
      }

      toast({
        title: "Fund Updated! ✓",
        description: "Your changes have been saved and are now live.",
      });

      // Clear any pending changes for this fund
      clearPendingChangesForFund(fundId);

      return true;
    } catch (error) {
      console.error('❌ [directUpdateFund] Error updating fund:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        error
      });
      toast({
        title: "Update Failed",
        description: error instanceof Error ? error.message : "Failed to update fund. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user, canEditFund, clearPendingChangesForFund, transformToDbFormat]);

  // Update fund team members assignments
  const updateFundTeamMembers = useCallback(async (
    fundId: string,
    teamMembers: { member_id: string; fund_role?: string }[]
  ) => {
    if (!user) {
      throw new Error('User must be authenticated');
    }

    try {
      console.log('👥 [updateFundTeamMembers] Updating team for fund:', fundId);
      console.log('Team members:', teamMembers);

      // Delete all existing assignments
      const { error: deleteError } = await supabase
        .from('fund_team_members')
        .delete()
        .eq('fund_id', fundId);

      if (deleteError) throw deleteError;

      // Insert new assignments
      if (teamMembers.length > 0) {
        const assignments = teamMembers.map(tm => ({
          fund_id: fundId,
          team_member_id: tm.member_id,
          fund_role: tm.fund_role || null,
        }));

        const { error: insertError } = await supabase
          .from('fund_team_members')
          .insert(assignments);

        if (insertError) throw insertError;
      }

      console.log('✅ [updateFundTeamMembers] Team updated successfully');
      return true;
    } catch (error) {
      console.error('❌ [updateFundTeamMembers] Error:', error);
      throw error;
    }
  }, [user]);

  return {
    user,
    loading: authLoading || loading,
    isHydrated,
    checkHydration,
    submitFundEditSuggestion,
    getUserSuggestions,
    checkIfUserIsAdmin,
    isAuthenticated: !!user,
    pendingChanges,
    updatePendingChanges,
    getPendingChangesForFund: (fundId: string) => pendingChanges[fundId] || {},
    clearPendingChangesForFund,
    clearAllPendingChanges,
    getAssignedFunds,
    canEditFund,
    canDirectEditAssigned,
    directUpdateFund,
    updateFundTeamMembers,
  };
};