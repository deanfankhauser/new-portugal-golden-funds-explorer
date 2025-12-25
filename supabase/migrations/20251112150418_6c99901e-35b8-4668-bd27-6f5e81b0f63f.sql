-- Create trigger function for lead status change notifications
CREATE OR REPLACE FUNCTION public.notify_lead_status_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  v_fund_name text;
  v_manager_name text;
  v_supabase_url text;
BEGIN
  -- Only proceed if status has actually changed
  IF OLD.status = NEW.status THEN
    RETURN NEW;
  END IF;

  -- Get fund name
  SELECT name INTO v_fund_name
  FROM public.funds
  WHERE id = NEW.fund_id;

  -- Get manager name who made the change
  SELECT 
    COALESCE(
      NULLIF(TRIM(manager_name), ''),
      NULLIF(TRIM(first_name || ' ' || last_name), ''),
      split_part(email, '@', 1)
    )
  INTO v_manager_name
  FROM public.profiles
  WHERE user_id = auth.uid();

  -- Set Supabase URL
  v_supabase_url := 'https://bkmvydnfhmkjnuszroim.supabase.co';

  -- Call edge function asynchronously using pg_net extension
  PERFORM
    net.http_post(
      url := v_supabase_url || '/functions/v1/notify-lead-status-change',
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'enquiryId', NEW.id::text,
        'oldStatus', OLD.status,
        'newStatus', NEW.status,
        'fundId', NEW.fund_id,
        'fundName', COALESCE(v_fund_name, 'Unknown Fund'),
        'changedBy', COALESCE(v_manager_name, 'Unknown Manager'),
        'changedAt', NEW.updated_at::text,
        'leadName', NEW.first_name || ' ' || NEW.last_name,
        'leadEmail', NEW.email,
        'leadPhone', NEW.phone,
        'investmentRange', NEW.investment_amount_range
      )
    );

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't fail the status update
    RAISE WARNING 'Failed to send lead status change notification: %', SQLERRM;
    RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_lead_status_change ON public.fund_enquiries;

-- Create trigger on fund_enquiries
CREATE TRIGGER on_lead_status_change
  AFTER UPDATE ON public.fund_enquiries
  FOR EACH ROW
  EXECUTE FUNCTION notify_lead_status_change();