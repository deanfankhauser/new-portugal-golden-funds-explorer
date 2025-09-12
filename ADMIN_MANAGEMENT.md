# Admin Panel Access Management

This guide explains how to manage who can access the Admin Panel in your application.

## Role System

The admin system uses three role levels:

### 1. Super Admin
- **Full system access**
- Can manage other admin users (add/remove)
- Can approve/reject fund suggestions
- Can view all activity logs
- Cannot be removed by other admins

### 2. Admin
- Can approve/reject fund suggestions
- Can view activity logs
- Cannot manage admin users
- Can be managed by super admins

### 3. Moderator
- Can view fund suggestions (read-only)
- Can view activity logs
- Cannot approve/reject suggestions
- Can be managed by super admins

## How to Grant Admin Access

### Method 1: Using the Admin Panel UI (Recommended)

1. **Login as Super Admin**
   - Only super admins can grant/revoke admin access

2. **Navigate to Admin Panel**
   - Go to `/admin` in your application
   - Click on the "Users" tab

3. **Add New Admin User**
   - Enter the user's email address
   - Select their role (Admin or Moderator)
   - Click "Add User"

**Important:** The user must be registered (have a profile) before they can be granted admin access.

### Method 2: Direct SQL (For Initial Setup)

If you need to manually add admin users via SQL:

```sql
-- Add a user as super admin
INSERT INTO public.admin_users (user_id, role, granted_by) 
VALUES ('user-uuid-here', 'super_admin', 'user-uuid-here')
ON CONFLICT (user_id) DO UPDATE SET role = 'super_admin';

-- Add a user as regular admin
INSERT INTO public.admin_users (user_id, role, granted_by) 
VALUES ('user-uuid-here', 'admin', 'granting-user-uuid')
ON CONFLICT (user_id) DO UPDATE SET role = 'admin';

-- Add a user as moderator
INSERT INTO public.admin_users (user_id, role, granted_by) 
VALUES ('user-uuid-here', 'moderator', 'granting-user-uuid')
ON CONFLICT (user_id) DO UPDATE SET role = 'moderator';
```

To find a user's UUID:
```sql
-- Find user by email in manager profiles
SELECT user_id FROM public.manager_profiles WHERE email = 'user@example.com';

-- Find user by email in investor profiles  
SELECT user_id FROM public.investor_profiles WHERE email = 'user@example.com';
```

## How to Revoke Admin Access

### Using the Admin Panel UI

1. Go to `/admin` → "Users" tab
2. Find the user in the admin users table
3. Click the trash icon next to their name
4. Confirm the removal

### Using SQL

```sql
-- Remove admin access by user_id
DELETE FROM public.admin_users WHERE user_id = 'user-uuid-here';

-- Remove admin access by email (more complex)
DELETE FROM public.admin_users 
WHERE user_id IN (
  SELECT user_id FROM public.manager_profiles WHERE email = 'user@example.com'
  UNION
  SELECT user_id FROM public.investor_profiles WHERE email = 'user@example.com'
);
```

## Security Features

### Row Level Security (RLS)
- Admin users table has RLS enabled
- Only existing admins can view admin user data
- Only super admins can modify admin users
- Users cannot escalate their own privileges

### Activity Logging
- All admin actions are logged automatically
- Logs include granting/revoking admin access
- Logs include approval/rejection of fund suggestions
- Logs are viewable in the Admin Panel

### Role-Based Access Control
- Each admin function checks user role
- UI elements are hidden based on permissions
- Backend functions validate role before execution

## Database Structure

### admin_users Table
```sql
- id: UUID (Primary Key)
- user_id: UUID (References auth.users)
- role: admin_role ENUM (super_admin, admin, moderator)
- created_at: TIMESTAMP
- granted_at: TIMESTAMP  
- granted_by: UUID (References auth.users)
```

### Database Functions
- `is_user_admin(user_id)`: Check if user has admin privileges
- `get_user_admin_role(user_id)`: Get user's admin role
- `log_admin_activity()`: Log admin actions

## Troubleshooting

### "User not found" Error
- Ensure the user has registered and created a profile
- Check both manager_profiles and investor_profiles tables
- Verify the email address is correct

### "Access Denied" Message
- User is not in the admin_users table
- Check user's role meets minimum requirements
- Verify RLS policies are working correctly

### Cannot See Admin Panel
- Check that user is logged in
- Verify user has admin privileges
- Check browser console for errors
- Ensure `/admin` route is accessible

## Best Practices

1. **Principle of Least Privilege**
   - Start with moderator role
   - Upgrade to admin only when needed
   - Use super admin sparingly

2. **Regular Access Review**
   - Review admin users quarterly
   - Remove access for inactive users
   - Update roles as responsibilities change

3. **Activity Monitoring**
   - Regularly check activity logs
   - Monitor for unusual admin activity
   - Set up alerts for critical changes

4. **Backup Super Admin**
   - Always have multiple super admins
   - Document super admin credentials
   - Test admin access regularly

## Quick Reference

| Action | Required Role | Location |
|--------|---------------|----------|
| View Admin Panel | Moderator+ | `/admin` |
| Approve Fund Suggestions | Admin+ | Admin Panel → Suggestions |
| Manage Admin Users | Super Admin | Admin Panel → Users |
| View Activity Logs | Moderator+ | Admin Panel → Activity |
| System Settings | Super Admin | Admin Panel → Settings |

## Getting Started

1. **First Time Setup:**
   - Manually add your first super admin via SQL
   - Login and access the Admin Panel
   - Use the UI to add other admin users

2. **Daily Operations:**
   - Use the Admin Panel UI for all admin management
   - Monitor activity logs regularly
   - Review and process fund suggestions

3. **Maintenance:**
   - Regularly review admin user list
   - Update roles as needed
   - Remove inactive admin accounts