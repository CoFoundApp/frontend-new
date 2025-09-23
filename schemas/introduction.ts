import z from "zod";

export const IntroductionGeneralSchema = z.object({
    display_name: z
        .string({
            message: "Vous devez renseigner un nom d'utilisateur valide."
        })
        .min(3, {
            message: "Votre nom d'utilisateur doit faire 3 caractères minimum.",
        }),
    headline: z
        .string({
            message: "Vous devez renseigner un titre valide.",
        })
        .optional(),
    bio: z
        .string({
            message: "Vous devez renseigner une description valide.",
        })
        .optional(),
    visibility: z
        .enum(["PRIVATE", "PUBLIC", "UNLISTED"]),
});

export const IntroductionProSchema = z.object({
    location: z
        .string({
            message: "Vous devez renseigner une localisation valide.",
        })
        .optional(),
    availability_hours: z
        .number({
            message: "Vous devez renseigner un nombre d'heures valide.",
        })
        .optional(),
    looking_for: z
        .string({
            message: "Vous devez renseigner une chaîne de caractère valide.",
        })
        .optional(),
});

export const IntroductionOtherSchema = z.object({
    languages: z
        .array(
            z.object({
                id: z.string(),
                text: z.string(),
            }),
        ),
    tags: z
        .array(
            z.object({
                id: z.string(),
                text: z.string(),
            }),
        ),
});