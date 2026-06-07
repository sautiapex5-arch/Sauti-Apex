
-- Enums
create type public.app_role as enum ('admin', 'team', 'client');
create type public.entity_type as enum ('individual','informal_group','registered_company','company_representative','public_institution','other');
create type public.case_stage as enum ('intake','diagnosis','stabilization','structuring','modernization','sustainability','closed');
create type public.document_type as enum ('invoice','quotation','report','letter');
create type public.document_status as enum ('draft','sent','paid','void');

-- Profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  entity_type public.entity_type not null default 'individual',
  display_name text not null,
  contact_email text not null,
  phone text,
  country text,
  city text,
  sector text,
  stage text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;

-- user_roles
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  unique(user_id, role)
);
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

-- Auto profile + default role on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name, contact_email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.email
  )
  on conflict (id) do nothing;

  insert into public.user_roles (user_id, role) values (new.id, 'client')
  on conflict do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Team members
create table public.team_members (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  role_title text not null,
  short_bio text not null,
  focus_areas text[] not null default '{}',
  photo_url text,
  order_index int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.team_members enable row level security;

-- Intake submissions
create table public.intake_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  entity_type public.entity_type not null,
  display_name text not null,
  contact_email text not null,
  phone text,
  country text,
  city text,
  sector text,
  stage text,
  engagement_areas text[] not null default '{}',
  pressure_points text[] not null default '{}',
  confidentiality_level text not null default 'standard',
  preferred_channel text,
  contact_window text,
  abstract_note text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);
alter table public.intake_submissions enable row level security;

-- Cases
create table public.cases (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  reference_code text unique,
  title text not null,
  summary text,
  current_stage public.case_stage not null default 'intake',
  intake_submission_id uuid references public.intake_submissions(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.cases enable row level security;

create or replace function public.generate_case_reference()
returns trigger
language plpgsql
as $$
begin
  if new.reference_code is null then
    new.reference_code := 'SAX-' || to_char(now(), 'YYYY') || '-' || lpad((floor(random()*10000))::text, 4, '0');
  end if;
  return new;
end;
$$;

create trigger trg_case_reference
before insert on public.cases
for each row execute function public.generate_case_reference();

-- Case events (timeline)
create table public.case_events (
  id uuid primary key default gen_random_uuid(),
  case_id uuid not null references public.cases(id) on delete cascade,
  stage public.case_stage,
  note text not null,
  is_internal boolean not null default false,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
alter table public.case_events enable row level security;

-- Documents (invoices, quotations, reports)
create table public.documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references public.cases(id) on delete set null,
  owner_id uuid not null references auth.users(id) on delete cascade,
  type public.document_type not null,
  number text not null,
  title text not null,
  status public.document_status not null default 'draft',
  currency text not null default 'KES',
  total_amount numeric(14,2) not null default 0,
  issued_at timestamptz not null default now(),
  valid_until timestamptz,
  pdf_path text,
  payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
alter table public.documents enable row level security;

-- Updated_at trigger
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

create trigger trg_profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();
create trigger trg_cases_touch before update on public.cases for each row execute function public.touch_updated_at();
create trigger trg_team_touch before update on public.team_members for each row execute function public.touch_updated_at();

-- ============== RLS Policies ==============

-- profiles: users see/edit own; admin sees all
create policy "profiles self select" on public.profiles for select to authenticated using (auth.uid() = id or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team'));
create policy "profiles self update" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles admin update" on public.profiles for update to authenticated using (public.has_role(auth.uid(),'admin'));

-- user_roles: users see own; admin manages
create policy "roles self select" on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "roles admin all" on public.user_roles for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- team_members: authenticated users can view active; admin manages
create policy "team view active" on public.team_members for select to authenticated using (is_active = true or public.has_role(auth.uid(),'admin'));
create policy "team admin all" on public.team_members for all to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- intake_submissions: public can insert; user/admin can view own
create policy "intake public insert" on public.intake_submissions for insert to anon, authenticated with check (true);
create policy "intake self select" on public.intake_submissions for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team'));
create policy "intake admin update" on public.intake_submissions for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- cases: owner sees own; admin/team see all
create policy "cases owner select" on public.cases for select to authenticated using (owner_id = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team'));
create policy "cases admin all" on public.cases for all to authenticated using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team')) with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team'));

-- case_events: visible to owner if not internal; admin sees all
create policy "case_events owner select" on public.case_events for select to authenticated using (
  (not is_internal and exists(select 1 from public.cases c where c.id = case_id and c.owner_id = auth.uid()))
  or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team')
);
create policy "case_events admin insert" on public.case_events for insert to authenticated with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team'));

-- documents: owner sees own; admin manages all
create policy "documents owner select" on public.documents for select to authenticated using (owner_id = auth.uid() or public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team'));
create policy "documents admin all" on public.documents for all to authenticated using (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team')) with check (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team'));

-- Storage buckets
insert into storage.buckets (id, name, public) values ('team-photos', 'team-photos', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('documents', 'documents', false) on conflict (id) do nothing;

-- team-photos policies (public read, admin write)
create policy "team-photos public read" on storage.objects for select using (bucket_id = 'team-photos');
create policy "team-photos admin write" on storage.objects for insert to authenticated with check (bucket_id = 'team-photos' and public.has_role(auth.uid(),'admin'));
create policy "team-photos admin update" on storage.objects for update to authenticated using (bucket_id = 'team-photos' and public.has_role(auth.uid(),'admin'));
create policy "team-photos admin delete" on storage.objects for delete to authenticated using (bucket_id = 'team-photos' and public.has_role(auth.uid(),'admin'));

-- documents bucket: only admin/team write; readers go through signed URLs (no select policy needed for owner since they use signed URLs)
create policy "documents admin write" on storage.objects for insert to authenticated with check (bucket_id = 'documents' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team')));
create policy "documents admin update" on storage.objects for update to authenticated using (bucket_id = 'documents' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team')));
create policy "documents admin read" on storage.objects for select to authenticated using (bucket_id = 'documents' and (public.has_role(auth.uid(),'admin') or public.has_role(auth.uid(),'team')));
