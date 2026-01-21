# Supabase Setup Guide

## Step 1: Create Supabase Account & Project

1. Go to https://supabase.com and sign up (free)
2. Create a new project
3. Wait for the database to initialize (~2 minutes)

## Step 2: Set Up Database Table

In Supabase Dashboard → SQL Editor, run this SQL:

```sql
-- Create assets table
CREATE TABLE assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL CHECK (category IN ('graphics', 'illustrations', 'motion-graphics', 'videos', 'logos-brands', 'misc')),
  title TEXT,
  description TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  file_type TEXT NOT NULL CHECK (file_type IN ('image', 'video')),
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security (RLS) but allow public read access
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read assets
CREATE POLICY "Allow public read access" ON assets
  FOR SELECT USING (true);

-- Create policy to allow INSERT for bulk uploads (using anon key)
-- Note: For production, consider restricting this to authenticated users
CREATE POLICY "Allow insert assets" ON assets
  FOR INSERT WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX idx_assets_category ON assets(category);
CREATE INDEX idx_assets_display_order ON assets(display_order);
```

## Step 3: Set Up Storage Bucket

1. Go to **Storage** → **Create Bucket**
2. Name: `portfolio`
3. **Public**: Yes (check this!)
4. Click **Create bucket**

Then create these folders inside the bucket:
- `graphics/`
- `illustrations/`
- `motion-graphics/`
- `videos/`
- `logos-brands/`
- `misc/`

### Set Up Storage Policies (for drag-and-drop uploads)

To enable drag-and-drop uploads from your website, you need to create storage policies. **Run this SQL in SQL Editor:**

```sql
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
```

**Or use the UI method:**
1. Go to **Storage** → **Policies**
2. Select `portfolio` bucket
3. Click **New Policy** → **Create a policy from scratch**
4. Name: `Allow anon uploads`
5. Allowed operation: `INSERT`
6. Target roles: `anon`
7. Policy definition: Use this SQL:
   ```sql
   (bucket_id = 'portfolio')
   ```
8. Click **Review** → **Save policy**

**Note**: The SQL method above is faster and sets up both INSERT and SELECT policies at once.

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to **Settings** → **API**
   - Copy the **Project URL** → paste as `VITE_SUPABASE_URL`
   - Copy the **anon public** key (NOT the service_role key!) → paste as `VITE_SUPABASE_ANON_KEY`
   - ⚠️ **CRITICAL**: Never use the `service_role` key in the browser - it's a security risk!

3. Update `.env.local` with your actual values

## Step 5: Upload & Manage Files

### Upload Files:

1. Go to **Storage** → **portfolio**
2. Navigate to the appropriate folder (e.g., `graphics/`)
3. Click **Upload file** and select your image/video
4. After upload, click on the file to get its **Public URL**

### Add to Database:

1. Go to **Table Editor** → **assets**
2. Click **Insert row** (or use the + button)
3. Fill in the fields:
   - **category**: `graphics` (or `illustrations`, `motion-graphics`, `videos`, `logos-brands`, `misc`)
   - **url**: Paste the Public URL from Storage
   - **file_type**: `image` or `video`
   - **display_order**: `0`, `1`, `2`, etc. (controls the order they appear)
   - **title**: (optional) Name of the piece
   - **description**: (optional) Description
   - **thumbnail_url**: (optional) For videos, a thumbnail image URL
4. Click **Save**

### Reorder Items:

Change the `display_order` field in the Table Editor to control the order. Lower numbers appear first.

### Delete Items:

Click the row in Table Editor and use the delete button, or delete the file from Storage.

## Step 6: Set Up Tiny Canvas Gallery (Optional)

If you want the Tiny Canvas gallery to be persistent and visible to all users:

1. **Create the gallery table** - Run this SQL in SQL Editor:
   ```sql
   -- See scripts/create-gallery-table.sql
   ```

2. **Create gallery folder in Storage**:
   - Go to **Storage** → **portfolio** bucket
   - Click **New Folder**
   - Name: `gallery`
   - Click **Create**

3. **Set up storage policies for gallery** - Run this SQL in SQL Editor:
   ```sql
   -- See scripts/setup-gallery-storage-policies.sql
   ```

This will allow users to upload drawings that are visible to everyone and persist across sessions.

## Benefits

✅ **Free tier**: 1GB storage, 2GB bandwidth/month  
✅ **Built-in admin UI**: Easy file management  
✅ **No code changes**: Just upload and add to database  
✅ **Fast CDN**: Automatic CDN delivery  
✅ **Scalable**: Upgrade when needed  

## Troubleshooting

### 401 Unauthorized Error

If you see `401 Unauthorized` errors in the console, it means the RLS policy isn't set up correctly:

1. **Verify the table exists:**
   - Go to **Table Editor** → Check if `assets` table exists
   - If not, run the SQL from Step 2

2. **Check RLS is enabled:**
   - Go to **Table Editor** → Click on `assets` table
   - Look for "RLS Enabled" badge (should be green)
   - If not enabled, run: `ALTER TABLE assets ENABLE ROW LEVEL SECURITY;`

3. **Verify the policy exists:**
   - Go to **Authentication** → **Policies**
   - Select `assets` table from dropdown
   - You should see a policy named "Allow public read access"
   - If missing, run this SQL:
     ```sql
     CREATE POLICY "Allow public read access" ON assets
       FOR SELECT USING (true);
     ```

4. **Check your API key:**
   - Go to **Settings** → **API**
   - Make sure you're using the **anon/public** key (not the service_role key)
   - Copy it again and update `.env.local`

### Other Common Issues

- **No assets showing?** Check that:
  - Environment variables are set correctly
  - RLS policy is created (Step 2)
  - Storage bucket is public
  - URLs in database are correct
  - Restart your dev server after changing `.env.local`

- **404 Not Found?** The `assets` table doesn't exist. Run the SQL from Step 2.

- **CORS errors?** Make sure your Supabase project allows requests from your domain (Settings → API → CORS)

## Uploading Files

Yes! Supabase Storage supports drag-and-drop directly in the dashboard:

1. Go to **Storage** → **portfolio**
2. Navigate to the folder you want (e.g., `graphics/`)
3. **Drag and drop** files directly into the folder, or click **Upload file**
4. After upload, click on the file to get its **Public URL**
5. Add the file to the database (see Step 5 in main guide)

## OneDrive Videos Setup

For the Videos section, you can use OneDrive to save on Supabase storage costs.

### Getting OneDrive Embed URLs:

1. **Upload your video to OneDrive**
2. **Right-click the video file** → Select **"Embed"**
3. **Copy the iframe src URL** (looks like: `https://onedrive.live.com/embed?resid=...&authkey=...&em=2`)
4. **Add to database**:
   - Go to **Table Editor** → **assets**
   - Insert row with:
     - `category`: `videos`
     - `url`: Paste the embed URL from step 3
     - `file_type`: `video`
     - `display_order`: `0`, `1`, `2`, etc.
     - `title`: (optional)
     - `description`: (optional)

### First Video:

Use this embed URL format:
```
https://onedrive.live.com/embed?resid={FILE_ID}&authkey={AUTH_KEY}&em=2
```

To get the embed URL from your folder link:
1. Open the folder link you provided
2. Click on the video file
3. Right-click → "Embed"
4. Copy the iframe src URL

The gallery will automatically detect OneDrive URLs and display them as embedded videos.
