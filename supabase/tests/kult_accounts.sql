-- Run against local Supabase after the migration, with a privileged psql
-- connection. Everything including the test users rolls back.
begin;
insert into auth.users (id, email) values
 ('dddddddd-0000-0000-0000-000000000001','kult-test-a@example.invalid'),
 ('dddddddd-0000-0000-0000-000000000002','kult-test-b@example.invalid');

do $$
begin
  if has_schema_privilege('authenticated','kult_private','usage')
    or has_function_privilege('anon','public.kult_taste_match(jsonb)','execute')
    or has_table_privilege('authenticated','kult_private.taste_accounts','select') then
    raise exception 'Private table/RPC grants are not isolated';
  end if;
end
$$;

set local role authenticated;
select set_config('request.jwt.claim.sub','dddddddd-0000-0000-0000-000000000001',true);
select public.kult_archive_merge('[{"id":"11","name":"A"},{"id":"22","name":"B"}]');
select public.kult_archive_merge('[{"id":"99","name":"Private viewer place"}]');

do $$
begin
  if jsonb_array_length(public.kult_archive_get()->'places') <> 3 then
    raise exception 'Merge did not preserve prior data';
  end if;
  if public.kult_shelf_get() <> '{"shelf":null}' then raise exception 'Archive was published automatically'; end if;
  begin
    perform public.kult_archive_merge('[{"id":"33","name":"C","url":"extra"}]');
    raise exception 'Extra data was retained';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.kult_shelf_publish('viewer','["11","22"]');
    raise exception 'Two-place shelf published';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.kult_shelf_publish('viewer','["11","22","33"]');
    raise exception 'Unarchived place published';
  exception when invalid_parameter_value then null; end;
end
$$;

select set_config('request.jwt.claim.sub','dddddddd-0000-0000-0000-000000000002',true);
do $$
begin
  if public.kult_archive_get() <> '{"places":[]}' then
    raise exception 'Peer archive was returned';
  end if;
end
$$;
select public.kult_archive_merge('[{"id":"11","name":"A"},{"id":"22","name":"B"},{"id":"33","name":"Public C"},{"id":"99","name":"Already known"},{"id":"88","name":"Peer private"}]');
select public.kult_shelf_publish('Local Wanderer','["11","22","33","99"]');
select public.kult_archive_merge('[{"id":"33","name":"Unpublished rename"}]');

select set_config('request.jwt.claim.sub','dddddddd-0000-0000-0000-000000000001',true);
do $$
declare matches jsonb;
begin
  matches := public.kult_taste_match('["11","22"]');
  if matches <> '{"matches":[{"nickname":"Local Wanderer","commonPlaceIds":["11","22"],"newPlaces":[{"id":"33","name":"Public C"}]}]}' then
    raise exception 'Wrong or excess match data: %', matches;
  end if;
  for i in 1..29 loop
    perform public.kult_taste_match('["11","22"]');
  end loop;
  begin
    perform public.kult_taste_match('["11","22"]');
    raise exception 'Rate budget not enforced';
  exception when sqlstate 'PT429' then null; end;
end
$$;

select set_config('request.jwt.claim.sub','dddddddd-0000-0000-0000-000000000002',true);
do $$
declare removal jsonb;
begin
  removal := public.kult_archive_remove('99');
  if jsonb_array_length(removal->'shelf'->'places') is distinct from 3
    or (removal->'shelf') is distinct from (public.kult_shelf_get()->'shelf')
    or (removal->'places') is distinct from (public.kult_archive_get()->'places') then
    raise exception 'Removing one place did not return the updated shelf and archive';
  end if;
  removal := public.kult_archive_remove('33');
  if removal->'shelf' is distinct from 'null'::jsonb
    or public.kult_shelf_get() <> '{"shelf":null}' then
    raise exception 'Shrinking shelf below three did not revoke it';
  end if;
  if jsonb_array_length(removal->'places') is distinct from 3
    or (removal->'places') is distinct from (public.kult_archive_get()->'places') then
    raise exception 'Archive did not remove the requested two places';
  end if;
end
$$;
select public.kult_shelf_revoke();
select public.kult_shelf_revoke();
reset role;
update kult_private.taste_accounts set match_count = 0;
set local role authenticated;
select set_config('request.jwt.claim.sub','dddddddd-0000-0000-0000-000000000001',true);
do $$
begin
  if public.kult_taste_match('["11","22"]') <> '{"matches":[]}' then raise exception 'Revoked shelf remains visible'; end if;
end
$$;

rollback;
