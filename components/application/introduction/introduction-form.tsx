"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { IntroductionExperienceSchema, IntroductionGeneralSchema, IntroductionOtherSchema, IntroductionProSchema } from "@/schemas/introduction";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@stepperize/react";
import { useForm } from "react-hook-form";
import z from "zod";
import IntroductionGeneralForm from "./introduction-general-form";
import IntroductionComplete from "./introduction-complete";
import IntroductionProForm from "./introduction-pro-form";
import IntroductionOtherForm from "./introduction-other-form";
import { Loader2 } from "lucide-react";
import { useMutation } from "@apollo/client/react";
import { UPDATE_MY_PROFILE } from "@/graphql/profile";
import { sideCannons } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import IntroductionExperienceForm from "./introduction-experience-form";

const { useStepper, steps, utils } = defineStepper(
    { id: "general", label: "Général", schema: IntroductionGeneralSchema },
    { id: "pro", label: "Détails professionnels", schema: IntroductionProSchema },
    { id: "experience", label: "Parcours", schema: IntroductionExperienceSchema },
    { id: "other", label: "Autre", schema: IntroductionOtherSchema },
    { id: "complete", label: "Fin", schema: z.object({}) },
);

export default function IntroductionForm() {
    const router = useRouter();
    const stepper = useStepper();

    const [updateMyProfile, { loading }] = useMutation(UPDATE_MY_PROFILE);

    const form = useForm({
        mode: "onTouched",
        resolver: zodResolver(stepper.current.schema),
        defaultValues: {
            visibility: "PUBLIC",
            languages: [],
            tags: [],
            skills: [],
            interests: [],
            educations: [],
            work_experiences: [],
        }
    });

    const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
        if (stepper.isLast) {
            const formData = form.getValues() as {
                display_name: string;
                visibility: string;
                availability_hours?: number;
                bio?: string;
                educations?: any[];
                headline?: string;
                interests?: string[];
                languages?: string[];
                location?: string;
                looking_for?: string;
                skills?: string[];
                tags?: string[];
                work_experiences?: any[];
            }

            const cleanedEducations = formData.educations?.map((edu) => ({
                ...edu,
                end_date: edu.is_current || !edu.end_date ? null : edu.end_date,
                grade: edu.grade || null,
                description: edu.description || null,
            }))

            const cleanedWorkExperiences = formData.work_experiences?.map((work) => ({
                ...work,
                end_date: work.is_current || !work.end_date ? null : work.end_date,
                description: work.description || null,
            }))

            updateMyProfile({
                variables: {
                    input: {
                        ...formData,
                        ...values,
                        educations: cleanedEducations,
                        work_experiences: cleanedWorkExperiences,
                    }
                }
            })
                .then(() => {
                    sideCannons();
                    toast.success("Profil créé !", {
                        description: "Vous avez créé votre profil avec succès.",
                    });
                    router.push("/discover");
                })
                .catch((err: Error) => {
                    console.log(err)
                    toast.error("Oups !", {
                        description: err.message || "Une erreur est survenue.",
                    });
                })
        } else {
            stepper.next()
        }
    }

    const currentIndex = utils.getIndex(stepper.current.id);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex justify-center"
            >
                <Card className="!w-full !max-w-2xl">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Personnalisez votre profil</CardTitle>
                            <span className="text-sm text-muted-foreground">
                                Etape {currentIndex + 1} sur {steps.length}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <div className="grid gap-6">
                            {stepper.switch({
                                general: () => <IntroductionGeneralForm />,
                                pro: () => <IntroductionProForm />,
                                experience: () => <IntroductionExperienceForm />,
                                other: () => <IntroductionOtherForm />,
                                complete: () => <IntroductionComplete />
                            })}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                        {!stepper.isLast ? (
                            <>
                                <Button variant="secondary" onClick={stepper.prev} disabled={stepper.isFirst}>
                                    Précédent
                                </Button>
                                <Button type="submit">{stepper.isLast ? 'Terminer' : 'Suivant'}</Button>
                            </>
                        ) : (
                            <Button>
                                {loading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin mr-2" />
                                        Chargement...
                                    </>
                                ) : (
                                    "Créer votre profil"
                                )}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}