import type { HomeTemplateData as WordPressHomeTemplateData } from '@/graphql/queries/getHomePage';
import BackgroundSlideshow from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import styles from './Home.module.css';
import {
  getCtas,
  getExhibitionRows,
  getPartners,
  getPastEditions,
  getPhotobookImage,
  getSlides,
} from './helpers/wordpress';

type HomeTemplateProps = {
  homeTemplate?: WordPressHomeTemplateData | null;
};

const asDisplayString = (value: unknown): string => {
  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return String(value);
  }

  return '';
};

export default function HomeTemplate({ homeTemplate }: HomeTemplateProps) {
  const head = homeTemplate?.head;
  const body = homeTemplate?.mainInfo;

  const heroSlides = getSlides(head?.slides);
  const heroCtas = getCtas(head?.cta);

  const heroDurationSeconds =
    typeof head?.durationSeconds === 'number' ? head.durationSeconds : undefined;
  const heroTransitionSeconds =
    typeof head?.transitionSeconds === 'number' ? head.transitionSeconds : undefined;

  const additional = body?.additional;
  const infoBlock = body?.mainInfo;

  const partners = getPartners(body?.partners);

  const exhibitionsRows = getExhibitionRows(body?.exhibitions);

  const photobookImage = getPhotobookImage(body?.photobook);

  const { columns: desktopPastEditionColumns, list: mobilePastEditions } =
    getPastEditions(body?.pastEditions);

  const mainInfoParagraphs =
    typeof additional?.mainSectionText === 'string' ? [additional.mainSectionText] : [];

  const mainInfoAwards = Array.isArray(infoBlock?.awards)
    ? infoBlock.awards.filter(
        (value): value is string | number =>
          typeof value === 'string' || typeof value === 'number',
      )
    : [];

  const mainInfoLeftColumn = Array.isArray(infoBlock?.leftColumnHeadlines)
    ? infoBlock.leftColumnHeadlines.filter(
        (value): value is string | number =>
          typeof value === 'string' || typeof value === 'number',
      )
    : [];

  const rightColumnSource = infoBlock?.rightColumnText;
  const mainInfoRightColumn = Array.isArray(rightColumnSource)
    ? rightColumnSource.filter(
        (value): value is string | number =>
          typeof value === 'string' || typeof value === 'number',
      )
    : typeof rightColumnSource === 'string' || typeof rightColumnSource === 'number'
      ? [rightColumnSource]
      : [];

  return (
    <div className={styles.homePage}>
      <section className={styles.summary}>
        <BackgroundSlideshow
          className={styles.backgroundSlider}
          images={heroSlides}
          durationSeconds={heroDurationSeconds}
          transitionSeconds={heroTransitionSeconds}
          overlay
        />

        <div className={`${styles.summaryContainer} container`}>
          <div className={styles.summaryTop}>
            <h4 className={styles.summaryEditionNumber}>
              {asDisplayString(head?.editionNumber)}
            </h4>
            <p
              className={styles.summaryEditionLabel}
              aria-label={asDisplayString(head?.editionLabel)}
            >
              <span className={styles.summaryEditionLabelSmall}>
                {asDisplayString(head?.editionLabel)}
              </span>
            </p>
          </div>
          <h3 className={styles.summaryTitle}>{asDisplayString(head?.subtitle)}</h3>
          <div className={styles.summaryBottom}>
            <span className={styles.summaryTopicLabel}>{asDisplayString(head?.topicLabel)}</span>
            <h1 className={styles.summaryTopicTitle}>{asDisplayString(head?.topicTitle)}</h1>
          </div>
          <div className={styles.summaryLinks}>
            {heroCtas.map((cta, index) => {
              const target = cta.targetBlank ? '_blank' : undefined;
              const rel = target === '_blank' ? 'noopener noreferrer' : undefined;

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
              dangerouslySetInnerHTML={{ __html: asDisplayString(additional?.headline) }}
            />
            <p
              className={styles.highlight}
              dangerouslySetInnerHTML={{
                __html:
                  typeof additional?.highlightText === 'string'
                    ? additional.highlightText
                    : '',
              }}
            />
          </div>

          <div className={styles.mainInfoColumns}>
            <div className={styles.programColumn}>
              <ul className={styles.program}></ul>
            </div>
            <div className={styles.infoColumn}>
              {mainInfoParagraphs.map((paragraph, index) => (
                <div
                  key={`${paragraph}-${index}`}
                  className={styles.mainInfoParagraph}
                  dangerouslySetInnerHTML={{ __html: asDisplayString(paragraph) }}
                />
              ))}
            </div>
          </div>

          <div className={styles.mainInfoAwardsBlock}>
            <h2
              className={styles.mainInfoTitle}
              dangerouslySetInnerHTML={{ __html: asDisplayString(infoBlock?.headline) }}
            />
            <div className={styles.mainInfoAwards}>
              {mainInfoAwards.map((line, index) => (
                <span
                  key={`${line}-${index}`}
                  dangerouslySetInnerHTML={{ __html: asDisplayString(line) }}
                />
              ))}
            </div>
          </div>

          <div className={styles.mainInfoColumns}>
            <div className={styles.infoColumn}>
              {mainInfoLeftColumn.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className={styles.mainInfoHeading}
                  dangerouslySetInnerHTML={{ __html: asDisplayString(item) }}
                />
              ))}
            </div>
            <div className={`${styles.infoColumn} ${styles.rightText}`}>
              {mainInfoRightColumn.map((item, index) => (
                <div
                  key={`${item}-${index}`}
                  className={styles.mainInfoParagraph}
                  dangerouslySetInnerHTML={{ __html: asDisplayString(item) }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.logoSofia}>
        <div className={`container ${styles.partners}`}>
          <div className={styles.partnerGrid}>
            {partners.map((partner) => (
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
          <h2>{asDisplayString(body?.exhibitions?.title)}</h2>
          <div className={styles.allWrapper}>
            {exhibitionsRows.map((row, rowIndex) => (
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
              style={{
                backgroundImage: photobookImage ? `url(${photobookImage})` : undefined,
              }}
            />
            <div className={styles.photoBookText}>
              <h3
                dangerouslySetInnerHTML={{
                  __html: asDisplayString(body?.photobook?.title),
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.pastEditionsSection}>
        <div className="container">
          <h2 className={styles.pastEditionsTitle}>
            {asDisplayString(body?.pastEditions?.title)}
          </h2>
          <h3
            className={styles.pastEditionsSubtitle}
            dangerouslySetInnerHTML={{
              __html: asDisplayString(body?.pastEditions?.subtitle),
            }}
          />

          <div>
            {desktopPastEditionColumns.map((column, columnIndex) => (
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
            {mobilePastEditions.map((edition) => (
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
