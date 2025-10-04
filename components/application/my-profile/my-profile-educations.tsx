import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

interface MyProfileEducationsProps {
    educations: IEducation[] | null;
}

export default function MyProfileEducations({
    educations
}: MyProfileEducationsProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <GraduationCap className="size-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">
                    Formations
                    {educations && educations.length > 0 && (
                        <span className="ml-2 text-sm text-muted-foreground">({educations.length})</span>
                    )}
                </h2>
            </div>
            {!educations || educations.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="p-4 bg-muted/50 rounded-full mb-4">
                            <GraduationCap className="size-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Aucune formation</h3>
                        <p className="text-muted-foreground text-center max-w-md">Ajoutez vos diplômes et formations pour enrichir votre profil</p>
                    </CardContent>
                </Card>
            ) : (
                <p></p>
            )}
        </div>
    );
}