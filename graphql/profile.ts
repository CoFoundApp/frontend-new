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
        educations: Array<{
            degree: string | null;
            description: string | null;
            end_date: string | null;
            field_of_study: string | null;
            grade: string | null;
            is_current: boolean;
            school: string;
            start_date: string;
        }>;
        headline: string | null;
        interests: Array<{
            name: string;
        }>;
        languages: string[];
        location: string | null;
        looking_for: string | null;
        skills: Array<{
            name: string;
        }>;
        tags: string[];
        visibility: ProfileVisibility;
        website_url: string | null;
        workExperiences: Array<{
            company: string;
            description: string | null;
            end_date: string | null;
            is_current: boolean;
            location: string | null;
            start_date: string;
            title: string;
        }>;
    } | null;
}

export const GET_MY_PROFILE = gql`
    query GetMyProfile {
        myProfile {
            avatar_url
            availability_hours
            bio
            display_name
            educations {
                degree
                description
                end_date
                field_of_study
                grade
                is_current
                school
                start_date
            }
            headline
            interests {
                name
            }
            languages
            location
            looking_for
            skills {
                name
            }
            tags
            visibility
            website_url
            workExperiences {
                company
                description
                end_date
                is_current
                location
                start_date
                title
            }
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
            educations {
                degree
                description
                end_date
                field_of_study
                grade
                is_current
                school
                start_date
            }
            headline
            interests {
                name
            }
            languages
            location
            looking_for
            skills {
                name
            }
            tags
            visibility
            website_url
            workExperiences {
                company
                description
                end_date
                is_current
                location
                start_date
                title
            }
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
        educations: Array<{
            degree: string | null;
            description: string | null;
            end_date: string | null;
            field_of_study: string | null;
            grade: string | null;
            is_current: boolean;
            school: string;
            start_date: string;
        }>;
        headline: string | null
        interests: Array<{
            name: string;
        }>;
        languages: string[]
        location: string | null
        looking_for: string | null
        skills: Array<{
            name: string;
        }>;
        tags: string[]
        visibility: ProfileVisibility
        website_url: string | null
        workExperiences: Array<{
            company: string;
            description: string | null;
            end_date: string | null;
            is_current: boolean;
            location: string | null;
            start_date: string;
            title: string;
        }>;
        user: {
            id: string
        }
    } | null
}