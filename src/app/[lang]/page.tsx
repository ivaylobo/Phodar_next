
import styles from './page.module.css';
import { getHomePageBySlug } from '@/graphql/queries/getHomePage';
import HomeTemplate from '@/templates/Home/Home';
import { notFound } from 'next/navigation';

type LangPageParams = {
  params: Promise<{ lang: string }>;
};

export default async function LangHome({ params }: LangPageParams) {
  const { lang } = await params;
  if (lang !== 'en' && lang !== 'bg') notFound();

  const languageCode = lang.toUpperCase();
  const slugWithLang = '/';

  const page = await getHomePageBySlug(slugWithLang, languageCode);


  if (page) {

    const templateValues =
      page.translation?.template?.template ?? page.template?.template;
    const templateName = Array.isArray(templateValues)
      ? templateValues.find((value) => typeof value === 'string' && value.length > 0)
      : undefined;

    const homeTemplate = page.translation?.template?.homeTemplate ?? page.template?.homeTemplate;

    if (templateName && templateName.toLowerCase() === 'homepage') {

      return <HomeTemplate homeTemplate={homeTemplate} />;
    }

    return (
      <article style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
        <h1 dangerouslySetInnerHTML={{ __html: page.translation?.title ?? page.title }} />
        <div dangerouslySetInnerHTML={{ __html: page.translation?.content ?? page.content }} />
      </article>
    );
  }

  return <section className={styles.container} />;
}

export { generateLangStaticParams as generateStaticParams } from '../../lib/staticParams';
