"use client";

import { GET_PROJECT_BY_ID, GetProjectByIdResult } from "@/graphql/projects";
import { useQuery } from "@apollo/client/react";
import MyProjectsShowHeader from "./my-projects-show-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyProjectsShowPositions from "./my-projects-show-positions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import MyProjectsShowMembers from "./my-projects-show-members";

interface MyProjectsShowLayoutProps {
    projectId: string;
}

export default function MyProjectsShowLayout({
    projectId
}: MyProjectsShowLayoutProps) {
    const { data, loading, error } = useQuery<GetProjectByIdResult>(GET_PROJECT_BY_ID, {
        variables: { id: projectId },
        fetchPolicy: "network-only",
    });

    const project = data?.projectById;

    if (loading) {
        return <p>Chargement...</p>
    }

    if (!project) {
        return <p>Ce projet n'existe pas !</p>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-1 xl:col-span-1 space-y-4">
                <MyProjectsShowHeader
                    avatar_url={project.avatar_url}
                    title={project.title}
                    summary={project.summary}
                    industry={project.industry}
                    status={project.status}
                    stage={project.stage}
                    visibility={project.visibility}
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
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <MyProjectsShowMembers projectId={project.id} />
                    <MyProjectsShowPositions projectId={project.id} />
                </div>
            </div>
        </div>
    );
}