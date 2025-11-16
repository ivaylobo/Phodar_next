import { fetchGraphQL } from '../client';

export type ArticleInlineImageEdge = {
  node?: { altText?: string | null; sourceUrl?: string | null } | null;
} | null;

export type ArticleFields = {
  customBody?: string | null;
  subtitle?: string | null;
  inlineImages?: { edges?: ArticleInlineImageEdge[] | null } | null;
} | null;

export type ArticleNode = {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  date?: string | null;
  language?: { code?: string | null } | null;
};

export type ArticleEdge = { node?: { articleFields?: ArticleFields } | null } | null;

export type ArticlesList = { nodes: ArticleNode[]; edges: ArticleEdge[] };

type ArticlesResponse = { articles: ArticlesList };

export async function getArticles(lang: 'EN' | 'BG'): Promise<ArticlesList> {
  const query = `
    query GetArticles($lang: LanguageCodeFilterEnum!) {
      articles(where: { language: $lang }) {
        nodes {
          id
          databaseId
          slug
          title
          date
          language { code }
        }
        edges {
          node {
            articleFields {
              customBody
              subtitle
              inlineImages {
                edges { node { altText sourceUrl } }
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL<ArticlesResponse>(query, { lang });
  return data.articles ?? { nodes: [], edges: [] };
}
