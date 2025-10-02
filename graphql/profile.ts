import { gql } from "@apollo/client";

export const UPDATE_MY_PROFILE = gql`
    mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
        updateMyProfile(input: $input) {
            __typename
        }
    }
`;

export type GetMyProfileResult = {
    myProfile: {
        avatar_url: string | null;
        availability_hours: string | null;
        bio: string | null;
        display_name: string | null;
        headline: string | null;
        languages: string[];
        location: string | null;
        looking_for: string | null;
        tags: string[];
        visibility: ProfileVisibility;
        website_url: string | null;
    } | null;
}

export const GET_MY_PROFILE = gql`
    query GetMyProfile {
        myProfile {
            avatar_url
            availability_hours
            bio
            display_name
            headline
            languages
            location
            looking_for
            tags
            visibility
            website_url
        }
    }
`;

export const GET_PROFILE_BY_ID = gql`
    query GetProfileById($id: String!) {
        profileById(id: $id) {
            avatar_url
            availability_hours
            bio
            display_name
            headline
            languages
            location
            looking_for
            tags
            visibility
            website_url
            user {
                id
            }
        }
    }
`

export type GetProfileByIdResult = {
    profileById: {
        avatar_url: string | null
        availability_hours: number | null
        bio: string | null
        display_name: string | null
        headline: string | null
        languages: string[]
        location: string | null
        looking_for: string | null
        tags: string[]
        visibility: ProfileVisibility
        website_url: string | null
        user: {
            id: string
        }
    } | null
}