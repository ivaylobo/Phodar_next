import type {
  HomeTemplateData as WordPressHomeTemplateData,
  HomeTemplateHead,
  HomeTemplateBody,
  HomeTemplatePastEditionColumn,
} from '@/graphql/queries/getHomePage';
import BackgroundSlideshow, {
  type BackgroundSlide,
} from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import styles from './Home.module.css';



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

type HomeViewModel = {
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

const defaultHomeViewModel: HomeViewModel = {
  hero: {
    editionNumber: '',
    editionLabel: '',
    subtitle: '',
    topicLabel: '',
    topicTitle: '',
    ctas: [],
    slides: [],
    durationSeconds: 5,
    transitionSeconds: 1,
  },
  mainInfo: {
    headline: '',
    highlightHtml: '',
    program: [],
    paragraphs: [],
    title: '',
    awardsHtml: [],
    leftColumn: [],
    rightColumn: [],
  },
  partners: [],
  exhibitions: {
    title: '',
    rows: [],
  },
  photobook: {
    title: '',
    image: '',
  },
  pastEditions: {
    title: '',
    subtitle: '',
    desktopColumns: [],
    mobileList: [],
  },
};

const defaultHomeViewModelJSON = JSON.stringify(defaultHomeViewModel);

function cloneDefaults(): HomeViewModel {
  return JSON.parse(defaultHomeViewModelJSON) as HomeViewModel;
}

type Maybe<T> = T | null | undefined;

function isNonEmptyString(value?: Maybe<string>): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function buildParagraphs(value?: Maybe<string>): string[] {
  if (!value) {
    return [];
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return [];
  }

  const segments = trimmed
    .split(/\n{2,}/)
    .map((segment) => segment.trim())
    .filter((segment) => segment.length > 0);

  return segments.length > 0 ? segments : [trimmed];
}

function toArray<T>(value?: Maybe<T | Array<Maybe<T>>>): Maybe<T>[] {
  if (!value) {
    return [];
  }

  return Array.isArray(value) ? value : [value];
}

function mapCtas(ctas?: Maybe<HomeTemplateHead['cta']>): HomeTemplateLink[] {
  const items = toArray(ctas);

  return items
    .map((cta) => {
      if (!cta) {
        return null;
      }

      const hrefField = cta.href;
      const href =
        typeof hrefField === 'string'
          ? hrefField.trim()
          : hrefField?.url;
      const fallbackLabel =
        typeof hrefField === 'string'
          ? undefined
          : hrefField?.title;
      const label = cta.label ?? fallbackLabel;

      if (!isNonEmptyString(label) || !isNonEmptyString(href)) {
        return null;
      }

      const link: HomeTemplateLink = {
        label: label.trim(),
        href,
      };

      const target =
        typeof hrefField === 'string'
          ? undefined
          : hrefField?.target;
      const targetBlank = cta.targetBlanc ?? (target === '_blank');
      if (targetBlank) {
        link.targetBlank = true;
        link.rel = 'noopener noreferrer';
      }

      return link;
    })
    .filter((cta): cta is HomeTemplateLink => cta !== null);
}

function mapSlides(slides?: Maybe<HomeTemplateHead['slides']>): BackgroundSlide[] {
  const items = toArray(slides);

  return items
    .map((slide) => {
      const imageNode = slide?.image?.node;
      if (!imageNode?.sourceUrl) {
        return null;
      }

      const result: BackgroundSlide = {
        src: imageNode.sourceUrl,
      };

      if (isNonEmptyString(imageNode.altText)) {
        result.alt = imageNode.altText.trim();
      }

      return result;
    })
    .filter((slide): slide is BackgroundSlide => slide !== null);
}

function mapTextArray(values?: Maybe<Array<Maybe<string>>>): string[] {
  if (!Array.isArray(values)) {
    return [];
  }

  return values
    .map((value) => (isNonEmptyString(value) ? value.trim() : null))
    .filter((value): value is string => value !== null);
}

function mapRichText(values?: Maybe<string | Array<Maybe<string>>>): string[] {
  if (!values) {
    return [];
  }

  if (typeof values === 'string') {
    return buildParagraphs(values);
  }

  if (Array.isArray(values)) {
    return values.flatMap((value) => (isNonEmptyString(value) ? buildParagraphs(value) : []));
  }

  return [];
}

function mapPartners(partners?: Maybe<HomeTemplateBody['partners']>): HomePartner[] {
  const items = toArray(partners);

  return items
    .map((partner) => {
      if (!partner) {
        return null;
      }

      const image = partner.image?.node?.sourceUrl;
      const name = partner.name;

      if (!isNonEmptyString(image) || !isNonEmptyString(name)) {
        return null;
      }

      const href = partner.link;

      return {
        name: name.trim(),
        href: isNonEmptyString(href) ? href : '#',
        image,
      };
    })
    .filter((partner): partner is HomePartner => partner !== null);
}

function mapExhibitions(
  exhibitions?: Maybe<HomeTemplateBody['exhibitions']>,
): HomeViewModel['exhibitions'] {
  const result: HomeViewModel['exhibitions'] = {
    title: '',
    rows: [],
  };

  if (!exhibitions) {
    return result;
  }

  if (isNonEmptyString(exhibitions.title)) {
    result.title = exhibitions.title.trim();
  }

  const imageNode = exhibitions.image1?.node;
  if (imageNode?.sourceUrl) {
    result.rows = [
      [
        {
          image: imageNode.sourceUrl,
          alt: isNonEmptyString(imageNode.altText) ? imageNode.altText.trim() : undefined,
        },
      ],
    ];
  }

  return result;
}

function mapPhotobook(
  photobook?: Maybe<HomeTemplateBody['photobook']>,
): HomeViewModel['photobook'] {
  const result: HomeViewModel['photobook'] = {
    title: '',
    image: '',
  };

  if (!photobook) {
    return result;
  }

  if (isNonEmptyString(photobook.title)) {
    result.title = photobook.title.trim();
  }

  const imageNode = photobook.image?.node;
  if (imageNode?.sourceUrl) {
    result.image = imageNode.sourceUrl;
  }

  return result;
}

function mapPastEditionColumn(edition?: Maybe<HomeTemplatePastEditionColumn>): HomePastEdition | null {
  if (!edition) {
    return null;
  }

  const image = edition.image?.node?.sourceUrl;
  const year = edition.year;

  if (!isNonEmptyString(image) || !isNonEmptyString(year)) {
    return null;
  }

  return {
    year: year.trim(),
    href: isNonEmptyString(edition.link) ? edition.link : '#',
    image,
  };
}

function mapPastEditions(
  pastEditions?: Maybe<HomeTemplateBody['pastEditions']>,
): HomeViewModel['pastEditions'] {
  const result: HomeViewModel['pastEditions'] = {
    title: '',
    subtitle: '',
    desktopColumns: [],
    mobileList: [],
  };

  if (!pastEditions) {
    return result;
  }

  if (isNonEmptyString(pastEditions.title)) {
    result.title = pastEditions.title.trim();
  }

  if (isNonEmptyString(pastEditions.subtitle)) {
    result.subtitle = pastEditions.subtitle.trim();
  }

  const collectEditions = (
    entries?: Maybe<
      HomeTemplatePastEditionColumn | Array<Maybe<HomeTemplatePastEditionColumn>>
    >,
  ) => {
    const normalized = toArray(entries);
    return normalized
      .map((entry) => mapPastEditionColumn(entry))
      .filter((entry): entry is HomePastEdition => entry !== null);
  };

  const desktopColumns = pastEditions.desktopColumns;

  let editions: HomePastEdition[] = [];

  if (Array.isArray(desktopColumns)) {
    editions = desktopColumns.flatMap((column) => collectEditions(column?.leftColumn));
  } else if (desktopColumns) {
    editions = collectEditions(desktopColumns.leftColumn);
  }

  if (editions.length > 0) {
    result.desktopColumns = [editions];
    result.mobileList = editions;
  }

  return result;
}

function buildHomeViewModel(homeTemplate?: WordPressHomeTemplateData | null): HomeViewModel {
  const viewModel = cloneDefaults();

  if (!homeTemplate) {
    return viewModel;
  }

  console.log('homeTemplate ', homeTemplate.head)

  if (homeTemplate.head) {
    const head = homeTemplate.head;

    if (isNonEmptyString(head.editionNumber)) {
      viewModel.hero.editionNumber = head.editionNumber.trim();
    }

    if (isNonEmptyString(head.editionLabel)) {
      viewModel.hero.editionLabel = head.editionLabel.trim();
    }

    if (isNonEmptyString(head.subtitle)) {
      viewModel.hero.subtitle = head.subtitle.trim();
    }

    if (isNonEmptyString(head.topicLabel)) {
      viewModel.hero.topicLabel = head.topicLabel.trim();
    }

    if (isNonEmptyString(head.topicTitle)) {
      viewModel.hero.topicTitle = head.topicTitle.trim();
    }

    const ctas = mapCtas(head.cta);
    if (ctas.length > 0) {
      viewModel.hero.ctas = ctas;
    }

    const slides = mapSlides(head.slides);
    if (slides.length > 0) {
      viewModel.hero.slides = slides;
    }

    if (typeof head.durationSeconds === 'number') {
      viewModel.hero.durationSeconds = head.durationSeconds;
    }

    if (typeof head.transitionSeconds === 'number') {
      viewModel.hero.transitionSeconds = head.transitionSeconds;
    }
  }

  if (homeTemplate.mainInfo) {
    const mainInfo = homeTemplate.mainInfo;

    if (mainInfo.additional) {
      const additional = mainInfo.additional;

      if (isNonEmptyString(additional.headline)) {
        viewModel.mainInfo.headline = additional.headline.trim();
      }

      if (isNonEmptyString(additional.highlightText)) {
        viewModel.mainInfo.highlightHtml = additional.highlightText;
      }

      viewModel.mainInfo.paragraphs = buildParagraphs(additional.mainSectionText);
    }

    if (mainInfo.mainInfo) {
      const infoBlock = mainInfo.mainInfo;

      if (isNonEmptyString(infoBlock.headline)) {
        viewModel.mainInfo.title = infoBlock.headline.trim();
      }

      viewModel.mainInfo.awardsHtml = mapTextArray(infoBlock.awards);
      viewModel.mainInfo.leftColumn = mapTextArray(infoBlock.leftColumnHeadlines);
      viewModel.mainInfo.rightColumn = mapRichText(infoBlock.rightColumnText);
    }

    viewModel.partners = mapPartners(mainInfo.partners);
    viewModel.exhibitions = mapExhibitions(mainInfo.exhibitions);
    viewModel.photobook = mapPhotobook(mainInfo.photobook);
    viewModel.pastEditions = mapPastEditions(mainInfo.pastEditions);
  }

  return viewModel;
}

type HomeTemplateProps = {
  homeTemplate?: WordPressHomeTemplateData | null;
};

export const homeTemplateDefaultData = defaultHomeViewModel;

export default function HomeTemplate({ homeTemplate }: HomeTemplateProps) {
  const data = buildHomeViewModel(homeTemplate);

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
                <div
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
                <div
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
