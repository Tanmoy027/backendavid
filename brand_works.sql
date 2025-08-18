-- Create brand_works table
CREATE TABLE IF NOT EXISTS brand_works (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  brand_id UUID REFERENCES brands(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_path TEXT,
  video_url TEXT,
  video_path TEXT,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE brand_works ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view brand_works" ON brand_works;
DROP POLICY IF EXISTS "Authenticated users can insert brand_works" ON brand_works;
DROP POLICY IF EXISTS "Authenticated users can update brand_works" ON brand_works;
DROP POLICY IF EXISTS "Authenticated users can delete brand_works" ON brand_works;
DROP POLICY IF EXISTS "Authenticated users can manage brand_works" ON brand_works;

-- Public read access
CREATE POLICY "Public can view brand_works" ON brand_works FOR SELECT USING (true);

-- Authenticated users can manage all operations
CREATE POLICY "Authenticated users can manage brand_works" ON brand_works FOR ALL USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX idx_brand_works_brand_id ON brand_works(brand_id);
CREATE INDEX idx_brand_works_order_index ON brand_works(order_index);

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_brand_works_modtime
    BEFORE UPDATE ON brand_works
    FOR EACH ROW
    EXECUTE PROCEDURE update_modified_column();