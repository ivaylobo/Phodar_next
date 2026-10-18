import type { Article } from '@/content/types';
import bgArticles from './bg.json';
import enArticles from './en.json';

export function getLocalArticles(lang: 'bg' | 'en'): Article[] {
  return lang === 'bg' ? bgArticles : enArticles;
}

export function getLocalArticle(lang: 'bg' | 'en', slug: string): Article | undefined {
  return getLocalArticles(lang).find((article) => article.slug === slug);
}
