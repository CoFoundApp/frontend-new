import { Card, CardContent } from "@/components/ui/card";

export default function MyProjectsBanner() {
    return (
        <Card className="bg-primary">
            <CardContent className="space-y-2 text-white">
                <h1 className="text-xl font-bold">De l'Idée à la Réalité</h1>
                <p>C'est ici que vous pilotez vos projets, suivez leur progression et construisez l'avenir.</p>
            </CardContent>
        </Card>
    );
}