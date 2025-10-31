
import styles from './page.module.css';
import { getPageBySlug } from '@/graphql/queries/getPageBySlug';
import HomeTemplate from '@/templates/Home/Home';
import { log } from 'console';

type LangPageParams = {
  params: { lang: string };
};

export default async function LangHome({ params }: LangPageParams) {
  const { lang } = await params;


  const slugWithLang = lang.toUpperCase() === 'EN' ? '/home' : `${lang.toUpperCase()}/home`;

  const page = await getPageBySlug(slugWithLang);


  if (page) {

    const templateName = page?.template?.template?.[0];

    if (templateName && templateName.toLowerCase() === 'homepage') {
      return <HomeTemplate page={page} />;
    }

    return (
      <article style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <h1 dangerouslySetInnerHTML={{ __html: page.title }} />
        <div dangerouslySetInnerHTML={{ __html: page.content }} />
      </article>
    );
  }

  return <section className={styles.container} />;
}

export { generateLangStaticParams as generateStaticParams } from '../../lib/staticParams';
