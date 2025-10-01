import { GET_PROJECT_POSITIONS, type GetProjectPositionsResult } from "@/graphql/projects"
import { useQuery } from "@apollo/client/react"
import { Briefcase, UserPlus } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useCurrentUser } from "@/stores/current-user"
import ProjectApplyDialog from "./project-apply-dialog"

interface ProjectShowPositionsProps {
    projectId: string;
    ownerId: string;
}

export default function ProjectShowPositions({ projectId, ownerId }: ProjectShowPositionsProps) {
    const { user } = useCurrentUser();
    const isOwner = user?.myProfile.user_id === ownerId;

    const { data, loading, error } = useQuery<GetProjectPositionsResult>(GET_PROJECT_POSITIONS, {
        variables: { project_id: projectId },
        fetchPolicy: "network-only",
    })

    const positions = data?.listProjectPositions?.filter((position) => position.status === "OPEN")

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                <   Skeleton className="h-6 w-32" />
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
            </div>

            {!positions || positions.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="p-4 bg-muted/50 rounded-full mb-4">
                            <UserPlus className="size-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Aucun poste ouvert</h3>
                        <p className="text-muted-foreground text-center max-w-md">Ce projet n'a pas encore de postes ouverts.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-2 gap-4">
                    {positions.map((position) => (
                        <Card key={position.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{position.title}</CardTitle>
                                {position.description && (
                                    <CardDescription className="text-sm leading-relaxed">{position.description}</CardDescription>
                                )}
                            </CardHeader>
                            {!isOwner && (
                                <CardFooter>
                                    <ProjectApplyDialog
                                        positionId={position.id}
                                        positionTitle={position.title}
                                        projectId={projectId}
                                    />
                                </CardFooter>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
