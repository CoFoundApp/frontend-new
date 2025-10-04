import { Card, CardContent } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

interface ProfileWorkExperiencesProps {
    experiences: IWorkExperience[] | null;
}

export default function ProfileWorkExperiences({
    experiences
}: ProfileWorkExperiencesProps) {
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
                    </CardContent>
                </Card>
            ) : (
                <p></p>
            )}
        </div>
    );
}