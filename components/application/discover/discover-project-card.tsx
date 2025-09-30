"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn, projectStageConfig, projectStatusConfig } from "@/lib/utils"
import { Building2, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"

interface DiscoverProjectCardProps {
    project: {
        id: string
        title: string
        summary: string | null
        avatar_url: string | null
        banner_url: string | null
        industry: string | null
        stage: ProjectStage
        status: ProjectStatus
        project_skills: string[]
        project_interests: string[]
        tags: string[]
        created_at: Date
    }
}

export default function DiscoverProjectCard({ project }: DiscoverProjectCardProps) {
    const router = useRouter();
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <Card 
            className="h-fit"
            onClick={() => router.push(`projects/${project.id}`)}
        >
            <CardHeader>
                <CardTitle>{project.title}</CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
                {project.summary && (
                    <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{project.summary}</p>
                )}

                <div className="flex items-center gap-2 flex-wrap">
                    {project.industry && (
                        <Badge variant="outline">
                            <Building2 className="size-3 mr-2" />
                            {project.industry}
                        </Badge>
                    )}
                    <Badge variant="secondary">{projectStatusConfig[project.status].label}</Badge>
                    <Badge variant="secondary">{projectStageConfig[project.stage].label}</Badge>
                </div>

                {isExpanded && (
                    <div className="space-y-4 pt-4 border-t">
                        {project.project_skills.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium mb-2">Compétences recherchées</h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.project_skills.map((skill, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                        {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {project.project_interests.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium mb-2">Centres d'intérêt</h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.project_interests.map((interest, index) => (
                                        <Badge key={index} variant="outline" className="text-xs">
                                        {interest}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {project.tags.length > 0 && (
                            <div>
                                <h4 className="text-sm font-medium mb-2">Tags</h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map((tag, index) => (
                                        <Badge key={index} variant="secondary" className="text-xs">
                                        {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between group"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsExpanded(!isExpanded);
                    }}
                >
                    <span className="text-sm">{isExpanded ? "Masquer les détails" : "Voir les détails"}</span>
                    <ChevronDown className={cn("size-4 transition-transform", isExpanded && "rotate-180")} />
                </Button>
            </CardContent>
        </Card>
    );
}
