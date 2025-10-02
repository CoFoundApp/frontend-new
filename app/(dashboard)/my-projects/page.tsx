import MyProjectsForm from "@/components/application/my-projects/form/my-projects-form";
import MyProjectsLayout from "@/components/application/my-projects/my-projects-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function MyProjectsPage() {
    return (
        <SidebarInset>
            <header className="flex h-16 px-4 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="ml-1" />
                    <Separator
                        orientation="vertical"
                        className="mr-2 data-[orientation=vertical]:h-4"
                    />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbLink href="#">
                                    Général
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem className="hidden md:block">
                                <BreadcrumbItem>
                                    <BreadcrumbPage>Mes projets</BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <MyProjectsForm />
            </header>
            <div className="flex flex-1 flex-col p-4">
                <MyProjectsLayout />
            </div>
        </SidebarInset>
    );
}