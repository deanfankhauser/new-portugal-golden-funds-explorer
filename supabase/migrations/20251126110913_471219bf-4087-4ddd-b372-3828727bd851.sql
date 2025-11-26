-- Add quiz eligibility flag (controls which funds appear in quiz)
ALTER TABLE funds ADD COLUMN IF NOT EXISTS is_quiz_eligible BOOLEAN DEFAULT false;

-- Add US compliance flag (for US citizen filtering)
ALTER TABLE funds ADD COLUMN IF NOT EXISTS us_compliant BOOLEAN DEFAULT false;

-- Add comments for documentation
COMMENT ON COLUMN funds.is_quiz_eligible IS 'Controls whether this fund appears in the Fund Matcher Quiz';
COMMENT ON COLUMN funds.us_compliant IS 'Indicates if fund is compliant for US citizens/residents (PFIC/QEF status)';