-- Add profile columns for settings and bio
alter table profiles 
add column if not exists headline text,
add column if not exists gender text,
add column if not exists phone text;
