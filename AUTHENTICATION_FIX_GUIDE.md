# 🔧 Authentication Database Error Fix

## Problem
Users are getting a "Database error saving new user" error when trying to sign up. This is caused by the database trigger that automatically creates user preferences failing.

## Root Cause
The trigger function `create_user_preferences()` is failing, likely due to:
1. Missing UNIQUE constraint on user_preferences.user_id
2. Race conditions in the trigger
3. Insufficient error handling in the trigger function

## Solution

### Step 1: Apply Database Fix
Run the SQL commands in `fix-auth-schema.sql` in your Supabase SQL editor:

```sql
-- This will fix the trigger and add proper error handling
```

### Step 2: Verify Database Setup
1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Run the contents of `fix-auth-schema.sql`
4. Check that the test function returns "SUCCESS"

### Step 3: Test User Creation
1. Try creating a new user account
2. Check that user_preferences record is created automatically
3. Verify that authentication works properly

## What the Fix Does

### 1. **Improved Trigger Function**
- Adds proper error handling with TRY/CATCH
- Uses `ON CONFLICT DO NOTHING` to prevent duplicate key errors
- Logs warnings instead of failing the entire user creation

### 2. **Better RLS Policies**
- Simplifies RLS policies to avoid permission issues
- Allows system functions to create user preferences
- Maintains security while improving reliability

### 3. **Fallback Mechanisms**
- Creates a function to ensure all existing users have preferences
- Adds a test function to verify the setup works
- Provides manual recovery options

## Alternative Quick Fix

If you want to temporarily disable the automatic user preferences creation:

```sql
-- Disable the trigger temporarily
DROP TRIGGER IF EXISTS create_user_preferences_trigger ON auth.users;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;
```

Then handle user preferences creation in your application code instead of the database trigger.

## Frontend Error Handling

The Auth.vue component already handles this error gracefully:

```javascript
} else if (error.message.includes('Database error saving new user')) {
  notification.error(
    'Account Creation Issue', 
    'There was a problem creating your account. Please try again in a moment, or contact support if the issue persists.'
  );
}
```

## Testing Steps

1. **Database Test**: Run `SELECT test_user_creation();` in Supabase SQL editor
2. **Manual Test**: Try creating a new user account
3. **Verification**: Check that user appears in auth.users and user_preferences tables

## Prevention

To prevent this issue in the future:
1. Always use `ON CONFLICT` clauses in trigger functions
2. Add proper error handling with TRY/CATCH blocks
3. Test triggers thoroughly before deploying
4. Monitor database logs for trigger failures

## Rollback Plan

If the fix causes issues, you can rollback:

```sql
-- Remove the new trigger
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;

-- Restore simple version
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER create_user_preferences_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_preferences();
```

## Status Check

After applying the fix, verify:
- ✅ New users can sign up without errors
- ✅ User preferences are created automatically
- ✅ Existing functionality still works
- ✅ No duplicate user preference records

## Support

If the issue persists after applying this fix:
1. Check Supabase logs for detailed error messages
2. Verify all database permissions are correct
3. Ensure the user_preferences table structure matches the schema
4. Contact Supabase support if it's a platform issue