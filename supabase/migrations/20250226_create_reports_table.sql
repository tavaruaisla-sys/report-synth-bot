-- Create reports table
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  title TEXT NOT NULL,
  brand_name TEXT NOT NULL,
  data JSONB NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow public access (anon) for now since auth is not fully implemented
-- Insert
CREATE POLICY "Enable insert for all users" ON reports FOR INSERT TO public WITH CHECK (true);

-- Select
CREATE POLICY "Enable read access for all users" ON reports FOR SELECT TO public USING (true);

-- Update
CREATE POLICY "Enable update for all users" ON reports FOR UPDATE TO public USING (true);

-- Delete
CREATE POLICY "Enable delete for all users" ON reports FOR DELETE TO public USING (true);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('report-images', 'report-images', true) ON CONFLICT DO NOTHING;

-- Storage policies for report-images bucket
-- Allow public access
CREATE POLICY "Give public access to report-images folder 1oj01k_0" ON storage.objects FOR SELECT TO public USING (bucket_id = 'report-images');
CREATE POLICY "Give public access to report-images folder 1oj01k_1" ON storage.objects FOR INSERT TO public WITH CHECK (bucket_id = 'report-images');
CREATE POLICY "Give public access to report-images folder 1oj01k_2" ON storage.objects FOR UPDATE TO public USING (bucket_id = 'report-images');
CREATE POLICY "Give public access to report-images folder 1oj01k_3" ON storage.objects FOR DELETE TO public USING (bucket_id = 'report-images');
