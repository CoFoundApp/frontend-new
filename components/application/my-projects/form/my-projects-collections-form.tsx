import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { TagInput } from "@/components/ui/tag-input";
import { ProjectCollectionSchema } from "@/schemas/projects";
import { useFormContext } from "react-hook-form";
import z from "zod";

export default function MyProjectsCollectionsForm() {
    const { control } = useFormContext<z.infer<typeof ProjectCollectionSchema>>();

    return (
        <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Mots-clés & compétences</h3>
            <FormField
                control={control}
                name="project_skills"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Compétences</FormLabel>
                        <FormControl>
                            <TagInput
                                tags={field.value ?? []}
                                onTagsChange={(next) => field.onChange(next)}
                                placeholder="Tapez et Entrée pour ajouter une compétence..."
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="project_interests"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Intêrets</FormLabel>
                        <FormControl>
                            <TagInput
                                tags={field.value ?? []}
                                onTagsChange={(next) => field.onChange(next)}
                                placeholder="Tapez et Entrée pour ajouter un intérêt..."
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="tags"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Tags</FormLabel>
                        <FormControl>
                            <TagInput
                                tags={field.value ?? []}
                                onTagsChange={(next) => field.onChange(next)}
                                placeholder="Tapez et Entrée pour ajouter un tag..."
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}