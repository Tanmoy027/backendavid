CREATE TABLE tshirts (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  image_path TEXT,
  category VARCHAR(100) DEFAULT 'custom',
  is_active BOOLEAN DEFAULT true,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE tshirts ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON tshirts
  FOR SELECT USING (true);

-- Create policies for authenticated users (admin) to manage
CREATE POLICY "Allow authenticated users to insert" ON tshirts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update" ON tshirts
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete" ON tshirts
  FOR DELETE USING (auth.role() = 'authenticated');

-- Create index for better performance
CREATE INDEX idx_tshirts_order_active ON tshirts(order_index, is_active);
CREATE INDEX idx_tshirts_category ON tshirts(category);