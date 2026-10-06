'use client';
import { useEffect, useRef, useState } from 'react';
import { getFollowingIds, subscribeFollowChanges, toggleFollow } from '@/lib/followStore';
import { getCurrentUser, subscribeUser } from '@/lib/userStore';
import { sourceFromLocation } from '@/lib/interactions';
import AuthModal from './AuthModal';
export default function FollowCuratorButton({curatorId}: {curatorId: string}) {
  const [followed, setFollowed] = useState(false), [auth, setAuth] = useState(false), [error, setError] = useState('');
  const pending = useRef(false);
  function change() { try {setFollowed(toggleFollow(curatorId,{recommendation_source:sourceFromLocation()}));setError('');} catch {setError('팔로우를 저장하지 못했습니다. 다시 시도해 주세요.');} }
  useEffect(() => {setFollowed(getFollowingIds().includes(curatorId));return subscribeFollowChanges(ids => setFollowed(ids.includes(curatorId)));},[curatorId]);
  useEffect(() => subscribeUser(user => {if (user && pending.current) {pending.current=false;change();}}),[curatorId]);
  return <div><button aria-pressed={followed} onClick={() => {if (!getCurrentUser()) {pending.current=true;setAuth(true);} else change();}} className="min-h-11 rounded-xl px-5 py-3 bg-amber-400 text-stone-950 text-sm font-bold">{followed ? '팔로잉 · 해제' : 'Curator 팔로우'}</button>{error && <p role="alert">{error}</p>}<AuthModal isOpen={auth} onClose={() => {pending.current=false;setAuth(false);}} /></div>;
}
