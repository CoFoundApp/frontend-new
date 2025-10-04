"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { ProjectCollectionSchema, ProjectGeneralSchema, ProjectSettingsSchema } from "@/schemas/projects";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@stepperize/react";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import MyProjectsGeneralForm from "./my-projects-general-form";
import MyProjectsSettingsForm from "./my-projects-settings-form";
import MyProjectsComplete from "./my-projects-complete";
import MyProjectsCollectionsForm from "./my-projects-collections-form";
import { useMutation } from "@apollo/client/react";
import { CREATE_PROJECT, GET_MY_PROJECTS } from "@/graphql/projects";
import { toast } from "sonner";
import { sideCannons } from "@/lib/utils";

const { useStepper, steps, utils } = defineStepper(
    { id: "general", label: "Général", schema: ProjectGeneralSchema },
    { id: "settings", label: "Paramètres du projet", schema: ProjectSettingsSchema },
    { id: "collections", label: "Mots-clés & compétences", schema: ProjectCollectionSchema },
    { id: "complete", label: "Fin", schema: z.object({}) },
);

export default function MyProjectsCreateForm() {
    const [open, setOpen] = useState(false);
    const stepper = useStepper();

    const [createProject, { loading }] = useMutation(CREATE_PROJECT, {
        refetchQueries: [GET_MY_PROJECTS],
    });

    const form = useForm({
        resolver: zodResolver(stepper.current.schema),
        defaultValues: {
            status: "DRAFT",
            stage: "IDEA",
            visibility: "PRIVATE",
            tags: [],
            project_interests: [],
            project_skills: [],
        },
        mode: "onTouched",
    });

    const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
        if (stepper.isLast) {
            createProject({
                variables: {
                    input: {
                        ...form.getValues(),
                        ...values
                    }
                }
            })
                .then(() => {
                    form.reset();
                    setOpen(false);
                    sideCannons();
                    toast.success("Projet créé !", {
                        description: "Vous avez créé votre projet avec succès.",
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
                    <Plus className="size-4" />
                    Nouveau projet
                </Button>
            </DialogTrigger>
            <DialogContent className="!w-full !max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Ajouter un projet</DialogTitle>
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
                                        "Créer votre projet"
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