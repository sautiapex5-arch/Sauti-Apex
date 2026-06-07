-- =====================================================================
-- SAUTIAPEX BUSINESS TRANSFORMATION OS - FULL SCHEMA REBUILD
-- =====================================================================

DROP TABLE IF EXISTS public.case_events CASCADE;
DROP TABLE IF EXISTS public.cases CASCADE;
DROP TABLE IF EXISTS public.documents CASCADE;
DROP TABLE IF EXISTS public.intake_submissions CASCADE;
DROP TABLE IF EXISTS public.team_members CASCADE;
DROP TYPE IF EXISTS public.case_stage CASCADE;
DROP TYPE IF EXISTS public.document_status CASCADE;
DROP TYPE IF EXISTS public.document_type CASCADE;

ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'super_admin';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'ceo';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'consultant';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'ops_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'project_manager';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'hr_officer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'finance_officer';
ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'client_user';

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;

-- Helper functions — cast enum to text to avoid "uncommitted enum value" error
CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id
      AND role::text IN ('admin','super_admin','ceo','consultant','ops_manager','project_manager','hr_officer','finance_officer','team')
  )
$$;
GRANT EXECUTE ON FUNCTION public.is_staff(uuid) TO authenticated;

-- 2. CLIENTS
CREATE TABLE public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_code text UNIQUE,
  client_type text NOT NULL DEFAULT 'company',
  company_name text NOT NULL,
  contact_person text, phone text, email text, physical_address text,
  industry text, business_type text,
  years_in_operation integer, employee_count integer,
  website text,
  status text NOT NULL DEFAULT 'active',
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clients TO authenticated;
GRANT ALL ON public.clients TO service_role;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "clients staff all" ON public.clients FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.client_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, user_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_users TO authenticated;
GRANT ALL ON public.client_users TO service_role;
ALTER TABLE public.client_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "client_users staff all" ON public.client_users FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "client_users self select" ON public.client_users FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.can_access_client(_client_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.is_staff(auth.uid()) OR EXISTS (
    SELECT 1 FROM public.client_users WHERE client_id = _client_id AND user_id = auth.uid()
  )
$$;
GRANT EXECUTE ON FUNCTION public.can_access_client(uuid) TO authenticated;

CREATE TABLE public.client_socials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  platform text NOT NULL, url text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_socials TO authenticated;
GRANT ALL ON public.client_socials TO service_role;
ALTER TABLE public.client_socials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "client_socials access" ON public.client_socials FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.client_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  assessment_date date NOT NULL DEFAULT CURRENT_DATE,
  consultant_id uuid,
  overall_score numeric, summary text,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_assessments TO authenticated;
GRANT ALL ON public.client_assessments TO service_role;
ALTER TABLE public.client_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "assessments access" ON public.client_assessments FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

-- 3. COMPLIANCE
CREATE TABLE public.compliance_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE, description text, category text,
  is_active boolean NOT NULL DEFAULT true, order_index integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.compliance_items TO authenticated;
GRANT ALL ON public.compliance_items TO service_role;
ALTER TABLE public.compliance_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "compliance_items view" ON public.compliance_items FOR SELECT TO authenticated USING (true);
CREATE POLICY "compliance_items admin" ON public.compliance_items FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TABLE public.client_compliance (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  compliance_item_id uuid NOT NULL REFERENCES public.compliance_items(id) ON DELETE CASCADE,
  available boolean NOT NULL DEFAULT false,
  expiry_date date, document_id uuid, notes text,
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(client_id, compliance_item_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_compliance TO authenticated;
GRANT ALL ON public.client_compliance TO service_role;
ALTER TABLE public.client_compliance ENABLE ROW LEVEL SECURITY;
CREATE POLICY "client_compliance access" ON public.client_compliance FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

-- 4. CHALLENGES
CREATE TABLE public.business_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE, description text, category text,
  is_active boolean NOT NULL DEFAULT true
);
GRANT SELECT ON public.business_challenges TO authenticated;
GRANT ALL ON public.business_challenges TO service_role;
ALTER TABLE public.business_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "challenges view" ON public.business_challenges FOR SELECT TO authenticated USING (true);
CREATE POLICY "challenges admin" ON public.business_challenges FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TABLE public.client_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  challenge_id uuid NOT NULL REFERENCES public.business_challenges(id) ON DELETE CASCADE,
  severity text NOT NULL DEFAULT 'medium', notes text,
  identified_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_challenges TO authenticated;
GRANT ALL ON public.client_challenges TO service_role;
ALTER TABLE public.client_challenges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "client_challenges access" ON public.client_challenges FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

-- 5. OBJECTIVES
CREATE TABLE public.objectives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  objective_type text NOT NULL, description text NOT NULL,
  priority text NOT NULL DEFAULT 'medium', target_date date,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.objectives TO authenticated;
GRANT ALL ON public.objectives TO service_role;
ALTER TABLE public.objectives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "objectives access" ON public.objectives FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

-- 6. DIGITAL MATURITY
CREATE TABLE public.digital_systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL UNIQUE, category text, description text
);
GRANT SELECT ON public.digital_systems TO authenticated;
GRANT ALL ON public.digital_systems TO service_role;
ALTER TABLE public.digital_systems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "digital_systems view" ON public.digital_systems FOR SELECT TO authenticated USING (true);
CREATE POLICY "digital_systems admin" ON public.digital_systems FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TABLE public.client_systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  system_id uuid NOT NULL REFERENCES public.digital_systems(id) ON DELETE CASCADE,
  currently_using boolean NOT NULL DEFAULT false,
  needs_upgrade boolean NOT NULL DEFAULT false, notes text,
  UNIQUE(client_id, system_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_systems TO authenticated;
GRANT ALL ON public.client_systems TO service_role;
ALTER TABLE public.client_systems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "client_systems access" ON public.client_systems FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

-- 7. PACKAGES
CREATE TABLE public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, description text,
  base_price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'KES', category text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.packages TO authenticated;
GRANT ALL ON public.packages TO service_role;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "packages view" ON public.packages FOR SELECT TO authenticated USING (true);
CREATE POLICY "packages admin" ON public.packages FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

CREATE TABLE public.package_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_id uuid NOT NULL REFERENCES public.packages(id) ON DELETE CASCADE,
  service_name text NOT NULL, order_index integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.package_services TO authenticated;
GRANT ALL ON public.package_services TO service_role;
ALTER TABLE public.package_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "package_services view" ON public.package_services FOR SELECT TO authenticated USING (true);
CREATE POLICY "package_services admin" ON public.package_services FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin')) WITH CHECK (has_role(auth.uid(),'admin'));

-- 8. CONSULTATIONS
CREATE TABLE public.consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  consultant_id uuid, meeting_date timestamptz NOT NULL,
  meeting_type text NOT NULL DEFAULT 'discovery',
  location text, notes text,
  status text NOT NULL DEFAULT 'scheduled',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consultations TO authenticated;
GRANT ALL ON public.consultations TO service_role;
ALTER TABLE public.consultations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "consultations access" ON public.consultations FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.consultation_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  consultation_id uuid NOT NULL REFERENCES public.consultations(id) ON DELETE CASCADE,
  file_name text NOT NULL, file_url text NOT NULL,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consultation_files TO authenticated;
GRANT ALL ON public.consultation_files TO service_role;
ALTER TABLE public.consultation_files ENABLE ROW LEVEL SECURITY;
CREATE POLICY "consultation_files staff" ON public.consultation_files FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 9. PROPOSALS
CREATE TABLE public.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  proposal_no text UNIQUE, title text NOT NULL,
  created_by uuid, amount numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'KES',
  status text NOT NULL DEFAULT 'draft',
  approved_at timestamptz, pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proposals TO authenticated;
GRANT ALL ON public.proposals TO service_role;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proposals access" ON public.proposals FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.proposal_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  service_name text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  order_index integer NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.proposal_items TO authenticated;
GRANT ALL ON public.proposal_items TO service_role;
ALTER TABLE public.proposal_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "proposal_items staff" ON public.proposal_items FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 10. CONTRACTS
CREATE TABLE public.contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  proposal_id uuid REFERENCES public.proposals(id) ON DELETE SET NULL,
  contract_no text UNIQUE, title text NOT NULL,
  start_date date, end_date date,
  value numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'draft',
  signed_at timestamptz, pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.contracts TO authenticated;
GRANT ALL ON public.contracts TO service_role;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contracts access" ON public.contracts FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

-- 11. PROJECTS
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  contract_id uuid REFERENCES public.contracts(id) ON DELETE SET NULL,
  project_name text NOT NULL, description text,
  start_date date, end_date date,
  status text NOT NULL DEFAULT 'planning',
  manager_id uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects access" ON public.projects FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.project_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title text NOT NULL, description text,
  due_date date, status text NOT NULL DEFAULT 'pending',
  order_index integer NOT NULL DEFAULT 0,
  completed_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_milestones TO authenticated;
GRANT ALL ON public.project_milestones TO service_role;
ALTER TABLE public.project_milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "milestones staff" ON public.project_milestones FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "milestones client view" ON public.project_milestones FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.projects p WHERE p.id = project_id AND public.can_access_client(p.client_id)));

CREATE TABLE public.project_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  milestone_id uuid REFERENCES public.project_milestones(id) ON DELETE SET NULL,
  assigned_to uuid, task_name text NOT NULL, description text,
  priority text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'todo',
  deadline timestamptz, completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.project_tasks TO authenticated;
GRANT ALL ON public.project_tasks TO service_role;
ALTER TABLE public.project_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tasks staff" ON public.project_tasks FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 12. DOCUMENTS
CREATE TABLE public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  category text NOT NULL, file_name text NOT NULL, file_url text NOT NULL,
  file_size integer, mime_type text,
  uploaded_by uuid,
  uploaded_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.documents TO authenticated;
GRANT ALL ON public.documents TO service_role;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "documents access" ON public.documents FOR ALL TO authenticated
  USING (client_id IS NULL OR public.can_access_client(client_id))
  WITH CHECK (public.is_staff(auth.uid()));

-- 13. FINANCE
CREATE TABLE public.invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text UNIQUE,
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  contract_id uuid REFERENCES public.contracts(id) ON DELETE SET NULL,
  amount numeric NOT NULL DEFAULT 0, vat numeric NOT NULL DEFAULT 0,
  total numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'KES',
  status text NOT NULL DEFAULT 'draft',
  issued_at timestamptz NOT NULL DEFAULT now(),
  due_date date, pdf_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invoices access" ON public.invoices FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
  amount numeric NOT NULL, payment_method text, reference text,
  payment_date timestamptz NOT NULL DEFAULT now(),
  notes text, recorded_by uuid
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.payments TO authenticated;
GRANT ALL ON public.payments TO service_role;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "payments staff" ON public.payments FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  description text NOT NULL,
  amount numeric NOT NULL DEFAULT 0, category text,
  expense_date date NOT NULL DEFAULT CURRENT_DATE,
  receipt_url text, recorded_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.expenses TO authenticated;
GRANT ALL ON public.expenses TO service_role;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "expenses staff" ON public.expenses FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 14. RETAINERS
CREATE TABLE public.retainers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  package_id uuid REFERENCES public.packages(id) ON DELETE SET NULL,
  monthly_fee numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'KES',
  start_date date NOT NULL, end_date date,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.retainers TO authenticated;
GRANT ALL ON public.retainers TO service_role;
ALTER TABLE public.retainers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "retainers access" ON public.retainers FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

-- 15. TENDERS
CREATE TABLE public.tenders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  title text NOT NULL, organization text, reference_no text,
  closing_date date, value_estimate numeric,
  status text NOT NULL DEFAULT 'identified',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tenders TO authenticated;
GRANT ALL ON public.tenders TO service_role;
ALTER TABLE public.tenders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tenders access" ON public.tenders FOR ALL TO authenticated
  USING (client_id IS NULL OR public.can_access_client(client_id))
  WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.tender_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  document_id uuid REFERENCES public.documents(id) ON DELETE CASCADE,
  document_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tender_documents TO authenticated;
GRANT ALL ON public.tender_documents TO service_role;
ALTER TABLE public.tender_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tender_documents staff" ON public.tender_documents FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.tender_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tender_id uuid NOT NULL REFERENCES public.tenders(id) ON DELETE CASCADE,
  submitted_date date, submitted_by uuid,
  result text, notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tender_submissions TO authenticated;
GRANT ALL ON public.tender_submissions TO service_role;
ALTER TABLE public.tender_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tender_submissions staff" ON public.tender_submissions FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 16. INVESTMENT
CREATE TABLE public.investors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, organization text,
  email text, phone text, focus_area text, notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.investors TO authenticated;
GRANT ALL ON public.investors TO service_role;
ALTER TABLE public.investors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "investors staff" ON public.investors FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.investment_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  required_amount numeric, currency text NOT NULL DEFAULT 'KES',
  purpose text, readiness_score numeric,
  status text NOT NULL DEFAULT 'preparation',
  matched_investor_id uuid REFERENCES public.investors(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.investment_opportunities TO authenticated;
GRANT ALL ON public.investment_opportunities TO service_role;
ALTER TABLE public.investment_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "investments access" ON public.investment_opportunities FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

-- 17. BI
CREATE TABLE public.kpis (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  metric_name text NOT NULL, target numeric, current_value numeric,
  unit text, period text,
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.kpis TO authenticated;
GRANT ALL ON public.kpis TO service_role;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;
CREATE POLICY "kpis access" ON public.kpis FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  generated_by uuid, report_type text NOT NULL,
  title text NOT NULL, period text,
  file_url text, summary text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reports TO authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports access" ON public.reports FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

-- 18. CRM
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL, company text, phone text, email text,
  source text, status text NOT NULL DEFAULT 'new',
  assigned_to uuid, notes text,
  converted_client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.leads TO authenticated;
GRANT INSERT ON public.leads TO anon;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads staff" ON public.leads FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "leads public insert" ON public.leads FOR INSERT TO anon, authenticated
  WITH CHECK (length(name) >= 1 AND length(name) <= 200);

CREATE TABLE public.lead_activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  activity_type text NOT NULL, notes text,
  performed_by uuid,
  activity_date timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lead_activities TO authenticated;
GRANT ALL ON public.lead_activities TO service_role;
ALTER TABLE public.lead_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lead_activities staff" ON public.lead_activities FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- 19. AI
CREATE TABLE public.ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.clients(id) ON DELETE CASCADE,
  user_id uuid NOT NULL, session_id text, title text,
  started_at timestamptz NOT NULL DEFAULT now(),
  ended_at timestamptz
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_conversations TO authenticated;
GRANT ALL ON public.ai_conversations TO service_role;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_conv self" ON public.ai_conversations FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()))
  WITH CHECK (user_id = auth.uid() OR public.is_staff(auth.uid()));

CREATE TABLE public.ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
  role text NOT NULL, message text NOT NULL,
  tokens_used integer,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_messages TO authenticated;
GRANT ALL ON public.ai_messages TO service_role;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ai_msg via conv" ON public.ai_messages FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM public.ai_conversations c WHERE c.id = conversation_id AND (c.user_id = auth.uid() OR public.is_staff(auth.uid()))))
  WITH CHECK (EXISTS (SELECT 1 FROM public.ai_conversations c WHERE c.id = conversation_id AND (c.user_id = auth.uid() OR public.is_staff(auth.uid()))));

CREATE TABLE public.ai_insights (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
  title text NOT NULL, description text NOT NULL,
  insight_type text NOT NULL DEFAULT 'general',
  priority text NOT NULL DEFAULT 'medium',
  action_required boolean NOT NULL DEFAULT false,
  resolved boolean NOT NULL DEFAULT false,
  generated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.ai_insights TO authenticated;
GRANT ALL ON public.ai_insights TO service_role;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "insights access" ON public.ai_insights FOR ALL TO authenticated
  USING (public.can_access_client(client_id)) WITH CHECK (public.is_staff(auth.uid()));

-- 20. NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL, title text NOT NULL, message text NOT NULL,
  link text, notification_type text NOT NULL DEFAULT 'info',
  read_status boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications self" ON public.notifications FOR ALL TO authenticated
  USING (user_id = auth.uid() OR public.is_staff(auth.uid()))
  WITH CHECK (user_id = auth.uid() OR public.is_staff(auth.uid()));

-- TRIGGERS
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_client_assessments_updated BEFORE UPDATE ON public.client_assessments FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_proposals_updated BEFORE UPDATE ON public.proposals FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER trg_leads_updated BEFORE UPDATE ON public.leads FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- SEED MASTER DATA
INSERT INTO public.compliance_items (name, category, order_index) VALUES
  ('KRA PIN','Tax',1),('Tax Compliance Certificate','Tax',2),('AGPO Certificate','Procurement',3),
  ('NSSF Registration','HR',4),('SHA / NHIF Registration','HR',5),('Business Permit','Legal',6),
  ('CR12','Legal',7),('Memorandum of Association','Legal',8),('Company Profile','Branding',9),
  ('Branding Assets','Branding',10),('Bank Account','Finance',11),('Audited Accounts','Finance',12);

INSERT INTO public.business_challenges (name, category) VALUES
  ('Operational disorder','Operations'),('Financial leakage','Finance'),('Weak coordination','Operations'),
  ('Low sales','Sales'),('Employee conflict','HR'),('Scaling difficulties','Strategy'),
  ('Poor record keeping','Operations'),('Lack of digital systems','Technology'),
  ('Limited market access','Sales'),('Compliance gaps','Legal');

INSERT INTO public.digital_systems (name, category) VALUES
  ('Excel / Spreadsheets','Basic'),('POS System','Sales'),('ERP','Enterprise'),
  ('CRM','Sales'),('Website','Marketing'),('Inventory System','Operations'),
  ('Accounting Software','Finance'),('HR System','HR'),('Email Marketing','Marketing'),
  ('Mobile App','Technology');

INSERT INTO public.packages (name, description, base_price, category) VALUES
  ('Startup Package','Foundation setup: registration, compliance, branding, basic systems',150000,'startup'),
  ('Modernization Package','Digital transformation, system upgrades, process automation',350000,'growth'),
  ('Expansion Package','Tender readiness, AGPO, market entry, investment prep',500000,'expansion'),
  ('Retainer Package','Ongoing monthly advisory, reporting, compliance monitoring',50000,'retainer');