"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface MyApplicationsFiltersProps {
    statusFilter: ApplicationStatus | "ALL"
    setStatusFilter: (status: ApplicationStatus | "ALL") => void
}

export default function MyApplicationsFilters({ statusFilter, setStatusFilter }: MyApplicationsFiltersProps) {
    return (
        <Tabs value={statusFilter} onValueChange={(value) => setStatusFilter(value as any)}>
            <TabsList>
                <TabsTrigger value="ALL">Toutes</TabsTrigger>
                <TabsTrigger value="PENDING">En attente</TabsTrigger>
                <TabsTrigger value="ACCEPTED">Acceptées</TabsTrigger>
                <TabsTrigger value="REJECTED">Refusées</TabsTrigger>
                <TabsTrigger value="WITHDRAWN">Retirées</TabsTrigger>
            </TabsList>
        </Tabs>
    );
}
