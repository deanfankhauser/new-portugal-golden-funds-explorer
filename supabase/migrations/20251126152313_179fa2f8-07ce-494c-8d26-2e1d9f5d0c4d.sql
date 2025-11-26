-- Create category_editorial table for admin-editable category introductions
CREATE TABLE IF NOT EXISTS public.category_editorial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_slug TEXT UNIQUE NOT NULL,
  category_name TEXT NOT NULL,
  editorial_content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.category_editorial ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read access to category editorial"
ON public.category_editorial
FOR SELECT
USING (true);

-- Admin write access
CREATE POLICY "Admins can manage category editorial"
ON public.category_editorial
FOR ALL
USING (is_user_admin());

-- Create trigger for updated_at
CREATE TRIGGER update_category_editorial_updated_at
BEFORE UPDATE ON public.category_editorial
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed default editorial content for key categories
INSERT INTO public.category_editorial (category_slug, category_name, editorial_content) VALUES
('private-equity', 'Private Equity', 'Private Equity funds in Portugal typically target mature companies or tangible assets (Agriculture, Industry, Hospitality) with established cash flows. They offer a middle-ground risk profile compared to high-risk Venture Capital and low-yield Bonds.'),
('venture-capital', 'Venture Capital', 'Venture Capital funds invest in early-stage and high-growth Portuguese startups across technology, healthcare, and cleantech sectors. These funds carry higher risk but offer potential for substantial returns through equity appreciation and successful exits.'),
('real-estate', 'Real Estate', 'Real Estate funds focus on Portuguese commercial, residential, and hospitality properties. These funds provide exposure to Portugal''s property market with income from rent and potential capital appreciation from development projects.'),
('debt', 'Debt', 'Debt funds provide fixed-income exposure through corporate loans, bonds, and structured credit instruments. They typically offer lower risk and more predictable returns compared to equity-focused strategies.'),
('infrastructure', 'Infrastructure', 'Infrastructure funds invest in essential Portuguese assets such as transportation networks, energy facilities, telecommunications, and utilities. These funds offer stable, long-term cash flows backed by essential services.'),
('clean-energy', 'Clean Energy', 'Clean Energy funds focus on renewable energy projects in Portugal, including solar, wind, and battery storage facilities. These funds align with Portugal''s carbon neutrality goals while providing returns from energy generation.'),
('bitcoin', 'Bitcoin', 'Bitcoin funds provide regulated exposure to Bitcoin cryptocurrency with professional custody and management. These digital asset funds offer high-risk, high-reward exposure to the world''s largest cryptocurrency.'),
('crypto', 'Crypto', 'Crypto funds invest in diversified cryptocurrency portfolios beyond Bitcoin, including Ethereum, DeFi tokens, and blockchain infrastructure projects. These funds offer exposure to the broader digital asset ecosystem.'),
('credit', 'Credit', 'Credit funds specialize in corporate lending, structured credit, and alternative debt instruments. They provide income-focused returns through interest payments with moderate risk profiles.'),
('fund-of-funds', 'Fund-of-Funds', 'Fund-of-Funds vehicles invest in portfolios of other investment funds, providing diversified exposure across multiple strategies, sectors, and managers. This approach offers built-in diversification with professional fund selection.'),
('other', 'Other', 'This category includes specialized investment strategies that don''t fit standard classifications, such as mixed-asset funds, niche sector investments, and hybrid instruments combining multiple asset classes.')
ON CONFLICT (category_slug) DO NOTHING;