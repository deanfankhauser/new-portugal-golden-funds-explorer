-- Populate funds table with key fund records so admin approvals can update actual records

-- Insert horizon-fund with correct field mapping
INSERT INTO public.funds (
    id, name, description, detailed_description, manager_name,
    minimum_investment, management_fee, performance_fee, lock_up_period_months,
    category, website, risk_level, currency, aum, inception_date,
    geographic_allocation, team_members, pdf_documents, faqs, gv_eligible,
    tags, created_at, updated_at, version
) VALUES (
    'horizon-fund',
    'Horizon Fund',
    'Open Ended Fund investing 65% in Portuguese Fixed Income and 35% in Digital Assets with access to Golden Visa in Portugal',
    'Horizon Fund is the first Golden-Visa-eligible SCR vehicle in Portugal, offering a blended strategy with a minimum allocation of 60% of its net asset value (NAV) in securities of issuers based in Portugal, and up to 40% in large-cap digital assets (e.g. Bitcoin, Ethereum). As an open-ended fund with monthly subscriptions and redemptions, it provides both liquidity and stability: Portuguese bond holdings generate steady income while crypto allocations capture growth potential. A robust risk-management framework—including stop-loss triggers, liquidity buffers and independent oversight—helps control volatility. Early redemptions (within 5 years) incur a 2% fee to align investor horizons, after which redemptions are processed daily. Managed by Octanova SCR with seasoned fixed income and blockchain experts, Horizon Fund targets a 15–20% IRR over a six-year term, with full transparency via quarterly reports and annual audited statements.',
    'Octanova SCR',
    500000,
    1.5,
    10.0,
    72, -- 6 years * 12 months
    'Mixed',
    'https://octanova.com',
    'Medium',
    'EUR',
    50000000,
    '2024-01-01',
    '[{"region": "Portugal", "percentage": 60}, {"region": "USA", "percentage": 40}]'::jsonb,
    '[{"name": "Octanova Team", "position": "Fund Management", "bio": "Experienced team in fixed income and digital assets"}]'::jsonb,
    '[{"title": "Fund Prospectus", "url": "#"}, {"title": "Risk Disclosure", "url": "#"}]'::jsonb,
    '[{"question": "What makes this fund unique?", "answer": "First Golden Visa eligible mixed crypto/bond fund in Portugal."}, {"question": "How is risk managed?", "answer": "Through diversification, stop-loss triggers, and professional oversight."}]'::jsonb,
    true,
    ARRAY['Mixed', 'Golden Visa Eligible', 'Open Ended', 'Digital Assets', 'Portugal'],
    now(),
    now(),
    1
) ON CONFLICT (id) DO NOTHING;

-- Insert optimize-golden-opportunities  
INSERT INTO public.funds (
    id, name, description, detailed_description, manager_name,
    minimum_investment, management_fee, performance_fee, lock_up_period_months,
    category, website, risk_level, currency, aum, inception_date,
    geographic_allocation, team_members, pdf_documents, faqs, gv_eligible,
    tags, created_at, updated_at, version
) VALUES (
    'optimize-golden-opportunities',
    'Optimize Portugal Golden Opportunities Fund',
    'Open-ended UCITS-compliant balanced fund investing in Portuguese listed equities and bonds, offering daily liquidity and eligibility for the Portuguese Golden Visa.',
    'Optimize Portugal Golden Opportunities Fund is a UCITS-compliant, open-ended vehicle designed for Golden Visa investors, blending a 75% allocation to Portuguese listed equities with 25% in bonds to achieve lower volatility and attractive long-term capital appreciation. The fund provides daily NAV and processing of subscriptions/redemptions within five business days, with no lock-up period or redemption fees. Investors benefit from professional portfolio management, diversification across Portuguese blue-chip companies, and full regulatory oversight under European investment fund directives.',
    'Optimize Investment Partners',
    100000,
    1.2,
    15.0,
    0, -- No lock-up period
    'Mixed',
    'https://optimize.pt',
    'Low-risk',
    'EUR',
    25000000,
    '2023-06-01',
    '[{"region": "Portugal", "percentage": 100}]'::jsonb,
    '[{"name": "Optimize Team", "position": "Portfolio Management", "bio": "UCITS-compliant investment professionals"}]'::jsonb,
    '[{"title": "UCITS Prospectus", "url": "#"}, {"title": "Key Investor Information", "url": "#"}]'::jsonb,
    '[{"question": "Is this fund UCITS compliant?", "answer": "Yes, fully UCITS compliant with daily liquidity."}, {"question": "What is the investment strategy?", "answer": "75% Portuguese equities, 25% bonds for balanced growth."}]'::jsonb,
    true,
    ARRAY['Mixed', 'Golden Visa Eligible', 'Open Ended', 'UCITS', 'Portugal', 'Low-risk'],
    now(),
    now(),
    1
) ON CONFLICT (id) DO NOTHING;