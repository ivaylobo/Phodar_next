import { fetchGraphQL } from '../client';

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
    cta?: Maybe<HomeTemplateCta | Array<Maybe<HomeTemplateCta>>>;
    durationSeconds?: Maybe<number>;
    editionLabel?: Maybe<string>;
    editionNumber?: Maybe<string>;
    slides?: Maybe<HomeTemplateSlide | Array<Maybe<HomeTemplateSlide>>>;
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

export type HomeTemplateMainInfoBlock = {
    awards?: Maybe<Array<Maybe<string>>>;
    headline?: Maybe<string>;
    leftColumnHeadlines?: Maybe<Array<Maybe<string>>>;
    rightColumnText?: Maybe<string | Array<Maybe<string>>>;
};

export type HomeTemplateExhibitions = {
    image1?: Maybe<ImageField>;
    title?: Maybe<string>;
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

const GET_HOME_PAGE_QUERY = `
  query GetHomePage($slug: ID!, $language: LanguageCodeEnum!) {
    page(id: $slug, idType: URI) {
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
              image1 {
                node {
                  altText
                  sourceUrl
                }
              }
              title
            }
            mainInfo {
              awards
              headline
              leftColumnHeadlines
              rightColumnText
            }
            partners {
              image {
                node {
                  altText
                  sourceUrl
                }
              }
              link
              name
            }
            pastEditions {
              desktopColumns {
                leftColumn {
                  image {
                    node {
                      altText
                      sourceUrl
                    }
                  }
                  link
                  year
                }
              }
              subtitle
              title
            }
            photobook {
              title
              image {
                node {
                  altText
                  sourceUrl
                }
              }
            }
          }
        }
      }
      translation(language: $language) {
        id
        title
        slug
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
                image1 {
                  node {
                    altText
                    sourceUrl
                  }
                }
                title
              }
              mainInfo {
                awards
                headline
                leftColumnHeadlines
                rightColumnText
              }
              partners {
                image {
                  node {
                    altText
                    sourceUrl
                  }
                }
                link
                name
              }
              pastEditions {
                desktopColumns {
                  leftColumn {
                    image {
                      node {
                        altText
                        sourceUrl
                      }
                    }
                    link
                    year
                  }
                }
                subtitle
                title
              }
              photobook {
                title
                image {
                  node {
                    altText
                    sourceUrl
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export async function getHomePageBySlug(slug: string, language: string) {
    const data = await fetchGraphQL<HomePageQueryResult>(GET_HOME_PAGE_QUERY, { slug, language });
    return data.page ?? null;
}
