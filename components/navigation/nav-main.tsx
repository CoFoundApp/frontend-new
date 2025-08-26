import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

export default function NavMain({
    items
}: {
    items: {
        href: string;
        label: string;
        icon?: LucideIcon;
        isActive: boolean;
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Général</SidebarGroupLabel>
            <SidebarMenu>
                {items.map((item, index) => (
                    <SidebarMenuItem key={index}>
                        <SidebarMenuButton isActive={item.isActive} asChild>
                            <Link href={item.href}>
                                {item.icon && <item.icon />}
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    );
}