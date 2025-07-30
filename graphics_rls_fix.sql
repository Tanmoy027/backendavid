-- FIXED RLS SOLUTION for Graphics - Drops existing policies first

ALTER TABLE graphics DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Public can view graphics" ON graphics;
DROP POLICY IF EXISTS "Authenticated users can manage graphics" ON graphics;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON graphics;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON graphics;

-- Drop storage policies
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete" ON storage.objects;

-- Ensure bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('graphicdesignpage', 'graphicdesignpage', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create storage policies
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'graphicdesignpage');
CREATE POLICY "Authenticated users can upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'graphicdesignpage' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update" ON storage.objects
    FOR UPDATE USING (bucket_id = 'graphicdesignpage' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete" ON storage.objects
    FOR DELETE USING (bucket_id = 'graphicdesignpage' AND auth.role() = 'authenticated');

-- Re-enable RLS and create table policies
ALTER TABLE graphics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view graphics" ON graphics FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage graphics" ON graphics FOR ALL USING (auth.role() = 'authenticated');

-- Test insert
INSERT INTO graphics (title, description, category, image_url, is_active, order_index)
VALUES ('Final Test', 'This should work', 'poster', 'test.jpg', true, 999);

-- Clean up
DELETE FROM graphics WHERE title = 'Final Test';