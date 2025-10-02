export const LANGUAGE_OPTIONS = [
    { label: "Allemand", value: "de" },
    { label: "Anglais", value: "en" },
    { label: "Espagnol", value: "es" },
    { label: "Français", value: "fr" },
    { label: "Italien", value: "it" },
] as const;

export function getLanguageName(code: string): string {
    const language = LANGUAGE_OPTIONS.find((lang) => lang.value.toLowerCase() === code.toLowerCase());
    return language ? language.label : code.toUpperCase();
}