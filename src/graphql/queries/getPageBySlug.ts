import { fetchGraphQL } from '../client';

export type WordPressPage = {
    id: string;
    title: string;
    content: string;
    slug: string;
    uri: string;
    template?: {
        template?: string[] | null;
    } | null;
};

export async function getPageBySlug(slug: string): Promise<WordPressPage | null> {
    const query = `
    query GetPageBySlug($slug: ID!) {
      page(id: $slug, idType: URI) {
        id
        title
        slug
        content
        uri
        template {
          template
        }
      }
    }
  `;

    try {
        const data = await fetchGraphQL<{ page: WordPressPage | null }>(query, {
            slug,
        });
        return data.page || null;
    } catch (error) {
        console.error('getPageBySlug error:', error);
        return null;
    }
}
