import { gql } from "@apollo/client";

export type GetCurrentUserResult = {
    myProfile: { display_name: string };
    myEmail: string;
}

export const GET_CURRENT_USER = gql`
    query GetCurrentUser {
        myEmail
        myProfile {
            display_name
        }
    }
`;