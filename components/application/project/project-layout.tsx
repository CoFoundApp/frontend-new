"use client"

import { GET_PROJECT_BY_ID, GET_PROJECT_MEMBERS, GetProjectMembersResult, type GetProjectByIdResult } from "@/graphql/projects"
import { useQuery } from "@apollo/client/react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProjectHeader from "./project-header"
import ProjectShowMembers from "./project-show-members"
import ProjectShowPositions from "./project-show-positions"

interface ProjectLayoutProps {
    projectId: string
}

export default function ProjectLayout({ projectId }: ProjectLayoutProps) {
    const { data, loading, error } = useQuery<GetProjectByIdResult>(GET_PROJECT_BY_ID, {
        variables: { id: projectId },
        fetchPolicy: "network-only",
    });

    const { data: membersData, loading: membersLoading } = useQuery<GetProjectMembersResult>(GET_PROJECT_MEMBERS, {
        variables: { project_id: projectId },
        fetchPolicy: "network-only",
    });

    const project = data?.projectById;
    const members = membersData?.projectMembers;

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!project || error) {
        return <p>Ce projet n'existe pas !</p>;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-1 xl:col-span-1 space-y-6">
                <ProjectHeader
                    avatar_url={project.avatar_url}
                    title={project.title}
                    summary={project.summary}
                    industry={project.industry}
                    status={project.status}
                    stage={project.stage}
                    owner_id={project.owner_id}
                />

                {project.tags && project.tags.length > 0 && (
                    <Card>
                        <CardHeader className="gap-4">
                            <CardTitle>Tags</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>
                    </Card>
                )}

                {project.project_skills && project.project_skills.length > 0 && (
                    <Card>
                        <CardHeader className="gap-4">
                            <CardTitle>Compétences recherchées</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                {project.project_skills.map((skill) => (
                                    <Badge key={skill} variant="outline" className="text-xs">
                                        {skill}
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>
                    </Card>
                )}

                {project.project_interests && project.project_interests.length > 0 && (
                    <Card>
                        <CardHeader className="gap-4">
                            <CardTitle>Centres d'intérêt</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                {project.project_interests.map((interest) => (
                                    <Badge key={interest} variant="outline" className="text-xs">
                                        {interest}
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>
                    </Card>
                )}
            </div>

            <div className="lg:col-span-2 xl:col-span-3 space-y-6">
                {project.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm leading-relaxed text-pretty">{project.description}</p>
                        </CardContent>
                    </Card>
                )}
                <ProjectShowMembers members={members} loading={membersLoading} />
                <ProjectShowPositions projectId={project.id} ownerId={project.owner_id} />
            </div>
        </div>
    );
}
