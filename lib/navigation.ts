import { LayoutGrid } from "lucide-react";

export function getMenuItems(pathname: string) {
    return {
        general: [
            {
                href: "/",
                label: "Tableau de bord",
                icon: LayoutGrid,
                isActive: true,
            },
        ],       
    }
}