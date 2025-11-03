const WP_GRAPHQL_URL =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://phodar.local/graphql';

export async function fetchGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const res = await fetch(WP_GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
        next: { revalidate: 60 }, // ISR cache
    });

    if (!res.ok) throw new Error('GraphQL fetch failed');
    const { data } = await res.json();
    return data;
}
