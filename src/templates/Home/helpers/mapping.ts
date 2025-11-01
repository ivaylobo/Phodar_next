import type {
  HomeTemplateData as WordPressHomeTemplateData,
  HomeTemplateHead,
  HomeTemplateBody,
  HomeTemplatePastEditionColumn,
} from '@/graphql/queries/getHomePage';
import type { BackgroundSlide } from '@/components/BackgroundSlideshow/BackgroundSlideshow';
import { buildParagraphs } from './buildHtml';

type Maybe<T> = T | null | undefined;

export type HomeTemplateLink = {
  label: string;
  href: string;
  targetBlank?: boolean;
  rel?: string;
};

export type HomeProgramItem = {
  title: string;
  descriptionHtml: string;
};

export type HomePartner = {
  name: string;
  href: string;
  image: string;
};

export type HomeExhibitionItem = {
  image: string;
  alt?: string;
};

export type HomePastEdition = {
  year: string;
  href: string;
  image: string;
};

export type HomeViewModel = {
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

function isNonEmptyString(value?: Maybe<string>): value is string {
  return typeof value === 'string' && value.trim().length > 0;
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
        typeof hrefField === 'string' ? hrefField.trim() : hrefField?.url;
      const fallbackLabel = typeof hrefField === 'string' ? undefined : hrefField?.title;
      const label = cta.label ?? fallbackLabel;

      if (!isNonEmptyString(label) || !isNonEmptyString(href)) {
        return null;
      }

      const link: HomeTemplateLink = {
        label: label.trim(),
        href,
      };

      const target = typeof hrefField === 'string' ? undefined : hrefField?.target;
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

function mapPastEditionColumn(
  edition?: Maybe<HomeTemplatePastEditionColumn>,
): HomePastEdition | null {
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
    entries?: Maybe<HomeTemplatePastEditionColumn | Array<Maybe<HomeTemplatePastEditionColumn>>>,
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

export function buildHomeViewModel(
  homeTemplate?: WordPressHomeTemplateData | null,
): HomeViewModel {
  const viewModel = cloneDefaults();

  if (!homeTemplate) {
    return viewModel;
  }

  if (homeTemplate.head) {
    const head = homeTemplate.head;

    console.log('HomeTemplate head:', head);

    if (isNonEmptyString(head.editionNumber)) {
      viewModel.hero.editionNumber = head.editionNumber.trim();
          console.log('viewModel.hero.editionNumber :', viewModel.hero.editionNumber );
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

export const homeTemplateDefaultData = defaultHomeViewModel;
