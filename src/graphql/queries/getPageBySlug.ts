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

export async function getPageBySlug(slug: string, language: 'EN' | 'BG'): Promise<WordPressPage | null> {
    const query = `
    fragment PageFields on Page {
      id
      title
      slug
      content
      uri
      template { template }
    }
    query GetPageBySlug($slug: ID!, $language: LanguageCodeEnum!) {
      page(id: $slug, idType: URI) {
        ...PageFields
        translation(language: $language) {
          ...PageFields
        }
      }
    }
  `;

    try {
        const data = await fetchGraphQL<{ page: (WordPressPage & { translation?: WordPressPage | null }) | null }>(query, {
            slug,
            language,
        });
        return data.page?.translation || null;
    } catch (error) {
        console.error('getPageBySlug error:', error);
        return null;
    }
}
