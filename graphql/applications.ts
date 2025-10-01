import { gql } from "@apollo/client"

export type GetMyApplicationsResult = {
    myApplications: {
        items: {
            id: string
            applicant_id: string
            position_id: string
            project_id: string
            note: string
            attachment_urls: string[]
            status: string
            created_at: Date
            updated_at: Date
            decided_at?: Date
            decided_by?: string
            position: {
                id: string
                title: string
                description: string
                status: string
            }
            project: {
                id: string
                title: string
                summary?: string
                avatar_url?: string
                industry?: string
            }
        }[]
        nextCursor?: string
    }
}

export type GetMyApplicationsVariables = {
    cursor?: string
    limit?: number
    position_id?: string
    status?: string
}

export const GET_MY_APPLICATIONS = gql`
    query GetMyApplications(
        $cursor: String
        $limit: Float
        $position_id: String
        $status: ApplicationStatus
    ) {
        myApplications(
            cursor: $cursor
            limit: $limit
            position_id: $position_id
            status: $status
        ) {
            items {
                id
                applicant_id
                position_id
                project_id
                note
                attachment_urls
                status
                created_at
                updated_at
                decided_at
                decided_by
                position {
                    id
                    title
                    description
                    status
                }
                project {
                    id
                    title
                    summary
                    avatar_url
                    industry
                }
            }
            nextCursor
        }
    }
`;

export type GetProjectApplicationsResult = {
  projectApplications: {
    items: {
      id: string
      applicant_id: string
      position_id: string
      project_id: string
      note: string
      attachment_urls: string[]
      status: string
      created_at: Date
      updated_at: Date
      decided_at?: Date
      decided_by?: string
      position: {
        id: string
        title: string
        description: string
        status: string
      }
      applicant: {
        id: string
        email: string
        profile: {
          avatar_url?: string
          display_name?: string
          headline?: string
        }
      }
    }[]
    nextCursor?: string
  }
}

export type GetProjectApplicationsVariables = {
  cursor?: string
  limit?: number
  position_id?: string
  project_id: string
  status?: string
}

export const GET_PROJECT_APPLICATIONS = gql`
    query GetProjectApplications(
        $cursor: String
        $limit: Float
        $position_id: String
        $project_id: String!
        $status: ApplicationStatus
    ) {
        projectApplications(
            cursor: $cursor
            limit: $limit
            position_id: $position_id
            project_id: $project_id
            status: $status
        ) {
            items {
                id
                applicant_id
                position_id
                project_id
                note
                attachment_urls
                status
                created_at
                updated_at
                decided_at
                decided_by
                position {
                    id
                    title
                    description
                    status
                }
                applicant {
                    id
                    email
                    profile {
                        avatar_url
                        display_name
                        headline
                    }
                }
            }
            nextCursor
        }
    }
`;
