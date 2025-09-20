-- Allow users to delete their own fund edit suggestions
CREATE POLICY "Users can delete own suggestions" 
ON public.fund_edit_suggestions 
FOR DELETE 
USING (auth.uid() = user_id AND status = 'pending');