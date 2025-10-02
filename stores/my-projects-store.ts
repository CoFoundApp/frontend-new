import { normalize } from "@/lib/utils";
import { create } from "zustand";

type Order = "asc" | "desc";

type Filters = {
    query: string;
    status: ProjectStatus | "ALL";
    stage: ProjectStage | "ALL";
    order: Order;
};

type MyProjectsState = {
    projects: IProject[];
    filters: Filters;

    setProjects: (p: IProject[]) => void;

    setQuery: (q: string) => void;
    setStatus: (s: Filters["status"]) => void;
    setStage: (s: Filters["stage"]) => void;
    setOrder: (o: Order) => void;
    resetFilters: () => void;

    getFilteredProjects: () => IProject[];
};

export const useMyProjects = create<MyProjectsState>((set, get) => ({
    projects: [],
    filters: {
        query: "",
        status: "ALL",
        stage: "ALL",
        order: "desc",
    },

    setProjects: (p) => set({ projects: p }),

    setQuery: (q) => set((s) => ({ filters: { ...s.filters, query: q } })),
    setStatus: (status) => set((s) => ({ filters: { ...s.filters, status } })),
    setStage: (stage) => set((s) => ({ filters: { ...s.filters, stage } })),
    setOrder: (order) => set((s) => ({ filters: { ...s.filters, order } })),
    resetFilters: () =>
        set({
            filters: { query: "", status: "ALL", stage: "ALL", order: "desc" },
        }),

    getFilteredProjects: () => {
        const { projects, filters } = get();
        const q = normalize(filters.query);

        let list = projects.filter((p) => {
            const statusOk = filters.status === "ALL" || p.status === filters.status;
            const stageOk = filters.stage === "ALL" || p.stage === filters.stage;

            if (!q) return statusOk && stageOk;

            const hay = [
                p.title,
                p.summary,
                p.description,
                p.industry,
                ...(p.tags ?? []),
            ]
                .filter(Boolean)
                .map((x) => normalize(String(x)))
                .join(" ");

            return statusOk && stageOk && hay.includes(q);
        });

        list = list.sort((a, b) => {
            const va = new Date(a.created_at).getTime();
            const vb = new Date(b.created_at).getTime();
            return filters.order === "asc" ? va - vb : vb - va;
        });

        return list;
    },
}))