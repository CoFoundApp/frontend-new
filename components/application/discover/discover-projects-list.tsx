"use client"

import { useQuery } from "@apollo/client/react"
import { LIST_PROJECTS, SEARCH_PROJECTS, type ListProjectsResult, type SearchProjectsResult } from "@/graphql/projects"
import DiscoverProjectCard from "./discover-project-card"
import { Skeleton } from "@/components/ui/skeleton"
import { Inbox } from "lucide-react"
import type { ProjectFilters, SortOption } from "./discover-filters"
import { Card, CardContent } from "@/components/ui/card"

interface DiscoverProjectsListProps {
    filters: ProjectFilters;
    sort: SortOption;
}

export default function DiscoverProjectsList({ filters, sort }: DiscoverProjectsListProps) {
    const useSearchQuery = !!filters.search && filters.search.trim().length > 0;

    const listQuery = useQuery<ListProjectsResult>(LIST_PROJECTS, {
        variables: {
            filters: {
                stages: filters.stages,
                statuses: filters.statuses,
            },
            sort: {
                by: sort.by,
                direction: sort.direction,
            },
        },
        fetchPolicy: "network-only",
        errorPolicy: "all",
        skip: useSearchQuery,
    });

    const searchQuery = useQuery<SearchProjectsResult>(SEARCH_PROJECTS, {
        variables: {
            q: filters.search,
            k: 20,
        },
        fetchPolicy: "network-only",
        errorPolicy: "all",
        skip: !useSearchQuery,
    });

    const { data, loading, error } = useSearchQuery ? searchQuery : listQuery;

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-80 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    if (error) {
        console.log("GraphQL Error:", error)
        return (
            <Card className="border-destructive/50">
                <CardContent className="pt-6">
                    <p className="text-destructive text-center">Une erreur est survenue lors du chargement des projets.</p>
                    <p className="text-xs text-muted-foreground text-center mt-2">{error.message}</p>
                </CardContent>
            </Card>
        );
    }

    const searchHits = useSearchQuery ? (data as SearchProjectsResult)?.searchProjects || [] : []

    const projects = useSearchQuery
        ? searchHits.map((hit) => hit.project)
        : (data as ListProjectsResult)?.listProjects?.items || []

    const total = useSearchQuery ? searchHits.length : (data as ListProjectsResult)?.listProjects?.total || 0

    if (projects.length === 0) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="rounded-full bg-muted p-4 mb-4">
                        <Inbox className="size-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">Aucun projet trouvé</h3>
                    <p className="text-muted-foreground text-sm max-w-md">
                        {useSearchQuery
                            ? "Aucun projet ne correspond à votre recherche. Essayez avec d'autres mots-clés."
                            : "Essayez de modifier vos filtres pour découvrir plus de projets."}
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {total} projet{total > 1 ? "s" : ""} trouvé{total > 1 ? "s" : ""}
                    {useSearchQuery && <span className="ml-1">(recherche sémantique)</span>}
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {useSearchQuery
                    ? searchHits.map((hit) => (
                        <DiscoverProjectCard key={hit.project.id} project={hit.project} score={hit.score} reasons={hit.reasons} />
                        ))
                    : projects.map((project) => <DiscoverProjectCard key={project.id} project={project} />)
                }
            </div>
        </div>
    );
}
