ALTER TABLE public.client_appraisals
  ADD CONSTRAINT client_appraisals_client_id_fkey FOREIGN KEY (client_id) REFERENCES public.clients(id) ON DELETE SET NULL;
ALTER TABLE public.client_appraisals
  ADD CONSTRAINT client_appraisals_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE SET NULL;