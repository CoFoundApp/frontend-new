import { gql } from "@apollo/client";

export const CREATE_PROJECT = gql`
    mutation CreateProject($input: CreateProjectInput!) {
        createProject(input: $input) {
            __typename
        }
    }
`;

export type GetMyProjectsResult = {
    listMyProjects: {
        id: string;
        title: string;
        summary?: string;
        description?: string;
        industry: string;
        status: ProjectStatus;
        stage: ProjectStage;
        visibility: ProjectVisibility;
        tags: string[];
        created_at: Date;
        updated_at: Date;
    }[]
}

export const GET_MY_PROJECTS = gql`
    query GetMyProjects {
        listMyProjects {
            id
            title
            summary
            industry
            status
            stage
            visibility
            tags
            created_at
            updated_at
        }
    }
`;

export const DELETE_PROJECT = gql`
    mutation DeleteProject($id: String!) {
        deleteProject(id: $id)
    }
`;