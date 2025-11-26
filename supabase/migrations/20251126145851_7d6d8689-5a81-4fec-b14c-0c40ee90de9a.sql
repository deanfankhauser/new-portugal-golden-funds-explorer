-- Add status column to funds table for fund lifecycle tracking
ALTER TABLE funds ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'Open'
  CHECK (status IN ('Open', 'Soft-closed', 'Closed', 'Liquidated', 'Closing Soon'));

-- Add entity_type column to profiles table for regulatory classification
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS entity_type TEXT DEFAULT 'SCR'
  CHECK (entity_type IN ('SCR', 'SGOIC', 'Gestora', 'Other'));

-- Add comment for documentation
COMMENT ON COLUMN funds.status IS 'Fund lifecycle status: Open (accepting investments), Soft-closed (limited availability), Closed (no new investors), Liquidated (wound up), Closing Soon (about to close)';
COMMENT ON COLUMN profiles.entity_type IS 'Portuguese regulatory entity type: SCR (Sociedade de Capital de Risco), SGOIC (Sociedade Gestora de Organismos de Investimento Coletivo), Gestora (General Manager), Other';