-- Debug script to check table structure and policies
-- Run this in Supabase SQL Editor

-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'assets';

-- List all policies on assets table
SELECT * FROM pg_policies WHERE tablename = 'assets';

-- Check table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'assets';

-- Try a test insert (this will help identify the issue)
-- Replace with actual values to test
INSERT INTO assets (category, url, file_type, display_order)
VALUES ('graphics', 'https://test.com/image.jpg', 'image', 0)
RETURNING *;
