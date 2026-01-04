-- Add missing risk_band column to funds table
ALTER TABLE funds ADD COLUMN IF NOT EXISTS risk_band TEXT;

-- Add index for risk_band for filtering performance
CREATE INDEX IF NOT EXISTS idx_funds_risk_band ON funds(risk_band);

-- Add comment explaining valid values
COMMENT ON COLUMN funds.risk_band IS 'Three-tier risk classification: Conservative, Balanced, or Aggressive';