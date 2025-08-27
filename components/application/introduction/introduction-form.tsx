"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { IntroductionGeneralSchema, IntroductionOtherSchema, IntroductionProSchema } from "@/schemas/introduction";
import { zodResolver } from "@hookform/resolvers/zod";
import { defineStepper } from "@stepperize/react";
import { Fragment } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import IntroductionGeneralForm from "./introduction-general-form";
import IntroductionComplete from "./introduction-complete";
import IntroductionProForm from "./introduction-pro-form";
import IntroductionOtherForm from "./introduction-other-form";

const { useStepper, steps, utils } = defineStepper(
    { id: "general", label: "Général", schema: IntroductionGeneralSchema },
    { id: "pro", label: "Détails professionnels", schema: IntroductionProSchema },
    { id: "other", label: "Autre", schema: IntroductionOtherSchema },
    { id: "complete", label: "Fin", schema: z.object({}) },
);

export default function IntroductionForm() {
    const stepper = useStepper();

    const form = useForm({
        mode: "onTouched",
        resolver: zodResolver(stepper.current.schema),
        defaultValues: {
            visibility: "PUBLIC",
            languages: "FR",
            tags: [],
        }
    });

    const onSubmit = (values: z.infer<typeof stepper.current.schema>) => {
        console.log(values);
        if (stepper.isLast) {
            stepper.reset()
        } else {
            stepper.next()
        }
    }

    const currentIndex = utils.getIndex(stepper.current.id);

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex justify-center"
            >
                <Card className="w-full max-w-lg">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Personnalisez votre profil</CardTitle>
                            <span className="text-sm text-muted-foreground">
                                Etape {currentIndex + 1} sur {steps.length}
                            </span>
                        </div>
                    </CardHeader>
                    <CardContent className="grid gap-6">
                        <nav aria-label="Checkout Steps" className="group my-4 overflow-x-auto">
                            <ol className="flex flex-nowrap items-center justify-between gap-2 min-w-max" aria-orientation="horizontal">
                                {stepper.all.map((step, index, array) => (
                                    <Fragment key={step.id}>
                                        <li className="flex items-center gap-4 flex-shrink-0">
                                            <Button
                                                type="button"
                                                role="tab"
                                                variant={index <= currentIndex ? 'default' : 'secondary'}
                                                aria-current={stepper.current.id === step.id ? 'step' : undefined}
                                                aria-posinset={index + 1}
                                                aria-setsize={steps.length}
                                                aria-selected={stepper.current.id === step.id}
                                                className="flex size-10 items-center justify-center rounded-full"
                                                onClick={async () => {
                                                    const valid = await form.trigger();
                                                    if (!valid) return;
                                                    if (index - currentIndex > 1) return;
                                                    stepper.goTo(step.id);
                                                }}
                                            >
                                                {index + 1}
                                            </Button>
                                            <span className="text-sm font-medium">{step.label}</span>
                                        </li>
                                        {index < array.length - 1 && (
                                            <Separator
                                                className={`flex-1 ${index < currentIndex ? 'bg-primary' : 'bg-muted'}`}
                                            />
                                        )}
                                    </Fragment>
                                ))}
                            </ol>
                        </nav>
                        <div className="grid gap-6">
                            {stepper.switch({
                                general: () => <IntroductionGeneralForm />,
                                pro: () => <IntroductionProForm />,
                                other: () => <IntroductionOtherForm />,
                                complete: () => <IntroductionComplete />
                            })}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-4">
                        {!stepper.isLast ? (
                            <>
                                <Button variant="secondary" onClick={stepper.prev} disabled={stepper.isFirst}>
                                    Précédent
                                </Button>
                                <Button type="submit">{stepper.isLast ? 'Terminer' : 'Suivant'}</Button>
                            </>
                        ) : (
                            <Button onClick={stepper.reset}>Réinitialiser</Button>
                        )}
                    </CardFooter>
                </Card>
            </form>
        </Form>
    );
}