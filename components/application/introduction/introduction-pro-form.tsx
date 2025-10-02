import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IntroductionProSchema } from "@/schemas/introduction";
import { useFormContext } from "react-hook-form";
import z from "zod";

export default function IntroductionProForm() {
    const { control } = useFormContext<z.infer<typeof IntroductionProSchema>>();

    return (
        <div className="grid gap-6">
            <FormField
                control={control}
                name="location"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Localisation</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Raimon"
                                {...field}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="availability_hours"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Heures disponibles</FormLabel>
                        <FormControl>
                            <Input
                                type="number"
                                min={0}
                                step={1}
                                value={field.value ?? ""}
                                onChange={(e) =>
                                    field.onChange(e.target.value === "" ? undefined : e.target.valueAsNumber)
                                }
                                placeholder="35"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name="looking_for"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Ce que vous recherchez</FormLabel>
                        <FormControl>
                            <Input
                                placeholder="Gagner le Football Frontier"
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