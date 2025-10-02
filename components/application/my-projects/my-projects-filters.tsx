"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMyProjects } from "@/stores/my-projects-store";

export default function MyProjectsFilters() {
    const { filters, setQuery, setStatus, setStage, setOrder } = useMyProjects();

    return (
        <div className="grid lg:grid-cols-2 gap-4">
            <div>
                <Input
                    placeholder="Recherchez par titre, description, etc..."
                    value={filters.query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <Select value={filters.status === "ALL" ? undefined : filters.status} onValueChange={(v) => setStatus(v as any)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tous</SelectItem>
                        <SelectItem value="ACTIVE">Actif</SelectItem>
                        <SelectItem value="ARCHIVED">Archivé</SelectItem>
                        <SelectItem value="DRAFT">Brouillon</SelectItem>
                        <SelectItem value="PAUSED">En pause</SelectItem>
                        <SelectItem value="SEEKING">En recherche</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filters.stage === "ALL" ? undefined : filters.stage} onValueChange={(v) => setStage(v as any)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Étape" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ALL">Tous</SelectItem>
                        <SelectItem value="IDEA">Idée</SelectItem>
                        <SelectItem value="MVP">MVP</SelectItem>
                        <SelectItem value="SCALE">Croissance</SelectItem>
                        <SelectItem value="TRACTION">Traction</SelectItem>
                    </SelectContent>
                </Select>
                <Select value={filters.order} onValueChange={(v) => setOrder(v as "asc" | "desc")}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">Plus récents</SelectItem>
                        <SelectItem value="asc">Plus anciens</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}