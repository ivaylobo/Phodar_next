import { notFound } from 'next/navigation';
import { getPageBySlug } from '@/graphql/queries/getPageBySlug';
import InformationalTemplate from "@/templates/Informational/Informational";

type LangSlugPageProps = {
    params: Promise<{ lang: string; slug: string }>;
};

export default async function LangSlugPage({ params }: LangSlugPageProps) {
    const { lang, slug } = await params;

    const slugWithLang = lang.toUpperCase() === 'EN' ? slug : `${lang.toUpperCase()}/${slug}`;

    const page = await getPageBySlug(slugWithLang);

    // ❌ Ако я няма → 404
    if (!page) {
        notFound();
    }

    const templateValue = page.template?.template;
    const hasInformationalTemplate =
        Array.isArray(templateValue) && templateValue.some((value) => value?.toLowerCase() === 'informational');

    if (hasInformationalTemplate) {
        return <InformationalTemplate page={page} />;
    }

    return (
        <article style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
            <h1 dangerouslySetInnerHTML={{ __html: page.title }} />
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
        </article>
    );
}
