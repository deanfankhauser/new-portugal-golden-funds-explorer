-- Update Horizon Fund logo URL to match existing storage file
UPDATE funds 
SET logo_url = 'https://bkmvydnfhmkjnuszroim.supabase.co/storage/v1/object/public/fund-logos/horizon-fund-1758273884863.webp' 
WHERE id = 'horizon-fund' AND logo_url IS NULL;