import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar, GraduationCap } from "lucide-react";

interface MyProfileEducationsProps {
    educations: IEducation[] | null;
}

export default function MyProfileEducations({
    educations
}: MyProfileEducationsProps) {
    const formatDate = (dateString: string) => {
        return format(new Date(dateString), "MMM yyyy", { locale: fr })
    }

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
                <div className="grid lg:grid-cols-2 gap-4">
                    {educations.map((education, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between gap-2">
                                            <h3 className="font-semibold text-lg">{education.degree}</h3>
                                            {education.is_current && (
                                                <Badge variant="secondary" className="text-xs">
                                                    En cours
                                                </Badge>
                                            )}
                                        </div>
                                        <p className="text-muted-foreground">{education.school}</p>
                                        <p className="text-sm text-muted-foreground">{education.field_of_study}</p>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Calendar className="size-4" />
                                            <span>
                                                {formatDate(education.start_date)} -{" "}
                                                {education.is_current ? "Présent" : education.end_date ? formatDate(education.end_date) : "N/A"}
                                            </span>
                                        </div>
                                        {education.grade && (
                                            <p className="text-sm">
                                                <span className="font-medium">Note : </span>
                                                {education.grade}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                {education.description && (
                                    <CardContent className="pt-4 px-0">
                                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{education.description}</p>
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