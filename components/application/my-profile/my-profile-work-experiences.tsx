import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

interface MyProfileWorkExperiencesProps {
    experiences: IWorkExperience[] | null;
}

export default function MyProfileWorkExperiences({
    experiences
}: MyProfileWorkExperiencesProps) {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-2">
                <Briefcase className="size-5 text-muted-foreground" />
                <h2 className="text-lg font-semibold">
                    Expériences professionnelles
                    {experiences && experiences.length > 0 && (
                        <span className="ml-2 text-sm text-muted-foreground">({experiences.length})</span>
                    )}
                </h2>
            </div>
            {!experiences || experiences.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="p-4 bg-muted/50 rounded-full mb-4">
                            <Briefcase className="size-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Aucune expérience</h3>
                        <p className="text-muted-foreground text-center max-w-md">Ajoutez vos expériences de travail pour enrichir votre profil</p>
                    </CardContent>
                </Card>
            ) : (
                <p></p>
            )}
        </div>
    );
}