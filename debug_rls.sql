-- Debug RLS policies and fix them
-- Run this in your Supabase SQL Editor

-- First, let's check current RLS status and policies
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'recent_works';

-- Check existing policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'recent_works';

-- Disable RLS temporarily to test
ALTER TABLE recent_works DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS enabled, create a more permissive policy
-- ALTER TABLE recent_works ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON recent_works;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON recent_works;

-- Create a simple policy that allows everything (for testing)
-- CREATE POLICY "allow_all" ON recent_works FOR ALL USING (true) WITH CHECK (true);

-- Alternative: Create separate policies for each operation
-- CREATE POLICY "allow_select" ON recent_works FOR SELECT USING (true);
-- CREATE POLICY "allow_insert" ON recent_works FOR INSERT WITH CHECK (true);
-- CREATE POLICY "allow_update" ON recent_works FOR UPDATE USING (true) WITH CHECK (true);
-- CREATE POLICY "allow_delete" ON recent_works FOR DELETE USING (true);