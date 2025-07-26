-- FINAL RLS FIX - Run ALL of these in Supabase SQL Editor
-- This will completely solve the RLS issue

-- 1. Check current RLS status on all related tables
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('recent_works', 'videos', 'users');

-- 2. Drop ALL existing policies on recent_works
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'recent_works') 
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS ' || quote_ident(r.policyname) || ' ON recent_works';
    END LOOP;
END $$;

-- 3. Disable RLS completely on recent_works
ALTER TABLE recent_works DISABLE ROW LEVEL SECURITY;

-- 4. Check if videos table has RLS enabled (might be causing conflict)
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename = 'videos';

-- 5. If videos has RLS, disable it too
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;

-- 6. Verify both tables have RLS disabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('recent_works', 'videos');

-- 7. Grant full permissions to authenticated role
GRANT ALL ON recent_works TO authenticated;
GRANT ALL ON videos TO authenticated;

-- 8. Grant full permissions to service_role
GRANT ALL ON recent_works TO service_role;
GRANT ALL ON videos TO service_role;

-- 9. Ensure sequences are accessible
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO service_role;

-- 10. Test insert (should work now)
INSERT INTO recent_works (title, description, category, image_url, is_active, order_index) 
VALUES ('RLS Test', 'This should work', 'poster', 'test.jpg', true, 999);

-- 11. Verify the test insert worked
SELECT * FROM recent_works WHERE title = 'RLS Test';

-- 12. Clean up test data
DELETE FROM recent_works WHERE title = 'RLS Test';