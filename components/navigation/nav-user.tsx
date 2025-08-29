"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_CURRENT_USER, GetCurrentUserResult } from "@/graphql/user";
import { useQuery } from "@apollo/client/react";
import { ChevronsUpDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";

export default function NavUser() {
    const { isMobile } = useSidebar();
    const router = useRouter();

    const { data, loading, error } = useQuery<GetCurrentUserResult>(GET_CURRENT_USER);

    if (loading) {
        return <Skeleton className="w-full h-16" />
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
                                <AvatarImage src="" alt={data?.myProfile.display_name} />
                                <AvatarFallback className="rounded-full bg-primary text-primary-foreground">{data?.myProfile.display_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">{data?.myProfile.display_name}</span>
                                <span className="truncate text-xs">{data?.myEmail}</span>
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
                                    <AvatarImage src="" alt={data?.myProfile.display_name} />
                                    <AvatarFallback className="rounded-full bg-primary text-primary-foreground">{data?.myProfile.display_name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-medium">{data?.myProfile.display_name}</span>
                                    <span className="truncate text-xs">{data?.myEmail}</span>
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
                            className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive"
                        >
                            <LogOut className="size-4 text-destructive" />
                            Se déconnecter
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}