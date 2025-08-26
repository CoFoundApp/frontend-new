import { gqlFetch } from "@/lib/graphql";

type RegisterInput = {
    fullName?: string;
    email: string;
    password: string;
};

type RegisterResult = {
    register: {
        user: { id: string, email: string } | null;
    };
};

export const REGISTER_MUTATION = `
    mutation Signup($input: SignupInput!) {
        signup(input: $input) {
            __typename
        }
    }
`;

export async function registerUser(input: RegisterInput, signal?: AbortSignal) {
    await gqlFetch<RegisterResult>(REGISTER_MUTATION, { input }, signal);
}