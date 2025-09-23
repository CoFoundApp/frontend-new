"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { LOGOUT } from "@/graphql/auth";
import { useCurrentUser } from "@/stores/current-user";
import { useMutation } from "@apollo/client/react";
import { ChevronsUpDown, Loader2, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function NavUser() {
    const { isMobile } = useSidebar();
    const router = useRouter();
    const { user, clearUser } = useCurrentUser();

    const [logout, { loading: logoutLoading }] = useMutation(LOGOUT);

    const handleLogout = async () => {
        try {
            await logout();
            clearUser();
            toast.success("Déconnexion réussie !", {
                description: "Vous vous êtes déconnecté avec succès.",
            });
            router.push("/login");
        } catch (err: any) {
            toast.error("Oups !", {
                description: err?.message || "Une erreur est survenue.",
            });
        }
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <Avatar className="size-8 rounded-full">
                                <AvatarImage src="" alt={user?.myProfile.display_name} />
                                <AvatarFallback className="rounded-full bg-primary text-primary-foreground">{""}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{user?.myProfile.display_name}</span>
                                <span className="truncate text-xs">{user?.myEmail}</span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? "bottom" : "right"}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="p-0 font-normal">
                            <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                <Avatar className="size-8 rounded-lg">
                                    <AvatarImage src="" alt={user?.myProfile.display_name} />
                                    <AvatarFallback className="rounded-full bg-primary text-primary-foreground">{""}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{user?.myProfile.display_name}</span>
                                    <span className="truncate text-xs">{user?.myEmail}</span>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="#" className="flex items-center gap-2 cursor-pointer">
                                <User className="size-4" />
                                Mon profil
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => handleLogout()}
                            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                        >
                            {logoutLoading ? (
                                <>
                                    <Loader2 className="size-4 animate-spin" />
                                    Déconnexion...
                                </>
                            ) : (
                                <>
                                    <LogOut className="size-4 text-destructive" />
                                    Se déconnecter
                                </>
                            )}
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}