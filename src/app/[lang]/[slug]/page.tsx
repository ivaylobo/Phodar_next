import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/graphql/queries/getPageBySlug';

type LangSlugPageProps = {
    params: Promise<{ lang: string; slug: string }>;
};

export default async function LangSlugPage({ params }: LangSlugPageProps) {
    const { lang, slug } = await params;

    const slugWithLang = lang.toUpperCase() === 'EN' ? slug : `${lang.toUpperCase()}/${slug}`;

    const page = await getPageBySlug(slugWithLang);

    console.log('page: ', page)

    // ❌ Ако я няма → 404
    if (!page) {
        notFound();
    }

    return (
        <article style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
            <h1 dangerouslySetInnerHTML={{ __html: page.title }} />
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
    );
}
