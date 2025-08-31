import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import Link from "next/link";

export default function MyProjectsListEmpty() {
    return (
        <div className="text-center py-10 px-6 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30">
            <div className="flex flex-col items-center space-y-4">
                <div className="p-4 bg-primary/10 rounded-full">
                    <Lightbulb className="size-8 text-primary" />
                </div>

                <div className="space-y-2">
                    <h2 className="text-lg md:text-xl font-bold text-foreground">
                        Votre prochaine grande idée commence ici.
                    </h2>
                    <p className="text-muted-foreground">
                        Lancez un projet pour trouver des co-fondateurs ou rejoignez une équipe existante.
                    </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                    <Button>
                        Lancer mon premier projet
                    </Button>
                    <Button variant="ghost" asChild>
                        <Link href="/discover">
                            Découvrir des projets
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}