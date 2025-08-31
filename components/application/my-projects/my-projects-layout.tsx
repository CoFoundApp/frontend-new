import MyProjectsBanner from "./my-projects-banner";
import MyProjectsFilters from "./my-projects-filters";

export default function MyProjectsLayout() {
    return (
        <div className="flex flex-1 flex-col gap-4">
            <MyProjectsBanner />
            <MyProjectsFilters />
        </div>
    );  
}