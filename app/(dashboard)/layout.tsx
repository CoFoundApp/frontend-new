import AppSidebar from "@/components/navigation/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import CurrentUserProvider from "@/providers/current-user-provider";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <CurrentUserProvider>
                <AppSidebar />
                {children}
            </CurrentUserProvider>
        </SidebarProvider>
    );
}