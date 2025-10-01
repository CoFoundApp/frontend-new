"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Building2, Calendar, FileText } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"

interface MyApplicationCardProps {
  application: IProjectApplication
}

const applicationStatusConfig = {
    PENDING: { label: "En attente" },
    ACCEPTED: { label: "Acceptée" },
    REJECTED: { label: "Refusée" },
    WITHDRAWN: { label: "Retirée" },
    CANCELED: { label: "Annulée" },
}

export default function MyApplicationCard({ application }: MyApplicationCardProps) {
    const router = useRouter()
    const statusConfig = applicationStatusConfig[application.status as keyof typeof applicationStatusConfig]

    return (
        <Card
            className="h-fit cursor-pointer"
            onClick={() => router.push(`/projects/${application.project_id}`)}
        >
            <CardHeader>
                <div className="flex items-start gap-3">
                    <Avatar className="size-12 shrink-0">
                        <AvatarImage src={application.project?.avatar_url || "/placeholder.svg"} alt={application.project?.title} />
                        <AvatarFallback className="bg-primary text-primary-foreground">{application.project?.title?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                            {application.project?.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground truncate">{application.position?.title}</p>
                        <Badge variant="secondary" className="mt-2">{statusConfig.label}</Badge>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                {application.note && (
                    <div className="flex items-start gap-2 text-sm">
                        <FileText className="size-4 mt-0.5 shrink-0 text-muted-foreground" />
                        <p className="text-muted-foreground line-clamp-2">{application.note}</p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="pt-3 border-t">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="size-3" />
                    <span>
                        Candidature envoyée{" "}
                        {formatDistanceToNow(new Date(application.created_at), {
                            addSuffix: true,
                            locale: fr,
                        })}
                    </span>
                </div>
            </CardFooter>
        </Card>
    )
}
