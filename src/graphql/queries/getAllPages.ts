import { fetchGraphQL } from '../client';
import type { WordPressPage } from './getPageBySlug';

export type WordPressPageSummary = Pick<WordPressPage, 'id' | 'slug' | 'uri' | 'template'>;

type GetAllPagesResponse = {
    pages: {
        nodes: Array<WordPressPageSummary | null> | null;
    } | null;
};

export async function getAllPagesFromWordPress(): Promise<WordPressPageSummary[]> {
    const query = `
    query GetAllPages {
      pages(first: 1000) {
        nodes {
          id
          slug
          uri
          template {
            template
          }
        }
      }
    }
  `;

    try {
        const data = await fetchGraphQL<GetAllPagesResponse>(query);
        return data.pages?.nodes?.filter((page): page is WordPressPageSummary => Boolean(page?.uri)) ?? [];
    } catch (error) {
        console.error('getAllPagesFromWordPress error:', error);
        return [];
    }
}
