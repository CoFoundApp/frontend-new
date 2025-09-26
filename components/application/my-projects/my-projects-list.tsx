"use client";

import { useQuery } from "@apollo/client/react";
import MyProjectsListEmpty from "./my-projects-list-empty";
import { GET_MY_PROJECTS, GetMyProjectsResult } from "@/graphql/projects";
import MyProjectCard from "@/components/application/my-projects/my-project-card";
import { useMyProjects } from "@/stores/my-projects-store";
import { useEffect } from "react";

export default function MyProjectsList() {
    const { data, loading, error } = useQuery<GetMyProjectsResult>(GET_MY_PROJECTS, {
        fetchPolicy: "cache-first",
        errorPolicy: "all",
    });

    const { setProjects, getFilteredProjects } = useMyProjects();

    useEffect(() => {
        if (data?.listMyProjects) setProjects(data.listMyProjects as IProject[]);
    }, [data, setProjects]);

    const projects = getFilteredProjects();

    if (loading) {
        return <p>Chargement...</p>
    }

    if (!projects || projects.length === 0) {
        return <MyProjectsListEmpty />
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {projects.map((p) => (
                <MyProjectCard project={p} />
            ))}
        </div>
    );
}