"use client";

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { getMenuItems } from "@/lib/navigation";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import NavMain from "./nav-main";

export default function AppSidebar() {
    const pathname = usePathname();
    const menuItems = getMenuItems(pathname);

    return (
        <Sidebar collapsible="icon">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="#">
                                <Image src={`/logo/icon-blue.svg`} alt="Logo de CoFound" height={32} width={32} className="rounded-md" />
                                <div className="flex flex-col gap-0.5 leading-none">
                                    <span className="font-medium">CoFound</span>
                                    <span>v1.0.0</span>
                                </div>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={menuItems.general} />
            </SidebarContent>
            <SidebarFooter>

            </SidebarFooter>
        </Sidebar>
    );
}