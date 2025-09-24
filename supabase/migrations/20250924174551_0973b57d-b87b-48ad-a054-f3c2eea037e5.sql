-- Ensure fund-logos bucket exists and is public
insert into storage.buckets (id, name, public)
select 'fund-logos', 'fund-logos', true
where not exists (
  select 1 from storage.buckets where id = 'fund-logos'
);

update storage.buckets
set public = true
where id = 'fund-logos' and public is not true;

-- Ensure public read access policy exists for fund-logos
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Public read access to fund-logos'
  ) then
    create policy "Public read access to fund-logos"
    on storage.objects
    for select
    using (bucket_id = 'fund-logos');
  end if;
end $$;

-- Ensure admin-only insert policy for fund-logos
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins can insert into fund-logos'
  ) then
    create policy "Admins can insert into fund-logos"
    on storage.objects
    for insert
    with check (bucket_id = 'fund-logos' and public.is_user_admin());
  end if;
end $$;

-- Ensure admin-only update policy for fund-logos
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins can update fund-logos'
  ) then
    create policy "Admins can update fund-logos"
    on storage.objects
    for update
    using (bucket_id = 'fund-logos' and public.is_user_admin());
  end if;
end $$;

-- Ensure admin-only delete policy for fund-logos
do $$
begin
  if not exists (
    select 1 from pg_policies 
    where schemaname = 'storage' and tablename = 'objects' and policyname = 'Admins can delete from fund-logos'
  ) then
    create policy "Admins can delete from fund-logos"
    on storage.objects
    for delete
    using (bucket_id = 'fund-logos' and public.is_user_admin());
  end if;
end $$;
