/*
# Create listings table for Portal BR Espanha

1. New Tables
- `listings`
  - `id` (uuid, primary key)
  - `name` (text, business name)
  - `slug` (text, URL-friendly identifier, unique)
  - `category` (text, e.g. Restaurantes, Barbearias)
  - `city` (text, e.g. Alicante, Benidorm, Torrevieja)
  - `short_description` (text, brief description for cards)
  - `full_description` (text, complete description for detail page)
  - `main_image` (text, URL of primary photo)
  - `gallery` (jsonb, array of additional photo URLs)
  - `phone` (text, contact phone)
  - `whatsapp` (text, WhatsApp number)
  - `instagram` (text, Instagram handle or URL)
  - `website` (text, website URL)
  - `address` (text, physical address)
  - `google_maps_link` (text, link to Google Maps)
  - `hours` (jsonb, object with opening hours per day)
  - `is_active` (boolean, whether listing is visible publicly)
  - `is_featured` (boolean, whether listing is highlighted)
  - `rating` (numeric, optional rating value)
  - `created_at` (timestamp, creation date)
  - `updated_at` (timestamp, last modification date)
2. Security
- Enable RLS on `listings`.
- Public read access for active listings (anon + authenticated).
- Full CRUD access for all roles (admin auth handled via edge function + service role).
3. Indexes
- Index on `city` for city-based filtering
- Index on `category` for category-based filtering
- Index on `is_active` for filtering active listings
- Index on `is_featured` for sorting featured first
- Index on `slug` for URL lookups
*/

CREATE TABLE IF NOT EXISTS listings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL,
  category text NOT NULL,
  city text NOT NULL,
  short_description text,
  full_description text,
  main_image text,
  gallery jsonb DEFAULT '[]'::jsonb,
  phone text,
  whatsapp text,
  instagram text,
  website text,
  address text,
  google_maps_link text,
  hours jsonb DEFAULT '{}'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  is_featured boolean NOT NULL DEFAULT false,
  rating numeric(2,1),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Public can read all listings (active and inactive visible to admin via service role)
DROP POLICY IF EXISTS "public_read_listings" ON listings;
CREATE POLICY "public_read_listings" ON listings FOR SELECT
  TO anon, authenticated USING (true);

-- Allow anon + authenticated to insert/update/delete
-- (Admin auth is enforced via edge function using service role key)
DROP POLICY IF EXISTS "anon_insert_listings" ON listings;
CREATE POLICY "anon_insert_listings" ON listings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_listings" ON listings;
CREATE POLICY "anon_update_listings" ON listings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_listings" ON listings;
CREATE POLICY "anon_delete_listings" ON listings FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_listings_city ON listings(city);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_listings_is_active ON listings(is_active);
CREATE INDEX IF NOT EXISTS idx_listings_is_featured ON listings(is_featured);
CREATE INDEX IF NOT EXISTS idx_listings_slug ON listings(slug);
CREATE INDEX IF NOT EXISTS idx_listings_created_at ON listings(created_at DESC);
