-- FIXED RLS SOLUTION - Drops existing policies first
-- Run this ENTIRE block in Supabase SQL Editor

-- 1. Temporarily disable RLS
ALTER TABLE recent_works DISABLE ROW LEVEL SECURITY;
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;

-- 2. Drop all existing table policies first
DROP POLICY IF EXISTS "Public can view recent_works" ON recent_works;
DROP POLICY IF EXISTS "Authenticated users can manage recent_works" ON recent_works;
DROP POLICY IF EXISTS "Public can view videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can manage videos" ON videos;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON recent_works;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON recent_works;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON videos;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON videos;

-- 3. Drop existing storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- 4. Ensure storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('homerecentwork', 'homerecentwork', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 5. Create storage policies for homerecentwork bucket
CREATE POLICY "Public Access" ON storage.objects 
    FOR SELECT USING (bucket_id = 'homerecentwork');

CREATE POLICY "Authenticated users can upload" ON storage.objects 
    FOR INSERT WITH CHECK (bucket_id = 'homerecentwork' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON storage.objects 
    FOR UPDATE USING (bucket_id = 'homerecentwork' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON storage.objects 
    FOR DELETE USING (bucket_id = 'homerecentwork' AND auth.role() = 'authenticated');

-- 6. Re-enable RLS with proper table policies
ALTER TABLE recent_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 7. Create clean table policies
CREATE POLICY "Public can view recent_works" ON recent_works 
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage recent_works" ON recent_works 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Public can view videos" ON videos 
    FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage videos" ON videos 
    FOR ALL USING (auth.role() = 'authenticated');

-- 8. Verify setup
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('recent_works', 'videos');
SELECT id, name, public FROM storage.buckets WHERE name = 'homerecentwork';

-- 9. Test insert (should work now)
INSERT INTO recent_works (title, description, category, image_url, is_active, order_index) 
VALUES ('Final Test', 'This should definitely work', 'poster', 'test.jpg', true, 999);

-- 10. Verify the test worked
SELECT * FROM recent_works WHERE title = 'Final Test';

-- 11. Clean up test data
DELETE FROM recent_works WHERE title = 'Final Test';