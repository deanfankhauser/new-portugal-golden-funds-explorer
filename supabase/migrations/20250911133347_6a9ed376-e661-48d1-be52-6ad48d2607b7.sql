-- Re-enable email confirmation requirement
UPDATE auth.config 
SET value = 'true'
WHERE key = 'email_confirmation_enabled';

-- If the config doesn't exist, insert it with true value
INSERT INTO auth.config (key, value)
SELECT 'email_confirmation_enabled', 'true'
WHERE NOT EXISTS (
  SELECT 1 FROM auth.config WHERE key = 'email_confirmation_enabled'
);