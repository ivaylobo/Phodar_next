import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { getArticleBySlug } from '@/graphql/queries/getArticleBySlug';
import { getArticles } from '@/graphql/queries/getArticles';

type PageProps = {
  params: Promise<{ lang: string; slug: string }>;
};

const SUPPORTED_LANGS = ['en', 'bg'] as const;
type Supported = typeof SUPPORTED_LANGS[number];

const normalizeLang = (lang: string): Supported =>
  (SUPPORTED_LANGS as readonly string[]).includes(lang) ? (lang as Supported) : 'en';

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang, slug } = await params;
  const lang = normalizeLang(rawLang);
  const article = await getArticleBySlug(slug, lang.toUpperCase() as 'EN' | 'BG');
  if (!article) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://phodar.net';
  const url = new URL(`/${lang}/articles/${encodeURIComponent(article.slug)}`, baseUrl).href;
  const title = article.title;
  const description = article.articleFields?.subtitle || undefined;
  const image = article.featuredImage?.node;
  const images = image?.sourceUrl
    ? [{ url: new URL(image.sourceUrl, baseUrl).href, alt: image.altText || title }]
    : [];

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title,
      description,
      url,
      siteName: 'Phodar',
      locale: lang === 'bg' ? 'bg_BG' : 'en_GB',
      images,
    },
    twitter: {
      card: images.length ? 'summary_large_image' : 'summary',
      title,
      description,
      images,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { lang: rawLang, slug } = await params;
  const lang = normalizeLang(rawLang);

  const wpLang = lang.toUpperCase() as 'EN' | 'BG';
  const article = await getArticleBySlug(slug, wpLang);
  if (!article) {
    notFound();
  }

  const imageUrl =
    article.featuredImage?.node?.sourceUrl ||
    '';
  const imageCaption = article.featuredImage?.node?.caption;

  return (
    <article className={styles.wrapper}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={article.featuredImage?.node?.altText || ''} className={styles.hero} />
      ) : null}
      {imageUrl && imageCaption ? (
        <small
          className={styles.imageCaption}
          dangerouslySetInnerHTML={{ __html: imageCaption.replace(/<\/?p\b[^>]*>/gi, '') }}
        />
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
import type { Metadata } from 'next';
