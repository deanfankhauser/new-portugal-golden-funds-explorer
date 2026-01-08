
INSERT INTO funds (
  id,
  name,
  manager_name,
  category,
  description,
  detailed_description,
  minimum_investment,
  aum,
  management_fee,
  performance_fee,
  subscription_fee,
  expected_return_min,
  expected_return_max,
  lock_up_period_months,
  gv_eligible,
  inception_date,
  regulated_by,
  location,
  tags,
  custodian,
  auditor,
  redemption_terms,
  currency
) VALUES (
  'peeif-ii-portuguese-energy-efficiency-investment-fund-ii',
  'PEEIF II – Portuguese Energy Efficiency Investment Fund II',
  'Quadrantis Capital',
  'Venture Capital',
  'A CMVM-recognised Portuguese venture capital fund managed by Quadrantis Capital, investing in energy efficiency, renewable energy and cleantech projects in Portugal, targeting 6% annual distributions plus a 2% loyalty bonus for Golden Visa investors.',
  'PEEIF II – Portuguese Energy Efficiency Investment Fund II is a CMVM-recognised Venture Capital Investment Fund managed by Quadrantis Capital. The fund is designed to back energy efficiency, renewable energy and cleantech projects in Portugal, focusing on high-potential companies and infrastructure that combine environmental impact with stable, attractive returns.

PEEIF II targets a hard cap of €25 million and a 10-year life cycle. The strategy concentrates on energy efficiency solutions, renewable energy production (including large-scale photovoltaic projects) and innovative cleantech initiatives that support Portugal''s transition towards carbon neutrality. A flagship initiative of the fund is the development of photovoltaic projects with approximately 800 MW of capacity, with expected returns above 20%, supported by market analysis from Deloitte and collaboration with Portugal''s Directorate of Renewable Energies.

Investors receive a 6% annual return distributed each year, plus a 2% p.a. loyalty bonus from year 5 onwards, subject to staying invested, resulting in a total of up to 8% p.a. for long-term investors. The fund offers an early exit option after 3 years through a buyback of participation units by an SPV (ValorGreen2). PEEIF II is fully exempt from corporate income tax, with no withholding tax for non-resident investors, and is structured to be fully eligible for the Portuguese Golden Visa regime, subject to the statutory €500,000 minimum investment required by law.',
  200000,
  NULL,
  2.5,
  30,
  3,
  6,
  8,
  36,
  true,
  '2025-01-01',
  'CMVM',
  'Portugal',
  ARRAY['Portugal', 'Quadrantis Capital', 'Golden Visa', 'Venture Capital', 'Energy', 'Renewable Energy', 'Cleantech', 'Private Markets', 'Closed-end Fund'],
  'Bison Bank',
  'Kreston & Associados, SROC LDA',
  '{"frequency": "End of Term", "redemptionOpen": false, "minimumHoldingPeriod": 36, "notes": "Closed-end 10-year fund with an early exit option after 3 years via buyback of participation units by PEEIF II SPV (ValorGreen2). Annual distribution of 6% p.a. to investors, with an additional 2% p.a. loyalty bonus after 5 years."}'::jsonb,
  'EUR'
);
