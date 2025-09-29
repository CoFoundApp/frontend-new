import { CLOSE_PROJECT_POSITION, GET_PROJECT_POSITIONS, GetProjectPositionsResult } from "@/graphql/projects";
import { useMutation, useQuery } from "@apollo/client/react";
import { Briefcase, Trash2, UserPlus } from "lucide-react";
import MyProjectsShowPositionForm from "./my-projects-show-position-form";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface MyProjectsShowPositionsProps {
    projectId: string;
}

export default function MyProjectsShowPositions({
    projectId,
}: MyProjectsShowPositionsProps) {
    const { data, loading, error } = useQuery<GetProjectPositionsResult>(GET_PROJECT_POSITIONS, {
        variables: { project_id: projectId },
        fetchPolicy: "cache-first",
    });

    const [deleteProjectPosition] = useMutation(CLOSE_PROJECT_POSITION, {
        refetchQueries: [{ query: GET_PROJECT_POSITIONS, variables: { project_id: projectId } }],
    });

    const handleDelete = (positionId: string) => {
        deleteProjectPosition({
            variables: {
                id: positionId
            }
        })
            .then(() => {
                toast.success("Poste supprimé !", {
                    description: "Le poste a été supprimé avec succès.",
                });
            })
            .catch((err: Error) => {
                console.log(err);
                toast.error("Oups !", {
                    description: err.message || "Une erreur est survenue lors de la suppression.",
                });
            });
    }

    const positions = data?.listProjectPositions?.filter((position) => position.status === "OPEN");

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-10 w-32" />
                </div>
                <Skeleton className="w-full h-48" />
            </div>
        )
    }

    if (error) {
        return (
            <Card className="border-destructive/50">
                <CardContent className="p-6">
                    <div className="text-center py-8">
                        <p className="text-destructive">{error.message ?? String(error)}</p>
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Briefcase className="size-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">
                        Postes ouverts
                        {positions && positions.length > 0 && (
                            <span className="ml-2 text-sm text-muted-foreground">({positions.length})</span>
                        )}
                    </h2>
                </div>
                <MyProjectsShowPositionForm projectId={projectId} />
            </div>

            {!positions || positions.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="p-4 bg-muted/50 rounded-full mb-4">
                            <UserPlus className="size-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Aucun poste ouvert</h3>
                        <p className="text-muted-foreground text-center max-w-md mb-4">
                            Créez votre première offre de poste pour attirer des cofondateurs et collaborateurs talentueux.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {positions.map((position) => (
                        <Card key={position.id}>
                            <CardHeader className="flex justify-between items-center gap-4">
                                <div>
                                    <CardTitle className="text-lg">{position.title}</CardTitle>
                                    {position.description && (
                                        <CardDescription className="text-sm leading-relaxed">{position.description}</CardDescription>
                                    )}
                                </div>
                                <Trash2 className="size-4 text-destructive" onClick={() => handleDelete(position.id)} />
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}