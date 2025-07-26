-- Test bucket access and policies
-- Run this in Supabase SQL Editor

-- Check if the bucket exists and its settings
SELECT * FROM storage.buckets WHERE name = 'homerecentwork';

-- Check bucket policies
SELECT * FROM storage.policies WHERE bucket_id = 'homerecentwork';

-- If no policies exist, create them
-- INSERT INTO storage.policies (id, bucket_id, policy_name, definition)
-- VALUES (
--   gen_random_uuid(),
--   'homerecentwork', 
--   'Allow public access',
--   'FOR SELECT USING (true)'
-- );

-- If bucket doesn't exist, create it
-- INSERT INTO storage.buckets (id, name, public, created_at, updated_at)
-- VALUES (
--   'homerecentwork',
--   'homerecentwork', 
--   true,
--   NOW(),
--   NOW()
-- );