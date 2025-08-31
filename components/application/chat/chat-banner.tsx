import { Card, CardContent } from "@/components/ui/card";

export default function ChatBanner() {
    return (
        <Card className="bg-primary">
            <CardContent className="space-y-2 text-white">
                <h1 className="text-xl font-bold">Ici naissent les grandes équipes</h1>
                <p>La communication est la clé. Négociez les rôles, partagez vos idées et construisez ensemble.</p>
            </CardContent>
        </Card>
    );
}