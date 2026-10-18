import type { ContentPage } from '@/content/types';
import bgCookies from './bg/cookies.json';
import enCookies from './en/cookies.json';
import bgAbout from './bg/about.json';
import bgRegulations from './bg/regulations.json';
import enAbout from './en/about.json';
import enRegulations from './en/regulations.json';

export const localPages: Record<string, Record<string, ContentPage>> = {
    bg: { cookies: bgCookies, about: bgAbout, regulations: bgRegulations },
    en: { cookies: enCookies, about: enAbout, regulations: enRegulations },
};

export function getLocalPage(lang: string, slug: string): ContentPage | undefined {
    if (!Object.hasOwn(localPages, lang)) return undefined;
    const pages = localPages[lang];
    return Object.hasOwn(pages, slug) ? pages[slug] : undefined;
}

export function generateLocalPageParams() {
    return Object.entries(localPages).flatMap(([lang, pages]) =>
        Object.keys(pages).map((slug) => ({ lang, slug })),
    );
}
