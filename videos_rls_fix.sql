-- videos_rls_fix.sql

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can read videos" ON public.videos;
DROP POLICY IF EXISTS "Authenticated users can manage videos" ON public.videos;

-- Ensure the videopage bucket exists
INSERT INTO storage.buckets (id, name)
VALUES ('videopage', 'videopage')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;

-- Create policies for videopage bucket
CREATE POLICY "Public can view videopage files" ON storage.objects
    FOR SELECT
    USING (bucket_id = 'videopage');

CREATE POLICY "Authenticated users can upload to videopage" ON storage.objects
    FOR INSERT
    WITH CHECK (bucket_id = 'videopage' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update videopage files" ON storage.objects
    FOR UPDATE
    USING (bucket_id = 'videopage' AND auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete videopage files" ON storage.objects
    FOR DELETE
    USING (bucket_id = 'videopage' AND auth.role() = 'authenticated');

-- Re-create table policies
CREATE POLICY "Public can read videos" ON public.videos
    FOR SELECT
    USING (true);

CREATE POLICY "Authenticated users can manage videos" ON public.videos
    FOR ALL
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');

-- Enable RLS if not already
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Test insert (optional, for verification)
INSERT INTO public.videos (title, description, video_url, video_path)
VALUES ('Test Video', 'This is a test', 'test_url', 'test_path');

-- Cleanup test data
DELETE FROM public.videos WHERE title = 'Test Video';