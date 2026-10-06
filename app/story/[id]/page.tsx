import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getStory } from '@/lib/stories';
import { getMergedCafes, getAllCurators } from '@/lib/curators';
import CafeCard from '@/components/CafeCard';
import { PageInteraction, StoryReading, SourceLink, ShareButton } from '@/components/Interaction';
export async function generateMetadata({params}:{params:Promise<{id:string}>}) {const {id}=await params;const story=getStory(id);return {title:story?`${story.title} — KULT Stories`:'Story Not Found — KULT'};}
export default async function StoryPage({params}:{params:Promise<{id:string}>}) {
  const {id}=await params;const story=getStory(id);if(!story) notFound();
  const cafes=(await getMergedCafes()).filter(c=>story.place_ids.includes(c.id));
  const curators=(await getAllCurators()).filter(c=>story.curator_ids.includes(c.id));
  return <div className="min-h-screen bg-[#fcf9f5] text-[#1c1c1a] pb-16"><PageInteraction key={id} event="story_open" story_id={id} /><nav className="border-b border-stone-200 px-5 py-5"><div className="max-w-5xl mx-auto flex justify-between"><Link href="/" className="font-serif font-bold text-xl">KULT</Link><Link href="/archive" className="text-sm">내 KULT</Link></div></nav><main className="max-w-5xl mx-auto px-5 py-12 space-y-12"><StoryReading storyId={id}><header className="max-w-3xl mx-auto border-b border-stone-300 pb-8 mb-8"><p className="text-xs tracking-[.2em] text-[#bf703a]">KULT STORIES / EDITORIAL NOTE</p><h1 className="font-serif text-3xl sm:text-5xl leading-tight mt-5">{story.title}</h1><p className="text-lg text-stone-600 mt-5">{story.subtitle}</p><p className="text-xs mt-6">{story.author} · 기존 큐레이터 기록을 바탕으로</p></header><div className="max-w-2xl mx-auto space-y-7 text-base sm:text-lg leading-8">{story.paragraphs.map(p=><p key={p}>{p}</p>)}</div></StoryReading><ShareButton context={{story_id:id}} /><section className="border-t border-stone-300 pt-6 space-y-3"><h2 className="font-serif text-2xl">이 이야기의 큐레이션</h2>{curators.map(c=><SourceLink key={c.id} href={`/curator/${c.id}`} source="story" className="block py-3 text-sm">{c.display_name} · 추천 공간 더 보기 →</SourceLink>)}</section><section className="space-y-5"><h2 className="font-serif text-2xl">이야기 속 공간, 내 KULT로</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-5">{cafes.map(c=><CafeCard key={c.id} cafe={c} source="story" />)}</div></section></main></div>;
}
