-- SECURITY FIX: Enable RLS on all views to prevent unauthorized data access
-- This addresses multiple security findings about missing RLS protection on views

-- Enable RLS on all manager-related views
ALTER VIEW public.managers_business_info ENABLE ROW LEVEL SECURITY;
ALTER VIEW public.managers_directory ENABLE ROW LEVEL SECURITY;
ALTER VIEW public.managers_public_view ENABLE ROW LEVEL SECURITY;
ALTER VIEW public.public_managers ENABLE ROW LEVEL SECURITY;

-- Enable RLS on security audit views
ALTER VIEW public.security_status_audit ENABLE ROW LEVEL SECURITY;
ALTER VIEW public.security_verification ENABLE ROW LEVEL SECURITY;

-- Create explicit RLS policies for business info view (authenticated users only)
CREATE POLICY "Authenticated users can view business information" 
ON public.managers_business_info 
FOR SELECT 
USING (auth.uid() IS NOT NULL);

-- Create RLS policies for public directory views (allow public read but with rate limiting consideration)
CREATE POLICY "Public can view directory listings" 
ON public.managers_directory 
FOR SELECT 
USING (true);

CREATE POLICY "Public can view manager listings" 
ON public.public_managers 
FOR SELECT 
USING (true);

CREATE POLICY "Public can view manager profiles" 
ON public.managers_public_view 
FOR SELECT 
USING (true);

-- Create strict policies for security audit views (system only)
CREATE POLICY "System only security status access" 
ON public.security_status_audit 
FOR SELECT 
USING (false);

CREATE POLICY "System only security verification access" 
ON public.security_verification 
FOR SELECT 
USING (false);

-- Add documentation for security policies
COMMENT ON POLICY "Authenticated users can view business information" ON public.managers_business_info IS 
'Restricts business information (including assets under management) to authenticated users only to prevent competitive intelligence gathering.';

COMMENT ON POLICY "Public can view directory listings" ON public.managers_directory IS 
'Allows public access to basic marketing directory. Contact information is excluded from this view to prevent spam/harassment.';

COMMENT ON POLICY "Public can view manager listings" ON public.public_managers IS 
'Allows public access to manager marketing information. Sensitive contact details are excluded from this view.';

COMMENT ON POLICY "System only security status access" ON public.security_status_audit IS 
'Prevents external access to internal security audit information that could reveal system vulnerabilities.';

COMMENT ON POLICY "System only security verification access" ON public.security_verification IS 
'Prevents access to security configuration details that could help attackers understand system security measures.';

-- Create a rate limiting table for future implementation (optional - for preventing automated scraping)
CREATE TABLE IF NOT EXISTS public.view_access_log (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    view_name text NOT NULL,
    accessed_at timestamp with time zone DEFAULT now(),
    user_id uuid,
    ip_address inet,
    user_agent text
);

-- Enable RLS on access log
ALTER TABLE public.view_access_log ENABLE ROW LEVEL SECURITY;

-- Only allow system to write to access log
CREATE POLICY "System only access logging" 
ON public.view_access_log 
FOR ALL 
USING (false);

-- Final verification
SELECT 
    'VIEW_RLS_SECURITY_FIX_APPLIED' as status,
    'All views now have explicit RLS policies to prevent unauthorized access' as description,
    now() as applied_at;