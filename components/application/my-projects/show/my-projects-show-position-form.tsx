"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CREATE_PROJECT_POSITION, GET_PROJECT_POSITIONS } from "@/graphql/projects";
import { ProjectPositionSchema } from "@/schemas/projects";
import { useMutation } from "@apollo/client/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

interface MyProjectsShowPositionFormProps {
    projectId: string;
}

export default function MyProjectsShowPositionForm({
    projectId,
}: MyProjectsShowPositionFormProps) {
    const [open, setOpen] = useState(false);
    const [createProjectPosition, { loading }] = useMutation(CREATE_PROJECT_POSITION, {
        refetchQueries: [{ query: GET_PROJECT_POSITIONS, variables: { project_id: projectId } }],
    });

    const form = useForm({
        resolver: zodResolver(ProjectPositionSchema),
        defaultValues: {
            title: "",
            description: "",
            project_id: projectId
        },
        mode: "onTouched",
    });

    const onSubmit = (values: z.infer<typeof ProjectPositionSchema>) => {
        createProjectPosition({
            variables: {
                input: values
            }
        })
            .then(() => {
                setOpen(false);
                toast.success("Poste créé !", {
                    description: "Vous avez créé votre poste avec succès.",
                });
            })
            .catch((err: Error) => {
                console.log(err)
                toast.error("Oups !", {
                    description: err.message || "Une erreur est survenue.",
                });
            })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="flex items-center gap-2">
                    <Plus className="size-4" />
                    Nouveau poste
                </Button>
            </DialogTrigger>
            <DialogContent className="!w-full !max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Ajouter un poste</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="grid gap-6"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titre</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Entrez le titre de votre projet..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea 
                                            placeholder="Entrez la description de votre projet..."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button>
                                {loading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin mr-2" />
                                        Chargement...
                                    </>
                                ) : (
                                    "Créer le poste"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}