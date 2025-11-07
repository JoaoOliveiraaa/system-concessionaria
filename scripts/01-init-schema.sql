-- Create vehicles table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  brand TEXT NOT NULL,
  model TEXT NOT NULL,
  year INT NOT NULL,
  color TEXT NOT NULL,
  km INT NOT NULL,
  price NUMERIC(12, 2) NOT NULL,
  fuel TEXT NOT NULL,
  gearbox TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'rascunho' CHECK (status IN ('rascunho', 'anunciado', 'vendido')),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create media table
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_id UUID NOT NULL REFERENCES vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('image', 'video')),
  url TEXT NOT NULL,
  "order" INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_created_at ON vehicles(created_at DESC);
CREATE INDEX idx_media_vehicle_id ON media(vehicle_id);
CREATE INDEX idx_media_order ON media(vehicle_id, "order");

-- Enable RLS (Row Level Security)
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for public access to vehicles (anunciado only)
CREATE POLICY "Allow public to view anunciado vehicles" ON vehicles
  FOR SELECT USING (status = 'anunciado');

CREATE POLICY "Allow public to view media for anunciado vehicles" ON media
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM vehicles v WHERE v.id = media.vehicle_id AND v.status = 'anunciado'
    )
  );

-- Create RLS policies for admin (service role has bypass)
-- This is handled via service role key in API routes
