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
        .int()
        .min(0, { message: "Le nombre d'heures doit être positif." })
        .optional(),
    looking_for: z
        .string({
            message: "Vous devez renseigner une chaîne de caractère valide.",
        })
        .optional(),
});

export const EducationSchema = z.object({
    school: z.string().min(1, { message: "L'école est requise." }),
    degree: z.string().optional(),
    field_of_study: z.string().optional(),
    start_date: z.string().min(1, { message: "La date de début est requise." }),
    end_date: z.string().optional(),
    grade: z.string().optional(),
    description: z.string().optional(),
    is_current: z.boolean().default(false),
})

export const WorkExperienceSchema = z.object({
    company: z.string().min(1, { message: "L'entreprise est requise." }),
    title: z.string().min(1, { message: "Le titre est requis." }),
    location: z.string().optional(),
    start_date: z.string().min(1, { message: "La date de début est requise." }),
    end_date: z.string().optional(),
    description: z.string().optional(),
    is_current: z.boolean().default(false),
})

export const IntroductionExperienceSchema = z.object({
    educations: z.array(EducationSchema).default([]),
    work_experiences: z.array(WorkExperienceSchema).default([]),
})

export const LanguageCode = z.enum(["de", "en", "es", "fr", "it"]);

export const IntroductionOtherSchema = z.object({
    languages: z
        .array(LanguageCode)
        .min(1, { message: "Sélectionnez au moins une langue." })
        .default([]),
    skills: z
        .array(z.string())
        .min(1, { message: "Vous devez renseigner une compétence minimum." })
        .default([]),
    interests: z
        .array(z.string())
        .min(1, { message: "Vous devez renseigner un intérêt minimum." })
        .default([]),
    tags: z
        .array(z.string())
        .min(1, { message: "Vous devez renseigner un tag minimum." })
        .default([]),
});