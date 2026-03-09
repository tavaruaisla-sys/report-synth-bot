
CREATE TABLE public.issue_briefs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  platform text NOT NULL,
  post_url text,
  post_caption text,
  issue_summary text,
  status text NOT NULL DEFAULT 'Aman',
  generated_brief text NOT NULL,
  simplified_brief text,
  created_at timestamptz DEFAULT now(),
  created_by uuid NOT NULL DEFAULT auth.uid()
);

ALTER TABLE public.issue_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own briefs" ON public.issue_briefs
  FOR SELECT TO authenticated USING (auth.uid() = created_by);

CREATE POLICY "Users can insert own briefs" ON public.issue_briefs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own briefs" ON public.issue_briefs
  FOR DELETE TO authenticated USING (auth.uid() = created_by);
