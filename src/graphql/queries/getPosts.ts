import { fetchGraphQL } from '../client';

export type WordPressPostSummary = {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
};

export async function getPosts(lang: 'EN' | 'BG') {
    const query = `
    query GetPosts($lang: LanguageCodeFilterEnum!) {
      posts(where: { language: $lang }) {
        nodes {
          id
          title
          slug
          excerpt
        }
      }
    }
  `;

    const data = await fetchGraphQL<{ posts: { nodes: WordPressPostSummary[] } }>(query, { lang });
    return data.posts.nodes;
}
