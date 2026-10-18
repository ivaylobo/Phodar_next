import type { MetadataRoute } from 'next';
import Galleries from '@/components/Gallery/Galleries';
import { generateLocalPageParams } from '@/content/pages';
import { getLocalArticles } from '@/content/articles';

export const dynamic = 'force-static';

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  // Fallback for local dev; can be omitted in production
  return 'https://phodar.net';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  const langs = ['en', 'bg'] as const;
  const pages: MetadataRoute.Sitemap = [
    ...langs.flatMap((lang) => [
      { url: `${baseUrl}/${lang}` },
      { url: `${baseUrl}/${lang}/articles` },
      { url: `${baseUrl}/${lang}/editions` },
    ]),
    ...generateLocalPageParams().map(({ lang, slug }) => ({
      url: `${baseUrl}/${lang}/${slug}`,
    })),
  ];

  // 2) Collect Editions (from Galleries dataset)
  const years = Array.from(new Set(Galleries.map((g) => g.year)));
  const editions: MetadataRoute.Sitemap = langs.flatMap((lang) =>
    years.map((year) => ({ url: `${baseUrl}/${lang}/editions/${year}`, lastModified: new Date() }))
  );

  // 3) Collect Author gallery URLs (route segments: /{lang}/editions/{year}/{authorSlug})
  const authors: MetadataRoute.Sitemap = langs.flatMap((lang) =>
    Galleries.flatMap((edition) =>
      (edition.authors || []).map((author) => {
        const slug = author.name.replace(/ /g, '_');
        return {
          url: `${baseUrl}/${lang}/editions/${edition.year}/${encodeURIComponent(slug)}`,
          lastModified: new Date(),
        } as const;
      })
    )
  );

  const articles: MetadataRoute.Sitemap = langs.flatMap((lang) =>
    getLocalArticles(lang).map((article) => ({
      url: `${baseUrl}/${lang}/articles/${article.slug}`,
      ...(article.date ? { lastModified: article.date } : {}),
    })),
  );

  // 5) Merge and de-duplicate by URL
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  [...pages, ...editions, ...authors, ...articles].forEach((item) => byUrl.set(item.url, item));

  return Array.from(byUrl.values());
}
