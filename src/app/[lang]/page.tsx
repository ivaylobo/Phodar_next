
import styles from './page.module.css';
import { getHomePageBySlug } from '@/graphql/queries/getHomePage';
import HomeTemplate from '@/templates/Home/Home';

type LangPageParams = {
  params: { lang: string };
};

export default async function LangHome({ params }: LangPageParams) {
  const { lang } = await params;

  const languageCode = lang.toUpperCase();
  const slugWithLang = languageCode === 'EN' ? '/home' : `${languageCode}/home`;

  const page = await getHomePageBySlug(slugWithLang, languageCode);


  if (page) {

    const templateValues =
      page.translation?.template?.template ?? page.template?.template;
    const templateName = Array.isArray(templateValues)
      ? templateValues.find((value) => typeof value === 'string' && value.length > 0)
      : undefined;

    const homeTemplate = page.translation?.template?.homeTemplate ?? page.template?.homeTemplate;

    if (templateName && templateName.toLowerCase() === 'homepage') {
      console.log('Rendering HomeTemplate with data:', homeTemplate);
      return <HomeTemplate homeTemplate={homeTemplate} />;
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
