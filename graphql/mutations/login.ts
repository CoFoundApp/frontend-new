import { gqlFetch } from "@/lib/graphql";

export type LoginInput = {
    email: string;
    password: string;
};

export const LOGIN_MUTATION = `
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            __typename
        }
    }
`;

export async function loginUser(input: LoginInput, signal?: AbortSignal) {
    await gqlFetch(LOGIN_MUTATION, { input }, signal);
}