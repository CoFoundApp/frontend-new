export type GqlResponse<T> = { data?: T; errors?: Array<{ message: string; path?: (string|number)[] }> };

export async function gqlFetch<T>(
    query: string,
    variables?: Record<string, unknown>,
    signal?: AbortSignal
): Promise<T> {
    const res = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query, variables }),
        signal,
    });

    const json = (await res.json()) as GqlResponse<T>;

    if (!res.ok) {
        throw new Error(json?.errors?.[0]?.message || `HTTP ${res.status}`);
    }
    if (json.errors?.length) {
        console.log(json.errors)
        throw new Error(json.errors[0].message);
    }
    if (!json.data) {
        throw new Error("Réponse GraphQL vide.");
    }
    return json.data;
}
