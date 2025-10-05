import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Briefcase, Calendar, MapPin } from "lucide-react";

interface MyProfileWorkExperiencesProps {
    experiences: IWorkExperience[] | null;
}

export default function MyProfileWorkExperiences({
    experiences
}: MyProfileWorkExperiencesProps) {
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "MMM yyyy", { locale: fr })
    }

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
                <div className="grid lg:grid-cols-2 gap-4">
                    {experiences.map((experience, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-semibold text-lg">{experience.title}</h3>
                                            {experience.is_current && (
                                                <Badge variant="secondary" className="text-xs">
                                                    En cours
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground">{experience.company}</p>
                                        {experience.location && (
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <MapPin className="size-4" />
                                                <span>{experience.location}</span>
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="size-4" />
                                            <span>
                                                {formatDate(experience.start_date)} -{" "}
                                                {experience.is_current
                                                    ? "Présent"
                                                    : experience.end_date
                                                        ? formatDate(experience.end_date)
                                                        : "N/A"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {experience.description && (
                                    <CardContent className="pt-4 px-0">
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{experience.description}</p>
                                    </CardContent>
                                )}
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}