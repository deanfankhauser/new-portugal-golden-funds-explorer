-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Create improved function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  v_invitation_token TEXT;
  v_invitation RECORD;
BEGIN
  -- Validate user data
  IF NEW.id IS NULL OR NEW.email IS NULL THEN
    RAISE EXCEPTION 'Invalid user data in authentication trigger';
  END IF;
  
  IF NOT NEW.email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$' THEN
    RAISE EXCEPTION 'Invalid email format in user metadata';
  END IF;
  
  -- Create unified profile for all users
  IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE user_id = NEW.id) THEN
    INSERT INTO public.profiles (
      user_id,
      email,
      first_name,
      last_name
    ) VALUES (
      NEW.id,
      NEW.email,
      COALESCE(TRIM(NEW.raw_user_meta_data ->> 'first_name'), ''),
      COALESCE(TRIM(NEW.raw_user_meta_data ->> 'last_name'), '')
    ) ON CONFLICT (email) DO NOTHING;
  END IF;
  
  -- Check if user signed up with an invitation token
  v_invitation_token := NEW.raw_user_meta_data ->> 'invitation_token';
  
  IF v_invitation_token IS NOT NULL AND v_invitation_token != '' THEN
    -- Get invitation details
    SELECT id, profile_id, email, status, expires_at
    INTO v_invitation
    FROM public.team_invitations
    WHERE invitation_token = v_invitation_token
      AND status = 'pending'
      AND expires_at > now()
      AND email = NEW.email;
    
    IF FOUND THEN
      -- Assign user to company profile automatically
      INSERT INTO public.manager_profile_assignments (
        profile_id,
        user_id,
        assigned_by,
        status,
        permissions,
        notes
      ) VALUES (
        v_invitation.profile_id,
        NEW.id,
        (SELECT inviter_user_id FROM public.team_invitations WHERE id = v_invitation.id),
        'active',
        '{"can_edit_profile": true, "can_edit_funds": true, "can_manage_team": true, "can_view_analytics": true}'::jsonb,
        'Automatically assigned via invitation on signup'
      ) ON CONFLICT (profile_id, user_id) DO NOTHING;
      
      -- Mark invitation as accepted
      UPDATE public.team_invitations
      SET 
        status = 'accepted',
        accepted_at = now(),
        used_by_user_id = NEW.id
      WHERE id = v_invitation.id;
      
      -- Log the automatic assignment
      INSERT INTO public.admin_activity_log (
        admin_user_id,
        action_type,
        target_type,
        target_id,
        details
      ) VALUES (
        NEW.id,
        'AUTOMATIC_TEAM_ASSIGNMENT',
        'team_invitation',
        v_invitation.id::text,
        jsonb_build_object(
          'invitation_token', v_invitation_token,
          'profile_id', v_invitation.profile_id,
          'auto_assigned', true
        )
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for automatic profile creation and invitation processing
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();