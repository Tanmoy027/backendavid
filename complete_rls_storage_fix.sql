-- COMPLETE RLS AND STORAGE FIX (Based on your working example)
-- Run this ENTIRE block in your Supabase SQL Editor

-- 1. Disable RLS temporarily to fix issues
ALTER TABLE recent_works DISABLE ROW LEVEL SECURITY;
ALTER TABLE videos DISABLE ROW LEVEL SECURITY;

-- 2. Ensure storage bucket exists and is public
INSERT INTO storage.buckets (id, name, public) 
VALUES ('homerecentwork', 'homerecentwork', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 3. Drop existing storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- 4. Create storage bucket policies for homerecentwork
CREATE POLICY "Public Access" ON storage.objects 
    FOR SELECT USING (bucket_id = 'homerecentwork');

CREATE POLICY "Authenticated users can upload" ON storage.objects 
    FOR INSERT WITH CHECK (bucket_id = 'homerecentwork' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update" ON storage.objects 
    FOR UPDATE USING (bucket_id = 'homerecentwork' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete" ON storage.objects 
    FOR DELETE USING (bucket_id = 'homerecentwork' AND auth.role() = 'authenticated');

-- 5. Re-enable RLS with proper policies for tables
ALTER TABLE recent_works ENABLE ROW LEVEL SECURITY;
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- 6. Drop existing table policies
DROP POLICY IF EXISTS "Public can view recent_works" ON recent_works;
DROP POLICY IF EXISTS "Public can view videos" ON videos;
DROP POLICY IF EXISTS "Authenticated users can manage recent_works" ON recent_works;
DROP POLICY IF EXISTS "Authenticated users can manage videos" ON videos;

-- 7. Allow public read access to recent_works and videos
CREATE POLICY "Public can view recent_works" ON recent_works 
    FOR SELECT USING (true);

CREATE POLICY "Public can view videos" ON videos 
    FOR SELECT USING (true);

-- 8. Allow authenticated users to manage recent_works and videos (for admin)
CREATE POLICY "Authenticated users can manage recent_works" ON recent_works 
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage videos" ON videos 
    FOR ALL USING (auth.role() = 'authenticated');

-- 9. Verify bucket exists and is public
SELECT id, name, public FROM storage.buckets WHERE name = 'homerecentwork';

-- 10. Verify table RLS is enabled with policies
SELECT tablename, rowsecurity FROM pg_tables WHERE tablename IN ('recent_works', 'videos');

-- 11. Test insert (should work now)
INSERT INTO recent_works (title, description, category, image_url, is_active, order_index) 
VALUES ('RLS Fix Test', 'This should work now', 'poster', 'test.jpg', true, 999);

-- 12. Verify the test worked
SELECT * FROM recent_works WHERE title = 'RLS Fix Test';

-- 13. Clean up test data
DELETE FROM recent_works WHERE title = 'RLS Fix Test';