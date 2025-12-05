-- Remove Skynix dummy data

-- Step 1: Delete admin user record for Skynix
DELETE FROM admin_users 
WHERE user_id = '91d23f04-e2a2-450f-80b9-5d87b15c5191';

-- Step 2: Delete both Skynix profile records
DELETE FROM profiles 
WHERE id IN (
  '63173912-a685-4072-8e3a-a7969341c77e',
  '2c85f029-6f85-4830-99dc-2b8b5da49dee'
);