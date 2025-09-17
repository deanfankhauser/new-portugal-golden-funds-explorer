# Development Environment Sync Guide

## Sync Results Analysis ✅

Based on the latest sync execution on 2025-09-17T13:09:20.594Z:

### ✅ Successfully Synced Data:
- **Storage Buckets**: profile-photos bucket created/verified
- **Manager Profiles**: 2 records synced
- **Investor Profiles**: 1 record synced  
- **Admin Users**: 2 records synced
- **Fund Edit Suggestions**: 35 records synced
- **Fund Edit History**: 27 records synced

### ✅ Empty Tables (Correctly Handled):
- **Funds**: 0 records (production has no fund data)
- **Admin Activity Log**: 0 records
- **Account Deletion Requests**: 0 records

---

## 🚨 Manual Steps Required

### 1. Database Schema & Functions Migration

**Status**: ⚠️ Requires CLI deployment

**Database Functions to Migrate (10 total)**:
- `check_sensitive_data_exposure`
- `find_user_by_email`
- `get_super_admin_emails`
- `get_user_admin_role`
- `get_users_identity`
- `handle_new_investor_user`
- `handle_new_manager_user`
- `is_user_admin`
- `log_admin_activity`
- `update_updated_at_column`

**Commands**:
```bash
# Connect to Funds_Develop project
supabase login
supabase link --project-ref fgwmkjivosjvvslbrvxe

# Deploy database migrations (includes functions, triggers, RLS policies)
supabase db push
```

### 2. Edge Functions Deployment

**Status**: ⚠️ Requires CLI deployment

**Edge Functions to Deploy (7 total)**:
- `delete-account`
- `notify-super-admins`
- `send-confirmation-email`
- `send-notification-email`
- `send-password-reset`
- `send-welcome-email`
- `sync-production-to-develop`

**Commands**:
```bash
# Deploy all edge functions
supabase functions deploy

# Deploy secrets (ensure .env file is properly configured)
supabase secrets set --env-file .env
```

### 3. Config.toml Update

**Status**: ⚠️ Manual update required

**Action**: Update `supabase/config.toml` in Funds_Develop:

```toml
project_id = "fgwmkjivosjvvslbrvxe"

[auth]
enable_signup = true
enable_confirmations = true

[auth.email]
site_name = "Investment Funds Platform"
enable_confirmations = true

# Configure each edge function
[functions.delete-account]
verify_jwt = false

[functions.notify-super-admins]
verify_jwt = false

[functions.send-confirmation-email]
verify_jwt = false

[functions.send-notification-email]
verify_jwt = false

[functions.send-password-reset]
verify_jwt = false

[functions.send-welcome-email]
verify_jwt = false

[functions.sync-production-to-develop]
verify_jwt = false
```

---

## 🔐 Security Considerations

### Linter Warnings (Address These):
1. **Leaked Password Protection**: Enable in Auth settings
2. **Postgres Version**: Upgrade to latest version for security patches

### Data Privacy Notes:
- ✅ Security audit tables are intentionally NOT synced (contain sensitive system data)
- ✅ Auth.users table managed by Supabase Auth (not synced)
- ✅ All user data properly protected with RLS policies

---

## 🧪 Testing Checklist

After completing manual steps, verify:

- [ ] All database functions execute correctly
- [ ] Edge functions deploy and respond properly  
- [ ] RLS policies allow proper data access
- [ ] Authentication flows work correctly
- [ ] Email confirmations are sent
- [ ] Storage bucket permissions work

---

## 📊 Complete Deployment Commands

```bash
# 1. Setup and connect
supabase login
supabase link --project-ref fgwmkjivosjvvslbrvxe

# 2. Deploy database schema and functions
supabase db push

# 3. Deploy edge functions
supabase functions deploy

# 4. Deploy secrets
supabase secrets set --env-file .env

# 5. Manual: Update config.toml with correct project_id
# 6. Manual: Enable password protection in Auth settings
# 7. Manual: Upgrade Postgres version if needed
```

---

## ✅ Verification

Run the sync function again after completing manual steps to ensure everything is properly configured:

```bash
# Test the sync function
curl -X POST https://fgwmkjivosjvvslbrvxe.supabase.co/functions/v1/sync-production-to-develop
```

**Expected Result**: All operations should show `success` status with no warnings.