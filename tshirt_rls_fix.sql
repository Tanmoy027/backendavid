-- FIXED RLS SOLUTION for Tshirts - Drops existing policies first

ALTER TABLE tshirts DISABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies first
DROP POLICY IF EXISTS "Public can view tshirts" ON tshirts;
DROP POLICY IF EXISTS "Authenticated users can manage tshirts" ON tshirts;
DROP POLICY IF EXISTS "Enable all operations for authenticated users" ON tshirts;
DROP POLICY IF EXISTS "Allow authenticated users full access" ON tshirts;

-- Drop storage policies for tshirt bucket
DROP POLICY IF EXISTS "Public Access tshirt" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload tshirt" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update tshirt" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete tshirt" ON storage.objects;

-- Ensure tshirt bucket exists
INSERT INTO storage.buckets (id, name, public)
VALUES ('tshirt', 'tshirt', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create storage policies for tshirt bucket
CREATE POLICY "Public Access tshirt" ON storage.objects
    FOR SELECT USING (bucket_id = 'tshirt');
CREATE POLICY "Authenticated users can upload tshirt" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'tshirt' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can update tshirt" ON storage.objects
    FOR UPDATE USING (bucket_id = 'tshirt' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can delete tshirt" ON storage.objects
    FOR DELETE USING (bucket_id = 'tshirt' AND auth.role() = 'authenticated');

-- Re-enable RLS and create table policies
ALTER TABLE tshirts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view tshirts" ON tshirts FOR SELECT USING (true);
CREATE POLICY "Authenticated users can manage tshirts" ON tshirts FOR ALL USING (auth.role() = 'authenticated');

-- Test insert
INSERT INTO tshirts (title, description, category, image_url, is_active, order_index)
VALUES ('Final Test', 'This should work', 'design', 'test.jpg', true, 999);

-- Clean up
DELETE FROM tshirts WHERE title = 'Final Test';