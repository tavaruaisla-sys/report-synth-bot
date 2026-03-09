
-- Remove orphan reports with no user_id
DELETE FROM public.reports WHERE user_id IS NULL;

-- Make user_id NOT NULL with default auth.uid()
ALTER TABLE public.reports ALTER COLUMN user_id SET DEFAULT auth.uid();
ALTER TABLE public.reports ALTER COLUMN user_id SET NOT NULL;

-- Drop existing permissive policies
DROP POLICY IF EXISTS "Allow all select" ON public.reports;
DROP POLICY IF EXISTS "Allow all insert" ON public.reports;
DROP POLICY IF EXISTS "Allow all update" ON public.reports;
DROP POLICY IF EXISTS "Allow all delete" ON public.reports;

-- Create user-scoped RLS policies
CREATE POLICY "Users can view own reports" ON public.reports
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reports" ON public.reports
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reports" ON public.reports
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own reports" ON public.reports
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
