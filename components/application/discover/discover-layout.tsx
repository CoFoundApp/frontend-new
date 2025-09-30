"use client"

import { useState } from "react"
import DiscoverBanner from "./discover-banner"
import DiscoverFilters, { type ProjectFilters, type SortOption } from "./discover-filters"
import DiscoverProjectsList from "./discover-projects-list"

export default function DiscoverLayout() {
    const [filters, setFilters] = useState<ProjectFilters>({});
    const [sort, setSort] = useState<SortOption>({ by: "CREATED_AT", direction: "desc" });

    const handleFiltersChange = (newFilters: ProjectFilters) => {
        setFilters(newFilters);
    }

    const handleSortChange = (newSort: SortOption) => {
        setSort(newSort);
    }

    return (
        <div className="flex flex-1 flex-col gap-6">
            <DiscoverBanner />

            <div className="space-y-6">
                <DiscoverFilters onFiltersChange={handleFiltersChange} onSortChange={handleSortChange} />
                <DiscoverProjectsList filters={filters} sort={sort} />
            </div>
        </div>
    )
}
