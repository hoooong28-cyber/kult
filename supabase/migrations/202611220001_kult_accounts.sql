begin;

create schema if not exists kult_private;
revoke all on schema kult_private from public, anon, authenticated, service_role;

create table kult_private.taste_accounts (
  user_id uuid primary key references auth.users(id) on delete cascade,
  places jsonb not null default '[]'::jsonb,
  shared_places jsonb not null default '[]'::jsonb,
  shelf_ids jsonb not null default '[]'::jsonb,
  nickname text,
  match_window timestamptz not null default '-infinity',
  match_count integer not null default 0
);
alter table kult_private.taste_accounts enable row level security;
revoke all on table kult_private.taste_accounts from public, anon, authenticated, service_role;

create function kult_private.require_user() returns uuid
language plpgsql stable security invoker set search_path = ''
as $$
declare uid uuid := auth.uid();
begin
  if uid is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;
  return uid;
end
$$;

create function kult_private.valid_place_ids(ids jsonb) returns boolean
language plpgsql immutable security invoker set search_path = ''
as $$
begin
  if jsonb_typeof(ids) is distinct from 'array' then return false; end if;
  if jsonb_array_length(ids) > 100 then return false; end if;
  return not exists (
    select 1 from jsonb_array_elements(ids) as i(value)
    where jsonb_typeof(value) <> 'string' or (value #>> '{}') !~ '^[1-9][0-9]{0,19}$'
  ) and (select count(distinct value) = count(*) from jsonb_array_elements(ids) as i(value));
end
$$;

create function kult_private.shelf_json(owner_nickname text, owner_places jsonb, owner_ids jsonb)
returns jsonb
language sql immutable security invoker set search_path = ''
as $$
  select jsonb_build_object('shelf', case when owner_nickname is not null then
    jsonb_build_object('nickname', owner_nickname, 'places', (
      select coalesce(jsonb_agg(value order by ordinality), '[]'::jsonb)
      from jsonb_array_elements(owner_places) with ordinality as p(value, ordinality)
      where owner_ids ? (value ->> 'id')
    )) else null end)
$$;

create function public.kult_archive_get() returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare uid uuid := kult_private.require_user();
begin
  return jsonb_build_object('places', coalesce((
    select places from kult_private.taste_accounts where user_id = uid
  ), '[]'::jsonb));
end
$$;

create function public.kult_archive_merge(p_places jsonb) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := kult_private.require_user();
  normalized jsonb;
  merged jsonb;
begin
  if jsonb_typeof(p_places) is distinct from 'array' then
    raise exception 'Places must be an array' using errcode = '22023';
  end if;
  if jsonb_array_length(p_places) > 500 or octet_length(p_places::text) > 300000 then
    raise exception 'Archive limit exceeded' using errcode = '22023';
  end if;
  if exists (
    select 1 from jsonb_array_elements(p_places) as p(value)
    where jsonb_typeof(value) <> 'object'
      or jsonb_typeof(value -> 'id') is distinct from 'string'
      or (value ->> 'id') !~ '^[1-9][0-9]{0,19}$'
      or jsonb_typeof(value -> 'name') is distinct from 'string'
      or char_length(btrim(value ->> 'name')) not between 1 and 100
      or (value ->> 'name') ~ '[[:cntrl:]]'
      or case when jsonb_typeof(value) = 'object' then value - 'id' - 'name' <> '{}'::jsonb else false end
  ) then raise exception 'Invalid archive place' using errcode = '22023'; end if;
  if (select count(distinct value ->> 'id') <> count(*) from jsonb_array_elements(p_places) as p(value)) then
    raise exception 'Duplicate place IDs' using errcode = '22023';
  end if;

  select coalesce(jsonb_agg(jsonb_build_object('id', value ->> 'id','name', btrim(value ->> 'name'))
    order by ordinality), '[]'::jsonb)
  into normalized
  from jsonb_array_elements(p_places) with ordinality as p(value, ordinality);

  insert into kult_private.taste_accounts (user_id) values (uid) on conflict do nothing;
  select places into merged from kult_private.taste_accounts where user_id = uid for update;
  select coalesce(jsonb_agg(value order by source, ordinality), '[]'::jsonb) into merged
  from (
    select 0 as source, p.value, p.ordinality
      from jsonb_array_elements(normalized) with ordinality as p(value, ordinality)
    union all
    select 1, p.value, p.ordinality
      from jsonb_array_elements(merged) with ordinality as p(value, ordinality)
      where not exists (select 1 from jsonb_array_elements(normalized) as n(value)
        where n.value ->> 'id' = p.value ->> 'id')
  ) as combined;
  if jsonb_array_length(merged) > 500 then
    raise exception 'Archive limit exceeded' using errcode = '22023';
  end if;
  update kult_private.taste_accounts set places = merged where user_id = uid;
  return jsonb_build_object('places', merged);
end
$$;

create function public.kult_archive_remove(p_place_id text) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := kult_private.require_user();
  account kult_private.taste_accounts%rowtype;
  remaining jsonb;
begin
  if p_place_id is null or p_place_id !~ '^[1-9][0-9]{0,19}$' then
    raise exception 'Invalid place ID' using errcode = '22023';
  end if;
  select * into account from kult_private.taste_accounts where user_id = uid for update;
  if not found then return '{"places":[],"shelf":null}'::jsonb; end if;
  select coalesce(jsonb_agg(value order by ordinality), '[]'::jsonb) into remaining
    from jsonb_array_elements(account.places) with ordinality as p(value, ordinality)
    where value ->> 'id' <> p_place_id;
  account.places := remaining;

  if account.shelf_ids ? p_place_id then
    account.shelf_ids := account.shelf_ids - p_place_id;
    if jsonb_array_length(account.shelf_ids) < 3 then
      account.shelf_ids := '[]'::jsonb;
      account.shared_places := '[]'::jsonb;
      account.nickname := null;
    else
      select coalesce(jsonb_agg(value order by ordinality), '[]'::jsonb) into remaining
        from jsonb_array_elements(account.shared_places) with ordinality as p(value, ordinality)
        where value ->> 'id' <> p_place_id;
      account.shared_places := remaining;
    end if;
  end if;

  update kult_private.taste_accounts set places = account.places,
    shelf_ids = account.shelf_ids, shared_places = account.shared_places, nickname = account.nickname
    where user_id = uid;
  return jsonb_build_object('places', account.places)
    || kult_private.shelf_json(account.nickname, account.shared_places, account.shelf_ids);
end
$$;

create function public.kult_shelf_get() returns jsonb
language plpgsql stable security definer set search_path = ''
as $$
declare uid uuid := kult_private.require_user();
begin
  return coalesce((
    select kult_private.shelf_json(nickname, shared_places, shelf_ids)
    from kult_private.taste_accounts where user_id = uid
  ), '{"shelf":null}'::jsonb);
end
$$;

create function public.kult_shelf_publish(p_nickname text,p_place_ids jsonb) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := kult_private.require_user();
  label text := btrim(p_nickname);
  archive jsonb;
begin
  if label is null or char_length(label) not between 1 and 40 or label ~ '[[:cntrl:]]'
    or position('@' in label) > 0 then
    raise exception 'Invalid display nickname' using errcode = '22023';
  end if;
  if not kult_private.valid_place_ids(p_place_ids) then
    raise exception 'Invalid selection' using errcode = '22023';
  end if;
  if jsonb_array_length(p_place_ids) < 3 then
    raise exception 'Select at least three places' using errcode = '22023';
  end if;
  select places into archive from kult_private.taste_accounts where user_id = uid for update;
  if archive is null or exists (
    select 1 from jsonb_array_elements_text(p_place_ids) as i(id)
    where not exists (select 1 from jsonb_array_elements(archive) as p(value) where p.value ->> 'id' = i.id)
  ) then raise exception 'Select only your archived places' using errcode = '22023'; end if;
  update kult_private.taste_accounts set nickname = label, shelf_ids = p_place_ids,
    shared_places = (select jsonb_agg(value) from jsonb_array_elements(archive) as p(value)
      where p_place_ids ? (value ->> 'id'))
    where user_id = uid;
  return kult_private.shelf_json(label, archive, p_place_ids);
end
$$;

create function public.kult_shelf_revoke() returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare uid uuid := kult_private.require_user();
begin
  update kult_private.taste_accounts set shared_places = '[]'::jsonb, nickname = null, shelf_ids = '[]'::jsonb
    where user_id = uid;
  return '{"shelf":null}'::jsonb;
end
$$;

create function public.kult_taste_match(p_place_ids jsonb) returns jsonb
language plpgsql security definer set search_path = ''
as $$
declare
  uid uuid := kult_private.require_user();
  tick timestamptz := clock_timestamp();
  archive jsonb;
  result jsonb;
  archive_ids jsonb;
begin
  if not kult_private.valid_place_ids(p_place_ids) then
    raise exception 'Invalid selection' using errcode = '22023';
  end if;
  if jsonb_array_length(p_place_ids) < 2 then return '{"matches":[]}'::jsonb; end if;

  -- Atomically reserve a request per account. Keep the lock until the RPC is done.
  update kult_private.taste_accounts as a set
    match_count = case when a.match_window <= tick - interval '1 minute' then 1 else a.match_count + 1 end,
    match_window = case when a.match_window <= tick - interval '1 minute' then tick else a.match_window end
  where a.user_id = uid and (a.match_count < 30 or a.match_window <= tick - interval '1 minute')
  returning a.places into archive;

  if not found then
    if exists (select 1 from kult_private.taste_accounts where user_id = uid) then
      raise exception 'Too many match requests' using errcode = 'PT429';
    end if;
    return '{"matches":[]}'::jsonb;
  end if;
  if exists (
    select 1 from jsonb_array_elements_text(p_place_ids) as i(id)
    where not exists (select 1 from jsonb_array_elements(archive) as p(value) where p.value ->> 'id' = i.id)
  ) then raise exception 'Select only your archived places' using errcode = '22023'; end if;

  select jsonb_agg(value ->> 'id') into archive_ids from jsonb_array_elements(archive) as p(value);
  select jsonb_build_object('matches', coalesce(
    jsonb_agg(jsonb_build_object('nickname', m.nickname, 'commonPlaceIds', m.common, 'newPlaces', m.new_places)
      order by m.overlap desc, m.shelf_size asc, m.user_id), '[]'::jsonb
  )) into result
  from (
    select a.nickname, a.user_id, details.common, details.overlap, details.shelf_size, details.new_places
    from kult_private.taste_accounts as a
    cross join lateral (
      select count(*) as shelf_size, count(*) filter (where p_place_ids ? (value ->> 'id')) as overlap,
        count(*) filter (where not (archive_ids ? (value ->> 'id'))) as unseen,
        jsonb_agg(value ->> 'id' order by value ->> 'id')
          filter (where p_place_ids ? (value ->> 'id')) as common,
        jsonb_agg(value order by value ->> 'id')
          filter (where not (archive_ids ? (value ->> 'id'))) as new_places
      from jsonb_array_elements(a.shared_places) as p(value)
      where a.shelf_ids ? (value ->> 'id')
    ) as details
    where a.user_id <> uid and a.nickname is not null and details.overlap >= 2 and details.unseen >= 1
    order by details.overlap desc, details.shelf_size asc, a.user_id
    limit 10
  ) as m;
  return result;
end
$$;

revoke all on all functions in schema kult_private from public, anon, authenticated, service_role;
revoke all on function public.kult_archive_get(), public.kult_archive_merge(jsonb), public.kult_archive_remove(text),
  public.kult_shelf_get(), public.kult_shelf_publish(text,jsonb), public.kult_shelf_revoke(),
  public.kult_taste_match(jsonb) from public, anon, authenticated, service_role;
grant execute on function public.kult_archive_get(), public.kult_archive_merge(jsonb), public.kult_archive_remove(text),
  public.kult_shelf_get(), public.kult_shelf_publish(text,jsonb), public.kult_shelf_revoke(),
  public.kult_taste_match(jsonb) to authenticated;

commit;
