-- Fix documents null client_id exposure
DROP POLICY IF EXISTS "documents access" ON public.documents;
CREATE POLICY "documents access" ON public.documents
  FOR ALL TO authenticated
  USING (is_staff(auth.uid()) OR (client_id IS NOT NULL AND can_access_client(client_id)))
  WITH CHECK (is_staff(auth.uid()));

-- Fix tenders null client_id exposure
DROP POLICY IF EXISTS "tenders access" ON public.tenders;
CREATE POLICY "tenders access" ON public.tenders
  FOR ALL TO authenticated
  USING (is_staff(auth.uid()) OR (client_id IS NOT NULL AND can_access_client(client_id)))
  WITH CHECK (is_staff(auth.uid()));

-- Revoke SECURITY DEFINER function execute from public/anon
REVOKE EXECUTE ON FUNCTION public.is_staff(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.can_access_client(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.auto_add_ceo_to_project() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.generate_case_reference() FROM anon, authenticated, public;
REVOKE EXECUTE ON FUNCTION public.touch_updated_at() FROM anon, authenticated, public;

GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.can_access_client(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- Restrictive policy on user_roles to ensure only admins can write (defense in depth)
CREATE POLICY "roles no self insert" ON public.user_roles
  AS RESTRICTIVE FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "roles no self update" ON public.user_roles
  AS RESTRICTIVE FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role))
  WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "roles no self delete" ON public.user_roles
  AS RESTRICTIVE FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Storage: documents bucket - allow client users to read their own files,
-- where path convention is: documents/<client_id>/<filename>
CREATE POLICY "documents bucket client read"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      is_staff(auth.uid())
      OR (
        (storage.foldername(name))[1] IS NOT NULL
        AND can_access_client(((storage.foldername(name))[1])::uuid)
      )
    )
  );

-- Storage: documents bucket - DELETE policy (staff only)
CREATE POLICY "documents bucket staff delete"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'documents' AND is_staff(auth.uid()));

-- Tighten team-photos public bucket: allow anon read of individual files but block listing
-- Drop any broad SELECT that allows listing, replace with object-only access
-- (Keeping public read of individual files via direct URL is fine; listing is what's risky.)
-- We add a restrictive policy preventing list-style queries from anon.
-- Note: Supabase serves public bucket files directly without RLS for GET object,
-- but list operations go through storage.objects SELECT. Restrict listing to staff.
DO $$
BEGIN
  -- Replace any permissive anon SELECT for team-photos with staff-only listing
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND policyname='team-photos public read'
  ) THEN
    EXECUTE 'DROP POLICY "team-photos public read" ON storage.objects';
  END IF;
END $$;

CREATE POLICY "team-photos staff list"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'team-photos' AND is_staff(auth.uid()));
