-- Temporarily disable email confirmation requirement
-- This allows users to sign in without confirming their email
UPDATE auth.config 
SET email_confirmation_enabled = false
WHERE key = 'email_confirmation_enabled';

-- If the config doesn't exist, insert it
INSERT INTO auth.config (key, value)
SELECT 'email_confirmation_enabled', 'false'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.config WHERE key = 'email_confirmation_enabled'
);