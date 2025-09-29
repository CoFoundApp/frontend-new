import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { projectVisibilityConfig } from "@/lib/utils";
import { Clock, Globe, MapPin } from "lucide-react";

interface MyProfileHeaderProps {
    avatar_url: string | null;
    availability_hours: string | null;
    bio: string | null;
    display_name: string | null;
    headline: string | null;
    location: string | null;
    visibility: ProfileVisibility;
    website_url: string | null;
}

export default function MyProfileHeader({
    avatar_url,
    availability_hours,
    bio,
    display_name,
    headline,
    location,
    visibility,
    website_url,
}: MyProfileHeaderProps) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4 mb-6">
                    <Avatar className="size-20 ring-2 ring-border">
                        <AvatarImage src={avatar_url ?? ""} alt={display_name ?? "Utilisateur"} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                            {(display_name ? display_name.charAt(0).toUpperCase() : "U")}
                        </AvatarFallback>
                    </Avatar>

                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                            <h1 className="text-xl font-bold text-balance">{display_name}</h1>
                            {visibility &&
                                (() => {
                                    const { icon: Icon } = projectVisibilityConfig[visibility]
                                    return <Icon className="size-4 text-muted-foreground" />
                                })()}
                        </div>

                        {headline && <p className="text-sm text-muted-foreground text-balance leading-relaxed">{headline}</p>}
                    </div>
                </div>

                <div className="flex flex-wrap justify-center gap-4 mb-4">
                    {location && (
                        <div className="flex items-center">
                            <MapPin className="size-4 mr-2 text-secondary" />
                            {location}
                        </div>
                    )}
                    {availability_hours && (
                        <div className="flex items-center">
                            <Clock className="size-4 mr-2 text-secondary" />
                            {availability_hours}h/semaine
                        </div>
                    )}
                    {website_url && (
                        <div className="flex items-center">
                            <Globe className="size-3 mr-2" />
                            <a 
                                href={website_url.startsWith("http") ? website_url : `https://${website_url}`} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="hover:underline"
                            >
                                Site web
                            </a>
                        </div>
                    )}
                </div>

                {bio && (
                    <div className="pt-4 border-t">
                        <h3 className="font-medium text-sm mb-2 text-muted-foreground">Description</h3>
                        <p className="text-sm leading-relaxed text-pretty">{bio}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}