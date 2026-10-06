'use client';
import Link from 'next/link';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { track, sourceFromLocation, withSource, type InteractionContext, type InteractionName, type RecommendationSource } from '@/lib/interactions';

export function PageInteraction({event, ...context}: InteractionContext & {event: InteractionName}) {
  const sent = useRef(false);
  useEffect(() => {if (!sent.current) {sent.current=true;track(event,{...context,recommendation_source:context.recommendation_source || sourceFromLocation()});}}, [event,context.place_id,context.story_id,context.curator_id]);
  return null;
}
export function Impression({event, children, ...context}: InteractionContext & {event: 'place_impression' | 'story_impression'; children: ReactNode}) {
  const ref = useRef<HTMLDivElement>(null), sent = useRef(false);
  useEffect(() => {
    const node=ref.current; if (!node || !('IntersectionObserver' in window)) return;
    let timer: ReturnType<typeof setTimeout> | undefined, visible=false;
    function schedule() {clearTimeout(timer);if (visible && document.visibilityState === 'visible' && !sent.current) timer=setTimeout(() => {sent.current=true;track(event,context);},1000);}
    const observer=new IntersectionObserver(([entry]) => {visible=entry.isIntersecting && entry.intersectionRatio>=0.5;schedule();},{threshold:[0,0.5]});
    observer.observe(node);document.addEventListener('visibilitychange',schedule);
    return () => {clearTimeout(timer);observer.disconnect();document.removeEventListener('visibilitychange',schedule);};
  },[event,context.place_id,context.story_id,context.recommendation_source]);
  return <div ref={ref} className="min-w-0">{children}</div>;
}
export function SourceLink({href,source,children,className}: {href:string;source:RecommendationSource;children:ReactNode;className?:string}) {
  return <Link href={withSource(href,source)} className={className}>{children}</Link>;
}
export function MapLink({href,placeId,children,className}: {href:string;placeId?:string;children:ReactNode;className?:string}) {
  return <a href={href} target="_blank" rel="noopener noreferrer" className={className} onClick={() => track('map_open',{place_id:placeId,recommendation_source:sourceFromLocation()})}>{children}</a>;
}
/** Reading signal means >=20 active seconds with article on screen AND reaching its end. */
export function StoryReading({storyId,children}: {storyId:string;children:ReactNode}) {
  const ref=useRef<HTMLElement>(null), end=useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current || !end.current || !('IntersectionObserver' in window)) return;
    let active=false, reachedEnd=false, seconds=0, sent=false;
    const articleObserver=new IntersectionObserver(([entry]) => {active=entry.isIntersecting;});
    const endObserver=new IntersectionObserver(([entry]) => {if(entry.isIntersecting && document.visibilityState==='visible') reachedEnd=true;});
    articleObserver.observe(ref.current);endObserver.observe(end.current);
    const timer=setInterval(() => {if (document.visibilityState==='visible' && active) seconds++;if (!sent && seconds>=20 && reachedEnd) {sent=true;track('story_read',{story_id:storyId,recommendation_source:sourceFromLocation()});}},1000);
    return () => {clearInterval(timer);articleObserver.disconnect();endObserver.disconnect();};
  },[storyId]);
  return <article ref={ref}>{children}<div ref={end} aria-hidden="true" className="h-1" /></article>;
}
export function ShareButton({context}: {context:InteractionContext}) {
  const [message,setMessage]=useState('');
  return <div><button className="min-h-11 border border-stone-400 rounded-xl px-4 py-2 text-sm" onClick={async () => {
    const url=new URL(window.location.href);url.search='';url.hash='';
    const nativeShare = typeof navigator.share === 'function';
    try {if(nativeShare) await navigator.share({title:document.title,url:url.toString()});else await navigator.clipboard.writeText(url.toString());track('share',{...context,recommendation_source:sourceFromLocation()});setMessage(nativeShare?'공유했습니다.':'링크를 복사했습니다.');}catch(e){if(!(e instanceof Error && e.name==='AbortError'))setMessage('공유하지 못했습니다. 주소를 직접 복사해 주세요.');}
  }}>공유하기</button>{message && <p role="status" className="text-xs mt-2">{message}</p>}</div>;
}
