
-- 1. Client-scoped SELECT for project_tasks
CREATE POLICY "tasks client view" ON public.project_tasks
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_tasks.project_id AND public.can_access_client(p.client_id)));

-- 2. Client-scoped SELECT for proposal_items
CREATE POLICY "proposal_items client view" ON public.proposal_items
FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM public.proposals pr WHERE pr.id = proposal_items.proposal_id AND public.can_access_client(pr.client_id)));

-- 3. Hide team_members emails from public; expose via a view without email
DROP POLICY IF EXISTS "team_members public read" ON public.team_members;

CREATE POLICY "team_members auth read" ON public.team_members
FOR SELECT TO authenticated
USING ((is_active = true) OR public.is_staff(auth.uid()));

CREATE OR REPLACE VIEW public.team_members_public
WITH (security_invoker = true) AS
SELECT id, full_name, title, bio, photo_url, linkedin_url, is_ceo, is_active, order_index, created_at, updated_at
FROM public.team_members
WHERE is_active = true;

GRANT SELECT ON public.team_members_public TO anon, authenticated;

-- Allow anon to read active rows via the view (view runs as invoker so needs row access)
CREATE POLICY "team_members anon active read" ON public.team_members
FOR SELECT TO anon
USING (is_active = true);

-- 4. Revoke EXECUTE on trigger-only SECURITY DEFINER functions from public roles
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.auto_add_ceo_to_project() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.generate_case_reference() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM anon, authenticated, public;
