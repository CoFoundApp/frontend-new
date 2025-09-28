"use client";

import { Button } from "@/components/ui/button";
import { Card, CardTitle } from "@/components/ui/card";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export default function ChatBubble() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <Card className="w-80 sm:w-96 shadow-lg flex flex-col h-96 overflow-hidden p-0">
                    <div className="bg-primary text-primary-foreground flex p-4 items-center justify-between">
                        <CardTitle>Messagerie</CardTitle>
                        <Button variant="ghost" size="icon" onClick={toggleChat} className="size-8 text-primary-foreground">
                            <X className="size-4"/>
                            <span className="sr-only">Fermer</span>
                        </Button>
                    </div>
                </Card>
            ) : (
                <Button size="icon" onClick={toggleChat} className="size-14 rounded-full shadow-lg">
                    <MessageCircle className="size-6" />
                    <span className="sr-only">Ouvrir le chat</span>
                </Button>
            )}
        </div>
    )
}