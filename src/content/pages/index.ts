import type { WordPressPage } from '@/graphql/queries/getPageBySlug';
import bgAbout from './bg/about.json';
import bgRegulations from './bg/regulations.json';
import enAbout from './en/about.json';
import enRegulations from './en/regulations.json';

export const localPages: Record<string, Record<string, WordPressPage>> = {
    bg: { about: bgAbout, regulations: bgRegulations },
    en: { about: enAbout, regulations: enRegulations },
};

export function getLocalPage(lang: string, slug: string): WordPressPage | undefined {
    if (!Object.hasOwn(localPages, lang)) return undefined;
    const pages = localPages[lang];
    return Object.hasOwn(pages, slug) ? pages[slug] : undefined;
}

export function generateLocalPageParams() {
    return Object.entries(localPages).flatMap(([lang, pages]) =>
        Object.keys(pages).map((slug) => ({ lang, slug })),
    );
}
