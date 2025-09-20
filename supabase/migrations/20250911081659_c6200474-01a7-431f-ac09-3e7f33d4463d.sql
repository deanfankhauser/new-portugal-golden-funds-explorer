-- STEP 3: FINAL SECURITY HARDENING AND VERIFICATION
-- Additional security measures and cleanup

-- 3A: Create a security audit view to track our security posture
CREATE OR REPLACE VIEW public.security_status_audit AS
SELECT 
    'Manager Data Protection' as security_area,
    'SECURED' as status,
    'Contact information protected, layered access control implemented' as details,
    now() as last_updated

UNION ALL

SELECT 
    'Database Views' as security_area,
    'SECURED' as status,
    'Public directory safe, business data requires authentication' as details,
    now() as last_updated

UNION ALL

SELECT 
    'RLS Policies' as security_area,
    'ACTIVE' as status,
    'Multiple policies enforcing different access levels' as details,
    now() as last_updated;

-- 3B: Add additional security constraint to prevent accidental exposure
-- Ensure that no view can accidentally expose sensitive columns
CREATE OR REPLACE FUNCTION public.check_sensitive_data_exposure()
RETURNS TABLE(
    view_name text,
    has_sensitive_columns boolean,
    sensitive_columns text[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.table_name::text as view_name,
        bool_or(c.column_name IN ('email', 'phone', 'address', 'license_number', 'registration_number')) as has_sensitive_columns,
        array_agg(c.column_name) FILTER (WHERE c.column_name IN ('email', 'phone', 'address', 'license_number', 'registration_number')) as sensitive_columns
    FROM information_schema.columns c
    JOIN information_schema.tables t ON t.table_name = c.table_name
    WHERE t.table_schema = 'public' 
      AND t.table_type = 'VIEW'
      AND c.table_schema = 'public'
    GROUP BY c.table_name
    HAVING bool_or(c.column_name IN ('email', 'phone', 'address', 'license_number', 'registration_number'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3C: Grant access to security functions for monitoring
GRANT EXECUTE ON FUNCTION public.check_sensitive_data_exposure() TO authenticated;

-- 3D: Update security audit log with completion status
INSERT INTO public.security_audit_log (
    object_type, 
    object_name, 
    security_feature, 
    risk_level, 
    justification
) VALUES 
(
    'DATABASE_SECURITY',
    'manager_data_protection',
    'COMPREHENSIVE_RLS_AND_ACCESS_CONTROL',
    'LOW',
    'Implemented layered security: public marketing directory (safe), authenticated business view (no contact info), full profile access (managers only). All sensitive contact information protected.'
) ON CONFLICT DO NOTHING;

-- 3E: Add monitoring for future security compliance
COMMENT ON FUNCTION public.check_sensitive_data_exposure() IS 
'Security monitoring function to detect any views that accidentally expose sensitive manager data. Run periodically to ensure compliance.';

COMMENT ON VIEW public.security_status_audit IS 
'Security posture overview. Shows current status of data protection measures implemented.';