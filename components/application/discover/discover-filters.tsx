"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DiscoverFiltersProps {
    onFiltersChange: (filters: ProjectFilters) => void
    onSortChange: (sort: SortOption) => void
}

export interface ProjectFilters {
    search?: string
    stages?: ProjectStage[]
    statuses?: ProjectStatus[]
}

export interface SortOption {
    by: "CREATED_AT" | "UPDATED_AT" | "TITLE"
    direction: "asc" | "desc"
}

const stages: { value: ProjectStage; label: string }[] = [
    { value: "IDEA", label: "Idée" },
    { value: "MVP", label: "MVP" },
    { value: "TRACTION", label: "Traction" },
    { value: "SCALE", label: "Scale" },
]

const statuses: { value: ProjectStatus; label: string }[] = [
    { value: "ACTIVE", label: "Actif" },
    { value: "DRAFT", label: "Brouillon" },
    { value: "SEEKING", label: "Recherche" },
    { value: "PAUSED", label: "En pause" },
    { value: "ARCHIVED", label: "Archivé" },
]

const sortOptions: { value: string; label: string; sort: SortOption }[] = [
    { value: "created_desc", label: "Plus récent", sort: { by: "CREATED_AT", direction: "desc" } },
    { value: "created_asc", label: "Plus ancien", sort: { by: "CREATED_AT", direction: "asc" } },
    { value: "updated_desc", label: "Dernière mise à jour", sort: { by: "UPDATED_AT", direction: "desc" } },
    { value: "updated_asc", label: "Première mise à jour", sort: { by: "UPDATED_AT", direction: "asc" } },
]

export default function DiscoverFilters({ onFiltersChange, onSortChange }: DiscoverFiltersProps) {
    const [searchValue, setSearchValue] = useState("")
    const [selectedStatus, setSelectedStatus] = useState<ProjectStatus | "all">("all")
    const [selectedStage, setSelectedStage] = useState<ProjectStage | "all">("all")
    const [selectedSort, setSelectedSort] = useState<string>("created_desc")

    const debouncedSearch = useCallback(
        (value: string) => {
            const timer = setTimeout(() => {
                updateFilters({ search: value });
            }, 500);

            return () => clearTimeout(timer);
        },
        [selectedStatus, selectedStage],
    )

    useEffect(() => {
        const cleanup = debouncedSearch(searchValue);
        return cleanup;
    }, [searchValue, debouncedSearch]);

    const updateFilters = (updates: Partial<ProjectFilters>) => {
        const filters: ProjectFilters = {
            search: searchValue || undefined,
            statuses: selectedStatus !== "all" ? [selectedStatus] : undefined,
            stages: selectedStage !== "all" ? [selectedStage] : undefined,
            ...updates,
        }
        onFiltersChange(filters)
    }

    const handleStatusChange = (value: string) => {
        const status = value as ProjectStatus | "all"
            setSelectedStatus(status)
            updateFilters({
            statuses: status !== "all" ? [status] : undefined,
        })
    }

    const handleStageChange = (value: string) => {
        const stage = value as ProjectStage | "all"
            setSelectedStage(stage)
            updateFilters({
            stages: stage !== "all" ? [stage] : undefined,
        })
    }

    const handleSortChange = (value: string) => {
        setSelectedSort(value)
        const sortOption = sortOptions.find((opt) => opt.value === value)
        if (sortOption) {
            onSortChange(sortOption.sort)
        }
    }

    return (
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                <Input
                    placeholder="Rechercher un projet..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="pl-9"
                />
            </div>

            <Select value={selectedStatus} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Statut" />
                </SelectTrigger>
                <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                    {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                            {status.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={selectedStage} onValueChange={handleStageChange}>
                <SelectTrigger className="w-full sm:w-[160px]">
                    <SelectValue placeholder="Étape" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Toutes les étapes</SelectItem>
                    {stages.map((stage) => (
                        <SelectItem key={stage.value} value={stage.value}>
                        {stage.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select value={selectedSort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                    {sortOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
