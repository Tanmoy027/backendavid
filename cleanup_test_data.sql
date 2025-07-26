-- Clean up test data from recent_works table
-- Run this in Supabase SQL Editor

-- Remove test entry with placeholder URL
DELETE FROM recent_works WHERE image_url = 'https://via.placeholder.com/300x300.png?text=Test';

-- Check what remains
SELECT id, title, image_url, created_at FROM recent_works ORDER BY created_at DESC;