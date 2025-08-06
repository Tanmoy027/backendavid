-- FIXED RLS SOLUTION for Brands - Drops existing policies first

ALTER TABLE brands DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Public can view brands" ON brands;
DROP POLICY IF EXISTS "Authenticated users can manage brands" ON brands;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON brands;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON brands;

-- Drop storage policies for brandspage bucket
DROP POLICY IF EXISTS "Public Access brandspage" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload brandspage" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update brandspage" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete brandspage" ON storage.objects;

-- Ensure brandspage bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('brandspage', 'brandspage', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create storage policies for brandspage bucket
CREATE POLICY "Public Access brandspage" ON storage.objects
    FOR SELECT USING (bucket_id = 'brandspage');
CREATE POLICY "Authenticated users can upload brandspage" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'brandspage' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update brandspage" ON storage.objects
    FOR UPDATE USING (bucket_id = 'brandspage' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete brandspage" ON storage.objects
    FOR DELETE USING (bucket_id = 'brandspage' AND auth.role() = 'authenticated');

-- Re-enable RLS and create table policies
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage brands" ON brands FOR ALL USING (auth.role() = 'authenticated');

-- Test insert
INSERT INTO brands (title, description, category, image_url, is_active, order_index)
VALUES ('Final Test', 'This should work', 'design', 'test.jpg', true, 999);

-- Clean up
DELETE FROM brands WHERE title = 'Final Test';