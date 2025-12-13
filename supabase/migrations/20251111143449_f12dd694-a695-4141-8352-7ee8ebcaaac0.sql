-- Drop old fund-level assignment trigger (no longer used)
DROP TRIGGER IF EXISTS on_fund_manager_assigned ON public.fund_managers;

-- Create trigger function for company manager assignment notifications
CREATE OR REPLACE FUNCTION public.notify_company_manager_assignment()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_company_name text;
  v_manager_email text;
  v_manager_name text;
  v_supabase_url text;
BEGIN
  -- Only send notification for new active assignments
  IF NEW.status != 'active' THEN
    RETURN NEW;
  END IF;

  -- Get company details from profiles
  SELECT 
    company_name,
    COALESCE(
      NULLIF(TRIM(manager_name), ''),
      NULLIF(TRIM(first_name || ' ' || last_name), ''),
      split_part(email, '@', 1)
    ) as display_name,
    email
  INTO v_company_name, v_manager_name, v_manager_email
  FROM public.profiles
  WHERE id = NEW.profile_id;

  -- Get assigned user's email if profile email is null
  IF v_manager_email IS NULL THEN
    SELECT email INTO v_manager_email
    FROM public.profiles
    WHERE user_id = NEW.user_id;
  END IF;

  -- Only proceed if we have an email
  IF v_manager_email IS NULL THEN
    RAISE WARNING 'No email found for user_id: %. Skipping notification.', NEW.user_id;
    RETURN NEW;
  END IF;

  -- Set Supabase URL
  v_supabase_url := 'https://bkmvydnfhmkjnuszroim.supabase.co';

  -- Call edge function asynchronously using pg_net extension
  PERFORM
    net.http_post(
      url := v_supabase_url || '/functions/v1/notify-manager-profile-assignment',
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'profile_id', NEW.profile_id::text,
        'company_name', v_company_name,
        'manager_name', v_manager_name,
        'manager_email', v_manager_email,
        'permissions', NEW.permissions,
        'notes', NEW.notes,
        'assigned_at', NEW.assigned_at
      )
    );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the assignment
    RAISE WARNING 'Failed to send company assignment notification: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger on manager_profile_assignments
DROP TRIGGER IF EXISTS on_company_manager_assigned ON public.manager_profile_assignments;

CREATE TRIGGER on_company_manager_assigned
  AFTER INSERT ON public.manager_profile_assignments
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION public.notify_company_manager_assignment();