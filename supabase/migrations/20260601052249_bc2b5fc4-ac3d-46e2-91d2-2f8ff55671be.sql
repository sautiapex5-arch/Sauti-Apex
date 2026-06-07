
-- Public team page profiles, admin-managed
CREATE TABLE public.team_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  full_name text NOT NULL,
  title text,
  bio text,
  photo_url text,
  email text,
  linkedin_url text,
  is_ceo boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.team_members TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.team_members TO authenticated;
GRANT ALL ON public.team_members TO service_role;

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "team_members public read" ON public.team_members
  FOR SELECT USING (is_active = true OR public.is_staff(auth.uid()));

CREATE POLICY "team_members admin manage" ON public.team_members
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER team_members_updated BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Project team member assignments
CREATE TABLE public.project_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  user_id uuid NOT NULL,
  role_on_project text NOT NULL DEFAULT 'member',
  assigned_at timestamptz NOT NULL DEFAULT now(),
  assigned_by uuid,
  UNIQUE (project_id, user_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_members TO authenticated;
GRANT ALL ON public.project_members TO service_role;

ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_members staff" ON public.project_members
  FOR ALL TO authenticated
  USING (public.is_staff(auth.uid()))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE POLICY "project_members client view" ON public.project_members
  FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.can_access_client(p.client_id)));

-- Project progress field (so clients see status visually)
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS progress_percent integer NOT NULL DEFAULT 0;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS estimated_duration_days integer;

-- Auto-add CEO to every new project
CREATE OR REPLACE FUNCTION public.auto_add_ceo_to_project()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE ceo_id uuid;
BEGIN
  SELECT user_id INTO ceo_id FROM public.user_roles WHERE role::text = 'ceo' LIMIT 1;
  IF ceo_id IS NOT NULL THEN
    INSERT INTO public.project_members (project_id, user_id, role_on_project)
    VALUES (NEW.id, ceo_id, 'CEO') ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER projects_auto_ceo AFTER INSERT ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.auto_add_ceo_to_project();

-- Storage policies for team-photos bucket (already public bucket exists)
CREATE POLICY "team photos admin upload" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "team photos admin update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "team photos admin delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'team-photos' AND public.has_role(auth.uid(), 'admin'::app_role));
