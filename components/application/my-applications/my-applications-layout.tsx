"use client"

import { useState } from "react"
import MyApplicationsBanner from "./my-applications-banner"
import MyApplicationsFilters from "./my-applications-filters"
import MyApplicationsList from "./my-applications-list"

export default function MyApplicationsLayout() {
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("ALL")

    return (
        <div className="flex flex-1 flex-col gap-4">
            <MyApplicationsBanner />
            <MyApplicationsFilters statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
            <MyApplicationsList statusFilter={statusFilter} />
        </div>
    )
}
