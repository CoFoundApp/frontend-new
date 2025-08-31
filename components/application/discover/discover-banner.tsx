import { Card, CardContent } from "@/components/ui/card";

export default function DiscoverBanner() {
    return (
        <Card className="bg-primary">
            <CardContent className="space-y-2 text-white">
                <h1 className="text-xl font-bold">Trouvez la perle rare</h1>
                <p>Filtrez, explorez et trouvez le projet ou le co-fondateur qui vous correspond.</p>
            </CardContent>
        </Card>
    );
}