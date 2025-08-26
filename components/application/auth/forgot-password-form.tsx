"use client";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ForgotPasswordSchema } from "@/schemas/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { startTransition } from "react";
import { useForm } from "react-hook-form";
import z from "zod";

export default function ForgotPasswordForm() {
    const form = useForm<z.infer<typeof ForgotPasswordSchema>>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    const onSubmit = (values: z.infer<typeof ForgotPasswordSchema>) => {
        startTransition(async () => {
            console.log(values);
        });
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                    <div className="grid gap-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Adresse e-mail</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="thibou@musee.com"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full">
                            Réinitialiser le mot de passe
                        </Button>
                    </div>
                    <div className="text-center text-sm">
                        Vous n'avez pas de compte ?{" "}
                        <Link href="/register" className="underline underline-offset-4">
                            S'inscrire
                        </Link>
                    </div>
                </div>
            </form>
        </Form>
    );
}