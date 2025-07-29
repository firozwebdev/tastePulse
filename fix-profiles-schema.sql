-- Fix for Profiles Table Schema
-- Run this SQL in your Supabase SQL editor to ensure the profiles table has the correct structure

-- Check if profiles table exists and has the correct structure
DO $
BEGIN
  -- Create profiles table if it doesn't exist
  IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'profiles') THEN
    CREATE TABLE profiles (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      name TEXT NOT NULL,
      taste_input TEXT NOT NULL,
      parsed_taste JSONB NOT NULL DEFAULT '{}',
      recommendations JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    RAISE NOTICE 'Created profiles table';
  END IF;
  
  -- Check if recommendations column exists, if not add it
  IF NOT EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'recommendations'
  ) THEN
    ALTER TABLE profiles ADD COLUMN recommendations JSONB DEFAULT '{}';
    RAISE NOTICE 'Added recommendations column to profiles table';
  END IF;
  
  -- Ensure the column is JSONB type
  IF EXISTS (
    SELECT column_name 
    FROM information_schema.columns 
    WHERE table_name = 'profiles' 
    AND column_name = 'recommendations' 
    AND data_type != 'jsonb'
  ) THEN
    ALTER TABLE profiles ALTER COLUMN recommendations TYPE JSONB USING recommendations::JSONB;
    RAISE NOTICE 'Updated recommendations column type to JSONB';
  END IF;
END $;

-- Enable Row Level Security if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Users can view their own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profiles" ON profiles;
DROP POLICY IF EXISTS "Users can delete their own profiles" ON profiles;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profiles" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles" ON profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance if they don't exist
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles(created_at DESC);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$ language 'plpgsql';

-- Create trigger to automatically update updated_at column
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON profiles TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE profiles_id_seq TO authenticated;

-- Test the profiles table structure
CREATE OR REPLACE FUNCTION test_profiles_table()
RETURNS TEXT AS $
DECLARE
  test_result TEXT;
  test_user_id UUID;
BEGIN
  -- Get a test user ID (use the first authenticated user or generate a random UUID for testing)
  SELECT auth.uid() INTO test_user_id;
  
  IF test_user_id IS NULL THEN
    test_user_id := gen_random_uuid();
  END IF;
  
  -- Test if we can insert into profiles table
  BEGIN
    INSERT INTO profiles (user_id, name, taste_input, parsed_taste, recommendations)
    VALUES (
      test_user_id, 
      'Test Profile', 
      'Test taste input', 
      '{"test": "data"}'::JSONB,
      '{"test": "recommendations"}'::JSONB
    );
    
    -- Clean up the test record
    DELETE FROM profiles WHERE user_id = test_user_id AND name = 'Test Profile';
    
    test_result := 'SUCCESS: Profiles table is working correctly with recommendations column';
  EXCEPTION
    WHEN OTHERS THEN
      test_result := 'ERROR: ' || SQLERRM;
  END;
  
  RETURN test_result;
END;
$ language 'plpgsql' SECURITY DEFINER;

-- Run the test
SELECT test_profiles_table();

-- Show current table structure for verification
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;