-- Update funds with realistic historical performance data

UPDATE funds 
SET historical_performance = '{
  "2024-09": {"returns": 0.4, "aum": 156000000, "nav": 1.024},
  "2024-08": {"returns": 0.3, "aum": 155500000, "nav": 1.020},
  "2024-07": {"returns": 0.5, "aum": 155000000, "nav": 1.017},
  "2024-06": {"returns": 0.2, "aum": 154000000, "nav": 1.012},
  "2024-05": {"returns": 0.4, "aum": 153500000, "nav": 1.010},
  "2024-04": {"returns": 0.3, "aum": 153000000, "nav": 1.006}
}'::jsonb
WHERE id = 'optimize-golden-opportunities';

UPDATE funds 
SET historical_performance = '{
  "2024-09": {"returns": 3.2, "aum": 45000000, "nav": 1.156},
  "2024-08": {"returns": -2.8, "aum": 44000000, "nav": 1.120},
  "2024-07": {"returns": 4.1, "aum": 43500000, "nav": 1.152},
  "2024-06": {"returns": 1.8, "aum": 42000000, "nav": 1.107},
  "2024-05": {"returns": -1.5, "aum": 41000000, "nav": 1.087},
  "2024-04": {"returns": 2.9, "aum": 40500000, "nav": 1.104}
}'::jsonb
WHERE id = 'horizon-fund';

UPDATE funds 
SET historical_performance = '{
  "2024-09": {"returns": 1.2, "aum": 35000000, "nav": 1.042},
  "2024-08": {"returns": 0.6, "aum": 34500000, "nav": 1.034},
  "2024-07": {"returns": 1.8, "aum": 34000000, "nav": 1.028},
  "2024-06": {"returns": 0.9, "aum": 33000000, "nav": 1.017},
  "2024-05": {"returns": 1.4, "aum": 32500000, "nav": 1.010},
  "2024-04": {"returns": 0.3, "aum": 32000000, "nav": 1.001}
}'::jsonb
WHERE id = 'mercurio-fund-ii';

UPDATE funds 
SET historical_performance = '{
  "2024-09": {"returns": 0.8, "aum": 28000000, "nav": 1.032},
  "2024-08": {"returns": 0.6, "aum": 27500000, "nav": 1.024},
  "2024-07": {"returns": 1.1, "aum": 27000000, "nav": 1.018},
  "2024-06": {"returns": 0.7, "aum": 26500000, "nav": 1.007},
  "2024-05": {"returns": 0.9, "aum": 26000000, "nav": 1.000},
  "2024-04": {"returns": 0.5, "aum": 25500000, "nav": 0.991}
}'::jsonb
WHERE id = '3cc-golden-income';