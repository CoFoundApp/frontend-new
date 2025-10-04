"use client";

import { GET_MY_PROFILE, GetMyProfileResult } from "@/graphql/profile";
import { useQuery } from "@apollo/client/react";
import MyProfileHeader from "./my-profile-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getLanguageName } from "@/lib/languages";
import MyProfileEducations from "./my-profile-educations";
import MyProfileWorkExperiences from "./my-profile-work-experiences";

export default function MyProfileLayout() {
    const { data, loading, error } = useQuery<GetMyProfileResult>(GET_MY_PROFILE, {
        fetchPolicy: "network-only",
    });

    const profile = data?.myProfile;

    if (loading) {
        return <p>Chargement...</p>
    }

    if (!profile) {
        return <p>Ce profil n'existe pas !</p>
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <div className="lg:col-span-1 xl:col-span-1 space-y-4">
                <MyProfileHeader
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

                {profile.skills && profile.skills.length > 0 && (
                    <Card>
                        <CardHeader className="gap-4">
                            <CardTitle>Compétences</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                {profile.skills.map((skill) => (
                                    <Badge key={skill.name} variant="outline" className="text-xs">
                                        {skill.name}
                                    </Badge>
                                ))}
                            </div>
                        </CardHeader>
                    </Card>
                )}

                {profile.interests && profile.interests.length > 0 && (
                    <Card>
                        <CardHeader className="gap-4">
                            <CardTitle>Centres d'intérêt</CardTitle>
                            <div className="flex flex-wrap gap-2">
                                {profile.interests.map((interest) => (
                                    <Badge key={interest.name} variant="outline" className="text-xs">
                                        {interest.name}
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
            <div className="lg:col-span-2 xl:col-span-3 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Ce que vous recherchez</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {profile.looking_for ?? "Vous n'avez pas défini ce que vous recherchiez"}
                    </CardContent>
                </Card>
                <MyProfileEducations educations={profile.educations} />
                <MyProfileWorkExperiences experiences={profile.workExperiences} />
            </div>
        </div>
    );
}