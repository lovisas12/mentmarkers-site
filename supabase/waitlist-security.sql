create table if not exists public.waitlist_rate_limits (
  ip_hash text primary key,
  window_started_at timestamptz not null default now(),
  attempts integer not null default 1
);

alter table public.waitlist_rate_limits enable row level security;
revoke all on table public.waitlist_rate_limits from anon, authenticated;

create or replace function public.consume_waitlist_attempt(
  p_ip_hash text,
  p_limit integer default 5,
  p_window_seconds integer default 900
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  is_allowed boolean;
begin
  insert into public.waitlist_rate_limits (ip_hash, window_started_at, attempts)
  values (p_ip_hash, now(), 1)
  on conflict (ip_hash) do update
  set
    attempts = case
      when waitlist_rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds) then 1
      else waitlist_rate_limits.attempts + 1
    end,
    window_started_at = case
      when waitlist_rate_limits.window_started_at < now() - make_interval(secs => p_window_seconds) then now()
      else waitlist_rate_limits.window_started_at
    end
  returning attempts <= p_limit into is_allowed;

  return is_allowed;
end;
$$;

revoke all on function public.consume_waitlist_attempt(text, integer, integer) from public;
grant execute on function public.consume_waitlist_attempt(text, integer, integer) to service_role;

drop policy if exists "Visitors can join the waitlist" on public.waitlist_signups;
revoke insert on table public.waitlist_signups from anon;
grant insert on table public.waitlist_signups to service_role;
