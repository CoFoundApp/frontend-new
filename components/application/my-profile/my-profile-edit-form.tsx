"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { GET_MY_PROFILE, GetMyProfileResult, UPDATE_MY_PROFILE } from "@/graphql/profile";
import { IntroductionExperienceSchema, IntroductionGeneralSchema, IntroductionOtherSchema, IntroductionProSchema } from "@/schemas/introduction";
import { useMutation, useQuery } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@stepperize/react";
import { Edit, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import IntroductionGeneralForm from "../introduction/introduction-general-form";
import IntroductionProForm from "../introduction/introduction-pro-form";
import IntroductionExperienceForm from "../introduction/introduction-experience-form";
import IntroductionOtherForm from "../introduction/introduction-other-form";
import IntroductionComplete from "../introduction/introduction-complete";

const { useStepper, steps, utils } = defineStepper(
    { id: "general", label: "Général", schema: IntroductionGeneralSchema },
    { id: "pro", label: "Détails professionnels", schema: IntroductionProSchema },
    { id: "experience", label: "Parcours", schema: IntroductionExperienceSchema },
    { id: "other", label: "Autre", schema: IntroductionOtherSchema },
    { id: "complete", label: "Fin", schema: z.object({}) },
);

const nullToUndefined = <T,>(obj: T): T => {
    if (obj === null) return undefined as T
    if (Array.isArray(obj)) return obj.map(nullToUndefined) as T
    if (typeof obj === "object" && obj !== null) {
        return Object.fromEntries(Object.entries(obj).map(([keyof, value]) => [keyof, nullToUndefined(value)])) as T
    }
    return obj
}

export default function MyProfileEditForm() {
    const [open, setOpen] = useState(false);
    const stepper = useStepper();

    const { data, loading: loadingProfile, error } = useQuery<GetMyProfileResult>(GET_MY_PROFILE, {
        fetchPolicy: "network-only",
    });

    const [updateMyProfile, { loading }] = useMutation(UPDATE_MY_PROFILE, {
        refetchQueries: [GET_MY_PROFILE]
    });

    const formatDateForInput = (isoDate: string | null | undefined): string => {
        if (!isoDate) return "";
        try {
            return isoDate.split('T')[0];
        } catch {
            return "";
        }
    };

    const form = useForm({
        mode: "onTouched",
        resolver: zodResolver(stepper.current.schema),
        values: data?.myProfile
            ?   nullToUndefined({
                    display_name: data.myProfile.display_name ?? "",
                    visibility: data.myProfile.visibility,
                    availability_hours: Number(data.myProfile.availability_hours) ?? undefined,
                    bio: data.myProfile.bio ?? "",
                    educations: data.myProfile.educations?.map(edu => ({
                        ...edu,
                        start_date: formatDateForInput(edu.start_date),
                        end_date: formatDateForInput(edu.end_date),
                        grade: edu.grade ?? "",
                        description: edu.description ?? "",
                    })) ?? [],
                    headline: data.myProfile.headline ?? "",
                    interests: data.myProfile.interests.map(i => i.name) ?? [],
                    languages: data.myProfile.languages || [],
                    location: data.myProfile.location ?? "",
                    looking_for: data.myProfile.looking_for ?? "",
                    skills: data.myProfile.skills.map(s => s.name) ?? [],
                    tags: data.myProfile.tags ?? [],
                    work_experiences: data.myProfile.workExperiences?.map(work => ({
                        ...work,
                        start_date: formatDateForInput(work.start_date),
                        end_date: formatDateForInput(work.end_date),
                        description: work.description ?? "",
                    })) ?? [],
                })
            : undefined,
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

            const removeTypename = (obj: any): any => {
                if (obj === null || obj === undefined) return obj;
                if (Array.isArray(obj)) return obj.map(removeTypename);
                if (typeof obj === 'object') {
                    const { __typename, ...rest } = obj;
                    return Object.fromEntries(
                        Object.entries(rest).map(([key, value]) => [key, removeTypename(value)])
                    );
                }
                return obj;
            };

            const cleanedEducations = formData.educations?.map((edu) => 
                removeTypename({
                    ...edu,
                    end_date: edu.is_current || !edu.end_date || edu.end_date === "" ? null : edu.end_date,
                    grade: !edu.grade || edu.grade === "" ? null : edu.grade,
                    description: !edu.description || edu.description === "" ? null : edu.description,
                })
            );

            const cleanedWorkExperiences = formData.work_experiences?.map((work) => 
                removeTypename({
                    ...work,
                    end_date: work.is_current || !work.end_date || work.end_date === "" ? null : work.end_date,
                    description: !work.description || work.description === "" ? null : work.description,
                })
            );

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
                    stepper.reset();
                    toast.success("Profil modifié !", {
                        description: "Vous avez modifié votre profil avec succès.",
                    });
                    setOpen(false);
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="flex items-center gap-2">
                    <Edit className="size-4" />
                    Modifier mon profil
                </Button>
            </DialogTrigger>
            <DialogContent className="!w-full !max-w-2xl max-h-[80%] overflow-auto">
                <DialogHeader>
                    <DialogTitle>Modifier mon profil</DialogTitle>
                    <DialogDescription>Étape {currentIndex + 1} sur {steps.length}</DialogDescription>
                </DialogHeader>
                <Form {...form} key={stepper.current.id}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-6"
                    >
                        {stepper.switch({
                            general: () => <IntroductionGeneralForm />,
                            pro: () => <IntroductionProForm />,
                            experience: () => <IntroductionExperienceForm />,
                            other: () => <IntroductionOtherForm />,
                            complete: () => <IntroductionComplete />
                        })}
                        <DialogFooter>
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
                                        "Modifier mon profil"
                                    )}
                                </Button>
                            )}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}