-- Neon Postgres schema for the AFCAC Helpdesk.

-- Staff auth. Not yet wired into the app (login page is still a
-- placeholder redirect).
create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  username text unique not null,
  password_hash text not null,
  role text not null default 'staff',
  created_at timestamptz not null default now()
);

-- Tickets submitted through the public request form (see
-- src/app/api/tickets/route.ts and src/lib/ticketRecord.ts, which
-- rehydrate a row here into the app's full Ticket shape).
create table if not exists tickets (
  id text primary key,
  title text not null,
  description text not null,
  priority text not null,
  status text not null default 'open',
  channel text not null,
  category_slug text not null,
  contact_name text not null,
  contact_email text not null,
  contact_phone text not null,
  sla_minutes_left integer not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
