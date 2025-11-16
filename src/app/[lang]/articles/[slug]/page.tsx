import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { getArticleBySlug } from '@/graphql/queries/getArticleBySlug';
import { getArticles } from '@/graphql/queries/getArticles';
import ArticleInlineImages from '@/components/ArticleInlineImages/ArticleInlineImages';

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

const SUPPORTED_LANGS = ['en', 'bg'] as const;
type Supported = typeof SUPPORTED_LANGS[number];

const normalizeLang = (lang: string): Supported =>
  (SUPPORTED_LANGS as readonly string[]).includes(lang) ? (lang as Supported) : 'en';

export default async function ArticlePage({ params }: PageProps) {
  const { lang: rawLang, slug } = await params;
  const lang = normalizeLang(rawLang);

  const wpLang = lang.toUpperCase() as 'EN' | 'BG';
  const article = await getArticleBySlug(slug, wpLang);
    console.log('article', article)
  if (!article) {
    notFound();
  }

  const imageUrl =
    article.featuredImage?.node?.sourceUrl ||
    article.articleFields?.inlineImages?.edges?.[0]?.node?.sourceUrl ||
    '';

  return (
    <article className={styles.wrapper}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt="" className={styles.hero} />
      ) : null}
      <header className={styles.header}>
        <h1 className={styles.title} dangerouslySetInnerHTML={{ __html: article.title }} />
        {article.articleFields?.subtitle ? (
          <p className={styles.subtitle}>{article.articleFields.subtitle}</p>
        ) : null}
        {article.date ? (
          <time className={styles.date} dateTime={article.date}>
            {new Date(article.date).toLocaleDateString(lang === 'bg' ? 'bg-BG' : 'en-GB')}
          </time>
        ) : null}
      </header>
      {(article.articleFields?.customBody || article.content) ? (
        <div
          className={styles.content}
          dangerouslySetInnerHTML={{ __html: article.articleFields?.customBody || article.content || '' }}
        />
      ) : null}

      {Array.isArray(article.articleFields?.inlineImages?.edges) &&
        article.articleFields!.inlineImages!.edges!.length > 0 && (
          <ArticleInlineImages
            images={article.articleFields!.inlineImages!.edges!
              .filter((e): e is { node: { sourceUrl?: string | null; altText?: string | null } } => !!e?.node?.sourceUrl)
              .map((e) => ({ src: e.node.sourceUrl as string, alt: e.node.altText }))}
          />
        )}
    </article>
  );
}

export async function generateStaticParams() {
  const langs: Supported[] = ['en', 'bg'];
  const entries = await Promise.all(
    langs.map(async (lang) => {
      const wpLang = lang.toUpperCase() as 'EN' | 'BG';
      const { nodes } = await getArticles(wpLang);
      return nodes.map((n) => ({ lang, slug: n.slug }));
    }),
  );
  return entries.flat();
}
