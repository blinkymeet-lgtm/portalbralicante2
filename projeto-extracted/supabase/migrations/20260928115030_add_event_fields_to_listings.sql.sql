-- Add event-specific fields to listings table
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS event_date text,
  ADD COLUMN IF NOT EXISTS event_time text,
  ADD COLUMN IF NOT EXISTS event_end_date text,
  ADD COLUMN IF NOT EXISTS event_location text,
  ADD COLUMN IF NOT EXISTS event_price text,
  ADD COLUMN IF NOT EXISTS event_age text,
  ADD COLUMN IF NOT EXISTS event_organizer text,
  ADD COLUMN IF NOT EXISTS event_tickets_link text;
