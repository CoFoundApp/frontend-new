"use client"

import { useQuery } from "@apollo/client/react"
import { GET_MY_APPLICATIONS, type GetMyApplicationsResult } from "@/graphql/applications"
import { useMemo } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import MyApplicationCard from "./my-application-card"
import MyApplicationsListEmpty from "./my-applications-list-empty"

interface MyApplicationsListProps {
    statusFilter: ApplicationStatus | "ALL"
}

export default function MyApplicationsList({ statusFilter }: MyApplicationsListProps) {
    const { data, loading } = useQuery<GetMyApplicationsResult>(GET_MY_APPLICATIONS, {
        fetchPolicy: "network-only",
        errorPolicy: "all",
        variables: {
            limit: 50,
        },
    })

    const filteredApplications = useMemo(() => {
        const applications = data?.myApplications?.items as IProjectApplication[] | undefined
        if (!applications) return []
        if (statusFilter === "ALL") return applications
        return applications.filter((app) => app.status === statusFilter)
    }, [data?.myApplications?.items, statusFilter])

    if (loading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="w-full h-64" />
                ))}
            </div>
        )
    }

    if (!filteredApplications || filteredApplications.length === 0) {
        return <MyApplicationsListEmpty />
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredApplications.map((application) => (
                <MyApplicationCard key={application.id} application={application} />
            ))}
        </div>
    )
}
