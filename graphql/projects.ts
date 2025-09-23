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
        industry: string;
        status: ProjectStatus;
        stage: ProjectStage;
        visibility: ProjectVisibility;
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
        }
    }
`;

export const DELETE_PROJECT = gql`
    mutation DeleteProject($id: String!) {
        deleteProject(id: $id)
    }
`;