import { notFound } from 'next/navigation';
import styles from './page.module.css';
import { getLocalArticle, getLocalArticles } from '@/content/articles';

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
  const article = getLocalArticle(lang, slug);
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

  const article = getLocalArticle(lang, slug);
  if (!article) {
    notFound();
  }

  const imageUrl =
    article.featuredImage?.node?.sourceUrl ||
    '';

  return (
    <article className={styles.wrapper}>
      {imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={imageUrl} alt={article.featuredImage?.node?.altText || ''} className={styles.hero} />
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
  return langs.flatMap((lang) =>
    getLocalArticles(lang).map((article) => ({ lang, slug: article.slug })),
  );
}
import type { Metadata } from 'next';
