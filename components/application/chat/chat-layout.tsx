"use client";

import { useState } from "react";
import ChatConversations from "./chat-conversations";
import ChatConversationDetail from "./chat-conversation-detail";

export default function ChatLayout() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChatConversations
                onSelectConversation={setSelectedConversationId}
                selectedConversationId={selectedConversationId}
            />
            <ChatConversationDetail conversationId={selectedConversationId} />
        </div>
    );
}