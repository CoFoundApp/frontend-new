import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { IntroductionOtherSchema, LanguageCode } from "@/schemas/introduction";
import { useFormContext } from "react-hook-form";
import z from "zod";
import { MultiSelect } from "@/components/ui/multi-select";
import { TagInput } from "@/components/ui/tag-input";

const LANGUAGE_OPTIONS = [
    { label: "Allemand", value: "DE" },
    { label: "Anglais", value: "EN" },
    { label: "Espagnol", value: "ES" },
    { label: "Français", value: "FR" },
    { label: "Italien", value: "IT" },
] as const;

export default function IntroductionOtherForm() {
    const { control } = useFormContext<z.infer<typeof IntroductionOtherSchema>>();

    return (
        <div className="grid gap-6">
            <FormField
                control={control}
                name="languages"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Langues</FormLabel>
                        <FormControl>
                            <MultiSelect
                                options={LANGUAGE_OPTIONS as any}
                                selected={field.value ?? []}
                                onSelectionChange={(sel) => {
                                    const valid = (sel ?? []).filter((v): v is z.infer<typeof LanguageCode> =>
                                        LanguageCode.options.includes(v as any)
                                    );
                                    field.onChange(valid);
                                }}
                                placeholder="Sélectionnez vos langues..."
                                className="w-full"
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