-- TastePulse Database Schema for Supabase
-- This file contains the SQL schema for the TastePulse application

-- Enable Row Level Security (RLS) for all tables
-- This ensures users can only access their own data

-- Create profiles table for storing user taste profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  taste_input TEXT NOT NULL,
  parsed_taste JSONB NOT NULL DEFAULT '{}',
  recommendations JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create saved_recommendations table for storing individual saved recommendations
CREATE TABLE IF NOT EXISTS saved_recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  recommendation_data JSONB NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_preferences table for storing user settings and preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme TEXT DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'es', 'bn')),
  notifications_enabled BOOLEAN DEFAULT true,
  public_profile BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create user_sessions table for tracking user activity (optional)
CREATE TABLE IF NOT EXISTS user_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  session_data JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() + INTERVAL '30 days'
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles table
CREATE POLICY "Users can view their own profiles" ON profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profiles" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profiles" ON profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profiles" ON profiles
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for saved_recommendations table
CREATE POLICY "Users can view their own saved recommendations" ON saved_recommendations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own saved recommendations" ON saved_recommendations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own saved recommendations" ON saved_recommendations
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own saved recommendations" ON saved_recommendations
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_preferences table
CREATE POLICY "Users can view their own preferences" ON user_preferences
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences" ON user_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences" ON user_preferences
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own preferences" ON user_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Create RLS policies for user_sessions table
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sessions" ON user_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON user_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON user_sessions
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_user_id_idx ON profiles(user_id);
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON profiles(created_at DESC);
CREATE INDEX IF NOT EXISTS saved_recommendations_user_id_idx ON saved_recommendations(user_id);
CREATE INDEX IF NOT EXISTS saved_recommendations_profile_id_idx ON saved_recommendations(profile_id);
CREATE INDEX IF NOT EXISTS saved_recommendations_category_idx ON saved_recommendations(category);
CREATE INDEX IF NOT EXISTS user_preferences_user_id_idx ON user_preferences(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_user_id_idx ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS user_sessions_expires_at_idx ON user_sessions(expires_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON user_preferences 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create a function to automatically create user preferences when a user signs up
CREATE OR REPLACE FUNCTION create_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically create user preferences on user signup
CREATE TRIGGER create_user_preferences_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION create_user_preferences();

-- Create a function to clean up expired sessions
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions WHERE expires_at < NOW();
END;
$$ language 'plpgsql';

-- Create demo user data (optional - for development/testing)
-- Note: This should be run manually in your Supabase dashboard, not in production

-- Insert demo user preferences (run this after creating the demo user in Supabase Auth)
-- INSERT INTO user_preferences (user_id, theme, language, notifications_enabled, public_profile)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'demo@example.com'),
--   'system',
--   'en',
--   true,
--   true
-- );

-- Insert sample taste profiles for demo user
-- INSERT INTO profiles (user_id, name, taste_input, parsed_taste, recommendations)
-- VALUES (
--   (SELECT id FROM auth.users WHERE email = 'demo@example.com'),
--   'Demo Profile 1',
--   'I love lo-fi beats and Japanese ramen',
--   '{"music": "lo-fi beats", "food": "Japanese ramen"}',
--   '{"music": [{"name": "Nujabes", "match": 95}], "food": [{"name": "Ichiran Ramen", "match": 96}]}'
-- );

-- Create a view for user profile statistics (optional)
CREATE OR REPLACE VIEW user_profile_stats AS
SELECT 
  u.id as user_id,
  u.email,
  COUNT(p.id) as profile_count,
  COUNT(sr.id) as saved_recommendations_count,
  MAX(p.created_at) as last_profile_created,
  up.theme,
  up.language,
  up.public_profile
FROM auth.users u
LEFT JOIN profiles p ON u.id = p.user_id
LEFT JOIN saved_recommendations sr ON u.id = sr.user_id
LEFT JOIN user_preferences up ON u.id = up.user_id
GROUP BY u.id, u.email, up.theme, up.language, up.public_profile;

-- Grant necessary permissions (adjust as needed for your setup)
-- GRANT USAGE ON SCHEMA public TO authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create a function to get user profile summary
CREATE OR REPLACE FUNCTION get_user_profile_summary(user_uuid UUID)
RETURNS TABLE (
  profile_count BIGINT,
  saved_count BIGINT,
  categories_count BIGINT,
  avg_match_percentage NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(DISTINCT p.id) as profile_count,
    COUNT(DISTINCT sr.id) as saved_count,
    COUNT(DISTINCT jsonb_object_keys(p.parsed_taste)) as categories_count,
    COALESCE(AVG((sr.recommendation_data->>'match')::NUMERIC), 0) as avg_match_percentage
  FROM profiles p
  LEFT JOIN saved_recommendations sr ON p.user_id = sr.user_id
  WHERE p.user_id = user_uuid;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Create a function to search profiles by content (for future features)
CREATE OR REPLACE FUNCTION search_profiles(search_term TEXT, user_uuid UUID)
RETURNS TABLE (
  id UUID,
  name TEXT,
  taste_input TEXT,
  parsed_taste JSONB,
  created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.taste_input,
    p.parsed_taste,
    p.created_at
  FROM profiles p
  WHERE p.user_id = user_uuid
    AND (
      p.name ILIKE '%' || search_term || '%' OR
      p.taste_input ILIKE '%' || search_term || '%' OR
      p.parsed_taste::TEXT ILIKE '%' || search_term || '%'
    )
  ORDER BY p.created_at DESC;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE profiles IS 'Stores user taste profiles with parsed data and recommendations';
COMMENT ON TABLE saved_recommendations IS 'Stores individual recommendations saved by users';
COMMENT ON TABLE user_preferences IS 'Stores user application preferences and settings';
COMMENT ON TABLE user_sessions IS 'Tracks user sessions for analytics and security';

COMMENT ON FUNCTION get_user_profile_summary IS 'Returns summary statistics for a user profile';
COMMENT ON FUNCTION search_profiles IS 'Searches user profiles by text content';
COMMENT ON FUNCTION cleanup_expired_sessions IS 'Removes expired user sessions from the database';