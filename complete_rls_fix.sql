-- Complete RLS fix - run ALL of these commands in Supabase SQL Editor
-- Run them one by one to see which one works

-- 1. Check current table info
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'recent_works';

-- 2. Drop all existing policies
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON recent_works;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON recent_works;
DROP POLICY IF EXISTS "allow_all" ON recent_works;

-- 3. Disable RLS completely
ALTER TABLE recent_works DISABLE ROW LEVEL SECURITY;

-- 4. Add image_path column
ALTER TABLE recent_works ADD COLUMN IF NOT EXISTS image_path TEXT;

-- 5. Confirm RLS is disabled
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'recent_works';

-- 6. Test insert (replace with your actual values)
-- INSERT INTO recent_works (title, description, category, image_url, is_active, order_index) 
-- VALUES ('Test', 'Test Description', 'poster', 'test.jpg', true, 1);

-- 7. If RLS must be enabled, use this policy instead:
-- ALTER TABLE recent_works ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "bypass_rls_for_service_role" ON recent_works FOR ALL TO service_role USING (true) WITH CHECK (true);
-- CREATE POLICY "allow_all_operations" ON recent_works FOR ALL USING (true) WITH CHECK (true);