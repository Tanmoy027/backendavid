-- Fix RLS policy for recent_works table
-- Run this in your Supabase SQL Editor

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON recent_works;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON recent_works;

-- Create new policy that allows all operations for authenticated users
CREATE POLICY "Enable all operations for authenticated users" ON recent_works
    FOR ALL USING (true);

-- If you want to be more specific, you can use this instead:
-- CREATE POLICY "Enable all operations for authenticated users" ON recent_works
--     FOR ALL USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Also add the image_path column if not exists
ALTER TABLE recent_works 
ADD COLUMN IF NOT EXISTS image_path TEXT;

-- Add comment to the column
COMMENT ON COLUMN recent_works.image_path IS 'File path in Supabase storage for image deletion';