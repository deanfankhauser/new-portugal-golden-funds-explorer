-- Temporarily disable the foreign key constraint to insert test data
ALTER TABLE public.manager_profiles DROP CONSTRAINT manager_profiles_user_id_fkey;

-- Insert sample manager users for testing
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
  gen_random_uuid(),
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
  250000000,
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
  120000000,
  2015
);

-- Re-add the foreign key constraint (this will be enforced for new records)
-- Note: Existing records without valid user_id will remain but new ones must have valid auth.users reference
ALTER TABLE public.manager_profiles 
ADD CONSTRAINT manager_profiles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;