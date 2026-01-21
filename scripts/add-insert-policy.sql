-- Add INSERT policy for assets table
-- Run this in Supabase SQL Editor to enable bulk uploads

-- Allow INSERT for anyone (using anon key)
-- For production, consider restricting this to authenticated users only
CREATE POLICY "Allow insert assets" ON assets
  FOR INSERT WITH CHECK (true);
