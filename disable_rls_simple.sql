-- Simple fix: Disable RLS for recent_works table
-- Run this in your Supabase SQL Editor

-- Disable Row Level Security completely for recent_works table
ALTER TABLE recent_works DISABLE ROW LEVEL SECURITY;

-- Also make sure the image_path column exists
ALTER TABLE recent_works 
ADD COLUMN IF NOT EXISTS image_path TEXT;

-- Check if it worked
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'recent_works';