import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { projectStageConfig, projectStatusConfig, projectVisibilityConfig } from "@/lib/utils";
import { Building2 } from "lucide-react";

interface MyProjectsShowHeaderProps {
    avatar_url: string | null;
    title: string;
    summary: string | null;
    industry: string | null;
    status: ProjectStatus;
    stage: ProjectStage;
    visibility: ProjectVisibility;
}

export default function MyProjectsShowHeader({
    avatar_url,
    title,
    summary,
    industry,
    status,
    stage,
    visibility,
}: MyProjectsShowHeaderProps) {
    return (
        <div className="flex items-center gap-8">
            <Avatar className="size-24 rounded-full">
                <AvatarImage src={avatar_url ?? ""} alt={title} />
                <AvatarFallback className="rounded-full bg-primary text-primary-foreground text-xl font-bold">{title.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-bold">{title}</h1>
                    {visibility && (
                        <>
                            {(() => {
                                const { icon: Icon } = projectVisibilityConfig[visibility];
                                return (
                                    <>
                                        <Icon className="size-4" />
                                    </>
                                );
                            })()}
                        </>
                    )}
                </div>
                {summary && (
                    <p>{summary}</p>
                )}
                <div className="flex items-center gap-2">
                    {industry && (
                        <Badge variant="outline">
                            <Building2 className="size-3 mr-2" />
                            {industry}
                        </Badge>
                    )}
                    <Badge variant="secondary">{projectStatusConfig[status].label}</Badge>
                    <Badge variant="secondary">{projectStageConfig[stage].label}</Badge>
                </div>
            </div>
        </div>
    );
}