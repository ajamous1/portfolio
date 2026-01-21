-- Fix INSERT policy for assets table
-- Run this in Supabase SQL Editor

-- First, drop any existing INSERT policies
DROP POLICY IF EXISTS "Allow insert assets" ON assets;
DROP POLICY IF EXISTS "Allow public insert" ON assets;
DROP POLICY IF EXISTS "Allow insert" ON assets;

-- Create the INSERT policy
CREATE POLICY "Allow insert assets" ON assets
  FOR INSERT 
  WITH CHECK (true);

-- Verify RLS is enabled
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Verify the policy was created
SELECT * FROM pg_policies WHERE tablename = 'assets';
