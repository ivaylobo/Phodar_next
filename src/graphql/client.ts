const WP_GRAPHQL_URL =
    process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'http://phodar.local/graphql';

export async function fetchGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const res = await fetch(WP_GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, variables }),
        ...(process.env.NODE_ENV === 'development'
            ? { cache: 'no-store' as const }
            : { next: { revalidate: 60 } }),
    });

    if (!res.ok) throw new Error(`GraphQL fetch failed: HTTP ${res.status}`);
    const { data, errors } = await res.json() as {
        data?: T | null;
        errors?: Array<{ message: string }>;
    };
    if (errors?.length) {
        throw new Error(`GraphQL errors: ${errors.map((error) => error.message).join('; ')}`);
    }
    if (data == null) throw new Error('GraphQL response contains no data');
    return data;
}
