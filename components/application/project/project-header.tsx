import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CREATE_CONVERSATION, GET_CONVERSATIONS } from "@/graphql/conversations"
import { projectStageConfig, projectStatusConfig } from "@/lib/utils"
import { useMutation } from "@apollo/client/react"
import { Building2, MessageCircle } from "lucide-react"

interface ProjectHeaderProps {
    avatar_url: string | null;
    title: string;
    description: string | null;
    summary: string | null;
    industry: string | null;
    status: ProjectStatus;
    stage: ProjectStage;
    owner_id: string;
}

export default function ProjectHeader({
    avatar_url,
    title,
    description,
    summary,
    industry,
    status,
    stage,
    owner_id,
}: ProjectHeaderProps) {
    const [createConversation, { loading: creatingConversation }] = useMutation(CREATE_CONVERSATION, {
            refetchQueries: [{ query: GET_CONVERSATIONS }],
        },
    )

    const handleContact = () => {
        createConversation({
            variables: { user_id: owner_id },
        });
    }

    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-6">
                    <Avatar className="size-20 ring-2 ring-border">
                        <AvatarImage src={avatar_url ?? ""} alt={title} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                            {title.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                        <h1 className="text-xl font-bold text-balance">{title}</h1>
                        {summary && <p className="text-sm text-muted-foreground text-balance leading-relaxed">{summary}</p>}
                    </div>

                    <Button onClick={handleContact} disabled={creatingConversation} className="w-full" size="sm">
                        <MessageCircle className="size-4 mr-2" />
                        {creatingConversation ? "Création..." : "Contacter"}
                    </Button>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {industry && (
                        <Badge variant="outline" className="text-xs">
                            <Building2 className="size-3 mr-1" />
                            {industry}
                        </Badge>
                    )}
                    <Badge variant="secondary" className="text-xs">
                        {projectStatusConfig[status].label}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                        {projectStageConfig[stage].label}
                    </Badge>
                </div>

                {description && (
                    <div className="pt-4 border-t">
                        <h3 className="font-medium text-sm mb-2 text-muted-foreground">Description</h3>
                        <p className="text-sm leading-relaxed text-pretty">{description}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
