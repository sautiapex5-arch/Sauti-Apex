
-- Set search_path on remaining functions
alter function public.touch_updated_at() set search_path = public;
alter function public.generate_case_reference() set search_path = public;

-- Revoke public EXECUTE on SECURITY DEFINER functions; only authenticated users
revoke execute on function public.has_role(uuid, public.app_role) from public, anon;
grant execute on function public.has_role(uuid, public.app_role) to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;
-- handle_new_user is only invoked by the auth trigger; no direct callers needed

-- Tighten intake INSERT: drop overly-permissive policy, replace with a column-level check
drop policy if exists "intake public insert" on public.intake_submissions;
create policy "intake submit"
on public.intake_submissions
for insert
to anon, authenticated
with check (
  length(display_name) between 1 and 200
  and length(contact_email) between 3 and 320
);
