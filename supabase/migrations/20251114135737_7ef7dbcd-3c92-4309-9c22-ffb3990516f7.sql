-- Update log_admin_activity to accept admin_user_id as parameter
CREATE OR REPLACE FUNCTION public.log_admin_activity(
  p_action_type text, 
  p_target_type text, 
  p_target_id text DEFAULT NULL::text, 
  p_details jsonb DEFAULT NULL::jsonb,
  p_admin_user_id uuid DEFAULT NULL::uuid
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO public.admin_activity_log (
    admin_user_id,
    action_type,
    target_type,
    target_id,
    details
  ) VALUES (
    COALESCE(p_admin_user_id, auth.uid()),
    p_action_type,
    p_target_type,
    p_target_id,
    p_details
  );
END;
$function$;