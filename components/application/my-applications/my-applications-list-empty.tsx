import { Card, CardContent } from "@/components/ui/card";
import { UserCheck } from "lucide-react"

export default function MyApplicationsListEmpty() {
    return (
        <Card className="border-dashed border-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="p-4 bg-muted/50 rounded-full mb-4">
                    <UserCheck className="size-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-2">Aucune candidature</h3>
                <p className="text-muted-foreground text-center max-w-lg">
                    Vous n'avez pas encore postulé à des projets. Explorez les projets disponibles et postulez aux positions qui
                    vous intéressent.
                </p>
            </CardContent>
        </Card>
    );
}
