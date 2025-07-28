# Demo User Setup Guide

## Creating the Demo User in Supabase

To enable the "Try Demo Account" functionality, you need to manually create a demo user in your Supabase project:

### Steps:

1. **Go to your Supabase Dashboard**
   - Navigate to https://supabase.com/dashboard
   - Select your project: `pzwrocsqwhmgosninpmv`

2. **Access Authentication**
   - Click on "Authentication" in the left sidebar
   - Go to "Users" tab

3. **Create Demo User**
   - Click "Add User" button
   - Fill in the details:
     - **Email**: `demo@example.com`
     - **Password**: `tastepulse123`
     - **Email Confirm**: Check this box to auto-confirm
   - Click "Create User"

4. **Verify Demo User**
   - The demo user should appear in your users list
   - Status should be "Confirmed"

### Alternative: SQL Command

You can also create the demo user using SQL in the Supabase SQL Editor:

```sql
-- Insert demo user (this requires admin access)
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'demo@example.com',
  crypt('tastepulse123', gen_salt('bf')),
  NOW(),
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
);
```

### Testing

After creating the demo user:
1. Go to your app's homepage
2. Click "Try Demo Account" button
3. Should automatically log in as demo@example.com

### Security Note

- The demo user is for testing purposes only
- Consider using a more secure password in production
- You can disable the demo login feature by removing the button from Auth.vue