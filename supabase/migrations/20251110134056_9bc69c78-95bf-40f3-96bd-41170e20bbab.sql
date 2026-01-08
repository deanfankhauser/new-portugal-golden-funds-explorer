-- Create function to notify fund managers when they are assigned
CREATE OR REPLACE FUNCTION public.notify_fund_manager_assignment()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_fund_name text;
  v_manager_email text;
  v_manager_name text;
  v_supabase_url text;
BEGIN
  -- Only send notification for new active assignments
  IF NEW.status != 'active' THEN
    RETURN NEW;
  END IF;

  -- Get fund details
  SELECT name INTO v_fund_name
  FROM public.funds
  WHERE id = NEW.fund_id;

  -- Get manager email and name from profiles
  SELECT 
    email,
    COALESCE(
      NULLIF(TRIM(manager_name), ''),
      NULLIF(TRIM(first_name || ' ' || last_name), ''),
      split_part(email, '@', 1)
    )
  INTO v_manager_email, v_manager_name
  FROM public.profiles
  WHERE user_id = NEW.user_id;

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
      url := v_supabase_url || '/functions/v1/notify-fund-assignment',
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'fund_id', NEW.fund_id,
        'fund_name', v_fund_name,
        'manager_email', v_manager_email,
        'manager_name', v_manager_name,
        'permissions', NEW.permissions,
        'notes', NEW.notes,
        'assigned_at', NEW.assigned_at
      )
    );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the assignment
    RAISE WARNING 'Failed to send fund assignment notification: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Create trigger to execute notification function after INSERT on fund_managers
DROP TRIGGER IF EXISTS on_fund_manager_assigned ON public.fund_managers;

CREATE TRIGGER on_fund_manager_assigned
  AFTER INSERT ON public.fund_managers
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_fund_manager_assignment();