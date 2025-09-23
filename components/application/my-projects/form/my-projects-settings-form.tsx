import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProjectSettingsSchema } from "@/schemas/projects";
import { useFormContext } from "react-hook-form";
import z from "zod";

export default function MyProjectsSettingsForm() {
    const { control } = useFormContext<z.infer<typeof ProjectSettingsSchema>>();
    
    return (
        <div className="grid gap-6">
            <h3 className="text-lg font-semibold">Paramètres du projet</h3>
            <FormField
                control={control}
                name="status"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Statut</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Statut" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="ACTIVE">
                                    Actif
                                </SelectItem>
                                <SelectItem value="ARCHIVED">
                                    Archivé
                                </SelectItem>
                                <SelectItem value="DRAFT">
                                    Brouillon
                                </SelectItem>
                                <SelectItem value="PAUSED">
                                    En pause
                                </SelectItem>
                                <SelectItem value="SEEKING">
                                    En recherche
                                </SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="stage"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Étape</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Étape" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="IDEA">
                                    Idéation
                                </SelectItem>
                                <SelectItem value="MVP">
                                    MVP
                                </SelectItem>
                                <SelectItem value="SCALE">
                                    En levé
                                </SelectItem>
                                <SelectItem value="TRACTION">
                                    Tractation
                                </SelectItem>
                            </SelectContent>
                        </Select>
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
                                    Équipe
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