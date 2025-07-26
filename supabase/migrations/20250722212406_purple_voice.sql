/*
  # Portfolio Management System Database Schema

  1. New Tables
    - `videos`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `video_url` (text)
      - `thumbnail_url` (text, optional)
      - `is_active` (boolean, default true)
      - `order_index` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `recent_works`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)
      - `category` (text) - 'poster', 'video', 'tshirt'
      - `price` (text, optional)
      - `is_active` (boolean, default true)
      - `order_index` (integer, default 0)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin access
*/

-- Create videos table
CREATE TABLE IF NOT EXISTS videos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  video_url text NOT NULL,
  thumbnail_url text,
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recent_works table
CREATE TABLE IF NOT EXISTS recent_works (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  category text NOT NULL CHECK (category IN ('poster', 'video', 'tshirt')),
  price text,
  is_active boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE recent_works ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Videos are viewable by everyone"
  ON videos
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Recent works are viewable by everyone"
  ON recent_works
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Create policies for authenticated admin access (full CRUD)
CREATE POLICY "Authenticated users can manage videos"
  ON videos
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can manage recent works"
  ON recent_works
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS videos_active_order_idx ON videos (is_active, order_index);
CREATE INDEX IF NOT EXISTS recent_works_active_category_order_idx ON recent_works (is_active, category, order_index);

-- Insert sample data for videos
INSERT INTO videos (title, description, video_url, is_active, order_index) VALUES
('Portfolio Showcase', 'A showcase of my latest video editing work', '/vedio editing/youtube.mp4', true, 1),
('Creative Process', 'Behind the scenes of my creative process', '/vedio editing/2.mp4', true, 2);

-- Insert sample data for recent works
INSERT INTO recent_works (title, description, image_url, category, price, is_active, order_index) VALUES
('Adidas Poster Design', 'Premium poster design for Adidas campaign', '/vedio editing/design5.jpg', 'poster', '$15', true, 1),
('Creative Video Edit', 'Professional video editing for social media', '/vedio editing/2.mp4', 'video', '$25', true, 2),
('Custom T-Shirt Design', 'Unique t-shirt design for fashion brand', '/vedio editing/tshirt.jpg', 'tshirt', '$20', true, 3),
('Brand Identity Design', 'Complete brand identity package', '/vedio editing/design.jpg', 'poster', '$30', true, 4),
('Product Showcase Video', 'Dynamic product showcase video', '/vedio editing/2.mp4', 'video', '$35', true, 5),
('Vintage T-Shirt Collection', 'Retro-style t-shirt design collection', '/vedio editing/tshirt.jpg', 'tshirt', '$18', true, 6);