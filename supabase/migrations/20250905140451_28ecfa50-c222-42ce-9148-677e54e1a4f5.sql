-- Insert a sample manager user for testing
-- Note: In production, users should be created through Supabase Auth
INSERT INTO public.manager_profiles (
  user_id,
  company_name,
  manager_name,
  email,
  phone,
  website,
  description,
  address,
  city,
  country,
  registration_number,
  license_number,
  status,
  assets_under_management,
  founded_year
) VALUES (
  gen_random_uuid(), -- This would normally be the auth.users.id
  'Golden Vista Investment Management',
  'Maria Silva',
  'maria.silva@goldenvista.pt',
  '+351 21 123 4567',
  'https://www.goldenvista.pt',
  'Leading investment management firm specializing in Golden Visa compliant funds with over 15 years of experience in Portuguese markets.',
  'Avenida da Liberdade, 123, 4º andar',
  'Lisbon',
  'Portugal',
  'CMVM-12345',
  'LIC-GV-2024-001',
  'approved',
  250000000, -- 250M EUR
  2008
),
(
  gen_random_uuid(),
  'Atlantic Capital Partners',
  'João Santos',
  'joao.santos@atlanticcapital.pt',
  '+351 22 987 6543',
  'https://www.atlanticcapital.pt',
  'Boutique investment firm focused on sustainable and ESG-compliant investment opportunities for international investors.',
  'Rua de Santa Catarina, 456, 2º andar',
  'Porto',
  'Portugal',
  'CMVM-67890',
  'LIC-GV-2024-002',
  'pending',
  120000000, -- 120M EUR
  2015
);