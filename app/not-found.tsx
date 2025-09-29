import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
    return (
        <section className="flex items-center min-h-screen bg-primary">
            <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto flex flex-col items-center max-w-screen-sm">
                    <Image src={`/logo/icon-blue.svg`} alt="Logo de CoFound" height={64} width={64} />
                    <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-white sm:text-7xl">Page introuvable</h1>
                    <p className="mt-6 text-lg font-medium text-pretty text-white sm:text-xl/8">
                        Désolé, la page que vous cherchez n'existe pas ou a été déplacée.
                    </p>
                    <Button variant="secondary" className="mt-10 cursor-pointer" asChild>
                        <Link href="/">
                            Retourner à l'accueil
                        </Link>
                    </Button>
                </div>   
            </div>
        </section>
    );
}