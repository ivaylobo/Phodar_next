import { fetchGraphQL } from '../client';

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

    const data = await fetchGraphQL<{ posts: { nodes: any[] } }>(query, { lang });
    return data.posts.nodes;
}
