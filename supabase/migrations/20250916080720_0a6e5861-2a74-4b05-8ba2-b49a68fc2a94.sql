-- Create a helper function to resolve user identities for admin listing
CREATE OR REPLACE FUNCTION public.get_users_identity(p_user_ids uuid[])
RETURNS TABLE(user_id uuid, email text, display_name text)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  WITH base AS (
    SELECT u_id AS user_id
    FROM unnest(p_user_ids) AS u_id
  ),
  m AS (
    SELECT user_id, email, manager_name, company_name
    FROM public.manager_profiles
    WHERE user_id = ANY(p_user_ids)
  ),
  i AS (
    SELECT user_id, email, first_name, last_name
    FROM public.investor_profiles
    WHERE user_id = ANY(p_user_ids)
  ),
  a AS (
    SELECT id AS user_id, email
    FROM auth.users
    WHERE id = ANY(p_user_ids)
  )
  SELECT
    b.user_id,
    COALESCE(m.email, i.email, a.email) AS email,
    COALESCE(
      NULLIF(TRIM(m.manager_name || ' (' || m.company_name || ')'), '()'),
      NULLIF(TRIM(i.first_name || ' ' || i.last_name), ''),
      split_part(a.email, '@', 1)
    ) AS display_name
  FROM base b
  LEFT JOIN m ON m.user_id = b.user_id
  LEFT JOIN i ON i.user_id = b.user_id
  LEFT JOIN a ON a.user_id = b.user_id;
$$;