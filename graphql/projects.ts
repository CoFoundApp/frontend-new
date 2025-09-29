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

export type GetProjectByIdResult = {
    projectById: {
        id: string;
        title: string;
        summary: string | null;
        description: string | null;
        avatar_url: string | null;
        banner_url: string | null;
        industry: string | null;
        owner_id: string;
        project_interests: string[];
        project_skills: string[];
        stage: ProjectStage;
        status: ProjectStatus;
        tags: string[];
        visibility: ProjectVisibility;
    } | null;
};

export const GET_PROJECT_BY_ID = gql`
    query GetProjectById($id: String!) {
        projectById(id: $id) {
            avatar_url
            banner_url
            description
            id
            industry
            owner_id
            stage
            status
            summary
            tags
            title
            visibility
        }
    }
`;

export type GetProjectPositionsResult = {
    listProjectPositions: {
        id: string;
        title: string;
        status: ProjectStatus;
        description: string;
    }[] | null;
};

export const GET_PROJECT_POSITIONS = gql`
    query GetProjectPositions($project_id: String!) {
        listProjectPositions(project_id: $project_id) {
            id
            title
            status
            description
        }
    }
`;

export const CREATE_PROJECT_POSITION = gql`
    mutation CreateProjectPosition($input: CreateProjectPositionInput!) {
        createProjectPosition(input: $input) {
            __typename
        }
    }
`;

export const CLOSE_PROJECT_POSITION = gql`
    mutation CloseProjectPosition($id: String!) {
        closeProjectPosition(id: $id) {
            __typename
        }
    }
`;