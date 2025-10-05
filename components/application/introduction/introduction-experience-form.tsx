"use client"

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import type { IntroductionExperienceSchema } from "@/schemas/introduction"
import { useFormContext, useFieldArray } from "react-hook-form"
import type z from "zod"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"

export default function IntroductionExperienceForm() {
    const { control } = useFormContext<z.infer<typeof IntroductionExperienceSchema>>()

    const {
        fields: educationFields,
        append: appendEducation,
        remove: removeEducation,
    } = useFieldArray({
        control,
        name: "educations",
    })

    const {
        fields: workFields,
        append: appendWork,
        remove: removeWork,
    } = useFieldArray({
        control,
        name: "work_experiences",
    })

    return (
        <div className="grid gap-6">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Formations</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            appendEducation({
                                school: "",
                                degree: "",
                                field_of_study: "",
                                start_date: "",
                                end_date: "",
                                grade: "",
                                description: "",
                                is_current: false,
                            })
                        }
                    >
                        <Plus className="size-4 mr-2" />
                        Ajouter une formation
                    </Button>
                </div>

                {educationFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">Formation {index + 1}</h4>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeEducation(index)}>
                                <Trash2 className="size-4" />
                            </Button>
                        </div>

                        <FormField
                            control={control}
                            name={`educations.${index}.school`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>École / Université</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Université de Paris" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name={`educations.${index}.degree`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Diplôme</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Master" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`educations.${index}.field_of_study`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Domaine d'études</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Informatique" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name={`educations.${index}.start_date`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date de début</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`educations.${index}.end_date`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date de fin</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} disabled={control._formValues.educations?.[index]?.is_current} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={control}
                            name={`educations.${index}.is_current`}
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="!mt-0">Formation en cours</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`educations.${index}.description`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Décrivez votre formation..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
            </div>

            <Separator />

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Expériences professionnelles</h3>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                            appendWork({
                                company: "",
                                title: "",
                                location: "",
                                start_date: "",
                                end_date: "",
                                description: "",
                                is_current: false,
                            })
                        }
                    >
                        <Plus className="size-4 mr-2" />
                        Ajouter une expérience
                    </Button>
                </div>

                {workFields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <h4 className="font-medium">Expérience {index + 1}</h4>
                            <Button type="button" variant="ghost" size="sm" onClick={() => removeWork(index)}>
                                <Trash2 className="size-4" />
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name={`work_experiences.${index}.company`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Entreprise</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Google" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`work_experiences.${index}.title`}
                                render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titre du poste</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Développeur Full Stack" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={control}
                            name={`work_experiences.${index}.location`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Localisation</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Paris, France" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={control}
                                name={`work_experiences.${index}.start_date`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date de début</FormLabel>
                                        <FormControl>
                                            <Input type="date" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={control}
                                name={`work_experiences.${index}.end_date`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Date de fin</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="date"
                                                {...field}
                                                disabled={control._formValues.work_experiences?.[index]?.is_current}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={control}
                            name={`work_experiences.${index}.is_current`}
                            render={({ field }) => (
                                <FormItem className="flex items-center space-x-2">
                                    <FormControl>
                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                    <FormLabel className="!mt-0">Poste actuel</FormLabel>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            name={`work_experiences.${index}.description`}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Décrivez vos responsabilités..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}
