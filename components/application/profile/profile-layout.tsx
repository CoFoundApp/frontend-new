"use client"

import { GET_PROFILE_BY_ID, type GetProfileByIdResult } from "@/graphql/profile"
import { useQuery } from "@apollo/client/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import ProfileHeader from "./profile-header"
import { getLanguageName } from "@/lib/languages"

interface ProfileLayoutProps {
  profileId: string
}

export default function ProfileLayout({ profileId }: ProfileLayoutProps) {
    const { data, loading, error } = useQuery<GetProfileByIdResult>(GET_PROFILE_BY_ID, {
        variables: { id: profileId },
        fetchPolicy: "network-only",
    })

    const profile = data?.profileById

    if (loading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <div className="lg:col-span-1 xl:col-span-1 space-y-4">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex flex-col items-center space-y-4">
                                <Skeleton className="size-20 rounded-full" />
                                <Skeleton className="h-6 w-32" />
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2 xl:col-span-3">
                    <Card>
                        <CardHeader>
                            <Skeleton className="h-6 w-48" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                </div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <AlertCircle className="size-12 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Profil introuvable</h2>
                <p className="text-muted-foreground text-center max-w-md">
                    Ce profil n'existe pas ou n'est pas accessible publiquement.
                </p>
                <Button asChild>
                    <Link href="/discover">Retour à la découverte</Link>
                </Button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-1 xl:col-span-1 space-y-4">
                <ProfileHeader
                    avatar_url={profile.avatar_url}
                    availability_hours={profile.availability_hours}
                    bio={profile.bio}
                    display_name={profile.display_name}
                    headline={profile.headline}
                    location={profile.location}
                    visibility={profile.visibility}
                    website_url={profile.website_url}
                />

                {profile.languages && profile.languages.length > 0 && (
                    <Card>
                        <CardHeader className="gap-4">
                            <CardTitle>Langues</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                {profile.languages.map((languageCode) => (
                                    <Badge key={languageCode} variant="secondary" className="text-xs">
                                        {getLanguageName(languageCode)}
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>
                    </Card>
                )}

                {profile.tags && profile.tags.length > 0 && (
                    <Card>
                        <CardHeader className="gap-4">
                            <CardTitle>Tags</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                {profile.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>
                    </Card>
                )}
            </div>

            <div className="lg:col-span-2 xl:col-span-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Ce que je recherche</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {profile.looking_for || "Cet utilisateur n'a pas défini ce qu'il recherche."}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
