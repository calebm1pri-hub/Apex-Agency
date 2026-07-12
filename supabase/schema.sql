-- Marnie — Supabase schema
-- Run in the Supabase SQL editor (or `supabase db push`) to provision the
-- custom tables the app's adapters expect. Auth is handled by Supabase Auth /
-- NextAuth; these tables cover creators, seeding, referrals, UGC, loyalty, and
-- the email list.

-- ---------- Email subscribers (glow list) ----------
create table if not exists subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  source text,
  subscribed_at timestamptz default now()
);

-- ---------- Creators / seeding pipeline ----------
create type creator_status as enum (
  'prospect','contacted','interested','sample_sent','posted','affiliate','declined'
);

create table if not exists creators (
  id uuid primary key default gen_random_uuid(),
  handle text not null,
  name text,
  email text,
  platform text default 'tiktok',
  followers int default 0,
  engagement_rate numeric default 0,
  niche text,
  region text,
  tier text default 'nano',
  status creator_status default 'prospect',
  gmv numeric default 0,
  sample_sent boolean default false,
  posted_content int default 0,
  last_contacted timestamptz,
  created_at timestamptz default now()
);

-- ---------- Sample requests / tracker ----------
create table if not exists samples (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id) on delete cascade,
  product_handle text,
  status text default 'requested', -- requested | shipped | delivered
  tracking_url text,
  sent_at timestamptz,
  created_at timestamptz default now()
);

-- ---------- Referrals (viral loop) ----------
create table if not exists referrals (
  id uuid primary key default gen_random_uuid(),
  code text not null,
  referrer_email text,
  order_id text,
  redeemed_at timestamptz default now()
);

-- ---------- UGC submissions ----------
create table if not exists ugc_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  video_url text not null,
  product_handle text,
  status text default 'pending', -- pending | approved | reposted
  points_awarded int default 250,
  created_at timestamptz default now()
);

-- ---------- Loyalty (Glow Points) ----------
create table if not exists loyalty_accounts (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  points int default 0,
  tier text default 'Glow',
  updated_at timestamptz default now()
);

-- ---------- Seedance scripts (generated video briefs) ----------
create table if not exists seedance_scripts (
  id uuid primary key default gen_random_uuid(),
  creator_id uuid references creators(id) on delete set null,
  product_handle text,
  title text,
  script jsonb,
  created_at timestamptz default now()
);

-- Helpful indexes
create index if not exists idx_creators_status on creators(status);
create index if not exists idx_referrals_code on referrals(code);
create index if not exists idx_ugc_status on ugc_submissions(status);

-- Row Level Security: enable + lock down. The server uses the service-role key
-- (bypasses RLS); the browser anon client should only read public data.
alter table subscribers enable row level security;
alter table creators enable row level security;
alter table referrals enable row level security;
alter table ugc_submissions enable row level security;
alter table loyalty_accounts enable row level security;

-- Example policy: allow anonymous inserts to the glow list only.
create policy "anon can subscribe" on subscribers
  for insert to anon with check (true);
