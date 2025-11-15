-- Drop the overly permissive policy that allows any authenticated user
DROP POLICY IF EXISTS "Authenticated users can create suggestions" ON public.fund_edit_suggestions;

-- Create restrictive policy: Only fund managers and admins can create suggestions
CREATE POLICY "Managers and admins can create suggestions"
ON public.fund_edit_suggestions 
FOR INSERT
WITH CHECK (
  (auth.uid() = user_id) 
  AND can_user_edit_fund(auth.uid(), fund_id)
);