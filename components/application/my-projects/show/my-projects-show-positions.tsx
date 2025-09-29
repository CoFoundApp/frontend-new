import { Button } from "@/components/ui/button";
import { GET_PROJECT_POSITIONS, GetProjectPositionsResult } from "@/graphql/projects";
import { useQuery } from "@apollo/client/react";
import { UserPlus } from "lucide-react";
import MyProjectsShowPositionForm from "./my-projects-show-position-form";

interface MyProjectsShowPositionsProps {
    projectId: string;
}

export default function MyProjectsShowPositions({
    projectId,
}: MyProjectsShowPositionsProps) {
    const { data, loading, error } = useQuery<GetProjectPositionsResult>(GET_PROJECT_POSITIONS, {
        variables: { projectId },
        fetchPolicy: "cache-first",
    });

    const positions = data?.listProjectPositions;

    if (loading) {
        return <p>Chargement...</p>;
    }

    if (!positions || positions.length === 0) {
        return (
            <div className="text-center py-10 px-6 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30">
                <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-secondary/10 rounded-full">
                        <UserPlus className="size-8 text-secondary" />
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-lg md:text-xl font-bold text-foreground">
                            Aucun poste ouvert sur ce projet pour le moment.
                        </h2>
                        <p className="text-muted-foreground">
                            Créez votre première offre de poste pour attirer des cofondateurs et collaborateurs.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                        <MyProjectsShowPositionForm projectId={projectId} />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <p>Liste des postes</p>
    )
}