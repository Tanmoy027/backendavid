-- SIMPLE SOLUTION: Create a function that bypasses RLS
-- Run this in Supabase SQL Editor

-- Create a function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION create_recent_work(
  p_title TEXT,
  p_description TEXT,
  p_image_url TEXT,
  p_image_path TEXT,
  p_category TEXT,
  p_is_active BOOLEAN DEFAULT true,
  p_order_index INTEGER DEFAULT 0
) RETURNS recent_works
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result recent_works;
BEGIN
  INSERT INTO recent_works (
    title, 
    description, 
    image_url, 
    image_path, 
    category, 
    is_active, 
    order_index,
    created_at,
    updated_at
  ) VALUES (
    p_title,
    p_description,
    p_image_url,
    p_image_path,
    p_category,
    p_is_active,
    p_order_index,
    NOW(),
    NOW()
  ) RETURNING * INTO result;
  
  RETURN result;
END;
$$;

-- Create update function
CREATE OR REPLACE FUNCTION update_recent_work(
  p_id UUID,
  p_title TEXT,
  p_description TEXT,
  p_image_url TEXT,
  p_image_path TEXT,
  p_category TEXT,
  p_is_active BOOLEAN,
  p_order_index INTEGER
) RETURNS recent_works
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result recent_works;
BEGIN
  UPDATE recent_works SET
    title = p_title,
    description = p_description,
    image_url = p_image_url,
    image_path = p_image_path,
    category = p_category,
    is_active = p_is_active,
    order_index = p_order_index,
    updated_at = NOW()
  WHERE id = p_id
  RETURNING * INTO result;
  
  RETURN result;
END;
$$;

-- Create delete function
CREATE OR REPLACE FUNCTION delete_recent_work(p_id UUID) 
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM recent_works WHERE id = p_id;
  RETURN FOUND;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION create_recent_work TO authenticated;
GRANT EXECUTE ON FUNCTION update_recent_work TO authenticated;
GRANT EXECUTE ON FUNCTION delete_recent_work TO authenticated;

-- Test the function
SELECT create_recent_work(
  'Function Test',
  'This should work',
  'test.jpg',
  'test-path',
  'poster',
  true,
  1
);

-- Verify it worked
SELECT * FROM recent_works WHERE title = 'Function Test';

-- Clean up test
SELECT delete_recent_work((SELECT id FROM recent_works WHERE title = 'Function Test'));