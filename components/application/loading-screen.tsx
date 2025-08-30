"use client";

import { Loader2 } from "lucide-react";

export default function LoadingScreenPage() {
    return (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-background">
            <div className="flex flex-col items-center gap-3">
                <Loader2 className="size-8 animate-spin" aria-hidden />
                <p className="text-sm text-muted-foreground">Chargement…</p>
            </div>
        </div>
    );
}