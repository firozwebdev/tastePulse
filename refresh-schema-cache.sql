-- Force refresh Supabase schema cache
-- Run this after applying your main schema

-- Verify the profiles table structure
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY ordinal_position;

-- Test inserting into profiles table
DO $$
DECLARE
  test_user_id UUID;
  test_profile_id BIGINT;
BEGIN
  -- Use current user or generate test UUID
  SELECT COALESCE(auth.uid(), gen_random_uuid()) INTO test_user_id;
  
  -- Test insert
  INSERT INTO profiles (
    user_id, 
    name, 
    taste_input, 
    parsed_taste, 
    recommendations
  ) VALUES (
    test_user_id,
    'Test Profile - ' || NOW()::text,
    'Test taste input for schema verification',
    '{"test": "parsed_data"}'::jsonb,
    '{"test": "recommendations_data"}'::jsonb
  ) RETURNING id INTO test_profile_id;
  
  RAISE NOTICE 'SUCCESS: Test profile created with ID %', test_profile_id;
  
  -- Clean up test data
  DELETE FROM profiles WHERE id = test_profile_id;
  RAISE NOTICE 'Test profile cleaned up successfully';
  
EXCEPTION WHEN OTHERS THEN
  RAISE NOTICE 'ERROR: %', SQLERRM;
END $$;

-- Refresh PostgREST schema cache (this forces Supabase to reload the schema)
NOTIFY pgrst, 'reload schema';

-- Alternative method to refresh schema cache
SELECT pg_notify('pgrst', 'reload schema');