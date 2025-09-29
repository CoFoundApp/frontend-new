"use client";

import { GET_PROJECT_BY_ID, GetProjectByIdResult } from "@/graphql/projects";
import { useQuery } from "@apollo/client/react";
import MyProjectsShowHeader from "./my-projects-show-header";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import MyProjectsShowPositions from "./my-projects-show-positions";

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
        <div className="grid gap-6 md:p-4 lg:p-6">
            <MyProjectsShowHeader 
                avatar_url={project.avatar_url} 
                title={project.title} 
                summary={project.summary}
                industry={project.industry}
                status={project.status}
                stage={project.stage}
                visibility={project.visibility}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 mt-4 gap-6">
                <div className="grid gap-6 h-fit">
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-lg">Description</h3>
                        <p>{project.description}</p>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="font-semibold text-lg">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag) => (
                                <Badge key={tag} variant="secondary">{tag}</Badge>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="md:col-span-2">
                    <Tabs defaultValue="members">
                        <TabsList>
                            <TabsTrigger value="members">Membres</TabsTrigger>
                            <TabsTrigger value="positions">Postes</TabsTrigger>
                        </TabsList>
                        <TabsContent value="positions">
                            <MyProjectsShowPositions projectId={project.id} />
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}