-- Add missing regulatory and additional fields to funds table
ALTER TABLE public.funds 
ADD COLUMN IF NOT EXISTS subscription_fee numeric,
ADD COLUMN IF NOT EXISTS redemption_fee numeric,
ADD COLUMN IF NOT EXISTS regulated_by text,
ADD COLUMN IF NOT EXISTS location text,
ADD COLUMN IF NOT EXISTS cmvm_id text,
ADD COLUMN IF NOT EXISTS auditor text,
ADD COLUMN IF NOT EXISTS custodian text,
ADD COLUMN IF NOT EXISTS nav_frequency text,
ADD COLUMN IF NOT EXISTS pfic_status text,
ADD COLUMN IF NOT EXISTS eligibility_basis jsonb,
ADD COLUMN IF NOT EXISTS redemption_terms jsonb;