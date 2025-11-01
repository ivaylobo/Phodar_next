import type {
  HomeTemplateCta,
  HomeTemplateData as WordPressHomeTemplateData,
  HomeTemplatePartner,
  HomeTemplatePastEditionColumn,
  HomeTemplatePastEditionColumnEntry,
  HomeTemplateSlide,
} from '@/graphql/queries/getHomePage';
import BackgroundSlideshow from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import type { BackgroundSlide } from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import styles from './Home.module.css';

type HomeTemplateProps = {
  homeTemplate?: WordPressHomeTemplateData | null;
};

type Maybe<T> = T | null | undefined;

const toArray = <T,>(value?: Maybe<T | Array<Maybe<T>>>): T[] => {
  if (Array.isArray(value)) {
    return value.filter((item): item is T => item !== null && item !== undefined);
  }

  if (value === null || value === undefined) {
    return [];
  }

  return [value];
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

  return (
    <div className={styles.homePage}>
      <section className={styles.summary}>
        <BackgroundSlideshow
          className={styles.backgroundSlider}
          images={toArray<HomeTemplateSlide>(head?.slides).reduce<BackgroundSlide[]>(
            (slides, current) => {
              const node = current.image?.node;
              if (typeof node?.sourceUrl !== 'string') {
                return slides;
              }

              slides.push({
                src: node.sourceUrl,
                alt: typeof node.altText === 'string' ? node.altText : undefined,
              });

              return slides;
            },
            [],
          )}
          durationSeconds={
            typeof head?.durationSeconds === 'number'
              ? head.durationSeconds
              : undefined
          }
          transitionSeconds={
            typeof head?.transitionSeconds === 'number'
              ? head.transitionSeconds
              : undefined
          }
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
            <span className={styles.summaryTopicLabel}>
              {asDisplayString(head?.topicLabel)}
            </span>
            <h1 className={styles.summaryTopicTitle}>
              {asDisplayString(head?.topicTitle)}
            </h1>
          </div>
          <div className={styles.summaryLinks}>
            {toArray<HomeTemplateCta>(head?.cta)
              .flatMap((cta) => {
                const href =
                  typeof cta.href === 'string'
                    ? cta.href
                    : typeof cta.href?.url === 'string'
                      ? cta.href.url
                      : '';
                const label =
                  typeof cta.label === 'string'
                    ? cta.label
                    : typeof cta.href !== 'string' &&
                        typeof cta.href?.title === 'string'
                      ? cta.href.title
                      : '';

                if (!href || !label) {
                  return [];
                }

                const target = cta.targetBlanc ? '_blank' : undefined;

                return [
                  <a
                    key={`${href}-${label}`}
                    className={styles.buttonLink}
                    href={href}
                    target={target}
                    rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                  >
                    {label}
                  </a>,
                ];
              })}
          </div>
        </div>
      </section>

      <section className={styles.mainInfo}>
        <div className="container">
          <div className={styles.mainInfoHeader}>
            <h3
              className={styles.mainInfoHeadline}
              dangerouslySetInnerHTML={{
                __html: asDisplayString(body?.additional?.headline),
              }}
            />
            <p
              className={styles.highlight}
              dangerouslySetInnerHTML={{
                __html:
                  typeof body?.additional?.highlightText === 'string'
                    ? body.additional.highlightText
                    : '',
              }}
            />
          </div>

          <div className={styles.mainInfoColumns}>
            <div className={styles.programColumn}>
              <ul className={styles.program}></ul>
            </div>
            <div className={styles.infoColumn}>
              {(typeof body?.additional?.mainSectionText === 'string'
                ? [body.additional.mainSectionText]
                : []
              ).map((paragraph, index) => (
                <div
                  key={`${paragraph}-${index}`}
                  className={styles.mainInfoParagraph}
                  dangerouslySetInnerHTML={{
                    __html: asDisplayString(paragraph),
                  }}
                />
              ))}
            </div>
          </div>

          <div className={styles.mainInfoAwardsBlock}>
            <h2
              className={styles.mainInfoTitle}
              dangerouslySetInnerHTML={{
                __html: asDisplayString(body?.mainInfo?.headline),
              }}
            />
            <div className={styles.mainInfoAwards}>
              {(Array.isArray(body?.mainInfo?.awards) ? body.mainInfo.awards : [])
                .filter((value): value is string => typeof value === 'string')
                .map((line, index) => (
                  <span
                    key={`${line}-${index}`}
                    dangerouslySetInnerHTML={{
                      __html: asDisplayString(line),
                    }}
                  />
                ))}
            </div>
          </div>

          <div className={styles.mainInfoColumns}>
            <div className={styles.infoColumn}>
              {(Array.isArray(body?.mainInfo?.leftColumnHeadlines)
                ? body.mainInfo.leftColumnHeadlines
                : [])
                .filter((value): value is string => typeof value === 'string')
                .map((item, index) => (
                  <div
                    key={`${item}-${index}`}
                    className={styles.mainInfoHeading}
                    dangerouslySetInnerHTML={{
                      __html: asDisplayString(item),
                    }}
                  />
                ))}
            </div>
            <div className={`${styles.infoColumn} ${styles.rightText}`}>
              {(() => {
                const source = body?.mainInfo?.rightColumnText;
                const values = Array.isArray(source)
                  ? source
                  : typeof source === 'string' || typeof source === 'number'
                    ? [source]
                    : [];

                return values
                  .filter((value): value is string => typeof value === 'string')
                  .map((item, index) => (
                    <div
                      key={`${item}-${index}`}
                      className={styles.mainInfoParagraph}
                      dangerouslySetInnerHTML={{
                        __html: asDisplayString(item),
                      }}
                    />
                  ));
              })()}
            </div>
          </div>
        </div>
      </section>

      <section className={styles.logoSofia}>
        <div className={`container ${styles.partners}`}>
          <div className={styles.partnerGrid}>
            {toArray<HomeTemplatePartner>(body?.partners)
              .flatMap((partner) => {
                const image = partner.image?.node?.sourceUrl;
                const name = partner.name;

                if (typeof image !== 'string' || typeof name !== 'string') {
                  return [];
                }

                const href =
                  typeof partner.link === 'string' && partner.link.length > 0
                    ? partner.link
                    : '#';

                return [
                  <div className={styles.partnerCard} key={name}>
                    <a
                      className={styles.partnerLink}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      style={{ backgroundImage: `url(${image})` }}
                      aria-label={name}
                    >
                      {name}
                    </a>
                  </div>,
                ];
              })}
          </div>
        </div>
      </section>

      <section className={styles.exhibitions}>
        <div className="container">
          <h2>{asDisplayString(body?.exhibitions?.title)}</h2>
          <div className={styles.allWrapper}>
            {(() => {
              const imageNode = body?.exhibitions?.image1?.node;
              if (typeof imageNode?.sourceUrl !== 'string') {
                return null;
              }

              const rows = [
                [
                  {
                    image: imageNode.sourceUrl,
                    alt:
                      typeof imageNode.altText === 'string'
                        ? imageNode.altText
                        : undefined,
                  },
                ],
              ];

              return rows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`${styles.rowWrapper} ${
                    rowIndex === 0
                      ? styles.rowWrapperFirst
                      : styles.rowWrapperSecond
                  }`}
                >
                  {row.map((item, itemIndex) => (
                    <div
                      key={`${item.image}-${itemIndex}`}
                      className={styles.imageWrapper}
                      style={{ backgroundImage: `url(${item.image})` }}
                      role="img"
                      aria-label={
                        item.alt ??
                        `Exhibition image ${rowIndex + 1}-${itemIndex + 1}`
                      }
                    />
                  ))}
                </div>
              ));
            })()}
          </div>
        </div>
      </section>

      <section className={styles.photoBook}>
        <div className="container">
          <div className={styles.photoBookInner}>
            <div
              className={styles.photoBookWrapper}
              style={{
                backgroundImage:
                  typeof body?.photobook?.image?.node?.sourceUrl === 'string'
                    ? `url(${body.photobook.image.node.sourceUrl})`
                    : undefined,
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
            {toArray<HomeTemplatePastEditionColumnEntry>(
              body?.pastEditions?.desktopColumns,
            )
              .map((column) =>
                toArray<HomeTemplatePastEditionColumn>(column.leftColumn)
                  .map((edition) => {
                    const image = edition.image?.node?.sourceUrl;
                    const year =
                      typeof edition.year === 'string' ? edition.year : null;
                    const href =
                      typeof edition.link === 'string' && edition.link.length > 0
                        ? edition.link
                        : '#';

                    if (typeof image !== 'string' || !year) {
                      return null;
                    }

                    return {
                      image,
                      year: asDisplayString(year),
                      href,
                    };
                  })
                  .filter(
                    (
                      edition,
                    ): edition is { image: string; year: string; href: string } =>
                      edition !== null,
                  ),
              )
              .filter((column) => column.length > 0)
              .map((column, columnIndex) => (
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
            {toArray<HomeTemplatePastEditionColumnEntry>(
              body?.pastEditions?.desktopColumns,
            )
              .flatMap((column) =>
                toArray<HomeTemplatePastEditionColumn>(column.leftColumn)
                  .map((edition) => {
                    const image = edition.image?.node?.sourceUrl;
                    const year =
                      typeof edition.year === 'string' ? edition.year : null;
                    const href =
                      typeof edition.link === 'string' && edition.link.length > 0
                        ? edition.link
                        : '#';

                    if (typeof image !== 'string' || !year) {
                      return null;
                    }

                    return {
                      image,
                      year: asDisplayString(year),
                      href,
                    };
                  })
                  .filter(
                    (
                      edition,
                    ): edition is { image: string; year: string; href: string } =>
                      edition !== null,
                  ),
              )
              .map((edition) => (
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
