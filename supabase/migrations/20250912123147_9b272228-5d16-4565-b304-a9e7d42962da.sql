-- Migrate static fund data to the funds table
-- First, let's add the static fund data

-- Insert the static fund data into the funds table
INSERT INTO public.funds (
  id, name, description, detailed_description, tags, category, 
  minimum_investment, aum, management_fee, performance_fee, 
  lock_up_period_months, manager_name, expected_return_min, expected_return_max,
  website, inception_date, geographic_allocation, team_members, 
  pdf_documents, faqs, gv_eligible, risk_level, currency
) VALUES
('horizon-fund', 'Horizon Fund', 'A diversified investment fund focusing on European markets with strong ESG principles.', 'The Horizon Fund is a comprehensive investment vehicle designed to capture opportunities across European markets while maintaining strict environmental, social, and governance (ESG) standards. Our investment strategy focuses on sustainable growth companies that demonstrate long-term value creation potential.', 
ARRAY['Real Estate', 'Private Equity', 'Golden Visa Eligible']::text[], 'Private Equity', 
250000, 85000000, 1.5, 20.0, 60, 'Horizon Capital', 8.0, 12.0,
'https://horizoncapital.pt', '2020-01-15', 
'[{"region": "Portugal", "percentage": 60}, {"region": "Spain", "percentage": 25}, {"region": "Other EU", "percentage": 15}]'::jsonb,
'[{"name": "Miguel Santos", "position": "Fund Manager", "bio": "20+ years in European markets"}]'::jsonb,
'[{"title": "Fund Prospectus", "url": "/documents/horizon-prospectus.pdf"}]'::jsonb,
'[{"question": "What is the minimum investment?", "answer": "The minimum investment is €250,000."}]'::jsonb,
true, 'Medium', 'EUR'),

('3cc-golden-income', '3CC Golden Income', 'Fixed income fund with Golden Visa eligibility and regular distributions.', 'The 3CC Golden Income Fund offers investors exposure to a diversified portfolio of fixed income securities, providing regular distributions while maintaining capital preservation as a key objective. This fund is specifically designed to meet Golden Visa requirements for Portugal.', 
ARRAY['Bonds', 'Golden Visa Eligible', 'Fixed Income']::text[], 'Fixed Income & Digital Assets', 
500000, 120000000, 1.2, 0.0, 84, '3CC Capital', 4.0, 6.0,
'https://3cccapital.com', '2019-03-10', 
'[{"region": "Portugal", "percentage": 70}, {"region": "Germany", "percentage": 20}, {"region": "France", "percentage": 10}]'::jsonb,
'[{"name": "Ana Silva", "position": "Portfolio Manager", "bio": "Expert in fixed income securities"}]'::jsonb,
'[{"title": "Investment Memorandum", "url": "/documents/3cc-memorandum.pdf"}]'::jsonb,
'[{"question": "How often are distributions made?", "answer": "Quarterly distributions are targeted."}]'::jsonb,
true, 'Low', 'EUR'),

('bluewater-capital-fund', 'Bluewater Capital Fund', 'Maritime and logistics focused private equity fund with infrastructure exposure.', 'Bluewater Capital Fund specializes in maritime infrastructure and logistics operations across Europe. Our investment thesis centers on the growing importance of efficient supply chain management and sustainable transportation solutions in the post-pandemic economy.', 
ARRAY['Infrastructure', 'Private Equity', 'Golden Visa Eligible']::text[], 'Infrastructure', 
400000, 95000000, 1.8, 15.0, 72, 'Bluewater Maritime Capital', 10.0, 15.0,
'https://bluewatercapital.eu', '2021-06-01', 
'[{"region": "Portugal", "percentage": 45}, {"region": "Netherlands", "percentage": 30}, {"region": "Belgium", "percentage": 25}]'::jsonb,
'[{"name": "Carlos Mendes", "position": "Managing Partner", "bio": "Former maritime industry executive"}]'::jsonb,
'[{"title": "Fund Overview", "url": "/documents/bluewater-overview.pdf"}]'::jsonb,
'[{"question": "What sectors does the fund target?", "answer": "Maritime infrastructure, ports, and logistics."}]'::jsonb,
true, 'Medium', 'EUR'),

('digital-insight-fund', 'Digital Insight Fund', 'Technology and digital transformation focused venture capital fund.', 'Digital Insight Fund targets early to growth-stage technology companies driving digital transformation across traditional industries. We focus on SaaS, fintech, and deep tech companies with strong IP portfolios and scalable business models.', 
ARRAY['Technology', 'Venture Capital', 'AI-Driven']::text[], 'Venture Capital', 
350000, 75000000, 2.0, 25.0, 48, 'Digital Ventures Ltd', 15.0, 25.0,
'https://digitalinsight.vc', '2022-01-15', 
'[{"region": "Portugal", "percentage": 40}, {"region": "UK", "percentage": 35}, {"region": "Germany", "percentage": 25}]'::jsonb,
'[{"name": "Sofia Rodrigues", "position": "General Partner", "bio": "Former tech entrepreneur and investor"}]'::jsonb,
'[{"title": "Technology Focus Areas", "url": "/documents/digital-focus.pdf"}]'::jsonb,
'[{"question": "What stage companies do you invest in?", "answer": "Series A to Series C growth stage companies."}]'::jsonb,
false, 'High', 'EUR'),

('emerald-green-fund', 'Emerald Green Fund', 'Sustainable energy and environmental technology investment fund.', 'The Emerald Green Fund invests in renewable energy projects and environmental technology companies across Europe. Our portfolio includes solar, wind, and battery storage projects, as well as innovative cleantech companies developing next-generation solutions.', 
ARRAY['Renewable Energy', 'Sustainability', 'Solar', 'Golden Visa Eligible']::text[], 'Clean Energy (Solar & Battery Storage)', 
300000, 110000000, 1.6, 18.0, 60, 'Emerald Energy Partners', 9.0, 14.0,
'https://emeraldgreen.pt', '2020-09-01', 
'[{"region": "Portugal", "percentage": 55}, {"region": "Spain", "percentage": 30}, {"region": "Italy", "percentage": 15}]'::jsonb,
'[{"name": "João Almeida", "position": "ESG Director", "bio": "Renewable energy sector specialist"}]'::jsonb,
'[{"title": "Sustainability Report", "url": "/documents/emerald-sustainability.pdf"}]'::jsonb,
'[{"question": "What types of renewable energy projects?", "answer": "Solar farms, wind projects, and battery storage facilities."}]'::jsonb,
true, 'Medium', 'EUR');

-- Add more fund data for comprehensive migration
INSERT INTO public.funds (
  id, name, description, detailed_description, tags, category, 
  minimum_investment, aum, management_fee, performance_fee, 
  lock_up_period_months, manager_name, expected_return_min, expected_return_max,
  website, inception_date, gv_eligible, risk_level, currency
) VALUES
('flex-space-fund', 'Flex Space Fund', 'Commercial real estate fund focused on flexible workspace solutions.', 'Flex Space Fund invests in commercial real estate properties optimized for flexible workspace solutions, including co-working spaces, hybrid office environments, and adaptable retail spaces that meet the changing needs of modern businesses.', 
ARRAY['Real Estate', 'Golden Visa Eligible', 'Commercial']::text[], 'Real Estate', 
450000, 88000000, 1.4, 12.0, 66, 'FlexSpace Investments', 7.0, 11.0,
'https://flexspace.pt', '2021-04-01', true, 'Medium', 'EUR'),

('portugal-prime-fund', 'Portugal Prime Fund', 'Diversified Portuguese equity and infrastructure fund with Golden Visa eligibility.', 'Portugal Prime Fund offers exposure to a carefully curated portfolio of Portuguese companies and infrastructure projects. The fund focuses on established businesses with strong market positions and sustainable competitive advantages.', 
ARRAY['Golden Visa Eligible', 'Equity', 'Infrastructure', 'Diversified']::text[], 'Multi-Asset', 
500000, 150000000, 1.3, 15.0, 60, 'Prime Capital Portugal', 6.0, 10.0,
NULL, '2018-11-01', true, 'Medium', 'EUR'),

('lince-growth-fund', 'Lince Growth Fund', 'Growth equity fund targeting mid-market companies across Iberia.', 'Lince Growth Fund partners with established mid-market companies in Spain and Portugal, providing growth capital to support expansion, operational improvements, and strategic initiatives. We focus on companies with proven business models seeking to scale.', 
ARRAY['Private Equity', 'Growth', 'Mid-Cap', 'Golden Visa Eligible']::text[], 'Private Equity', 
600000, 200000000, 1.8, 20.0, 72, 'Lince Capital Partners', 12.0, 18.0,
'https://lincecapital.com', '2019-07-15', true, 'High', 'EUR'),

('solar-future-fund', 'Solar Future Fund', 'Pure-play solar energy infrastructure fund with long-term contracts.', 'Solar Future Fund invests exclusively in utility-scale solar energy projects with long-term power purchase agreements. Our portfolio consists of operational and development-stage solar farms across Southern Europe, providing predictable cash flows and environmental impact.', 
ARRAY['Solar', 'Renewable Energy', 'Infrastructure', 'Golden Visa Eligible']::text[], 'Clean Energy (Solar & Battery Storage)', 
400000, 180000000, 1.5, 10.0, 84, 'Solar Energy Partners', 8.0, 12.0,
'https://solarfuture.eu', '2020-03-01', true, 'Low', 'EUR'),

('ventures-eu-fund', 'Ventures EU Fund', 'Early-stage venture capital fund focused on European tech startups.', 'Ventures EU Fund backs exceptional entrepreneurs building category-defining technology companies across Europe. We provide capital, expertise, and network access to help startups scale from early revenue to market leadership positions.', 
ARRAY['Venture Capital', 'Technology', 'Early Stage']::text[], 'Venture Capital', 
250000, 65000000, 2.2, 25.0, 36, 'Ventures EU', 20.0, 35.0,
'https://ventures-eu.com', '2022-05-01', false, 'High', 'EUR');

-- Create a function to increment version numbers for fund updates
CREATE OR REPLACE FUNCTION public.increment_fund_version()
RETURNS TRIGGER AS $$
BEGIN
  NEW.version = COALESCE(OLD.version, 1) + 1;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic version incrementing
CREATE TRIGGER trigger_increment_fund_version
  BEFORE UPDATE ON public.funds
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_fund_version();

-- Enable real-time updates for the funds table
ALTER TABLE public.funds REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.funds;