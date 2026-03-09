
-- Drop restrictive policies
DROP POLICY IF EXISTS "Enable delete for all users" ON public.reports;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.reports;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.reports;
DROP POLICY IF EXISTS "Enable update for all users" ON public.reports;

-- Create permissive policies
CREATE POLICY "Allow all select" ON public.reports FOR SELECT USING (true);
CREATE POLICY "Allow all insert" ON public.reports FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all update" ON public.reports FOR UPDATE USING (true);
CREATE POLICY "Allow all delete" ON public.reports FOR DELETE USING (true);
