import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GET_PROJECT_MEMBERS, GetProjectMembersResult } from "@/graphql/projects";
import { memberRoleConfig } from "@/lib/utils";
import { useQuery } from "@apollo/client/react";
import { Mail, User, UserPlus, Users } from "lucide-react";

interface MyProjectsShowMembersProps {
    projectId: string;
}

export default function MyProjectsShowMembers({
    projectId,
}: MyProjectsShowMembersProps) {
    const { data, loading, error } = useQuery<GetProjectMembersResult>(GET_PROJECT_MEMBERS, {
        variables: { project_id: projectId },
        fetchPolicy: "cache-first",
    });

    const members = data?.projectMembers;

    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center gap-2">
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
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <Users className="size-5 text-muted-foreground" />
                    <h2 className="text-lg font-semibold">
                        Membres
                        {members && members.length > 0 && (
                            <span className="ml-2 text-sm text-muted-foreground">({members.length})</span>
                        )}
                    </h2>
                </div>
            </div>
            {!members || members.length === 0 ? (
                <Card className="border-dashed border-2">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="p-4 bg-muted/50 rounded-full mb-4">
                            <User className="size-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-2">Aucun membre</h3>
                        <p className="text-muted-foreground text-center max-w-md">Ce projet n'a pas encore de membres.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid xl:grid-cols-2 gap-4">
                    {members.map((member) => {
                        const displayName = member.users.profile?.display_name || member.users.email.split("@")[0]

                        return (
                            <Card key={member.users.id}>
                                <CardHeader>
                                    <div className="flex items-start gap-4">
                                        <Avatar className="size-12">
                                            <AvatarImage src={member.users.profile.avatar_url ?? ""} alt={displayName} />
                                            <AvatarFallback className="bg-primary text-primary-foreground font-bold">{displayName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <CardTitle className="text-base leading-tight">{displayName}</CardTitle>
                                                    {member.users.profile?.headline && (
                                                        <CardDescription className="text-sm mt-1 leading-relaxed">
                                                            {member.users.profile.headline}
                                                        </CardDescription>
                                                    )}
                                                </div>
                                                <Badge variant="secondary" className="shrink-0">
                                                    {memberRoleConfig[member.role].label}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-1.5 mt-2 text-xs text-muted-foreground">
                                                <Mail className="size-3" />
                                                <span className="truncate">{member.users.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </CardHeader>
                            </Card>
                        )
                    })}
                    </div>
            )}
        </div>
    );
}