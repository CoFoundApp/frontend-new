import { gql } from "@apollo/client";

export const UPDATE_MY_PROFILE = gql`
    mutation UpdateMyProfile($input: UpdateMyProfileInput!) {
        updateMyProfile(input: $input) {
            id
            display_name
            headline
            bio
            visibility
            location
            availability_hours
            looking_for
            languages
            tags
            updated_at
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