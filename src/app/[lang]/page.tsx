
import styles from './page.module.css';
import {getMenu} from "@/graphql/queries/getMenu";
import {getPageBySlug} from "@/graphql/queries/getPageBySlug";

type LangPageParams = {
  params: { lang: string };
};

const copy = {
  bg: {
    heading: 'Novini ot Phodar',
    empty: 'Vse oshte nyama statii. Skoro shte zaredim sadarzhanieto ot WordPress.',
  },
  en: {
    heading: 'Phodar News',
    empty: 'No posts yet. Real content will arrive once the WordPress data is connected.',
  },
};

export default async function LangHome({ params }: LangPageParams) {
  const { lang } = await params;

  // 🔠 Полиланг очаква езиковия префикс в slug-а с главни букви
  const slugWithLang = lang.toUpperCase() === 'EN' ? '/home' : `${lang.toUpperCase()}/home`;

  const page = await getPageBySlug(slugWithLang);

  console.log('page ', page)

  return (
    <section className={styles.container}>
      {/*{posts.length === 0 ? (*/}
      {/*  <p className={styles.empty}>{copy[locale].empty}</p>*/}
      {/*) : (*/}
      {/*  <ul className={styles.list}>*/}
      {/*    {posts.map((post: WordPressPost) => (*/}
      {/*      <li key={post.id} className={styles.listItem}>*/}
      {/*        <h2*/}
      {/*          className={styles.postTitle}*/}
      {/*          dangerouslySetInnerHTML={{ __html: post.title.rendered }}*/}
      {/*        />*/}
      {/*        <div*/}
      {/*          className={styles.postExcerpt}*/}
      {/*          dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}*/}
      {/*        />*/}
      {/*      </li>*/}
      {/*    ))}*/}
      {/*  </ul>*/}
      {/*)}*/}
    </section>
  );
}
