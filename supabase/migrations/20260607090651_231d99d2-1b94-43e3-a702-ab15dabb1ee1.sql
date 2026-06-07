CREATE TABLE public.client_appraisals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  client_id uuid,
  project_id uuid,
  request_type text NOT NULL DEFAULT 'account_onboarding',
  full_name text NOT NULL,
  company_name text,
  contact_person text,
  phone text,
  email text NOT NULL,
  physical_address text,
  industry text,
  nature_of_business text,
  years_in_operation integer,
  employee_count integer,
  website_links text,
  is_registered boolean,
  business_structure text,
  compliance_items text[] NOT NULL DEFAULT '{}',
  challenges text,
  urgent_intervention text,
  operational_gaps text,
  missing_systems text,
  pain_points text[] NOT NULL DEFAULT '{}',
  short_term_goals text,
  long_term_goals text,
  objectives text[] NOT NULL DEFAULT '{}',
  current_systems text[] NOT NULL DEFAULT '{}',
  required_systems text[] NOT NULL DEFAULT '{}',
  planning_expansion boolean,
  seeking_funding boolean,
  tender_experience boolean,
  opportunity_interests text[] NOT NULL DEFAULT '{}',
  expected_outcomes text,
  engagement_model text,
  preferred_budget_range text,
  recommended_package text,
  estimated_price_range text,
  pricing_notes text,
  status text NOT NULL DEFAULT 'submitted',
  admin_notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.client_appraisals TO authenticated;
GRANT ALL ON public.client_appraisals TO service_role;
ALTER TABLE public.client_appraisals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Clients can view own appraisals" ON public.client_appraisals FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()) OR (client_id IS NOT NULL AND public.can_access_client(client_id)));
CREATE POLICY "Clients can create own appraisals" ON public.client_appraisals FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "Clients can edit draft submitted own appraisals" ON public.client_appraisals FOR UPDATE TO authenticated USING ((user_id = auth.uid() AND status IN ('draft','submitted')) OR public.is_staff(auth.uid())) WITH CHECK ((user_id = auth.uid() AND status IN ('draft','submitted')) OR public.is_staff(auth.uid()));
CREATE POLICY "Staff can delete appraisals" ON public.client_appraisals FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));
CREATE TRIGGER touch_client_appraisals_updated_at BEFORE UPDATE ON public.client_appraisals FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.isolated_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Consultancy',
  description text,
  price_range text,
  order_index integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.isolated_services TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.isolated_services TO authenticated;
GRANT ALL ON public.isolated_services TO service_role;
ALTER TABLE public.isolated_services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active isolated services" ON public.isolated_services FOR SELECT TO anon, authenticated USING (is_active = true OR public.is_staff(auth.uid()));
CREATE POLICY "Staff can manage isolated services" ON public.isolated_services FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER touch_isolated_services_updated_at BEFORE UPDATE ON public.isolated_services FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

INSERT INTO public.isolated_services (name, category, description, price_range, order_index) VALUES
('Business registration & compliance coordination', 'Formalization', 'Business name or company setup guidance, KRA PIN, permits, statutory registrations and compliance coordination.', 'From Ksh 15,000', 10),
('Logo, company profile & brand identity', 'Branding', 'Logo direction, company profile, letterhead, invoice/receipt templates, business cards, flyers and social media branding.', 'Ksh 25,000 – 120,000', 20),
('Website development & email setup', 'Digital Infrastructure', 'Basic to advanced website, professional email setup, social media integration and client engagement touchpoints.', 'Ksh 45,000 – 350,000+', 30),
('SOPs, workflow and accountability systems', 'Operations', 'Workflow restructuring, SOP development, team structure optimization, reporting structures and accountability systems.', 'Ksh 80,000 – 500,000+', 40),
('CRM, dashboard and automation systems', 'Systems & Automation', 'Customer management, reporting dashboards, workflow systems, inventory/attendance systems and business intelligence structures.', 'Ksh 150,000 – 1,500,000+', 50),
('Tender readiness & procurement support', 'Growth', 'Capability statements, procurement structuring, bid support coordination, supplier positioning and contract execution systems.', 'Ksh 80,000 – 1,500,000+', 60),
('Investment readiness & pitch packaging', 'Investment', 'Investor packaging, pitch deck coordination, valuation coordination, financial structuring and resource mobilization support.', 'Ksh 150,000 – 5,000,000+', 70),
('Monthly strategic advisory retainer', 'Retainer', 'Ongoing advisory, implementation coordination, review meetings, systems monitoring and optimization support.', 'Ksh 25,000 – 1,500,000+/month', 80);