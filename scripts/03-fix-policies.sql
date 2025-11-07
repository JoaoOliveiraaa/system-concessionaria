-- This script safely creates RLS policies only if they don't already exist
-- It can be run multiple times without errors

DO $$
BEGIN
  -- Create profiles table if it doesn't exist
  CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Enable RLS on profiles
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  
  -- Create policies safely using IF NOT EXISTS pattern with exception handling
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can view their own profile'
  ) THEN
    CREATE POLICY "Users can view their own profile" ON profiles
      FOR SELECT USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can update their own profile'
  ) THEN
    CREATE POLICY "Users can update their own profile" ON profiles
      FOR UPDATE USING (auth.uid() = id);
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'vehicles' AND policyname = 'Admins can insert vehicles'
  ) THEN
    CREATE POLICY "Admins can insert vehicles" ON vehicles
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'vehicles' AND policyname = 'Admins can update vehicles'
  ) THEN
    CREATE POLICY "Admins can update vehicles" ON vehicles
      FOR UPDATE USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'vehicles' AND policyname = 'Admins can delete vehicles'
  ) THEN
    CREATE POLICY "Admins can delete vehicles" ON vehicles
      FOR DELETE USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'media' AND policyname = 'Admins can insert media'
  ) THEN
    CREATE POLICY "Admins can insert media" ON media
      FOR INSERT WITH CHECK (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'media' AND policyname = 'Admins can delete media'
  ) THEN
    CREATE POLICY "Admins can delete media" ON media
      FOR DELETE USING (
        EXISTS (
          SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
        )
      );
  END IF;
  
  RAISE NOTICE 'RLS policies configured successfully';
END $$;
