import type { MetadataRoute } from 'next';
import Galleries from '@/components/Gallery/Galleries';
import { getAllPagesFromWordPress } from '@/graphql/queries/getAllPages';
import { getArticles } from '@/graphql/queries/getArticles';

function getBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL.replace(/\/$/, '')}`;
  // Fallback for local dev; can be omitted in production
  return 'http://localhost:3000';
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseUrl();

  // 1) Collect WordPress pages
  let wpItems: MetadataRoute.Sitemap = [];
  try {
    const pages = await getAllPagesFromWordPress();
    const normalize = (uri: string) => uri.replace(/^\/+/, '').replace(/\/+$/, '');
    wpItems = pages
      .map((p) => p?.uri)
      .filter((u): u is string => Boolean(u && u.length > 0))
      .map((uri) => ({ url: `${baseUrl}/${normalize(uri)}`, lastModified: new Date() }));
  } catch {
    wpItems = [];
  }

  // 2) Collect Editions (from Galleries dataset)
  const years = Array.from(new Set(Galleries.map((g) => g.year)));
  const langs = ['en', 'bg'];
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

  // 4) Collect Articles (custom post type)
  const articlesEn = await getArticles('EN');
  const articlesBg = await getArticles('BG');
  const articles: MetadataRoute.Sitemap = [
    ...articlesEn.nodes.map((n) => ({ url: `${baseUrl}/en/articles/${n.slug}`, lastModified: new Date() })),
    ...articlesBg.nodes.map((n) => ({ url: `${baseUrl}/bg/articles/${n.slug}`, lastModified: new Date() })),
  ];

  // 5) Merge and de-duplicate by URL
  const byUrl = new Map<string, MetadataRoute.Sitemap[number]>();
  [...wpItems, ...editions, ...authors, ...articles].forEach((item) => byUrl.set(item.url, item));

  return Array.from(byUrl.values());
}
