-- Fix Security Definer View warnings by setting security_invoker = true
-- This makes views use the querying user's permissions instead of the view creator's

-- Update managers_public_view to use security_invoker
ALTER VIEW public.managers_public_view SET (security_invoker = true);

-- Update public_managers to use security_invoker  
ALTER VIEW public.public_managers SET (security_invoker = true);

-- Verify the changes
COMMENT ON VIEW public.managers_public_view IS 
'Public view of approved manager profiles. Uses security_invoker=true to enforce RLS policies based on the querying user, not the view creator.';

COMMENT ON VIEW public.public_managers IS 
'Public view of approved manager basic information. Uses security_invoker=true to enforce RLS policies based on the querying user, not the view creator.';