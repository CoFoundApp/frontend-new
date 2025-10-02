"use client"

import { useState } from "react"
import ChatConversations from "./chat-conversations"
import ChatConversationDetail from "./chat-conversation-detail"

export default function ChatLayout() {
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            {!selectedConversationId ? (
                <ChatConversations
                    onSelectConversation={setSelectedConversationId}
                    selectedConversationId={selectedConversationId}
                />
            ) : (
                <ChatConversationDetail
                    conversationId={selectedConversationId}
                    onBack={() => setSelectedConversationId(null)}
                />
            )}
        </div>
    )
}
