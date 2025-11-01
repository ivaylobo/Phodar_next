import type { HomeTemplateData as WordPressHomeTemplateData } from '@/graphql/queries/getHomePage';
import BackgroundSlideshow from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import type { BackgroundSlide } from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import { renderWPContent } from '../../helpers/parseWYSIWYG';
import PastEditionsHome from './components/PastEditionsHome';
import styles from './Home.module.css';

type HomeTemplateProps = {
  homeTemplate?: WordPressHomeTemplateData | null;
};

export default function HomeTemplate({ homeTemplate }: HomeTemplateProps) {
  const head = homeTemplate?.head;
  const body = homeTemplate?.mainInfo;
  const additional = body?.additional;
  const mainInfoData = body?.mainInfo;

  const additionalHeadline =
    typeof additional?.headline === 'string' &&
    additional.headline.trim().length > 0
      ? additional.headline
      : null;

  const additionalHighlight =
    typeof additional?.highlightText === 'string' &&
    additional.highlightText.trim().length > 0
      ? additional.highlightText
      : null;

  const additionalMainSectionTexts =
    typeof additional?.mainSectionText === 'string' &&
    additional.mainSectionText.trim().length > 0
      ? [additional.mainSectionText]
      : Array.isArray(additional?.mainSectionText)
        ? additional.mainSectionText.filter(
            (item): item is string =>
              typeof item === 'string' && item.trim().length > 0,
          )
        : [];

  const mainInfoHeadline =
    typeof mainInfoData?.headline === 'string' &&
    mainInfoData.headline.trim().length > 0
      ? mainInfoData.headline
      : null;

  const awardsList = (
    Array.isArray(mainInfoData?.awards)
      ? mainInfoData.awards
      : typeof mainInfoData?.awards === 'string'
        ? [mainInfoData.awards]
        : []
  ).filter(
    (item): item is string =>
      typeof item === 'string' && item.trim().length > 0,
  );

    const leftColumnValue = mainInfoData?.leftColumnHeadlines as string | undefined;

    const leftColumnItems =
        typeof leftColumnValue === 'string' && leftColumnValue.trim().length > 0
            ? leftColumnValue
            : null;

  const rightColumnTexts = (
    Array.isArray(mainInfoData?.rightColumnText)
      ? mainInfoData.rightColumnText
      : typeof mainInfoData?.rightColumnText === 'string'
        ? [mainInfoData.rightColumnText]
        : typeof mainInfoData?.rightColumnText === 'number'
          ? [String(mainInfoData.rightColumnText)]
          : []
  ).filter(
    (item): item is string =>
      typeof item === 'string' && item.trim().length > 0,
  );

  const hasLeftColumn = !!leftColumnItems;
  const hasRightColumn = rightColumnTexts.length > 0;

    console.log('body?.exhibitions: ', body)

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
                      typeof node.altText === 'string'
                        ? node.altText
                        : undefined,
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
            <span className={styles.summaryTopicLabel}>{head?.topicLabel}</span>
            <h1 className={styles.summaryTopicTitle}>{head?.topicTitle}</h1>
          </div>
          <div className={styles.summaryLinks}>
            {(Array.isArray(head?.cta)
              ? head.cta
              : head?.cta
                ? [head.cta]
                : []
            ).flatMap((cta) => {
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
          {additionalHeadline ? (
            <div className={styles.mainInfoHeader}>
              <h3 className={styles.mainInfoHeadline}>
                {renderWPContent(additionalHeadline)}
              </h3>
            </div>
          ) : null}

          {additionalHighlight || additionalMainSectionTexts.length > 0 ? (
            <div className={styles.additionalColumns}>
              {additionalHighlight ? (
                <div className={styles.additionalHighlight}>
                  <div className={styles.highlight}>
                    {renderWPContent(additionalHighlight)}
                  </div>
                </div>
              ) : null}
              {additionalMainSectionTexts.length > 0 ? (
                <div className={styles.additionalText}>
                  {additionalMainSectionTexts.map((paragraph, index) => (
                    <div key={`additional-text-${index}`}>
                      {renderWPContent(paragraph)}
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

          {mainInfoHeadline || awardsList.length > 0 ? (
            <div className={styles.mainInfoAwardsSection}>
              {mainInfoHeadline ? (
                <h2 className={styles.mainInfoTitle}>
                  {renderWPContent(mainInfoHeadline)}
                </h2>
              ) : null}
              {awardsList.length > 0 ? (
                <div className={styles.mainInfoAwards}>
                  {awardsList.map((award, index) => (
                    <span key={index}>{renderWPContent(award)}</span>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}

            {(hasLeftColumn || hasRightColumn) && (
                <div
                    className={
                        hasLeftColumn && hasRightColumn
                            ? styles.mainInfoColumns
                            : styles.mainInfoSingleColumn
                    }
                >
                    {leftColumnItems && (
                        <div className={styles.mainInfoHeading}>
                            {renderWPContent(leftColumnItems)}
                        </div>
                    )}

                    {hasRightColumn &&
                        rightColumnTexts.map((item, index) => (
                            <div key={`right-${index}`} className={styles.mainInfoParagraph}>
                                {renderWPContent(item)}
                            </div>
                        ))}
                </div>
            )}

        </div>
      </section>

      <section className={styles.logoSofia}>
        <div className={`container ${styles.partners}`}>
          <div className={styles.partnerGrid}>
            {(Array.isArray(body?.partners)
              ? body.partners
              : body?.partners
                ? [body.partners]
                : []
            ).flatMap((partner) => {
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
          <h2>
            {typeof body?.exhibitions?.title === 'string' &&
            body.exhibitions.title.trim().length > 0
              ? renderWPContent(body.exhibitions.title)
              : (body?.exhibitions?.title ?? '')}
          </h2>
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
              <h3>
                {typeof body?.photobook?.title === 'string' &&
                body.photobook.title.trim().length > 0
                  ? renderWPContent(body.photobook.title)
                  : (body?.photobook?.title ?? '')}
              </h3>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.pastEditionsSection}>
        <div className="container">
          <h2 className={styles.pastEditionsTitle}>
            {body?.pastEditions?.title}
          </h2>

          <h3 className={styles.pastEditionsSubtitle}>
            {typeof body?.pastEditions?.subtitle === 'string' &&
            body.pastEditions.subtitle.trim().length > 0
              ? renderWPContent(body.pastEditions.subtitle)
              : (body?.pastEditions?.subtitle ?? '')}
          </h3>

          <PastEditionsHome
            desktopColumns={body?.pastEditions?.desktopColumns}
          />
        </div>
      </section>
    </div>
  );
}
