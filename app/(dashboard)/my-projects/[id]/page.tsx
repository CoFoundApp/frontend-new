import MyProjectsEditForm from "@/components/application/my-projects/form/my-projects-edit-form";
import MyProjectsShowLayout from "@/components/application/my-projects/show/my-projects-show-layout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default async function MyProjectsShowPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
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
                <MyProjectsEditForm projectId={id} />
            </header>
            <div className="flex flex-1 flex-col p-4">
                <MyProjectsShowLayout projectId={id} />
            </div>
        </SidebarInset>
    );
}