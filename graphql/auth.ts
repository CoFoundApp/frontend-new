import { gql } from "@apollo/client";

export const LOGIN = gql`
    mutation Login($input: LoginInput!) {
        login(input: $input) {
            __typename
        }
    }
`;

export const REGISTER = gql`
    mutation Signup($input: SignupInput!) {
        signup(input: $input) {
            __typename
        }
    }
`;

export const LOGOUT = gql`
    mutation Logout {
        logout
    }
`;

export const REFRESH_TOKEN = gql`
    mutation RefreshToken {
        refresh {
            __typename
        }
    }
`