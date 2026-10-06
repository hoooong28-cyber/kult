import type { Story } from '@/lib/stories';
import type { RecommendationSource } from '@/lib/interactions';
import { Impression, SourceLink } from './Interaction';
export default function StoryCards({stories,source='editorial'}:{stories:Story[];source?:RecommendationSource}) {
  if (!stories.length) return null;
  return <section className="space-y-5"><div><p className="text-xs tracking-[.2em] text-[#bf703a] font-bold">KULT STORIES</p><h2 className="font-serif text-2xl mt-2">공간을 고르는 사람들의 이야기</h2></div><div className="grid sm:grid-cols-2 gap-5">{stories.map(story => <Impression key={story.id} event="story_impression" story_id={story.id} recommendation_source={source}><SourceLink href={`/story/${story.id}`} source={source} className="block h-full rounded-2xl border border-[#bf703a]/30 p-6 hover:border-[#bf703a] transition-colors"><p className="text-xs text-[#bf703a]">{story.author}</p><h3 className="font-serif text-xl mt-3 mb-3">{story.title}</h3><p className="text-sm opacity-75 leading-6">{story.subtitle}</p><p className="text-xs mt-5">이야기 읽기 →</p></SourceLink></Impression>)}</div></section>;
}
