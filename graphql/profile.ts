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