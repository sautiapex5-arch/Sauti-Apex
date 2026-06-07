CREATE POLICY "documents bucket upload"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "documents bucket read"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "documents bucket delete staff"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'documents' AND public.is_staff(auth.uid()));