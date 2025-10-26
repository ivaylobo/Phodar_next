import { fetchGraphQL } from '../client';

export type MenuItem = {
    id: string;
    label: string;
    url: string;
};

export type MenuResponse = {
    menu: {
        id: string;
        name: string;
        slug: string;
        menuItems: {
            nodes: MenuItem[];
        };
    };
};

export async function getMenu(lang: 'EN' | 'BG') {
    const slug = lang === 'EN' ? 'main-menu-en' : 'main-menu-bg';

    const query = `
    query GetMenu($slug: ID!) {
      menu(id: $slug, idType: SLUG) {
        id
        name
        slug
        menuItems {
          nodes {
            id
            label
            url
          }
        }
      }
    }
  `;

    const data = await fetchGraphQL<MenuResponse>(query, { slug });


    return data.menu?.menuItems?.nodes ?? [];
}
