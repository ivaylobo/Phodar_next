import type { HomeTemplatePastEditionColumnEntry } from '@/graphql/queries/getHomePage';
import styles from '../Home.module.css';

type PastEditionsProps = {
  desktopColumns?:
    | HomeTemplatePastEditionColumnEntry
    | Array<HomeTemplatePastEditionColumnEntry | null | undefined>
    | null
    | undefined;
};

export default function PastEditionsHome({
  desktopColumns,
}: PastEditionsProps) {
  const columns = Array.isArray(desktopColumns)
    ? desktopColumns
    : desktopColumns
      ? [desktopColumns]
      : [];

  const entries = columns
    .flatMap((column) => {
      if (!column) {
        return [];
      }

      const leftColumn = column.leftColumn;
      const editions = Array.isArray(leftColumn)
        ? leftColumn
        : leftColumn
          ? [leftColumn]
          : [];

      return editions
        .map((edition) => {
          if (!edition) {
            return null;
          }

          const image = edition.image?.node?.sourceUrl;
          const year =
            typeof edition.year === 'string' ? edition.year.trim() : null;
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
          (edition): edition is { image: string; year: string; href: string } =>
            edition !== null,
        );
    })
    .filter((edition) => edition.year.length > 0);

  if (entries.length === 0) {
    return null;
  }

  const sorted = [...entries].sort((a, b) => {
    const yearA = parseInt(a.year, 10);
    const yearB = parseInt(b.year, 10);

    if (Number.isNaN(yearA) || Number.isNaN(yearB)) {
      return a.year.localeCompare(b.year);
    }

    return yearB - yearA;
  });

  return (
    <div className={styles.pastEditionsGrid}>
      {sorted.map((edition, index) => (
        <a
          key={`${edition.year}-${index}`}
          className={styles.pastEditionCard}
          href={edition.href}
          style={{ backgroundImage: `url(${edition.image})` }}
        >
          <span>{edition.year}</span>
        </a>
      ))}
    </div>
  );
}
