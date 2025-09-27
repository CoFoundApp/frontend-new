"use client";

import { useState } from "react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Badge } from "./badge";
import { Check, ChevronDown, X } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./command";
import { cn } from "@/lib/utils";

export interface MultiSelectOption {
    label: string;
    value: string;
}

interface MultiSelectProps {
    options: MultiSelectOption[];
    selected: string[];
    onSelectionChange: (selected: string[]) => void;
    placeholder?: string;
    maxSelections?: number;
    className?: string;
    disabled?: boolean;
}

export function MultiSelect({
    options,
    selected,
    onSelectionChange,
    placeholder = "Sélectionnez des options...",
    maxSelections,
    className,
    disabled = false,
}: MultiSelectProps) {
    const [open, setOpen] = useState(false);

    const handleSelect = (value: string) => {
        if (selected.includes(value)) {
            onSelectionChange(selected.filter((item) => item !== value ));
        } else {
            if (maxSelections && selected.length >= maxSelections) {
                return;
            }
            onSelectionChange([...selected, value]);
        }
    }

    const handleRemove = (value: string) => {
        onSelectionChange(selected.filter((item) => item !== value));
    }

    const selectedOptions = options.filter((option) => selected.includes(option.value));

    return (
        <div className={cn("w-full", className)}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className={cn("w-full justify-between min-h-10 h-auto p-2", disabled && "opacity-50 cursor-not-allowed")}
                        disabled={disabled}
                    >
                        <div className="flex flex-wrap gap-1 flex-1">
                            {selectedOptions.length > 0 ? (
                                selectedOptions.map((option) => (
                                    <Badge
                                        key={option.value}
                                        variant="secondary"
                                        className="text-xs"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            handleRemove(option.value)
                                        }}
                                    >
                                        {option.label}
                                        <X className="ml-1 h-3 w-3 cursor-pointer" />
                                    </Badge>
                                ))
                            ) : (
                                <span className="text-muted-foreground">{placeholder}</span>
                            )}
                        </div>
                        <ChevronDown className="h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                    <Command>
                        <CommandInput placeholder="Rechercher..." />
                        <CommandList>
                            <CommandEmpty>Aucune option trouvée.</CommandEmpty>
                            <CommandGroup>
                                {options.map((option) => {
                                    const isSelected = selected.includes(option.value);
                                    const isDisabled = maxSelections && selected.length >= maxSelections && !isSelected;

                                    return (
                                        <CommandItem
                                            key={option.value}
                                            value={`${option.label} ${option.value}`}
                                            onSelect={() => handleSelect(option.value)}
                                            disabled={!!isDisabled}
                                            className={cn("cursor-pointer", isDisabled && "opacity-50 cursor-not-allowed")}
                                        >
                                            <Check className={cn("mr-2 h-4 w-4", isSelected ? "opacity-100" : "opacity-0")} />
                                            {option.label}
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {maxSelections && (
                <div className="text-xs text-muted-foreground mt-1">
                    {selected.length}/{maxSelections} sélectionnés
                </div>
            )}
        </div>
    )
}