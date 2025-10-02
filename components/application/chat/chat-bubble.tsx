"use client"

import { useState } from "react"
import { MessageCircle, X, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import ChatLayout from "./chat-layout"
import { cn } from "@/lib/utils"

export default function ChatBubble() {
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)

    return (
        <>
            {!isOpen && (
                <div className="fixed bottom-6 right-6 z-50">
                    <Button
                        onClick={() => setIsOpen(true)}
                        className={cn(
                            "relative h-16 w-16 rounded-full shadow-2xl transition-all duration-300",
                            "hover:scale-110 hover:shadow-primary/50",
                            "animate-in fade-in slide-in-from-bottom-4",
                        )}
                        size="icon"
                    >
                        <MessageCircle className="h-7 w-7" />
                    </Button>
                </div>
            )}

            {isOpen && (
                <div
                    className={cn(
                        "fixed bottom-6 right-6 z-50",
                        "w-[calc(100vw-3rem)] max-w-[420px] md:w-[420px]",
                        "animate-in fade-in slide-in-from-bottom-8 duration-300",
                    )}
                >
                    <div
                        className={cn(
                            "bg-background rounded-2xl shadow-2xl border overflow-hidden",
                            "flex flex-col transition-all duration-300",
                            isMinimized ? "h-16" : "h-[600px] max-h-[calc(100vh-6rem)]",
                        )}
                    >
                        <div className="flex items-center justify-between px-5 py-4 border-b shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center shadow-lg">
                                    <MessageCircle className="h-5 w-5 text-primary-foreground" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-base">Messages</h3>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsMinimized(!isMinimized)}
                                    className="h-9 w-9 hover:bg-primary/10"
                                >
                                    <Minimize2 className="h-4 w-4" />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="h-9 w-9 hover:bg-destructive/10 hover:text-destructive"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {!isMinimized && (
                            <div className="flex-1 min-h-0 overflow-hidden">
                                <ChatLayout />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
