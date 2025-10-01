"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  GET_PROJECT_APPLICATIONS,
  type GetProjectApplicationsResult,
} from "@/graphql/applications"
import { useMutation, useQuery } from "@apollo/client/react"
import { Check, FileText, Mail, UserCheck, Users, X } from "lucide-react"
import { toast } from "sonner"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MyProjectsShowApplicationsProps {
    projectId: string
}

const applicationStatusConfig: Record<
    ApplicationStatus,
    { label: string }
> = {
    PENDING: { label: "En attente" },
    ACCEPTED: { label: "Acceptée" },
    REJECTED: { label: "Refusée" },
    CANCELED: { label: "Annulée" },
    WITHDRAWN: { label: "Retirée" },
}

export default function MyProjectsShowApplications({ projectId }: MyProjectsShowApplicationsProps) {
    const [statusFilter, setStatusFilter] = useState<ApplicationStatus | "ALL">("PENDING")
    const [positionFilter, setPositionFilter] = useState<string>("ALL")

    const { data, loading, error } = useQuery<GetProjectApplicationsResult>(GET_PROJECT_APPLICATIONS, {
        variables: {
            project_id: projectId,
            status: statusFilter === "ALL" ? undefined : statusFilter,
            position_id: positionFilter === "ALL" ? undefined : positionFilter,
        },
        fetchPolicy: "network-only",
    });

    const applications = data?.projectApplications?.items || [];

    const positions = Array.from(new Set(applications.map((app) => app.position.id))).map((id) => {
        const app = applications.find((a) => a.position.id === id)
        return { id, title: app?.position.title || "" }
    });

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="w-full h-48" />
            </div>
        );
    }

    if (error) {
        return (
            <Card className="border-destructive/50">
                <CardContent className="p-6">
                <div className="text-center py-8">
                    <p className="text-destructive">{error.message ?? String(error)}</p>
                </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                    <Users className="size-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">
                        Candidatures
                        {applications.length > 0 && (
                            <span className="ml-2 text-sm text-muted-foreground">({applications.length})</span>
                        )}
                    </h2>
                </div>

                <div className="flex gap-2">
                    <Select value={positionFilter} onValueChange={setPositionFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Tous les postes" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tous les postes</SelectItem>
                            {positions.map((position) => (
                                <SelectItem key={position.id} value={position.id}>
                                    {position.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ApplicationStatus | "ALL")}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Statut" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">Tous les statuts</SelectItem>
                            <SelectItem value="PENDING">En attente</SelectItem>
                            <SelectItem value="ACCEPTED">Acceptées</SelectItem>
                            <SelectItem value="REJECTED">Refusées</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {applications.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="p-4 bg-muted/50 rounded-full mb-4">
                            <UserCheck className="size-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Aucune candidature</h3>
                        <p className="text-muted-foreground text-center max-w-md">
                            Aucune candidature n'a été reçue pour ce projet pour le moment.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid lg:grid-cols-2 gap-4">
                    {applications.map((application) => {
                        const displayName = application.applicant.profile?.display_name || application.applicant.email.split("@")[0]

                        return (
                            <Card key={application.id}>
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <Avatar className="size-12">
                                            <AvatarImage src={application.applicant.profile?.avatar_url ?? ""} alt={displayName} />
                                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                                                {displayName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-base leading-tight">{displayName}</CardTitle>
                                                    {application.applicant.profile?.headline && (
                                                        <CardDescription className="text-sm mt-1 leading-relaxed">
                                                            {application.applicant.profile.headline}
                                                        </CardDescription>
                                                    )}
                                                </div>
                                                <Badge variant="secondary">
                                                    {applicationStatusConfig[application.status as ApplicationStatus].label}
                                                </Badge>
                                            </div>

                                            <div className="mt-3">
                                                <Badge variant="outline" className="text-xs">
                                                    <FileText className="size-3 mr-1" />
                                                    {application.position.title}
                                                </Badge>
                                            </div>

                                            {application.note && (
                                                <div className="bg-muted/50 rounded-lg p-3 mt-3">
                                                    <p className="text-sm leading-relaxed">{application.note}</p>
                                                </div>
                                            )}

                                            {application.decided_at && (
                                                <p className="text-xs text-muted-foreground mt-2">
                                                    Décidée le {new Date(application.decided_at).toLocaleDateString("fr-FR")}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
