"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, FileText, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMutation } from "@apollo/client/react"
import { GET_MY_APPLICATIONS, WITHDRAW_PROJECT_APPLICATION } from "@/graphql/applications"
import { Button } from "@/components/ui/button"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

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

    const [withdrawApplication, { loading: withdrawing }] = useMutation(WITHDRAW_PROJECT_APPLICATION, {
        refetchQueries: [{ query: GET_MY_APPLICATIONS }],
        onCompleted: () => {
            toast.success("Candidature retirée", {
                description: "Votre candidature a été retirée avec succès.",
            })
        },
        onError: (error) => {
            toast.error("Oups !", {
                description: error.message || "Une erreur est survenue lors du retrait de votre candidature.",
            })
        },
    })

    const handleWithdraw = (e: React.MouseEvent) => {
        e.stopPropagation()
        withdrawApplication({
            variables: { id: application.id },
        })
    }

    const isPending = application.status === "PENDING"

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
                    </div>
                    {isPending && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-8 shrink-0"
                                    onClick={(e) => e.stopPropagation()}
                                    disabled={withdrawing}
                                >
                                    <X className="size-4" />
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Retirer votre candidature ?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Êtes-vous sûr de vouloir retirer votre candidature pour le poste de{" "}
                                        <span className="font-medium">{application.position?.title}</span> dans le projet{" "}
                                        <span className="font-medium">{application.project?.title}</span> ? Cette action est irréversible.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Annuler</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleWithdraw} disabled={withdrawing}>
                                        {withdrawing ? "Retrait..." : "Retirer"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
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

            <CardFooter className="flex items-center justify-between pt-3 border-t">
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
                <Badge variant="secondary" className="mt-2">{statusConfig.label}</Badge>
            </CardFooter>
        </Card>
    )
}
