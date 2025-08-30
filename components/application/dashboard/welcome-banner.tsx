"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useCurrentUser } from "@/stores/current-user";
import { useEffect, useState } from "react";

export default function WelcomeBanner() {
    const { user } = useCurrentUser();

    const descriptions = [
        "La Force est grande en toi. Prêt à construire ton Empire ?",
        "La peur tue l'esprit. N'ayez pas peur de lancer votre idée.",
        "Je jure solennellement que mes intentions sont mauvaises... enfin innovantes.",
        "Même la plus petite personne peut changer le cours de l'avenir. À vous de jouer.",
        "Ceci est la journée que vous retiendrez comme le jour où vous avez lancé votre projet.",
        "La fortune et la gloire. C'est ce qui attend les audacieux.",
        "Équipe, rassemblement ! Il est temps de trouver vos co-fondateurs.",
        "Certains veulent juste voir le monde brûler. D'autres veulent le construire. Bienvenue.",
        "Avec de grandes idées viennent de grandes responsabilités. On dirait que vous êtes prêt.",
        "La première règle de CoFound est : il faut parler de CoFound. Trouvez vos membres.",
        "La vie, c'est comme une boîte de chocolats... On ne sait jamais sur quel co-fondateur on va tomber.",
        "Cool, cool, cool, cool. Pas de doute, pas de doute. Un nouveau projet en vue.",
        "Un nouveau challenger apparaît ! Prêt à devenir le meilleur entrepreneur ?",
        "J'étais un aventurier, et puis j'ai décidé de monter un projet.",
        "Rien n'est vrai, tout est permis. Surtout l'innovation.",
    ];

    const [description, setDescription] = useState<string>("");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * descriptions.length);
        setDescription(descriptions[randomIndex]);
    }, [user]);

    return (
        <Card className="bg-primary">
            <CardContent className="space-y-2 text-white">
                <h1 className="text-xl font-bold">Bonjour, <i>{user?.myProfile.display_name}</i> !</h1>
                <p>{description}</p>
            </CardContent>
        </Card>
    );
}