import { stories } from '@/lib/stories';
import { MetadataRoute } from 'next';
import { getMergedCafes, getAllCurators } from '@/lib/curators';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://kult-magazine.vercel.app';

  // Core static pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // Dynamic Cafe detail pages
  const cafes = await getMergedCafes();
  for (const cafe of cafes) {
    routes.push({
      url: `${baseUrl}/cafe/${cafe.id}`,
      lastModified: cafe.last_verified_date ? new Date(cafe.last_verified_date) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    });
  }

  // Dynamic Curator profile pages
  const curators = await getAllCurators();
  for (const curator of curators) {
    routes.push({
      url: `${baseUrl}/curator/${curator.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });
  }

  for (const story of stories) routes.push({url: `${baseUrl}/story/${story.id}`, changeFrequency: 'monthly', priority: 0.7});
  return routes;
}
