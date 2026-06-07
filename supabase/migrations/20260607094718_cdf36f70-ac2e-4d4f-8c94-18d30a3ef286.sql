-- 1) Project numbers
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS project_no text;

CREATE OR REPLACE FUNCTION public.generate_project_no()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
begin
  if new.project_no is null then
    new.project_no := 'SAX-PRJ-' || to_char(now(),'YYYY') || '-' || lpad((floor(random()*100000))::int::text, 5, '0');
  end if;
  return new;
end;
$$;

DROP TRIGGER IF EXISTS set_project_no ON public.projects;
CREATE TRIGGER set_project_no
BEFORE INSERT ON public.projects
FOR EACH ROW EXECUTE FUNCTION public.generate_project_no();

UPDATE public.projects
SET project_no = 'SAX-PRJ-' || to_char(created_at,'YYYY') || '-' || lpad((floor(random()*100000))::int::text, 5, '0')
WHERE project_no IS NULL;

-- 2) Document enhancements
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE public.documents ADD COLUMN IF NOT EXISTS is_branded boolean NOT NULL DEFAULT false;

-- 3) Project communication thread
CREATE TABLE IF NOT EXISTS public.project_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  sender_id uuid NOT NULL,
  body text,
  document_id uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_messages TO authenticated;
GRANT ALL ON public.project_messages TO service_role;

ALTER TABLE public.project_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "project_messages view"
ON public.project_messages FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_messages.project_id AND public.can_access_client(p.client_id)));

CREATE POLICY "project_messages insert"
ON public.project_messages FOR INSERT TO authenticated
WITH CHECK (sender_id = auth.uid() AND EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_messages.project_id AND public.can_access_client(p.client_id)));

CREATE POLICY "project_messages update own"
ON public.project_messages FOR UPDATE TO authenticated
USING (sender_id = auth.uid())
WITH CHECK (sender_id = auth.uid());

CREATE POLICY "project_messages delete"
ON public.project_messages FOR DELETE TO authenticated
USING (sender_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE INDEX IF NOT EXISTS idx_project_messages_project ON public.project_messages (project_id, created_at);