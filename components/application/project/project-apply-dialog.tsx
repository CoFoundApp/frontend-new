"use client"

import type React from "react"

import { useState } from "react"
import { useMutation } from "@apollo/client/react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, Send } from "lucide-react"
import { toast } from "sonner"
import { APPLY_TO_PROJECT } from "@/graphql/projects"

interface ProjectApplyDialogProps {
    positionId: string;
    positionTitle: string;
    projectId: string;
}

export default function ProjectApplyDialog({
    positionId,
    positionTitle,
    projectId,
}: ProjectApplyDialogProps) {
    const [open, setOpen] = useState(false)
    const [note, setNote] = useState("")

    const [applyToProject, { loading }] = useMutation(APPLY_TO_PROJECT, {
        onCompleted: () => {
            toast.success("Candidature envoyée !", {
                description: "Votre candidature a été envoyée avec succès.",
            })
            setOpen(false)
            setNote("")
        },
        onError: (error) => {
            toast.error("Erreur", {
                description: error.message || "Une erreur est survenue lors de l'envoi de votre candidature.",
            })
        },
    })

    const handleSubmit = async () => {
        if (!note.trim()) {
            toast.error("Message requis", {
                description: "Veuillez ajouter un message de motivation.",
            })
            return
        }

        try {
            await applyToProject({
            variables: {
                input: {
                    position_id: positionId,
                    project_id: projectId,
                    note: note.trim(),
                },
            },
            })
        } catch (error) {
            console.error("Error applying to project:", error)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" className="w-full">
                    <Send className="size-4 mr-2" />
                    Postuler
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Postuler au poste</DialogTitle>
                    <DialogDescription>Postulez pour le poste de {positionTitle}</DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="note">Message de motivation (optionnel)</Label>
                        <Textarea
                            id="note"
                            placeholder="Expliquez pourquoi vous êtes intéressé par ce poste..."
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            rows={5}
                            className="resize-none"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
                        Annuler
                    </Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                            <>
                                <Loader2 className="size-4 mr-2 animate-spin" />
                                Envoi...
                            </>
                        ) : (
                            <>
                                <Send className="size-4 mr-2" />
                                Envoyer
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
