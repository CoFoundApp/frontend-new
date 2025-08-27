import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Tag, TagInput } from 'emblor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IntroductionOtherSchema } from "@/schemas/introduction";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import z from "zod";

export default function IntroductionOtherForm() {
    const { control, setValue } = useFormContext<z.infer<typeof IntroductionOtherSchema>>();

    const [tags, setTags] = useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

    return (
        <div className="grid gap-6">
            <FormField
                control={control}
                name="languages"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Langues</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Langues" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="DE">
                                    Allemand
                                </SelectItem>
                                <SelectItem value="EN">
                                    Anglais
                                </SelectItem>
                                <SelectItem value="ES">
                                    Espagnol
                                </SelectItem>
                                <SelectItem value="FR">
                                    Français
                                </SelectItem>
                                <SelectItem value="IT">
                                    Italien
                                </SelectItem>
                            </SelectContent>
                        </Select>
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
                                {...field}
                                placeholder="Entrez vos tags"
                                tags={tags}
                                setTags={(newTags) => {
                                    setTags(newTags);
                                    setValue("tags", newTags as [Tag, ...Tag[]]);
                                }}
                                activeTagIndex={activeTagIndex}
                                setActiveTagIndex={setActiveTagIndex}
                            />
                        </FormControl>
                    </FormItem>
                )}
            />
        </div>
    );
}