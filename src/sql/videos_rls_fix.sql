-- Drop existing RLS policies if they exist
DROP POLICY IF EXISTS videos_select_policy ON videos;
DROP POLICY IF EXISTS videos_all_policy ON videos;

-- Add video_path column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'videos' AND column_name = 'video_path') THEN
    ALTER TABLE videos ADD COLUMN video_path TEXT;
  END IF;
END
$$;

-- Create policy for public read access (only active videos)
CREATE POLICY videos_select_policy ON videos
  FOR SELECT
  TO public
  USING (is_active = true);

-- Create policy for authenticated users to manage videos
CREATE POLICY videos_all_policy ON videos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Storage bucket RLS policies for videopage

-- Allow public to view files in the videopage bucket
CREATE POLICY videopage_public_select_policy ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'videopage');

-- Allow authenticated users to manage files in the videopage bucket
CREATE POLICY videopage_authenticated_all_policy ON storage.objects
  FOR ALL
  TO authenticated
  USING (bucket_id = 'videopage')
  WITH CHECK (bucket_id = 'videopage');

-- Test insert
INSERT INTO videos (title, description, video_url, video_path, is_active, order_index)
VALUES ('Sample Video', 'This is a sample video description', 'https://example.com/sample-video.mp4', 'videopage/sample-video.mp4', true, 1);

-- Cleanup (comment out if you want to keep the test data)
-- DELETE FROM videos WHERE title = 'Sample Video';