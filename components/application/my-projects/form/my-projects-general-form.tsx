import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ProjectGeneralSchema } from "@/schemas/projects";
import { useFormContext } from "react-hook-form";
import z from "zod";

export default function MyProjectsGeneralForm() {
    const { control } = useFormContext<z.infer<typeof ProjectGeneralSchema>>();

    return (
        <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Informations de base</h3>
            <FormField
                control={control}
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
                control={control}
                name="summary"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Résumé</FormLabel>
                        <FormControl>
                            <Textarea 
                                placeholder="Entrez le résumé de votre projet..."
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
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
            <FormField
                control={control}
                name="industry"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Secteur d'activité</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Entrez le secteur d'activité de votre projet..."
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}