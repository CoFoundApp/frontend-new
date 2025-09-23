import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ProjectCollectionSchema } from "@/schemas/projects";
import { Tag, TagInput } from "emblor";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import z from "zod";

export default function MyProjectsCollectionsForm() {
    const { control, setValue } = useFormContext<z.infer<typeof ProjectCollectionSchema>>();

    const [tags, setTags] = useState<Tag[]>([]);
    const [activeTagIndex, setActiveTagIndex] = useState<number | null>(null);

    const [interests, setInterests] = useState<Tag[]>([]);
    const [activeInterestIndex, setActiveInterestIndex] = useState<number | null>(null);

    const [skills, setSkills] = useState<Tag[]>([]);
    const [activeSkillIndex, setActiveSkillIndex] = useState<number | null>(null);

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
                                {...field}
                                placeholder="Entrez les compétences de votre projet..."
                                tags={skills}
                                setTags={(newTags) => {
                                    setSkills(newTags);
                                    setValue("project_skills", newTags as [Tag, ...Tag[]]);
                                }}
                                activeTagIndex={activeSkillIndex}
                                setActiveTagIndex={setActiveSkillIndex}
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
                                {...field}
                                placeholder="Entrez les intêrets de votre projet..."
                                tags={interests}
                                setTags={(newTags) => {
                                    setInterests(newTags);
                                    setValue("project_interests", newTags as [Tag, ...Tag[]]);
                                }}
                                activeTagIndex={activeInterestIndex}
                                setActiveTagIndex={setActiveInterestIndex}
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
                                {...field}
                                placeholder="Entrez les tags de votre projet..."
                                tags={tags}
                                setTags={(newTags) => {
                                    setTags(newTags);
                                    setValue("tags", newTags as [Tag, ...Tag[]]);
                                }}
                                activeTagIndex={activeTagIndex}
                                setActiveTagIndex={setActiveTagIndex}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}