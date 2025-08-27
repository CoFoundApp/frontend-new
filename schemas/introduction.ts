import z from "zod";

export const IntroductionGeneralSchema = z.object({
    display_name: z
        .string({
            message: "Vous devez renseigner un nom d'utilisateur valide."
        })
        .min(3, {
            message: "Votre nom d'utilisateur doit faire 3 caractères minimum.",
        }),
    bio: z
        .string({
            message: "Vous devez renseigner une description valide.",
        })
        .min(3, {
            message: "Votre description doit faire 3 caractères minimum.",
        }),
    location: z
        .string({
            message: "Vous devez renseigner une localisation valide.",
        })
        .min(3, {
            message: "Votre localisation doit faire 3 caractères minimum.",
        }),
    visibility: z
        .enum(["PRIVATE", "PUBLIC", "UNLISTED"]),
});