"use client";

import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { Badge } from "./badge";
import { Input } from "./input";
import { X } from "lucide-react";

interface TagInputProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    placeholder?: string;
    className?: string;
    maxTags?: number;
    allowDuplicates?: boolean;
}

export function TagInput({
    tags,
    onTagsChange,
    placeholder = "Tapez et appuyez sur Entrée pour ajouter un tag...",
    className,
    maxTags,
    allowDuplicates = false,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const addTag = (tag: string) => {
        const trimmedTag = tag.trim();
        if (!trimmedTag) return;

        if (!allowDuplicates && tags.includes(trimmedTag)) return;

        if (maxTags && tags.length >= maxTags) return;

        onTagsChange([...tags, trimmedTag]);
        setInputValue("");
    }

    const removeTag = (indexToRemove: number) => {
        onTagsChange(tags.filter((_, index) => index !== indexToRemove));
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
            removeTag(tags.length - 1);
        }
    }

    const handleInputClick = () => {
        inputRef.current?.focus();
    }

    return (
        <div
            className={cn(
                "flex min-h-10 w-full flex-wrap items-center gap-2 rounded-md border border-input bg-background px-2 text-base ring-offset-background placeholder:text-muted-foreground focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                className,
            )}
            onClick={handleInputClick}
        >
            {tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="gap-1 pr-1 text-xs">
                    <span>{tag}</span>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation()
                            removeTag(index)
                        }}
                        className="ml-1 rounded-full hover:bg-muted-foreground/20"
                    >
                        <X className="h-3 w-3" />
                    </button>
                </Badge>
            ))}
            <Input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={tags.length === 0 ? placeholder : ""}
                className="flex-1 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0"
                disabled={maxTags ? tags.length >= maxTags : false}
            />
        </div>
    )
}