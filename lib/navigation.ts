import { Folder, LayoutGrid, Search } from "lucide-react";

export function getMenuItems(pathname: string) {
    return {
        general: [
            {
                href: "/",
                label: "Tableau de bord",
                icon: LayoutGrid,
                isActive: pathname === "/",
            },
            {
                href: "/my-projects",
                label: "Mes projets",
                icon: Folder,
                isActive: pathname.includes("/my-projects"),
            },
            {
                href: "/discover",
                label: "Découvrir",
                icon: Search,
                isActive: pathname.includes("/discover") || pathname.includes("/profile") || pathname.includes("/projects"),
            },
        ],       
    }
}