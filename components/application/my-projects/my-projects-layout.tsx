import MyProjectsBanner from "./my-projects-banner";
import MyProjectsFilters from "./my-projects-filters";
import MyProjectsList from "./my-projects-list";

export default function MyProjectsLayout() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <MyProjectsBanner />
            <MyProjectsFilters />
            <MyProjectsList />
        </div>
    );  
}