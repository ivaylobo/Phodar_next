import type { HomeTemplateData as WordPressHomeTemplateData } from '@/graphql/queries/getHomePage';
import BackgroundSlideshow from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import type { BackgroundSlide } from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import styles from './Home.module.css';

type HomeTemplateProps = {
  homeTemplate?: WordPressHomeTemplateData | null;
};

export default function HomeTemplate({ homeTemplate }: HomeTemplateProps) {
  const head = homeTemplate?.head;
  const body = homeTemplate?.mainInfo;

  return (
    <div className={styles.homePage}>
      <section className={styles.summary}>
        <BackgroundSlideshow
          className={styles.backgroundSlider}
          images={
            Array.isArray(head?.slides)
              ? head.slides.reduce<BackgroundSlide[]>((slides, current) => {
                  if (!current) {
                    return slides;
                  }

                  const node = current.image?.node;
                  if (typeof node?.sourceUrl !== 'string') {
                    return slides;
                  }

                  slides.push({
                    src: node.sourceUrl,
                    alt:
                      typeof node.altText === 'string' ? node.altText : undefined,
                  });

                  return slides;
                }, [])
              : []
          }
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
              {head?.editionNumber}
            </h4>
            <p
              className={styles.summaryEditionLabel}
              aria-label={head?.editionLabel ?? undefined}
            >
              <span className={styles.summaryEditionLabelSmall}>
                {head?.editionLabel}
              </span>
            </p>
          </div>
          <h3 className={styles.summaryTitle}>{head?.subtitle}</h3>
          <div className={styles.summaryBottom}>
            <span className={styles.summaryTopicLabel}>
              {head?.topicLabel}
            </span>
            <h1 className={styles.summaryTopicTitle}>
              {head?.topicTitle}
            </h1>
          </div>
          <div className={styles.summaryLinks}>
            {(Array.isArray(head?.cta) ? head.cta : head?.cta ? [head.cta] : [])
              .flatMap((cta) => {
                if (!cta) {
                  return [];
                }

                const href =
                  typeof cta.href === 'string'
                    ? cta.href
                    : typeof cta.href?.url === 'string'
                      ? cta.href.url
                      : undefined;
                const label =
                  typeof cta.label === 'string'
                    ? cta.label
                    : typeof cta.href !== 'string' &&
                        typeof cta.href?.title === 'string'
                      ? cta.href.title
                      : undefined;

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
                __html: body?.additional?.headline ?? '',
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
                    __html: paragraph,
                  }}
                />
              ))}
            </div>
          </div>

          <div className={styles.mainInfoAwardsBlock}>
            <h2
              className={styles.mainInfoTitle}
              dangerouslySetInnerHTML={{
                __html: body?.mainInfo?.headline ?? '',
              }}
            />
            <div className={styles.mainInfoAwards}>
              {(Array.isArray(body?.mainInfo?.awards) ? body.mainInfo.awards : [])
                .filter((value): value is string => typeof value === 'string')
                .map((line, index) => (
                  <span
                    key={`${line}-${index}`}
                    dangerouslySetInnerHTML={{
                      __html: line,
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
                      __html: item,
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
                      __html: item,
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
            {(Array.isArray(body?.partners)
              ? body.partners
              : body?.partners
                ? [body.partners]
                : [])
              .flatMap((partner) => {
                if (!partner) {
                  return [];
                }

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
          <h2>{body?.exhibitions?.title}</h2>
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
                  __html: body?.photobook?.title ?? '',
                }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className={styles.pastEditionsSection}>
        <div className="container">
          <h2 className={styles.pastEditionsTitle}>
            {body?.pastEditions?.title}
          </h2>
          <h3
            className={styles.pastEditionsSubtitle}
            dangerouslySetInnerHTML={{
              __html: body?.pastEditions?.subtitle ?? '',
            }}
          />

          <div>
            {(Array.isArray(body?.pastEditions?.desktopColumns)
              ? body.pastEditions.desktopColumns
              : body?.pastEditions?.desktopColumns
                ? [body.pastEditions.desktopColumns]
                : [])
              .map((column) => {
                if (!column) {
                  return [];
                }

                const leftColumn = column.leftColumn;
                return (Array.isArray(leftColumn)
                  ? leftColumn
                  : leftColumn
                    ? [leftColumn]
                    : []
                )
                  .map((edition) => {
                    if (!edition) {
                      return null;
                    }

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
                      year,
                      href,
                    };
                  })
                  .filter(
                    (
                      edition,
                    ): edition is { image: string; year: string; href: string } =>
                      edition !== null,
                  );
              })
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
            {(Array.isArray(body?.pastEditions?.desktopColumns)
              ? body.pastEditions.desktopColumns
              : body?.pastEditions?.desktopColumns
                ? [body.pastEditions.desktopColumns]
                : [])
              .flatMap((column) => {
                if (!column) {
                  return [];
                }

                const leftColumn = column.leftColumn;
                return (Array.isArray(leftColumn)
                  ? leftColumn
                  : leftColumn
                    ? [leftColumn]
                    : []
                )
                  .map((edition) => {
                    if (!edition) {
                      return null;
                    }

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
                      year,
                      href,
                    };
                  })
                  .filter(
                    (
                      edition,
                    ): edition is { image: string; year: string; href: string } =>
                      edition !== null,
                  );
              })
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
