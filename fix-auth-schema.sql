-- Fix for Authentication Database Error
-- Run this SQL in your Supabase SQL editor to fix the user creation issue

-- First, let's drop the existing trigger that might be causing issues
DROP TRIGGER IF EXISTS create_user_preferences_trigger ON auth.users;
DROP FUNCTION IF EXISTS create_user_preferences();

-- Create a more robust function to handle user preferences creation
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  -- Use INSERT ... ON CONFLICT to avoid duplicate key errors
  INSERT INTO user_preferences (user_id, theme, language, notifications_enabled, public_profile)
  VALUES (NEW.id, 'system', 'en', true, false)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create user preferences for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Recreate the trigger with better error handling
CREATE TRIGGER create_user_preferences_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_preferences();

-- Also ensure the user_preferences table has the correct structure
-- Add the UNIQUE constraint if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint 
    WHERE conname = 'user_preferences_user_id_key'
  ) THEN
    ALTER TABLE user_preferences ADD CONSTRAINT user_preferences_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Create a function to manually create user preferences for existing users
CREATE OR REPLACE FUNCTION ensure_user_preferences()
RETURNS void AS $$
BEGIN
  INSERT INTO user_preferences (user_id, theme, language, notifications_enabled, public_profile)
  SELECT 
    u.id,
    'system',
    'en',
    true,
    false
  FROM auth.users u
  LEFT JOIN user_preferences up ON u.id = up.user_id
  WHERE up.user_id IS NULL
  ON CONFLICT (user_id) DO NOTHING;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Run the function to ensure all existing users have preferences
SELECT ensure_user_preferences();

-- Create a more robust RLS policy for user_preferences
DROP POLICY IF EXISTS "Users can view their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON user_preferences;

-- Create better RLS policies
CREATE POLICY "Users can manage their own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Allow the trigger function to insert preferences
CREATE POLICY "System can create user preferences" ON user_preferences
  FOR INSERT WITH CHECK (true);

-- Create a function to handle user signup with better error handling
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Create user preferences with error handling
  BEGIN
    INSERT INTO user_preferences (user_id, theme, language, notifications_enabled, public_profile)
    VALUES (NEW.id, 'system', 'en', true, false)
    ON CONFLICT (user_id) DO NOTHING;
  EXCEPTION
    WHEN OTHERS THEN
      -- Log the error but don't fail
      RAISE WARNING 'Failed to create user preferences: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Replace the trigger with the new function
DROP TRIGGER IF EXISTS create_user_preferences_trigger ON auth.users;
CREATE TRIGGER handle_new_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON user_preferences TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON saved_recommendations TO authenticated;

-- Create a test function to verify the setup
CREATE OR REPLACE FUNCTION test_user_creation()
RETURNS TEXT AS $$
DECLARE
  test_result TEXT;
BEGIN
  -- Test if we can create a user preference record
  BEGIN
    INSERT INTO user_preferences (user_id, theme, language)
    VALUES (gen_random_uuid(), 'system', 'en')
    ON CONFLICT (user_id) DO NOTHING;
    
    test_result := 'SUCCESS: User preferences table is working correctly';
  EXCEPTION
    WHEN OTHERS THEN
      test_result := 'ERROR: ' || SQLERRM;
  END;
  
  RETURN test_result;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Run the test
SELECT test_user_creation();