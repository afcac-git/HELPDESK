-- Neon Postgres schema for the AFCAC Helpdesk staff auth.
-- Not yet wired into the app (login page is still a placeholder redirect).

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  role text not null default 'staff',
  created_at timestamptz not null default now()
);
