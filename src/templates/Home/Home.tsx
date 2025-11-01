import type {HomeTemplateData as WordPressHomeTemplateData} from '@/graphql/queries/getHomePage';
import BackgroundSlideshow from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import type {BackgroundSlide} from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import {renderWPContent} from '../../helpers/parseWYSIWYG';
import PastEditionsHome from './components/PastEditionsHome';
import styles from './Home.module.css';

type HomeTemplateProps = {
    homeTemplate?: WordPressHomeTemplateData | null;
};

export default function HomeTemplate({homeTemplate}: HomeTemplateProps) {
    if (!homeTemplate) return null;

    const head = homeTemplate.head;
    const body = homeTemplate.mainInfo;
    const mainInfoData = body?.mainInfo;

    const slides: BackgroundSlide[] =
        head?.slides?.map((s) => ({
            src: s?.image?.node?.sourceUrl ?? '',
            alt: s?.image?.node?.altText ?? undefined,
        })) ?? [];

    const partners = Array.isArray(body?.partners)
        ? body.partners
        : body?.partners
            ? [body.partners]
            : [];

    return (
        <div className={styles.homePage}>
            {/* SUMMARY SECTION */}
            <section className={styles.summary}>
                <BackgroundSlideshow
                    className={styles.backgroundSlider}
                    images={slides}
                    durationSeconds={head?.durationSeconds ?? undefined}
                    transitionSeconds={head?.transitionSeconds ?? undefined}
                    overlay
                />

                <div className={`${styles.summaryContainer} container`}>
                    <div className={styles.summaryTop}>
                        <h4 className={styles.summaryEditionNumber}>{head?.editionNumber}</h4>
                        <p className={styles.summaryEditionLabel}>
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
                        {head?.cta && (
                            <a
                                className={styles.buttonLink}
                                href={
                                    typeof head.cta.href === 'string'
                                        ? head.cta.href
                                        : head.cta.href?.url ?? '#'
                                }
                                target={head.cta.targetBlanc ? '_blank' : undefined}
                                rel={head.cta.targetBlanc ? 'noopener noreferrer' : undefined}
                            >
                                {head.cta.label ??
                                    (typeof head.cta.href !== 'string' ? head.cta.href?.title : '')}
                            </a>
                        )}

                    </div>
                </div>
            </section>

            {/* MAIN INFO */}
            <section className={styles.mainInfo}>
                <div className="container">
                    {body?.additional?.headline && (
                        <div className={styles.mainInfoHeader}>
                            <h3 className={styles.mainInfoHeadline}>
                                {renderWPContent(body.additional.headline)}
                            </h3>
                        </div>
                    )}

                    {(body?.additional?.highlightText || body?.additional?.mainSectionText) && (
                        <div className={styles.additionalColumns}>
                            {body.additional?.highlightText && (
                                <div className={styles.additionalHighlight}>
                                    <div className={styles.highlight}>
                                        {renderWPContent(body.additional.highlightText)}
                                    </div>
                                </div>
                            )}

                            {body.additional?.mainSectionText && (
                                <div className={styles.additionalText}>
                                    {renderWPContent(body.additional.mainSectionText)}
                                </div>
                            )}
                        </div>
                    )}

                    {(mainInfoData?.headline || mainInfoData?.awards) && (
                        <div className={styles.mainInfoAwardsSection}>
                            {mainInfoData?.headline && (
                                <h2 className={styles.mainInfoTitle}>
                                    {renderWPContent(mainInfoData.headline)}
                                </h2>
                            )}

                            {mainInfoData?.awards && (
                                <div className={styles.mainInfoAwards}>
                                    {renderWPContent(mainInfoData.awards)}
                                </div>
                            )}
                        </div>
                    )}

                    {(mainInfoData?.leftColumnHeadlines || mainInfoData?.rightColumnText) && (
                        <div className={styles.mainInfoColumns}>
                            {mainInfoData?.leftColumnHeadlines && (
                                <div className={styles.mainInfoHeading}>
                                    {renderWPContent(mainInfoData.leftColumnHeadlines)}
                                </div>
                            )}

                            {mainInfoData?.rightColumnText && (
                                <div className={styles.mainInfoParagraph}>
                                    {renderWPContent(mainInfoData.rightColumnText)}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </section>


            {/* PARTNERS */}
            <section className={styles.logoSofia}>
                <div className={`container ${styles.partners}`}>
                    <div className={styles.partnerGrid}>
                        {partners.map(
                            (p) =>
                                p && (
                                    <div key={p.name} className={styles.partnerCard}>
                                        <a
                                            className={styles.partnerLink}
                                            href={p.link ?? '#'}
                                            target="_blank"
                                            rel="noreferrer"
                                            style={{
                                                backgroundImage: `url(${p.image?.node?.sourceUrl ?? ''})`,
                                            }}
                                            aria-label={p.name ?? ''}
                                        >
                                            {p.name}
                                        </a>
                                    </div>
                                ),
                        )}
                    </div>
                </div>
            </section>

            {/* EXHIBITIONS */}
            <section className={styles.exhibitions}>
                <div className="container">
                    {body?.exhibitions?.title && (
                        <h2>{renderWPContent(body.exhibitions.title)}</h2>
                    )}

                    <div className={styles.allWrapper}>
                        <div className={`${styles.rowWrapper} ${styles.rowWrapperFirst}`}>
                            {[body?.exhibitions?.imgFirst?.node, body?.exhibitions?.imgSecond?.node]
                                .filter(Boolean)
                                .map((node, i) => (
                                    <div
                                        key={`exh-row1-${i}`}
                                        className={styles.imageWrapper}
                                        style={{backgroundImage: `url(${node!.sourceUrl})`}}
                                        aria-label={node?.altText ?? ''}
                                    />
                                ))}
                        </div>

                        <div className={`${styles.rowWrapper} ${styles.rowWrapperSecond}`}>
                            {[body?.exhibitions?.imgThird?.node, body?.exhibitions?.imgFourth?.node]
                                .filter(Boolean)
                                .map((node, i) => (
                                    <div
                                        key={`exh-row2-${i}`}
                                        className={styles.imageWrapper}
                                        style={{backgroundImage: `url(${node!.sourceUrl})`}}
                                        aria-label={node?.altText ?? ''}
                                    />
                                ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* PHOTOBOOK */}
            <section className={styles.photoBook}>
                <div className="container">
                    <div className={styles.photoBookInner}>
                        <div
                            className={styles.photoBookWrapper}
                            style={{
                                backgroundImage: `url(${body?.photobook?.image?.node?.sourceUrl ?? ''})`,
                            }}
                        />
                        <div className={styles.photoBookText}>
                            <h3>{renderWPContent(body?.photobook?.title ?? '')}</h3>
                        </div>
                    </div>
                </div>
            </section>

            {/* PAST EDITIONS */}
            <section className={styles.pastEditionsSection}>
                <div className="container">
                    <h2 className={styles.pastEditionsTitle}>{body?.pastEditions?.title}</h2>
                    <h3 className={styles.pastEditionsSubtitle}>
                        {renderWPContent(body?.pastEditions?.subtitle ?? '')}
                    </h3>
                    <PastEditionsHome desktopColumns={body?.pastEditions?.desktopColumns}/>
                </div>
            </section>
        </div>
    );
}
