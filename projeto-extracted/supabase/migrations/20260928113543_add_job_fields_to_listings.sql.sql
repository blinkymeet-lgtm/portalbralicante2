-- Add job-specific fields to listings table
ALTER TABLE listings
  ADD COLUMN IF NOT EXISTS job_title text,
  ADD COLUMN IF NOT EXISTS job_type text,
  ADD COLUMN IF NOT EXISTS job_salary text,
  ADD COLUMN IF NOT EXISTS job_schedule text,
  ADD COLUMN IF NOT EXISTS job_requirements text,
  ADD COLUMN IF NOT EXISTS job_benefits text,
  ADD COLUMN IF NOT EXISTS job_contact_email text;
