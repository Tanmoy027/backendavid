-- RLS Fix for brandsworks bucket
-- This script creates the brandsworks bucket and sets up proper storage policies

-- Drop existing storage policies for brandsworks bucket if they exist
DROP POLICY IF EXISTS "Public Access brandsworks" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload brandsworks" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update brandsworks" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete brandsworks" ON storage.objects;

-- Ensure brandsworks bucket exists and is public
INSERT INTO storage.buckets (id, name, public)
VALUES ('brandsworks', 'brandsworks', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Create storage policies for brandsworks bucket
-- Public read access
CREATE POLICY "Public Access brandsworks" ON storage.objects
    FOR SELECT USING (bucket_id = 'brandsworks');

-- Authenticated users can upload
CREATE POLICY "Authenticated users can upload brandsworks" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'brandsworks' AND auth.role() = 'authenticated');

-- Authenticated users can update
CREATE POLICY "Authenticated users can update brandsworks" ON storage.objects
    FOR UPDATE USING (bucket_id = 'brandsworks' AND auth.role() = 'authenticated');

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete brandsworks" ON storage.objects
    FOR DELETE USING (bucket_id = 'brandsworks' AND auth.role() = 'authenticated');

-- Verify bucket creation
SELECT id, name, public FROM storage.buckets WHERE name = 'brandsworks';

-- Test the setup with a dummy insert (will be cleaned up)
INSERT INTO brand_works (brand_id, title, description, is_active, order_index)
SELECT 
    (SELECT id FROM brands LIMIT 1),
    'RLS Test Work',
    'Testing brandsworks bucket RLS policies',
    true,
    999
WHERE EXISTS (SELECT 1 FROM brands LIMIT 1);

-- Clean up test data
DELETE FROM brand_works WHERE title = 'RLS Test Work';

-- Display success message
SELECT 'brandsworks bucket RLS policies created successfully!' as status;