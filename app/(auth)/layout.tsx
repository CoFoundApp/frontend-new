import Image from "next/image";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className="bg-muted flex min-h-screen flex-col items-center justify-center gap-6 p-6 md:p-10">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <a href="#" className="flex items-center gap-2 self-center font-medium">
                    <Image src={`/logo/icon-blue.svg`} alt="Logo de CoFound" height={24} width={24} className="rounded-md" />
                    CoFound
                </a>
                {children}
            </div>
        </div>
    );
}