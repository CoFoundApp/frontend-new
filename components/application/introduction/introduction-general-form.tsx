import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { IntroductionGeneralSchema } from "@/schemas/introduction";
import { useFormContext } from "react-hook-form";
import z from "zod";

export default function IntroductionGeneralForm() {
    const { control } = useFormContext<z.infer<typeof IntroductionGeneralSchema>>();
    
    return (
        <div className="grid gap-6">
            <FormField
                control={control}
                name="display_name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nom d'utilisateur</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Mark Evans"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="headline"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Titre</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Gardien de but"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="bio"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                            <Textarea 
                                placeholder="Gardien de but, libéro et capitaine de l'équipe du collège Raimon"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="visibility"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Visibilité</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Visibilité" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="PUBLIC">
                                    Publique
                                </SelectItem>
                                <SelectItem value="PRIVATE">
                                    Privé
                                </SelectItem>
                                <SelectItem value="UNLISTED">
                                    Non répertorié
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
}