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
}