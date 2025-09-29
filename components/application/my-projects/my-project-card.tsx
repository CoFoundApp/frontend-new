"use client";

import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import { projectStageConfig, projectStatusConfig, projectVisibilityConfig } from "@/lib/utils";
import { Building2, Edit, Loader2, MoreVertical, Trash2 } from "lucide-react";
import { Button } from "../../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../ui/dropdown-menu";
import { useMutation } from "@apollo/client/react";
import { DELETE_PROJECT, GET_MY_PROJECTS } from "@/graphql/projects";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface MyProjectCardProps {
    project: Partial<IProject>;
}

export default function MyProjectCard({ project }: MyProjectCardProps) {
    const router = useRouter();

    const [deleteProject, { loading }] = useMutation(DELETE_PROJECT, {
        refetchQueries: [GET_MY_PROJECTS],
    });

    const handleDelete = () => {
        deleteProject({
            variables: {
                id: project.id
            }
        })
            .then(() => {
                toast.success("Projet supprimé !", {
                    description: "Vous avez supprimé votre projet avec succès.",
                });
            })
            .catch((err: Error) => {
                console.log(err)
                toast.error("Oups !", {
                    description: err.message || "Une erreur est survenue.",
                });
            })
    }

    return (
        <Card 
            className="h-fit"
            onClick={() => router.push(`/my-projects/${project.id}`)}
        >
            <CardHeader className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <CardTitle>{project.title}</CardTitle>
                    {project.visibility && (
                        <>
                            {(() => {
                                const { icon: Icon } = projectVisibilityConfig[project.visibility];
                                return (
                                    <>
                                        <Icon className="size-4" />
                                    </>
                                );
                            })()}
                        </>
                    )}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                        >
                            <MoreVertical className="size-4" />
                            <span className="sr-only">Actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem className="cursor-pointer">
                            <Edit className="mr-2 size-4" />
                            Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                            className="cursor-pointer text-destructive"
                            onClick={handleDelete}
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin mr-2" />
                                    Chargement...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="mr-2 size-4 text-destructive" />
                                    Supprimer
                                </>
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className="space-y-6">
                {project.summary && (
                    <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{project.summary}</p>
                )}
                <div className="flex items-center gap-2">
                    {project.industry && (
                        <Badge variant="outline">
                            <Building2 className="size-3 mr-2" />
                            {project.industry}
                        </Badge>
                    )}
                    <Badge variant="secondary">{projectStatusConfig[project.status!].label}</Badge>
                    <Badge variant="secondary">{projectStageConfig[project.stage!].label}</Badge>
                </div>
            </CardContent>
        </Card>
    );
}