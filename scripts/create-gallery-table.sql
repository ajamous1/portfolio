-- Create pics table for Tiny Canvas gallery
CREATE TABLE IF NOT EXISTS pics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Anonymous',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  month_key TEXT NOT NULL -- Format: "YYYY-MM" for monthly expiration
);

-- Enable Row Level Security (RLS)
ALTER TABLE pics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read pics
CREATE POLICY "Allow public read access" ON pics
  FOR SELECT USING (true);

-- Create policy to allow INSERT for anyone (anon role)
CREATE POLICY "Allow insert pics" ON pics
  FOR INSERT WITH CHECK (true);

-- Create policy to allow DELETE for anyone (to remove oldest when limit reached)
CREATE POLICY "Allow delete pics" ON pics
  FOR DELETE USING (true);

-- Create index for faster queries
CREATE INDEX idx_pics_month_key ON pics(month_key);
CREATE INDEX idx_pics_created_at ON pics(created_at DESC);
