-- Add 'admin' to the admin_role enum if it doesn't exist
ALTER TYPE admin_role ADD VALUE IF NOT EXISTS 'admin';