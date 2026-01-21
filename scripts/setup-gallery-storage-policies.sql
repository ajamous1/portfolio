-- Set up Storage policies for gallery folder in portfolio bucket
-- This allows anonymous users to upload and read gallery drawings

-- Allow INSERT (upload) for gallery folder
CREATE POLICY "Allow anon uploads gallery" ON storage.objects
  FOR INSERT
  TO anon
  WITH CHECK (bucket_id = 'portfolio' AND (storage.foldername(name))[1] = 'gallery');

-- Allow SELECT (read/download) for gallery folder
CREATE POLICY "Allow anon reads gallery" ON storage.objects
  FOR SELECT
  TO anon
  USING (bucket_id = 'portfolio' AND (storage.foldername(name))[1] = 'gallery');

-- Allow DELETE for gallery folder (to remove oldest when limit reached)
CREATE POLICY "Allow anon delete gallery" ON storage.objects
  FOR DELETE
  TO anon
  USING (bucket_id = 'portfolio' AND (storage.foldername(name))[1] = 'gallery');
