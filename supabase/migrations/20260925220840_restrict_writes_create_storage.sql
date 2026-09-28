/*
# Restrict listing writes to admin only + create storage bucket

1. Security changes
- Remove INSERT/UPDATE/DELETE policies from listings table.
- Keep only public SELECT policy.
- Writes will be handled exclusively through the admin edge function using the service role key, which bypasses RLS.
- This prevents unauthorized users from creating/modifying/deleting listings directly.

2. Storage
- Create public storage bucket "listings" for listing images.
- Allow public read access.
- Allow anon write access (admin uploads via frontend with anon key).
*/

-- Drop write policies - only admin edge function (service role) can write
DROP POLICY IF EXISTS "anon_insert_listings" ON listings;
DROP POLICY IF EXISTS "anon_update_listings" ON listings;
DROP POLICY IF EXISTS "anon_delete_listings" ON listings;

-- Create storage bucket for listing images
INSERT INTO storage.buckets (id, name, public)
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: public read, anon write (admin uploads)
DROP POLICY IF EXISTS "public_read_listings_storage" ON storage.objects;
CREATE POLICY "public_read_listings_storage" ON storage.objects FOR SELECT
  TO anon, authenticated USING (bucket_id = 'listings');

DROP POLICY IF EXISTS "anon_write_listings_storage" ON storage.objects;
CREATE POLICY "anon_write_listings_storage" ON storage.objects FOR INSERT
  TO anon, authenticated WITH CHECK (bucket_id = 'listings');

DROP POLICY IF EXISTS "anon_update_listings_storage" ON storage.objects;
CREATE POLICY "anon_update_listings_storage" ON storage.objects FOR UPDATE
  TO anon, authenticated USING (bucket_id = 'listings') WITH CHECK (bucket_id = 'listings');

DROP POLICY IF EXISTS "anon_delete_listings_storage" ON storage.objects;
CREATE POLICY "anon_delete_listings_storage" ON storage.objects FOR DELETE
  TO anon, authenticated USING (bucket_id = 'listings');
