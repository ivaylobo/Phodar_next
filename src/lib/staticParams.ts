import { getAllPagesFromWordPress } from '@/graphql/queries/getAllPages';

const DEFAULT_LANGUAGE = 'en';

type StaticParamsData = {
    languages: string[];
    langSlugPairs: { lang: string; slug: string }[];
};

async function collectStaticParams(): Promise<StaticParamsData> {
    const pages = await getAllPagesFromWordPress();
    const languages = new Set<string>();
    const langSlugPairs = new Map<string, { lang: string; slug: string }>();

    for (const page of pages) {
        if (!page?.uri) continue;

        const segments = page.uri.split('/').filter(Boolean);
        if (segments.length === 0) {
            continue;
        }

        const hasExplicitLang = segments.length > 1;
        const langSegment = hasExplicitLang ? segments[0] : DEFAULT_LANGUAGE;
        const slugSegment = hasExplicitLang ? segments[1] : segments[0];

        if (!langSegment) continue;
        const lang = langSegment.toLowerCase();
        languages.add(lang);

        if (!slugSegment) continue;
        const slug = slugSegment;
        const key = `${lang}:${slug}`;

        if (!langSlugPairs.has(key)) {
            langSlugPairs.set(key, { lang, slug });
        }
    }

    return {
        languages: Array.from(languages),
        langSlugPairs: Array.from(langSlugPairs.values()),
    };
}

export async function generateLangStaticParams(): Promise<Array<{ lang: string }>> {
    const { languages } = await collectStaticParams();
    return languages.map((lang) => ({ lang }));
}

export async function generateLangSlugStaticParams(): Promise<Array<{ lang: string; slug: string }>> {
    const { langSlugPairs } = await collectStaticParams();
    return langSlugPairs;
}
