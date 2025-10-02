import { Card, CardContent } from "@/components/ui/card";

export default function MyApplicationsBanner() {
    return (
        <Card className="bg-primary">
            <CardContent className="space-y-2 text-white">
                <h1 className="text-xl font-bold">Vos candidatures</h1>
                <p>Suivez vos candidatures, vérifiez leur statut et gardez un œil sur vos opportunités.</p>
            </CardContent>
        </Card>
    );
}