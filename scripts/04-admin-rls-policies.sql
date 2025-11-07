-- Add RLS policies for authenticated admin users to manage vehicles
-- Note: These policies are for reference. In practice, we use service role via API routes for admin operations.

-- Allow authenticated users (admins) to see their own created vehicles
CREATE POLICY "Allow authenticated users to see all vehicles" ON vehicles
  FOR SELECT
  TO authenticated
  USING (true);

-- Allow authenticated users (admins) to see all media
CREATE POLICY "Allow authenticated users to see all media" ON media
  FOR SELECT
  TO authenticated
  USING (true);

-- The actual INSERT/UPDATE/DELETE is handled via API routes using service_role key
-- This prevents direct client manipulation while allowing server-side admin operations
