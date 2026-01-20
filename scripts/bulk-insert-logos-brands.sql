-- Bulk insert logos-brands images
-- Run this in Supabase SQL Editor
-- Replace YOUR_PROJECT_URL with your actual Supabase project URL

INSERT INTO assets (category, url, file_type, display_order, title)
VALUES
  ('logos-brands', 'https://glqrxhfycqrogivjplan.supabase.co/storage/v1/object/public/portfolio-assets/logos-brands/2025allstar.png', 'image', 0, '2025allstar'),
  ('logos-brands', 'https://glqrxhfycqrogivjplan.supabase.co/storage/v1/object/public/portfolio-assets/logos-brands/calipr.png', 'image', 1, 'calipr'),
  ('logos-brands', 'https://glqrxhfycqrogivjplan.supabase.co/storage/v1/object/public/portfolio-assets/logos-brands/hawkstalk.png', 'image', 2, 'hawkstalk'),
  ('logos-brands', 'https://glqrxhfycqrogivjplan.supabase.co/storage/v1/object/public/portfolio-assets/logos-brands/kwilttlogo.png', 'image', 3, 'kwilttlogo'),
  ('logos-brands', 'https://glqrxhfycqrogivjplan.supabase.co/storage/v1/object/public/portfolio-assets/logos-brands/msl.png', 'image', 4, 'msl'),
  ('logos-brands', 'https://glqrxhfycqrogivjplan.supabase.co/storage/v1/object/public/portfolio-assets/logos-brands/nextwave.png', 'image', 5, 'nextwave'),
  ('logos-brands', 'https://glqrxhfycqrogivjplan.supabase.co/storage/v1/object/public/portfolio-assets/logos-brands/techhubpfp.png', 'image', 6, 'techhubpfp'),
  ('logos-brands', 'https://glqrxhfycqrogivjplan.supabase.co/storage/v1/object/public/portfolio-assets/logos-brands/wolvespluglogo%20(1).png', 'image', 7, 'wolvespluglogo');
