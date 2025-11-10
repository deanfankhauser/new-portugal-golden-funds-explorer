-- Create fund_enquiries table for lead generation
CREATE TABLE fund_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fund_id TEXT NOT NULL REFERENCES funds(id) ON DELETE CASCADE,
  
  -- Lead contact information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  
  -- Enquiry details
  message TEXT NOT NULL,
  investment_amount_range TEXT,
  interest_areas JSONB DEFAULT '[]'::jsonb,
  
  -- Lead management
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'closed_lost', 'won')),
  notes TEXT,
  
  -- Tracking
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  referrer TEXT,
  user_agent TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  contacted_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

-- Indexes for performance
CREATE INDEX idx_fund_enquiries_fund_id ON fund_enquiries(fund_id);
CREATE INDEX idx_fund_enquiries_status ON fund_enquiries(status);
CREATE INDEX idx_fund_enquiries_created_at ON fund_enquiries(created_at DESC);
CREATE INDEX idx_fund_enquiries_email ON fund_enquiries(email);

-- Enable RLS
ALTER TABLE fund_enquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can insert enquiries (public form)
CREATE POLICY "Anyone can create enquiries"
  ON fund_enquiries FOR INSERT
  WITH CHECK (true);

-- Fund managers can view enquiries for their assigned funds
CREATE POLICY "Managers can view their fund enquiries"
  ON fund_enquiries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM fund_managers
      WHERE fund_managers.fund_id = fund_enquiries.fund_id
        AND fund_managers.user_id = auth.uid()
        AND fund_managers.status = 'active'
    ) OR is_user_admin()
  );

-- Fund managers can update enquiries for their funds
CREATE POLICY "Managers can update their fund enquiries"
  ON fund_enquiries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM fund_managers
      WHERE fund_managers.fund_id = fund_enquiries.fund_id
        AND fund_managers.user_id = auth.uid()
        AND fund_managers.status = 'active'
    ) OR is_user_admin()
  );

-- Admins can delete enquiries
CREATE POLICY "Admins can delete enquiries"
  ON fund_enquiries FOR DELETE
  USING (is_user_admin());

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_fund_enquiries_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_fund_enquiries_updated_at_trigger
  BEFORE UPDATE ON fund_enquiries
  FOR EACH ROW
  EXECUTE FUNCTION update_fund_enquiries_updated_at();