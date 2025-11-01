import type { HomeTemplateData as WordPressHomeTemplateData } from '@/graphql/queries/getHomePage';
import BackgroundSlideshow from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import styles from './Home.module.css';
import { buildHomeViewModel, homeTemplateDefaultData } from './helpers/mapping';

export { homeTemplateDefaultData };

type HomeTemplateProps = {
  homeTemplate?: WordPressHomeTemplateData | null;
};

export default function HomeTemplate({ homeTemplate }: HomeTemplateProps) {
  const data = buildHomeViewModel(homeTemplate);

  console.log('HomeTemplate data:', data);

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
