import Link from 'next/link';
import styles from './page.module.css';
import { getArticles } from '@/graphql/queries/getArticles';

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
  const wpLang = lang.toUpperCase() as 'EN' | 'BG';

  const { nodes, edges } = await getArticles(wpLang);

  return (
    <section className={styles.wrapper}>
      <div className={styles.grid}>
        {nodes.map((node, idx) => {
          const fields = edges[idx]?.node?.articleFields;
          const a = node;
          const imageUrl =
            fields?.inlineImages?.edges?.[0]?.node?.sourceUrl ||
            '';
          const href = `/${lang}/articles/${node.slug}`;

          return (
            <article key={node.id} className={`${styles.card} ${idx === 0 ? styles.featured : ''}`}>
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="" className={styles.cardImage} />
              ) : null}
              <div className={styles.cardBody}>
                <h2 className={styles.cardTitle} dangerouslySetInnerHTML={{ __html: node.title }} />
                {fields?.subtitle ? (
                  <p className={styles.cardSubtitle}>{fields.subtitle}</p>
                ) : null}
                <Link className={styles.readMore} href={href}>
                  {lang === 'bg' ? 'Прочети ➜' : 'Read more ➜'}
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export { generateLangStaticParams as generateStaticParams } from '@/lib/staticParams';
