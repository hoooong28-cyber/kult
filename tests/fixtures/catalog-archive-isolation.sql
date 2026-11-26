set role anon;
do $$ begin
  begin
    perform public.kult_catalog_saves_get();
    raise exception 'Anonymous read allowed';
  exception when insufficient_privilege then null;
  end;
end $$;

set role authenticated;
do $$ begin
  begin
    perform public.kult_catalog_saves_get();
    raise exception 'Read without auth uid allowed';
  exception when insufficient_privilege then null;
  end;
  begin
    perform public.kult_catalog_save_set('lowkey-seongsu', true);
    raise exception 'Write without auth uid allowed';
  exception when insufficient_privilege then null;
  end;
end $$;

select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);
select public.kult_archive_merge('[{"id":"1393890643","name":"로우키 성수"}]');
select public.kult_catalog_save_set('lowkey-seongsu', true);
select public.kult_catalog_save_set('lowkey-seongsu', true);
do $$ begin
  if public.kult_catalog_saves_get() <> '["lowkey-seongsu"]'::jsonb then raise exception 'Account A save was missing or duplicated'; end if;
  if public.kult_archive_get()->'places' <> '[{"id":"1393890643","name":"로우키 성수"}]'::jsonb then raise exception 'Naver archive had unwanted changes'; end if;
  if public.kult_shelf_get()->'shelf' <> 'null'::jsonb then raise exception 'Private save appeared on public shelf'; end if;
  begin
    perform 1 from kult_private.catalog_saves;
    raise exception 'Direct account archive table access allowed';
  exception when insufficient_privilege then null;
  end;
end $$;

select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', false);
do $$ begin
  if public.kult_catalog_saves_get() <> '[]'::jsonb then raise exception 'Account B read A saves'; end if;
end $$;
select public.kult_catalog_save_set('lowkey-seongsu', false);
select public.kult_catalog_save_set('cuco-seongsu', true);

select set_config('request.jwt.claim.sub', '11111111-1111-1111-1111-111111111111', false);
do $$ begin
  if public.kult_catalog_saves_get() <> '["lowkey-seongsu"]'::jsonb then raise exception 'Account B mutated A saves'; end if;
end $$;
select public.kult_catalog_save_set('lowkey-seongsu', false);
do $$ begin
  if public.kult_catalog_saves_get() <> '[]'::jsonb then raise exception 'Account A removal failed'; end if;
  if public.kult_archive_get()->'places' <> '[{"id":"1393890643","name":"로우키 성수"}]'::jsonb then raise exception 'Catalog removal modified Naver archive'; end if;
end $$;

select set_config('request.jwt.claim.sub', '22222222-2222-2222-2222-222222222222', false);
do $$ begin
  if public.kult_catalog_saves_get() <> '["cuco-seongsu"]'::jsonb then raise exception 'Account A removal modified B'; end if;
end $$;
