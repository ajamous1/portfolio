-- Set up Storage policies for portfolio bucket
-- Run this in Supabase SQL Editor

-- Allow INSERT (upload) for anon role
CREATE POLICY "Allow anon uploads" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'portfolio');

-- Allow SELECT (read/download) for anon role  
CREATE POLICY "Allow anon reads" ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'portfolio');

-- Allow UPDATE for anon role (if you want to allow file updates)
CREATE POLICY "Allow anon updates" ON storage.objects
  FOR UPDATE
  TO anon
  USING (bucket_id = 'portfolio')
  WITH CHECK (bucket_id = 'portfolio');

-- Allow DELETE for anon role (if you want to allow file deletion)
CREATE POLICY "Allow anon deletes" ON storage.objects
  FOR DELETE
  TO anon
  USING (bucket_id = 'portfolio');
