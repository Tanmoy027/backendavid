-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  image_path TEXT,
  category TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable RLS
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public can view brands" ON brands FOR SELECT USING (true);

-- Authenticated users can insert
CREATE POLICY "Authenticated users can insert brands" ON brands FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Authenticated users can update
CREATE POLICY "Authenticated users can update brands" ON brands FOR UPDATE USING (auth.role() = 'authenticated');

-- Authenticated users can delete
CREATE POLICY "Authenticated users can delete brands" ON brands FOR DELETE USING (auth.role() = 'authenticated');

-- Indexes for performance
CREATE INDEX idx_brands_category ON brands(category);
CREATE INDEX idx_brands_order_index ON brands(order_index);