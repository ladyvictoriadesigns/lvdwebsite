-- Partial inquiries from every website lead form (welcome/reserve, inquire,
-- consultation, style quiz, venue checklist, planning booking). One row per form session:
-- created when the visitor starts typing, updated per step, marked "completed"
-- (and linked to the real lead) on submit. Only the server (service role) reads
-- or writes it. Safe to run more than once.

create extension if not exists pgcrypto;

create table if not exists public.partial_leads (
  id uuid primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  status text not null default 'partial',
  form text not null default 'reserve',
  step_reached integer not null default 1,
  step_total integer not null default 5,
  page text,
  lead_id uuid references public.leads(id) on delete set null,
  name text,
  email text,
  phone text,
  celebration_type text,
  event_date date,
  date_undecided boolean not null default false,
  venue text,
  guest_count text,
  services text[] not null default '{}',
  vision text,
  investment text,
  referral_source text,
  extra jsonb not null default '{}'::jsonb,
  user_agent text,
  constraint partial_leads_status_check check (status in ('partial', 'completed')),
  constraint partial_leads_form_check check (form in ('reserve', 'inquire', 'consultation', 'style_quiz', 'venue_checklist', 'planning_booking')),
  constraint partial_leads_step_check check (step_reached between 1 and 10 and step_total between 1 and 10)
);

-- If an earlier version of this table was already created (welcome form only),
-- bring it up to date. Does nothing on a fresh install.
alter table public.partial_leads add column if not exists form text not null default 'reserve';
alter table public.partial_leads add column if not exists step_total integer not null default 5;
alter table public.partial_leads add column if not exists extra jsonb not null default '{}'::jsonb;
alter table public.partial_leads drop constraint if exists partial_leads_step_check;
alter table public.partial_leads add constraint partial_leads_step_check check (step_reached between 1 and 10 and step_total between 1 and 10);
alter table public.partial_leads drop constraint if exists partial_leads_form_check;
alter table public.partial_leads add constraint partial_leads_form_check check (form in ('reserve', 'inquire', 'consultation', 'style_quiz', 'venue_checklist', 'planning_booking'));

create index if not exists partial_leads_status_updated_idx on public.partial_leads (status, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists partial_leads_set_updated_at on public.partial_leads;
create trigger partial_leads_set_updated_at
before update on public.partial_leads
for each row
execute function public.set_updated_at();

alter table public.partial_leads enable row level security;

comment on table public.partial_leads is 'Unfinished website inquiries saved as the visitor types; status flips to completed on submit.';
comment on column public.partial_leads.extra is 'Form-specific answers without their own column, e.g. style quiz result or checklist edition.';
