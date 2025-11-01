import { fetchGraphQL } from "../client";

type Maybe<T> = T | null | undefined;

type LinkField = {
    url?: Maybe<string>;
    title?: Maybe<string>;
    target?: Maybe<string>;
};

type ImageNode = {
    altText?: Maybe<string>;
    sourceUrl?: Maybe<string>;
};

type ImageField = {
    node?: Maybe<ImageNode>;
};

export type HomeTemplateCta = {
    label?: Maybe<string>;
    targetBlanc?: Maybe<boolean>;
    href?: Maybe<string | LinkField>;
};

export type HomeTemplateSlide = {
    image?: Maybe<ImageField>;
};

export type HomeTemplateHead = {
    cta?: Maybe<HomeTemplateCta>;
    durationSeconds?: Maybe<number>;
    editionLabel?: Maybe<string>;
    editionNumber?: Maybe<string>;
    slides?: Maybe<Array<Maybe<HomeTemplateSlide>>>;
    subtitle?: Maybe<string>;
    topicLabel?: Maybe<string>;
    topicTitle?: Maybe<string>;
    transitionSeconds?: Maybe<number>;
};

export type HomeTemplateAdditional = {
    headline?: Maybe<string>;
    highlightText?: Maybe<string>;
    mainSectionText?: Maybe<string>;
    shouldShow?: Maybe<boolean>;
};

/**
 * ✅ Всички WYSIWYG полета са string (HTML)
 */
export type HomeTemplateMainInfoBlock = {
    awards?: Maybe<string>;               // WYSIWYG
    headline?: Maybe<string>;
    leftColumnHeadlines?: Maybe<string>;  // WYSIWYG
    rightColumnText?: Maybe<string>;      // WYSIWYG
};

/**
 * ✅ Актуализирана структура за 4 изображения
 */
export type HomeTemplateExhibitions = {
    title?: Maybe<string>;
    imgFirst?: Maybe<ImageField>;
    imgSecond?: Maybe<ImageField>;
    imgThird?: Maybe<ImageField>;
    imgFourth?: Maybe<ImageField>;
};

export type HomeTemplatePartner = {
    image?: Maybe<ImageField>;
    link?: Maybe<string>;
    name?: Maybe<string>;
};

export type HomeTemplatePastEditionColumn = {
    image?: Maybe<ImageField>;
    link?: Maybe<string>;
    year?: Maybe<string>;
};

export type HomeTemplatePastEditionColumnEntry = {
    leftColumn?: Maybe<
        HomeTemplatePastEditionColumn | Array<Maybe<HomeTemplatePastEditionColumn>>
    >;
};

export type HomeTemplatePastEditions = {
    desktopColumns?: Maybe<
        HomeTemplatePastEditionColumnEntry | Array<Maybe<HomeTemplatePastEditionColumnEntry>>
    >;
    subtitle?: Maybe<string>;
    title?: Maybe<string>;
};

export type HomeTemplatePhotobook = {
    title?: Maybe<string>;
    image?: Maybe<ImageField>;
};

export type HomeTemplateBody = {
    additional?: Maybe<HomeTemplateAdditional>;
    exhibitions?: Maybe<HomeTemplateExhibitions>;
    mainInfo?: Maybe<HomeTemplateMainInfoBlock>;
    partners?: Maybe<HomeTemplatePartner | Array<Maybe<HomeTemplatePartner>>>;
    pastEditions?: Maybe<HomeTemplatePastEditions>;
    photobook?: Maybe<HomeTemplatePhotobook>;
};

export type HomeTemplateData = {
    head?: Maybe<HomeTemplateHead>;
    mainInfo?: Maybe<HomeTemplateBody>;
};

type TemplateEnvelope = {
    template?: Maybe<string[]>;
    homeTemplate?: Maybe<HomeTemplateData>;
};

export type HomePageTranslation = {
    id: string;
    title?: Maybe<string>;
    slug?: Maybe<string>;
    uri?: Maybe<string>;
    template?: Maybe<TemplateEnvelope>;
};

export type HomePageQueryResult = {
    page: Maybe<{
        id: string;
        title: string;
        slug: string;
        content: string;
        uri: string;
        template?: Maybe<TemplateEnvelope>;
        translation?: Maybe<HomePageTranslation>;
    }>;
};

/**
 * ✅ Единен GraphQL фрагмент за page + translation
 */
const GET_HOME_PAGE_QUERY = `
  fragment HomePageTemplateFields on Page {
    id
    title
    slug
    content
    uri
    template {
      template
      homeTemplate {
        head: headSection {
          cta {
            label: ctaLabel
            targetBlanc
            href
          }
          durationSeconds
          editionLabel
          editionNumber
          slides {
            image {
              node {
                altText
                sourceUrl
              }
            }
          }
          subtitle
          topicLabel
          topicTitle
          transitionSeconds
        }
        mainInfo {
          additional {
            headline
            highlightText
            mainSectionText
            shouldShow
          }
          exhibitions {
            title
            imgFirst { node { altText sourceUrl } }
            imgSecond { node { altText sourceUrl } }
            imgThird { node { altText sourceUrl } }
            imgFourth { node { altText sourceUrl } }
          }
          mainInfo {
            awards
            headline
            leftColumnHeadlines
            rightColumnText
          }
          partners {
            image { node { altText sourceUrl } }
            link
            name
          }
          pastEditions {
            desktopColumns {
              leftColumn {
                image { node { altText sourceUrl } }
                link
                year
              }
            }
            subtitle
            title
          }
          photobook {
            title
            image { node { altText sourceUrl } }
          }
        }
      }
    }
  }

  query GetHomePage($slug: ID!, $language: LanguageCodeEnum!) {
    page(id: $slug, idType: URI) {
      ...HomePageTemplateFields
      translation(language: $language) {
        ...HomePageTemplateFields
      }
    }
  }
`;

export async function getHomePageBySlug(
    slug: string,
    language: string,
): Promise<HomePageQueryResult["page"]> {
    try {
        const data = await fetchGraphQL<HomePageQueryResult>(
            GET_HOME_PAGE_QUERY,
            { slug, language },
        );

        if (!data || !data.page) {
            console.warn(`[getHomePageBySlug] Page not found for slug: ${slug}`);
            return null;
        }

        return data.page;
    } catch (error) {
        console.error(`[getHomePageBySlug] GraphQL fetch failed:`, error);
        return null;
    }
}
