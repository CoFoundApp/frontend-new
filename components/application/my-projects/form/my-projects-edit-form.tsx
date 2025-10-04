"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ProjectCollectionSchema, ProjectGeneralSchema, ProjectSettingsSchema } from "@/schemas/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@stepperize/react";
import { Edit, Loader2 } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import MyProjectsGeneralForm from "./my-projects-general-form";
import MyProjectsSettingsForm from "./my-projects-settings-form";
import MyProjectsComplete from "./my-projects-complete";
import MyProjectsCollectionsForm from "./my-projects-collections-form";
import { useMutation, useQuery } from "@apollo/client/react";
import { GET_MY_PROJECTS, GET_PROJECT_BY_ID, GetProjectByIdResult, UPDATE_PROJECT } from "@/graphql/projects";
import { toast } from "sonner";

const { useStepper, steps, utils } = defineStepper(
    { id: "general", label: "Général", schema: ProjectGeneralSchema },
    { id: "settings", label: "Paramètres du projet", schema: ProjectSettingsSchema },
    { id: "collections", label: "Mots-clés & compétences", schema: ProjectCollectionSchema },
    { id: "complete", label: "Fin", schema: z.object({}) },
);

interface MyProjectsEditFormProps {
    projectId: string;
}

export default function MyProjectsEditForm({ projectId }: MyProjectsEditFormProps) {
    const [open, setOpen] = useState(false);
    const stepper = useStepper();

    const { data, loading: loadingProject } = useQuery<GetProjectByIdResult>(GET_PROJECT_BY_ID, {
        variables: { id: projectId },
    })

    const [updateProject, { loading }] = useMutation(UPDATE_PROJECT, {
        refetchQueries: [GET_MY_PROJECTS, { query: GET_PROJECT_BY_ID, variables: { id: projectId } }],
    })

    const form = useForm({
        resolver: zodResolver(stepper.current.schema),
        values: data?.projectById
            ?   {
                    title: data.projectById.title,
                    summary: data.projectById.summary ?? "",
                    description: data.projectById.description ?? "",
                    industry: data.projectById.industry ?? "",
                    status: data.projectById.status,
                    stage: data.projectById.stage,
                    visibility: data.projectById.visibility,
                    tags: data.projectById.tags,
                    project_interests: data.projectById.project_interests ?? [],
                    project_skills: data.projectById.project_skills ?? [],
                }
            : undefined,
        mode: "onTouched",
    });

    const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
        if (stepper.isLast) {
            updateProject({
                variables: {
                    id: projectId,
                    input: {
                        ...form.getValues(),
                        ...values
                    }
                }
            })
                .then(() => {
                    stepper.reset();
                    setOpen(false);
                    toast.success("Projet modifié !", {
                        description: "Vous avez modifié votre projet avec succès.",
                    });
                })
                .catch((err: Error) => {
                    console.log(err)
                    toast.error("Oups !", {
                        description: err.message || "Une erreur est survenue.",
                    });
                })
        } else {
            stepper.next();
        }
    }

    const currentIndex = utils.getIndex(stepper.current.id);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="secondary" className="flex items-center gap-2">
                    <Edit className="size-4" />
                    Modifier mon projet
                </Button>
            </DialogTrigger>
            <DialogContent className="!w-full !max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Modifier le projet</DialogTitle>
                    <DialogDescription>Étape {currentIndex + 1} sur {steps.length}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form 
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-6"
                    >
                        {stepper.switch({
                            general: () => <MyProjectsGeneralForm />,
                            settings: () => <MyProjectsSettingsForm />,
                            collections: () => <MyProjectsCollectionsForm />,
                            complete: () => <MyProjectsComplete />
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
                                        "Modifier votre projet"
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