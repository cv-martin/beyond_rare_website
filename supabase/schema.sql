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



-- -------------------------------------------------------------
-- 6. Create Tables for Community Feed
-- -------------------------------------------------------------

-- Community Posts Table
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  author_id uuid references public.profiles(id) on delete cascade not null,
  group_id text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure constraints exist even if table was already created
alter table public.posts drop constraint if exists posts_content_check;
alter table public.posts add constraint posts_content_check check (
  char_length(trim(content)) between 1 and 5000
);

alter table public.posts drop constraint if exists posts_group_id_check;
alter table public.posts add constraint posts_group_id_check check (
  group_id in ('caregivers', 'stories', 'community')
);

-- Post Likes Table (Feed Specific)
create table if not exists public.post_likes (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (post_id, user_id)
);

-- Post Comments Table (Feed Specific)
create table if not exists public.post_comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure constraints exist even if table was already created
alter table public.post_comments drop constraint if exists post_comments_content_check;
alter table public.post_comments add constraint post_comments_content_check check (
  char_length(trim(content)) between 1 and 2000
);


-- -------------------------------------------------------------
-- 7. Enable Row Level Security (RLS)
-- -------------------------------------------------------------
alter table public.posts enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_comments enable row level security;


-- -------------------------------------------------------------
-- 8. Clean Existing Triggers and Policies (Repeatable Setup)
-- -------------------------------------------------------------
drop trigger if exists on_post_updated on public.posts;
drop trigger if exists on_post_comment_updated on public.post_comments;

drop policy if exists "Posts are viewable by everyone" on public.posts;
drop policy if exists "Logged-in users can create posts" on public.posts;
drop policy if exists "Users can update their own posts" on public.posts;
drop policy if exists "Users can delete their own posts" on public.posts;

drop policy if exists "Post likes are viewable by everyone" on public.post_likes;
drop policy if exists "Users can insert their own post likes" on public.post_likes;
drop policy if exists "Users can delete their own post likes" on public.post_likes;

drop policy if exists "Post comments are viewable by everyone" on public.post_comments;
drop policy if exists "Logged-in users can create post comments" on public.post_comments;
drop policy if exists "Users can update their own post comments" on public.post_comments;
drop policy if exists "Users can delete their own post comments" on public.post_comments;


-- -------------------------------------------------------------
-- 9. Recreate Policies and Triggers
-- -------------------------------------------------------------

-- Policies for Posts
create policy "Posts are viewable by everyone"
  on public.posts
  for select
  using (true);

create policy "Logged-in users can create posts"
  on public.posts
  for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Users can update their own posts"
  on public.posts
  for update
  to authenticated
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

create policy "Users can delete their own posts"
  on public.posts
  for delete
  to authenticated
  using (auth.uid() = author_id);

-- Policies for Post Likes
create policy "Post likes are viewable by everyone"
  on public.post_likes
  for select
  using (true);

create policy "Users can insert their own post likes"
  on public.post_likes
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can delete their own post likes"
  on public.post_likes
  for delete
  to authenticated
  using (auth.uid() = user_id);

-- Policies for Post Comments
create policy "Post comments are viewable by everyone"
  on public.post_comments
  for select
  using (true);

create policy "Logged-in users can create post comments"
  on public.post_comments
  for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update their own post comments"
  on public.post_comments
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete their own post comments"
  on public.post_comments
  for delete
  to authenticated
  using (auth.uid() = user_id);


-- Secure Trigger Function & Recreate Triggers
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_post_updated
  before update on public.posts
  for each row execute procedure public.set_updated_at();

create trigger on_post_comment_updated
  before update on public.post_comments
  for each row execute procedure public.set_updated_at();


-- -------------------------------------------------------------
-- 10. Create Indexes
-- -------------------------------------------------------------
create index if not exists posts_author_id_idx
  on public.posts(author_id);

create index if not exists posts_group_created_at_idx
  on public.posts(group_id, created_at desc);

create index if not exists post_likes_post_id_idx
  on public.post_likes(post_id);

create index if not exists post_likes_user_id_idx
  on public.post_likes(user_id);

create index if not exists post_comments_post_created_at_idx
  on public.post_comments(post_id, created_at asc);

create index if not exists post_comments_user_id_idx
  on public.post_comments(user_id);


-- -------------------------------------------------------------
-- 11. Revoke and Apply Privileged Grants
-- -------------------------------------------------------------
-- Explicitly revoke existing privileges
revoke all on public.posts from anon, authenticated;
revoke all on public.post_likes from anon, authenticated;
revoke all on public.post_comments from anon, authenticated;

-- Anonymous users (Public read-only)
grant select on public.posts to anon;
grant select on public.post_likes to anon;
grant select on public.post_comments to anon;

-- Authenticated users (Full CRUD subject to RLS)
grant select, insert, update, delete on public.posts to authenticated;
grant select, insert, delete on public.post_likes to authenticated;
grant select, insert, update, delete on public.post_comments to authenticated;
