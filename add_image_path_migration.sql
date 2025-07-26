-- Add image_path column to recent_works table to store storage file paths
-- Run this in your Supabase SQL Editor

ALTER TABLE recent_works 
ADD COLUMN IF NOT EXISTS image_path TEXT;

-- Add comment to the column
COMMENT ON COLUMN recent_works.image_path IS 'File path in Supabase storage for image deletion';