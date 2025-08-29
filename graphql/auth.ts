import { gql } from "@apollo/client";

type LoginInput = {
    email: string;
    password: string;
}

export const LOGIN = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            __typename
        }
    }
`;

type SignupInput = {
    email: string;
    password: string;
}

export const REGISTER = gql`
    mutation Signup($input: SignupInput!) {
        signup(input: $input) {
            __typename
        }
    }
`;