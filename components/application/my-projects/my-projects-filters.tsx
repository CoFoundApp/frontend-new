import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MyProjectsFilters() {
    return (
        <div className="grid lg:grid-cols-2 gap-4">
            <div>
                <Input
                    placeholder="Recherchez par titre, description, etc..."
                />
            </div>
            <div className="grid grid-cols-3 gap-4">
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ACTIVE">
                            Actif
                        </SelectItem>
                        <SelectItem value="ARCHIVED">
                            Archivé
                        </SelectItem>
                        <SelectItem value="DRAFT">
                            Brouillon
                        </SelectItem>
                        <SelectItem value="PAUSED">
                            En pause
                        </SelectItem>
                        <SelectItem value="SEEKING">
                            En recherche
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Étape" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="IDEA">
                            Idée
                        </SelectItem>
                        <SelectItem value="MVP">
                            MVP
                        </SelectItem>
                        <SelectItem value="SCALE">
                            Croissance
                        </SelectItem>
                        <SelectItem value="TRACTION">
                            Traction
                        </SelectItem>
                    </SelectContent>
                </Select>
                <Select>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Date" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="desc">
                            Plus récents
                        </SelectItem>
                        <SelectItem value="asc">
                            Plus anciens
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
}