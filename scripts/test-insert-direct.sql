-- Test direct insert to see if it works
-- Run this in Supabase SQL Editor

-- First, make sure RLS is disabled
ALTER TABLE assets DISABLE ROW LEVEL SECURITY;

-- Try inserting a test row
INSERT INTO assets (category, url, file_type, display_order, title)
VALUES ('graphics', 'https://glqrxhfycqrogivjplan.supabase.co/storage/v1/object/public/portfolio/graphics/test.jpg', 'image', 999, 'Test Image')
RETURNING *;

-- If that works, check what policies exist
SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE tablename = 'assets';
