import { fetchGraphQL } from '../client';
import type { ArticleFields } from './getArticles';

export type Article = {
  id: string;
  slug: string;
  title: string;
  content?: string | null;
  excerpt?: string | null;
  date?: string | null;
  articleFields?: ArticleFields;
  featuredImage?: { node?: { sourceUrl?: string | null } | null } | null;
};

type ArticleWithTranslation = Article & { translation?: Article | null };

export async function getArticleBySlug(
  slug: string,
  language: 'EN' | 'BG',
): Promise<Article | null> {
  // Use the working schema: articles { nodes{}, edges{ node { articleFields{} } } }
  const query = `
    query GetArticleBySlug($language: LanguageCodeFilterEnum!) {
      articles(where: { language: $language }) {
        nodes {
          id
          databaseId
          slug
          title
          date
          featuredImage { node { sourceUrl } }
        }
        edges {
          node {
            articleFields {
              customBody
              subtitle
              inlineImages { edges { node { altText sourceUrl } } }
            }
          }
        }
      }
    }
  `;

  try {
    const result = await fetchGraphQL<{
      articles: {
        nodes: Array<Pick<Article, 'id' | 'slug' | 'title' | 'date' | 'featuredImage'>>;
        edges: Array<{ node?: { articleFields?: ArticleFields } | null } | null>;
      };
    }>(query, { language });

    const nodes = result.articles?.nodes ?? [];
    const edges = result.articles?.edges ?? [];
    const index = nodes.findIndex((n) => n.slug === slug);
    if (index === -1) return null;
    const node = nodes[index]!;
    const fields = edges[index]?.node?.articleFields;
    return { ...node, articleFields: fields } as Article;
  } catch (err) {
    console.error('getArticleBySlug error:', err);
    return null;
  }
}
