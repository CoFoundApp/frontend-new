type ProjectStatus = "ACTIVE" | "DRAFT" | "ARCHIVED" | "PAUSED" | "SEEKING";
type ProjectStage = "IDEA" | "MVP" | "SCALE" | "TRACTION";
type ProjectVisibility = "PRIVATE" | "PUBLIC" | "UNLISTED";

interface IProject {
    id: string;
    title: string;
    summary?: string;
    description?: string;
    industry: string;
    status: ProjectStatus;
    stage: ProjectStage;
    visibility: ProjectVisibility;
    tags: string[];
    project_interests: string[];
    project_skills: string[];
    attachment_urls: string[];
    avatar_url: string;
    banner_url: string;
    owner_id: string;
    created_at: Date;
    updated_at: Date;
}

type PositionStatus = "CLOSED" | "OPEN";
type ProfileVisibility = "PRIVATE" | "PUBLIC" | "UNLISTED";
type MemberRole = "MAINTAINER" | "MEMBER" | "MENTOR" | "OWNER";

type ApplicationStatus = "ACCEPTED" | "CANCELED" | "PENDING" | "REJECTED" | "WITHDRAWN"

interface IProjectApplication {
    id: string
    applicant_id: string
    position_id: string
    project_id: string
    note: string
    attachment_urls: string[]
    status: ApplicationStatus
    created_at: Date
    updated_at: Date
    decided_at?: Date
    decided_by?: string
    position?: {
        id: string
        title: string
        description: string
        status: PositionStatus
    }
    project?: {
        id: string
        title: string
        summary?: string
        avatar_url?: string
        industry?: string
    }
}