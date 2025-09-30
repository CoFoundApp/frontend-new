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
            project_interests
            project_skills
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

export type GetProjectMembersResult = {
    projectMembers: {
        role: MemberRole;
        users: {
            id: string;
            email: string;
            profile: {
                avatar_url: string | null;
                display_name: string | null;
                headline: string | null;
            }
        }
    }[] | null;
}

export const GET_PROJECT_MEMBERS = gql`
    query GetProjectMembers($project_id: String!) {
        projectMembers(project_id: $project_id) {
            role
            users {
                id
                email
                profile {
                    avatar_url
                    display_name
                    headline
                }
            }
        }
    }
`;

export type ListProjectsResult = {
  listProjects: {
    items: {
      id: string
      title: string
      summary: string | null
      description: string | null
      avatar_url: string | null
      banner_url: string | null
      industry: string | null
      owner_id: string
      project_interests: string[]
      project_skills: string[]
      stage: ProjectStage
      status: ProjectStatus
      tags: string[]
      visibility: ProjectVisibility
      created_at: Date
      updated_at: Date
    }[]
    page: number
    pageSize: number
    total: number
  }
}

export const LIST_PROJECTS = gql`
    query ListProjects(
        $filters: ProjectListFiltersInput
        $page: ProjectListPageInput
        $sort: ProjectListSortInput
    ) {
        listProjects(filters: $filters, page: $page, sort: $sort) {
            items {
                id
                title
                summary
                description
                avatar_url
                banner_url
                industry
                owner_id
                project_interests
                project_skills
                stage
                status
                tags
                visibility
                created_at
                updated_at
            }
            page
            pageSize
            total
        }
    }
`;

export type SearchProjectsResult = {
    searchProjects: {
        project: {
            id: string
            title: string
            summary: string | null
            description: string | null
            avatar_url: string | null
            banner_url: string | null
            industry: string | null
            owner_id: string
            project_interests: string[]
            project_skills: string[]
            stage: ProjectStage
            status: ProjectStatus
            tags: string[]
            visibility: ProjectVisibility
            created_at: Date
            updated_at: Date
        }
        reasons: string[]
        score: number
    }[]
}

export const SEARCH_PROJECTS = gql`
    query SearchProjects($q: String!, $k: Int, $embedding: [Float!]) {
        searchProjects(q: $q, k: $k, embedding: $embedding) {
            project {
                id
                title
                summary
                description
                avatar_url
                banner_url
                industry
                owner_id
                project_interests
                project_skills
                stage
                status
                tags
                visibility
                created_at
                updated_at
            }
            reasons
            score
        }
    }
`;