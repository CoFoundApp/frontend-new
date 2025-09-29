"use client";

import { GET_PROJECT_BY_ID, GetProjectByIdResult } from "@/graphql/projects";
import { useQuery } from "@apollo/client/react";
import MyProjectsShowHeader from "./my-projects-show-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyProjectsShowPositions from "./my-projects-show-positions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MyProjectsShowLayoutProps {
    projectId: string;
}

export default function MyProjectsShowLayout({
    projectId
}: MyProjectsShowLayoutProps) {
    const { data, loading, error } = useQuery<GetProjectByIdResult>(GET_PROJECT_BY_ID, {
        variables: { id: projectId },
        fetchPolicy: "cache-first",
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
            <div className="lg:col-span-1 xl:col-span-1 space-y-6">
                <MyProjectsShowHeader
                    avatar_url={project.avatar_url}
                    title={project.title}
                    description={project.description}
                    summary={project.summary}
                    industry={project.industry}
                    status={project.status}
                    stage={project.stage}
                    visibility={project.visibility}
                />

                {project.tags && project.tags.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Tags</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {project.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>

            <div className="lg:col-span-2 xl:col-span-3">
                <Tabs defaultValue="positions" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6">
                        <TabsTrigger value="members" className="text-sm">
                            Membres
                        </TabsTrigger>
                        <TabsTrigger value="positions" className="text-sm">
                            Postes
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="members" className="mt-0">
                        <Card>
                            <CardContent className="p-6">
                                <div className="text-center py-8">
                                    <p className="text-muted-foreground">Section membres à venir...</p>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="positions" className="mt-0">
                        <MyProjectsShowPositions projectId={project.id} />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}