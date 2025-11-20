-- Reassign "Private Equity & Venture Capital" funds to single categories
UPDATE funds SET category = 'Venture Capital' WHERE id = 'ventures-eu-fund-i';
UPDATE funds SET category = 'Venture Capital' WHERE id = 'imga-futurum-tech-fund';
UPDATE funds SET category = 'Private Equity' WHERE id = 'portugal-investment-1';