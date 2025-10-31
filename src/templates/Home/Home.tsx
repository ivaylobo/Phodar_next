import type { WordPressPage } from '@/graphql/queries/getPageBySlug';
import BackgroundSlideshow, {
  type BackgroundSlide,
} from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import styles from './Home.module.css';
import { getHomePageBySlug } from '@/graphql/queries/getHomePage';



type HomeTemplateLink = {
  label: string;
  href: string;
  targetBlank?: boolean;
  rel?: string;
};

type HomeProgramItem = {
  title: string;
  descriptionHtml: string;
};

type HomePartner = {
  name: string;
  href: string;
  image: string;
};

type HomeExhibitionItem = {
  image: string;
  alt?: string;
};

type HomePastEdition = {
  year: string;
  href: string;
  image: string;
};

type HomeTemplateData = {
  hero: {
    editionNumber: string;
    editionLabel: string;
    subtitle: string;
    topicLabel: string;
    topicTitle: string;
    ctas: HomeTemplateLink[];
    slides: BackgroundSlide[];
    durationSeconds?: number;
    transitionSeconds?: number;
  };
  mainInfo: {
    headline: string;
    highlightHtml: string;
    program: HomeProgramItem[];
    paragraphs: string[];
    title: string;
    awardsHtml: string[];
    leftColumn: string[];
    rightColumn: string[];
  };
  partners: HomePartner[];
  exhibitions: {
    title: string;
    rows: Array<HomeExhibitionItem[]>;
  };
  photobook: {
    title: string;
    image: string;
  };
  pastEditions: {
    title: string;
    subtitle: string;
    desktopColumns: Array<HomePastEdition[]>;
    mobileList: HomePastEdition[];
  };
};

const defaultHomeData: HomeTemplateData = {
  hero: {
    editionNumber: '13',
    editionLabel: 'edition',
    subtitle: 'international photo competition',
    topicLabel: 'topic:',
    topicTitle: 'Photographic reality',
    ctas: [
      {
        label: 'winners',
        href: '/editions',
        targetBlank: true,
        rel: 'noopener noreferrer',
      },
    ],
    slides: [
      { src: '/assets/images/head_1.jpg', alt: 'Festival hero photography 1' },
      { src: '/assets/images/head_2.jpg', alt: 'Festival hero photography 2' },
      { src: '/assets/images/head_4.jpg', alt: 'Festival hero photography 3' },
    ],
    durationSeconds: 5,
    transitionSeconds: 1,
  },
  mainInfo: {
    headline: '2025_1',
    highlightHtml: '<strong>2025_4</strong>',
    program: [
      { title: '2025_5_1', descriptionHtml: '2025_5' },
      { title: '2025_6_1', descriptionHtml: '2025_6' },
      { title: '2025_7_1', descriptionHtml: '2025_7' },
    ],
    paragraphs: ['2025_2', '2025_3'],
    title: 'HOME_MAIN_TEXT',
    awardsHtml: [
      'HOME_MAIN_TEXT_1 <strong>$2,000</strong>',
      'Award for Humanistic Photography <strong>$600</strong>',
      'HOME_MAIN_TEXT_9 <strong>$600</strong>',
    ],
    leftColumn: ['HOME_MAIN_TEXT_4', 'HOME_MAIN_TEXT_5', 'HOME_MAIN_TEXT_6'],
    rightColumn: ['terms_4', 'terms_4_5'],
  },
  partners: [
    {
      name: 'Culture Department Sofia',
      href: 'https://kultura.sofia.bg/',
      image: '/assets/images/logo_programa_2_kontur_eng.svg',
    },
    {
      name: 'National Gallery',
      href: 'https://nationalgallery.bg/',
      image: '/assets/images/NG.svg',
    },
    {
      name: 'National Culture Fund',
      href: 'https://ncf.bg/bg',
      image: '/assets/images/NCF.svg',
    },
    {
      name: 'Obscura Magazine',
      href: 'https://obscuramag.com/',
      image: '/assets/images/obscura.svg',
    },
  ],
  exhibitions: {
    title: 'showcase your photography in our festival exhibitions',
    rows: [
      [
        { image: '/assets/images/exibition1.jpg', alt: 'Exhibition highlight 1' },
        { image: '/assets/images/exibition2.jpg', alt: 'Exhibition highlight 2' },
      ],
      [
        { image: '/assets/images/exibition3.jpg', alt: 'Exhibition highlight 3' },
        { image: '/assets/images/exibition4.jpg', alt: 'Exhibition highlight 4' },
      ],
    ],
  },
  photobook: {
    title: 'BE PART OF OUR EDITION PHOTO BOOK',
    image: '/assets/images/photobook.png',
  },
  pastEditions: {
    title: 'editions',
    subtitle: 'SEE THE FULL GALLERY OF WINNERS & PARTICIPANTS IN PAST EDITIONS',
    desktopColumns: [
      [
        { year: '2023', href: '/editions/2023/', image: '/assets/images/galleries_links/23.jpg' },
        { year: '2019', href: '/editions/2019/', image: '/assets/images/galleries_links/19.jpg' },
        { year: '2013', href: '/editions/2013', image: '/assets/images/galleries_links/13.jpg' },
        { year: '2009', href: '/editions/2009', image: '/assets/images/galleries_links/09.jpg' },
        { year: '2005', href: '/editions/2005', image: '/assets/images/galleries_links/05.jpg' },
        { year: '2001', href: '/editions/2001', image: '/assets/images/galleries_links/01.jpg' },
      ],
      [
        { year: '2021', href: '/editions/2021/', image: '/assets/images/galleries_links/21.jpg' },
        { year: '2015', href: '/editions/2015/', image: '/assets/images/galleries_links/15.jpg' },
        { year: '2011', href: '/editions/2011', image: '/assets/images/galleries_links/11.jpg' },
        { year: '2007', href: '/editions/2007', image: '/assets/images/galleries_links/07.jpg' },
        { year: '2003', href: '/editions/2003', image: '/assets/images/galleries_links/03.jpg' },
        { year: '1999', href: '/editions/1999', image: '/assets/images/galleries_links/99.jpg' },
      ],
    ],
    mobileList: [
      { year: '2023', href: '/editions/2023/', image: '/assets/images/galleries_links/23.jpg' },
      { year: '2021', href: '/editions/2021/', image: '/assets/images/galleries_links/21.jpg' },
      { year: '2019', href: '/editions/2019/', image: '/assets/images/galleries_links/19.jpg' },
      { year: '2015', href: '/editions/2015', image: '/assets/images/galleries_links/15.jpg' },
      { year: '2013', href: '/editions/2013', image: '/assets/images/galleries_links/13.jpg' },
      { year: '2011', href: '/editions/2011', image: '/assets/images/galleries_links/11.jpg' },
      { year: '2009', href: '/editions/2009', image: '/assets/images/galleries_links/09.jpg' },
      { year: '2007', href: '/editions/2007', image: '/assets/images/galleries_links/07.jpg' },
      { year: '2003', href: '/editions/2003', image: '/assets/images/galleries_links/03.jpg' },
      { year: '2001', href: '/editions/2001', image: '/assets/images/galleries_links/01.jpg' },
      { year: '1999', href: '/editions/1999', image: '/assets/images/galleries_links/99.jpg' },
    ],
  },
};

const defaultHomeDataJSON = JSON.stringify(defaultHomeData);

function cloneDefaults(): HomeTemplateData {
  return JSON.parse(defaultHomeDataJSON) as HomeTemplateData;
}

function decodeHtmlEntities(value: string): string {
  const entities: Record<string, string> = {
    '&quot;': '"',
    '&#34;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
  };

  return value.replace(/&[a-zA-Z0-9#]+;/g, (entity) => entities[entity] ?? entity);
}

function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

function mergeWithDefaults<T>(defaults: T, overrides: unknown): T {
  if (overrides === null || overrides === undefined) {
    return defaults;
  }

  if (Array.isArray(defaults)) {
    return (Array.isArray(overrides) ? overrides : defaults) as T;
  }

  if (typeof defaults === 'object' && defaults !== null && typeof overrides === 'object') {
    const result: Record<string, unknown> = Array.isArray(defaults)
      ? [...(defaults as unknown[])]
      : { ...(defaults as Record<string, unknown>) };

    for (const [key, value] of Object.entries(overrides)) {
      const defaultValue = (defaults as Record<string, unknown>)[key];
      if (value === undefined || value === null) {
        continue;
      }

      if (Array.isArray(defaultValue)) {
        result[key] = Array.isArray(value) ? value : defaultValue;
      } else if (
        typeof defaultValue === 'object' &&
        defaultValue !== null &&
        typeof value === 'object' &&
        value !== null
      ) {
        result[key] = mergeWithDefaults(defaultValue, value);
      } else {
        result[key] = value;
      }
    }

    return result as T;
  }

  return (overrides as T) ?? defaults;
}

function parseHomeTemplateData(content?: string | null): HomeTemplateData {
  if (!content) {
    return cloneDefaults();
  }

  const trimmed = content.trim();
  if (!trimmed) {
    return cloneDefaults();
  }

  const sanitized = decodeHtmlEntities(stripHtmlTags(trimmed)).trim();
  if (!sanitized) {
    return cloneDefaults();
  }

  try {
    const parsed = JSON.parse(sanitized) as Partial<HomeTemplateData>;
    return mergeWithDefaults(cloneDefaults(), parsed);
  } catch (error) {
    console.error('Home template JSON parse error:', error);
    return cloneDefaults();
  }
}

type HomeTemplateProps = {
  page: WordPressPage;
};

export const homeTemplateDefaultData = defaultHomeData;

export default function HomeTemplate({ page }: HomeTemplateProps) {
  const data = parseHomeTemplateData(page.content);

  return (
    <div className={styles.homePage}>
      <section className={styles.summary}>
        <BackgroundSlideshow
          className={styles.backgroundSlider}
          images={data.hero.slides}
          durationSeconds={data.hero.durationSeconds}
          transitionSeconds={data.hero.transitionSeconds}
          overlay
        />

        <div className={`${styles.summaryContainer} container`}>
          <div className={styles.summaryTop}>
            <h4 className={styles.summaryEditionNumber}>{data.hero.editionNumber}</h4>
            <p className={styles.summaryEditionLabel} aria-label={data.hero.editionLabel}>
              <span className={styles.summaryEditionLabelSmall}>{data.hero.editionLabel}</span>
            </p>
          </div>
          <h3 className={styles.summaryTitle}>{data.hero.subtitle}</h3>
          <div className={styles.summaryBottom}>
            <span className={styles.summaryTopicLabel}>{data.hero.topicLabel}</span>
            <h1 className={styles.summaryTopicTitle}>{data.hero.topicTitle}</h1>
          </div>
          <div className={styles.summaryLinks}>
            {data.hero.ctas.map((cta, index) => {
              const target = cta.targetBlank ? '_blank' : undefined;
              const rel =
                target === '_blank' ? cta.rel ?? 'noopener noreferrer' : cta.rel ?? undefined;

              return (
                <a
                  key={`${cta.href}-${index}`}
                  className={styles.buttonLink}
                  href={cta.href}
                  target={target}
                  rel={rel}
                >
                  {cta.label}
                </a>
              );
            })}
          </div>
        </div>
      </section>

      <section className={styles.mainInfo}>
        <div className="container">
          <div className={styles.mainInfoHeader}>
            <h3
              className={styles.mainInfoHeadline}
              dangerouslySetInnerHTML={{ __html: data.mainInfo.headline }}
            />
            <p
              className={styles.highlight}
              dangerouslySetInnerHTML={{ __html: data.mainInfo.highlightHtml }}
            />
          </div>

          <div className={styles.mainInfoColumns}>
            <div className={styles.programColumn}>
              <ul className={styles.program}>
                {data.mainInfo.program.map((item, index) => (
                  <li key={`${item.title}-${index}`}>
                    <strong dangerouslySetInnerHTML={{ __html: item.title }} />
                    <span dangerouslySetInnerHTML={{ __html: item.descriptionHtml }} />
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.infoColumn}>
              {data.mainInfo.paragraphs.map((paragraph, index) => (
                <p
                  key={`${paragraph}-${index}`}
                  className={styles.mainInfoParagraph}
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              ))}
            </div>
          </div>

          <div className={styles.mainInfoAwardsBlock}>
            <h2
              className={styles.mainInfoTitle}
              dangerouslySetInnerHTML={{ __html: data.mainInfo.title }}
            />
            <div className={styles.mainInfoAwards}>
              {data.mainInfo.awardsHtml.map((line, index) => (
                <span key={`${line}-${index}`} dangerouslySetInnerHTML={{ __html: line }} />
              ))}
            </div>
          </div>

          <div className={styles.mainInfoColumns}>
            <div className={styles.infoColumn}>
              {data.mainInfo.leftColumn.map((item, index) => (
                <h4
                  key={`${item}-${index}`}
                  className={styles.mainInfoHeading}
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              ))}
            </div>
            <div className={`${styles.infoColumn} ${styles.rightText}`}>
              {data.mainInfo.rightColumn.map((item, index) => (
                <p
                  key={`${item}-${index}`}
                  className={styles.mainInfoParagraph}
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.logoSofia}>
        <div className={`container ${styles.partners}`}>
          <div className={styles.partnerGrid}>
            {data.partners.map((partner) => (
              <div className={styles.partnerCard} key={partner.name}>
                <a
                  className={styles.partnerLink}
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundImage: `url(${partner.image})` }}
                  aria-label={partner.name}
                >
                  {partner.name}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.exhibitions}>
        <div className="container">
          <h2>{data.exhibitions.title}</h2>
          <div className={styles.allWrapper}>
            {data.exhibitions.rows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`${styles.rowWrapper} ${
                  rowIndex === 0 ? styles.rowWrapperFirst : styles.rowWrapperSecond
                }`}
              >
                {row.map((item, itemIndex) => (
                  <div
                    key={`${item.image}-${itemIndex}`}
                    className={styles.imageWrapper}
                    style={{ backgroundImage: `url(${item.image})` }}
                    role="img"
                    aria-label={item.alt ?? `Exhibition image ${rowIndex + 1}-${itemIndex + 1}`}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.photoBook}>
        <div className="container">
          <div className={styles.photoBookInner}>
            <div
              className={styles.photoBookWrapper}
              style={{ backgroundImage: `url(${data.photobook.image})` }}
            />
            <div className={styles.photoBookText}>
              <h3 dangerouslySetInnerHTML={{ __html: data.photobook.title }} />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.pastEditionsSection}>
        <div className="container">
          <h2 className={styles.pastEditionsTitle}>{data.pastEditions.title}</h2>
          <h3
            className={styles.pastEditionsSubtitle}
            dangerouslySetInnerHTML={{ __html: data.pastEditions.subtitle }}
          />

          <div>
            {data.pastEditions.desktopColumns.map((column, columnIndex) => (
              <ul key={columnIndex} className={styles.desktopList}>
                {column.map((edition) => (
                  <li
                    key={edition.year}
                    className={styles.desktopListItem}
                    style={{ backgroundImage: `url(${edition.image})` }}
                  >
                    <a href={edition.href}>
                      <span>{edition.year}</span>
                    </a>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          <ul className={styles.mobileList}>
            {data.pastEditions.mobileList.map((edition) => (
              <li
                key={`mobile-${edition.year}`}
                className={styles.mobileListItem}
                style={{ backgroundImage: `url(${edition.image})` }}
              >
                <a href={edition.href}>
                  <span>{edition.year}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
