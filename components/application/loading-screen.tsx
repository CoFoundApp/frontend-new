"use client";

import Image from "next/image";

export default function LoadingScreenPage() {
    return (
        <div className="fixed inset-0 z-[9999] grid place-items-center bg-primary">
            <div className="flex flex-col items-center gap-3">
                <Image src={`/logo/icon-blue.svg`} alt="Logo de CoFound" height={128} width={128} className="rounded-md animate-spin" />
                <p className="text-white">Chargement…</p>
            </div>
        </div>
    );
}