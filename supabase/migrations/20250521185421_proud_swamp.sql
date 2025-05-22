/*
  # Create Scholar Cache Table

  1. New Tables
    - `scholar_cache`: Stores cached Google Scholar profile data
      - `id` (uuid, primary key)
      - `url` (text, unique)
      - `data` (jsonb)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policy for service role access
*/

CREATE TABLE IF NOT EXISTS scholar_cache (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url text UNIQUE NOT NULL,
  data jsonb NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE scholar_cache ENABLE ROW LEVEL SECURITY;

-- Allow service role full access
CREATE POLICY "Service role full access"
  ON scholar_cache
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_scholar_cache_url ON scholar_cache(url);
CREATE INDEX IF NOT EXISTS idx_scholar_cache_expires_at ON scholar_cache(expires_at);

-- Add function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_scholar_cache()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  DELETE FROM scholar_cache
  WHERE expires_at < NOW();
END;
$$;