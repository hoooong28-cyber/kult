begin;

create table kult_private.catalog_saves (
  user_id uuid not null references auth.users(id) on delete cascade,
  place_id text not null check (char_length(place_id) <= 120 and place_id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  saved_at timestamptz not null default now(),
  primary key (user_id, place_id)
);
alter table kult_private.catalog_saves enable row level security;
revoke all on table kult_private.catalog_saves from public, anon, authenticated, service_role;

create function public.kult_catalog_saves_get() returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare uid uuid := kult_private.require_user();
begin
  return (
    select coalesce(jsonb_agg(place_id order by saved_at desc, place_id), '[]'::jsonb)
    from kult_private.catalog_saves
    where user_id = uid
  );
end
$$;

create function public.kult_catalog_save_set(p_place_id text, p_saved boolean) returns void
language plpgsql security definer set search_path = ''
as $$
declare uid uuid := kult_private.require_user();
begin
  if p_saved is null or p_place_id is null or char_length(p_place_id) > 120
    or p_place_id !~ '^[a-z0-9]+(-[a-z0-9]+)*$' then
    raise exception 'Invalid catalog place' using errcode = '22023';
  end if;
  -- Serialize changes per account using the existing private row.
  insert into kult_private.taste_accounts (user_id) values (uid) on conflict do nothing;
  perform 1 from kult_private.taste_accounts where user_id = uid for update;
  if p_saved then
    if not exists (select 1 from kult_private.catalog_saves where user_id = uid and place_id = p_place_id)
      and (select count(*) from kult_private.catalog_saves where user_id = uid) >= 500 then
      raise exception 'Archive limit exceeded' using errcode = '22023';
    end if;
    insert into kult_private.catalog_saves (user_id, place_id) values (uid, p_place_id) on conflict do nothing;
  else
    delete from kult_private.catalog_saves where user_id = uid and place_id = p_place_id;
  end if;
end
$$;

revoke all on function public.kult_catalog_saves_get(), public.kult_catalog_save_set(text, boolean) from public, anon, authenticated, service_role;
grant execute on function public.kult_catalog_saves_get(), public.kult_catalog_save_set(text, boolean) to authenticated;

commit;
