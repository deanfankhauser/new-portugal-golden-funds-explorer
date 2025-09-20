-- Create enum for suggestion status
CREATE TYPE public.suggestion_status AS ENUM ('pending', 'approved', 'rejected');

-- Create enum for admin roles
CREATE TYPE public.admin_role AS ENUM ('super_admin', 'moderator');

-- Table for fund edit suggestions
CREATE TABLE public.fund_edit_suggestions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  fund_id TEXT NOT NULL,
  suggested_changes JSONB NOT NULL,
  current_values JSONB NOT NULL,
  status suggestion_status NOT NULL DEFAULT 'pending',
  rejection_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_by UUID,
  approved_at TIMESTAMP WITH TIME ZONE,
  
  -- Add constraints
  CONSTRAINT fund_edit_suggestions_user_id_not_empty CHECK (user_id IS NOT NULL),
  CONSTRAINT fund_edit_suggestions_fund_id_not_empty CHECK (fund_id != ''),
  CONSTRAINT fund_edit_suggestions_changes_not_empty CHECK (suggested_changes != '{}'::jsonb)
);

-- Enable RLS
ALTER TABLE public.fund_edit_suggestions ENABLE ROW LEVEL SECURITY;

-- Table for admin users
CREATE TABLE public.admin_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  role admin_role NOT NULL DEFAULT 'moderator',
  granted_by UUID NOT NULL,
  granted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Table for fund edit history (approved changes)
CREATE TABLE public.fund_edit_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  fund_id TEXT NOT NULL,
  suggestion_id UUID,
  changed_by UUID NOT NULL,
  admin_user_id UUID NOT NULL,
  changes JSONB NOT NULL,
  applied_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  CONSTRAINT fund_edit_history_fund_id_not_empty CHECK (fund_id != ''),
  CONSTRAINT fund_edit_history_changes_not_empty CHECK (changes != '{}'::jsonb)
);

-- Enable RLS
ALTER TABLE public.fund_edit_history ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.admin_users 
    WHERE user_id = check_user_id
  );
$$;

-- Create security definer function to get user admin role
CREATE OR REPLACE FUNCTION public.get_user_admin_role(check_user_id UUID DEFAULT auth.uid())
RETURNS admin_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role 
  FROM public.admin_users 
  WHERE user_id = check_user_id;
$$;

-- RLS Policies for fund_edit_suggestions
CREATE POLICY "Users can view own suggestions"
  ON public.fund_edit_suggestions
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all suggestions"
  ON public.fund_edit_suggestions
  FOR SELECT
  USING (public.is_user_admin());

CREATE POLICY "Authenticated users can create suggestions"
  ON public.fund_edit_suggestions
  FOR INSERT
  WITH CHECK (auth.uid() = user_id AND auth.uid() IS NOT NULL);

CREATE POLICY "Admins can update suggestions"
  ON public.fund_edit_suggestions
  FOR UPDATE
  USING (public.is_user_admin());

-- RLS Policies for admin_users
CREATE POLICY "Admins can view admin users"
  ON public.admin_users
  FOR SELECT
  USING (public.is_user_admin());

CREATE POLICY "Super admins can manage admin users"
  ON public.admin_users
  FOR ALL
  USING (public.get_user_admin_role() = 'super_admin');

-- RLS Policies for fund_edit_history
CREATE POLICY "Anyone can view fund edit history"
  ON public.fund_edit_history
  FOR SELECT
  USING (true);

CREATE POLICY "Admins can create edit history"
  ON public.fund_edit_history
  FOR INSERT
  WITH CHECK (public.is_user_admin() AND auth.uid() = admin_user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_fund_edit_suggestions_updated_at
  BEFORE UPDATE ON public.fund_edit_suggestions
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key references (after ensuring tables exist)
ALTER TABLE public.fund_edit_suggestions
  ADD CONSTRAINT fund_edit_suggestions_approved_by_fkey
  FOREIGN KEY (approved_by) REFERENCES auth.users(id) ON DELETE SET NULL;

ALTER TABLE public.admin_users
  ADD CONSTRAINT admin_users_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT admin_users_granted_by_fkey
  FOREIGN KEY (granted_by) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.fund_edit_history
  ADD CONSTRAINT fund_edit_history_suggestion_id_fkey
  FOREIGN KEY (suggestion_id) REFERENCES public.fund_edit_suggestions(id) ON DELETE SET NULL,
  ADD CONSTRAINT fund_edit_history_changed_by_fkey
  FOREIGN KEY (changed_by) REFERENCES auth.users(id) ON DELETE CASCADE,
  ADD CONSTRAINT fund_edit_history_admin_user_id_fkey
  FOREIGN KEY (admin_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create indexes for better performance
CREATE INDEX idx_fund_edit_suggestions_user_id ON public.fund_edit_suggestions(user_id);
CREATE INDEX idx_fund_edit_suggestions_fund_id ON public.fund_edit_suggestions(fund_id);
CREATE INDEX idx_fund_edit_suggestions_status ON public.fund_edit_suggestions(status);
CREATE INDEX idx_fund_edit_suggestions_created_at ON public.fund_edit_suggestions(created_at DESC);
CREATE INDEX idx_fund_edit_history_fund_id ON public.fund_edit_history(fund_id);
CREATE INDEX idx_fund_edit_history_applied_at ON public.fund_edit_history(applied_at DESC);