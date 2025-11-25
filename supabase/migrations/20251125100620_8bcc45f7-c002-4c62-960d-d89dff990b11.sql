-- Fix team member slugs with proper Portuguese character mapping
-- Direct UPDATE approach with explicit transliteration

UPDATE team_members SET slug = 'andre-paul' WHERE name = 'André Paul';
UPDATE team_members SET slug = 'antonio-ferreira' WHERE name = 'António Ferreira';
UPDATE team_members SET slug = 'antonio-pereira' WHERE name = 'António Pereira';
UPDATE team_members SET slug = 'barbara-silva' WHERE name = 'Bárbara Silva';
UPDATE team_members SET slug = 'francisco-giao' WHERE name = 'Francisco Gião';
UPDATE team_members SET slug = 'goncalo-mendes' WHERE name = 'Gonçalo Mendes';
UPDATE team_members SET slug = 'gustavo-caiuby-guimaraes' WHERE name = 'Gustavo Caiuby Guimarães';
UPDATE team_members SET slug = 'gustavo-guimaraes' WHERE name = 'Gustavo Guimarães';
UPDATE team_members SET slug = 'ines-borges-de-carvalho' WHERE name = 'Inês Borges de Carvalho';
UPDATE team_members SET slug = 'joao-silva' WHERE name = 'João Silva';
UPDATE team_members SET slug = 'jose-carlos-monteiro' WHERE name = 'José Carlos Monteiro';
UPDATE team_members SET slug = 'pedro-rebelo' WHERE name = 'Pedro Rebêlo';
UPDATE team_members SET slug = 'tomas-sa' WHERE name = 'Tomás Sá';

-- Verify all slugs are now ASCII-only
SELECT 
  COUNT(*) as total_members,
  COUNT(*) FILTER (WHERE slug ~ '^[a-z0-9-]+$') as ascii_only_slugs,
  COUNT(*) FILTER (WHERE slug !~ '^[a-z0-9-]+$') as non_ascii_slugs
FROM team_members;