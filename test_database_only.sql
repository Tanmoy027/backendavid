-- Test direct insert into recent_works table
-- Run this in Supabase SQL Editor to test if the table itself works

-- Check current table structure
\d recent_works;

-- Try a direct insert
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
    'Test Work',
    'Test Description', 
    'https://example.com/test.jpg',
    'test.jpg',
    'poster',
    true,
    1,
    NOW(),
    NOW()
);

-- Check if it was inserted
SELECT * FROM recent_works WHERE title = 'Test Work';

-- Clean up test data
DELETE FROM recent_works WHERE title = 'Test Work';