--
-- Supabase Schema for Comments, Likes, and User Profiles
-- Beyond Rare Website
--

-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- -------------------------------------------------------------
-- 1. Profiles Table
-- -------------------------------------------------------------
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  name text not null,
  avatar text default '/images/logo.avif',
  role text default 'Supporter',
  bio text default '',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for profiles
alter table public.profiles enable row level security;

-- Policies for profiles
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can insert their own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can update their own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can delete their own profile" on public.profiles
  for delete using (auth.uid() = id);


-- -------------------------------------------------------------
-- 2. Comments Table
-- -------------------------------------------------------------
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_slug text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  is_approved boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for comments
alter table public.comments enable row level security;

-- Policies for comments
create policy "Approved comments are viewable by everyone" on public.comments
  for select using (is_approved = true or auth.uid() = user_id);

create policy "Logged-in users can create comments" on public.comments
  for insert with check (
    auth.role() = 'authenticated' 
    and auth.uid() = user_id
  );

create policy "Users can update their own comments" on public.comments
  for update using (auth.uid() = user_id);

create policy "Users can delete their own comments" on public.comments
  for delete using (auth.uid() = user_id);


-- -------------------------------------------------------------
-- 3. Likes Table
-- -------------------------------------------------------------
create table if not exists public.likes (
  id uuid default gen_random_uuid() primary key,
  post_slug text not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (post_slug, user_id)
);

-- Enable RLS for likes
alter table public.likes enable row level security;

-- Policies for likes
create policy "Likes are viewable by everyone" on public.likes
  for select using (true);

create policy "Users can insert their own likes" on public.likes
  for insert with check (
    auth.role() = 'authenticated' 
    and auth.uid() = user_id
  );

create policy "Users can delete their own likes" on public.likes
  for delete using (auth.uid() = user_id);


-- -------------------------------------------------------------
-- 4. Automatically Sync auth.users to public.profiles
-- -------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
declare
  display_name text;
begin
  display_name := coalesce(
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'name', 
    new.email
  );
  
  -- Prevent mock login bypass tokens from being saved as display name
  if display_name ilike '%bypass%' or display_name ilike '%password%' then
    display_name := split_part(new.email, '@', 1);
  end if;

  insert into public.profiles (id, name, avatar, role, bio)
  values (
    new.id,
    display_name,
    coalesce(
      new.raw_user_meta_data->>'avatar_url', 
      '/images/logo.avif'
    ),
    coalesce(
      new.raw_user_meta_data->>'role', 
      'Supporter'
    ),
    ''
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to automatically call handle_new_user on signup
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- -------------------------------------------------------------
-- 5. Role Table Grants
-- -------------------------------------------------------------
grant select, insert, update, delete on public.profiles to anon, authenticated, service_role;
grant select, insert, update, delete on public.comments to anon, authenticated, service_role;
grant select, insert, update, delete on public.likes to anon, authenticated, service_role;

