import Link from 'next/link';
import styles from './page.module.css';
import { getLocalArticles } from '@/content/articles';

type PageProps = {
  params: Promise<{ lang: string }>;
};

const SUPPORTED_LANGS = ['en', 'bg'] as const;
type Supported = typeof SUPPORTED_LANGS[number];

const normalizeLang = (lang: string): Supported =>
  (SUPPORTED_LANGS as readonly string[]).includes(lang) ? (lang as Supported) : 'en';

export default async function ArticlesIndexPage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  const lang = normalizeLang(rawLang);
  const nodes = getLocalArticles(lang);

  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {nodes.map((node, idx) => {
          const fields = node.articleFields;
          const imageUrl = node.featuredImage?.node?.sourceUrl || '';
          const href = `/${lang}/articles/${node.slug}`;

          return (
            <article key={node.id} className={`${styles.card} ${idx === 0 ? styles.featured : ''}`}>
              <Link className={styles.cardLink} href={href}>
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt={node.featuredImage?.node?.altText || ''} className={styles.cardImage} />
              ) : null}
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle} dangerouslySetInnerHTML={{ __html: node.title }} />
                {fields?.subtitle ? (
                  <p className={styles.cardSubtitle}>{fields.subtitle}</p>
                ) : null}
                <span className={styles.readMore}>
                  {lang === 'bg' ? 'Прочети ➜' : 'Read more ➜'}
                </span>
              </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export function generateStaticParams() {
  return [{ lang: 'en' }, { lang: 'bg' }];
}
