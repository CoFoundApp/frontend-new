"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GET_CONVERSATIONS, type GetConversationsResult } from "@/graphql/conversations"
import { useCurrentUser } from "@/stores/current-user"
import { useQuery } from "@apollo/client/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2, MessageSquare } from "lucide-react"

interface ChatConversationsProps {
    onSelectConversation?: (conversationId: string) => void
    selectedConversationId?: string | null
}

export default function ChatConversations({ onSelectConversation, selectedConversationId }: ChatConversationsProps) {
    const { user } = useCurrentUser();
    const { data, loading, error } = useQuery<GetConversationsResult>(GET_CONVERSATIONS, {
        fetchPolicy: "network-only",
        errorPolicy: "all",
    });

    const conversations = data?.conversationsQuery;

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="px-5 py-4 border-b shrink-0">
                <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Conversations</h3>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-3 py-2">
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {error && (
                    <div className="mx-2 mt-2 rounded-xl border border-destructive/50 bg-destructive/10 p-4">
                        <p className="text-sm text-destructive">Erreur lors du chargement</p>
                    </div>
                )}

                {!loading && !error && (!conversations || conversations.length === 0) && (
                    <div className="flex flex-col items-center justify-center py-12 px-4">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-medium text-center">Aucune conversation</p>
                        <p className="text-xs text-muted-foreground text-center mt-1">Vos conversations apparaîtront ici</p>
                    </div>
                )}

                {!loading && conversations && conversations.length > 0 && (
                    <div className="space-y-1">
                        {conversations.map((conversation) => {
                            const otherParticipant = conversation.participants.find(
                                (p) => p.user.id !== user?.myProfile.user_id,
                            )?.user

                            const displayName = otherParticipant?.profile?.display_name || otherParticipant?.email || "Utilisateur"
                            const isSelected = selectedConversationId === conversation.id

                            return (
                                <button
                                    key={conversation.id}
                                    onClick={() => onSelectConversation?.(conversation.id)}
                                    className={cn(
                                        "w-full flex items-start gap-3 rounded-xl p-3 transition-all duration-200",
                                        "hover:bg-accent/50 active:scale-[0.98]",
                                        isSelected && "bg-primary/10 hover:bg-primary/15",
                                    )}
                                >
                                    <div className="relative">
                                        <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                                            {otherParticipant?.profile?.avatar_url && (
                                                <AvatarImage
                                                    src={otherParticipant.profile.avatar_url || "/placeholder.svg"}
                                                    alt={displayName}
                                                />
                                            )}
                                            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                                                {displayName.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background" />
                                    </div>

                                    <div className="flex-1 min-w-0 text-left">
                                        <div className="flex items-center justify-between gap-2 mb-1">
                                            <p className="font-semibold text-sm truncate">{displayName}</p>
                                            {conversation.last_message?.created_at && (
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {formatDistanceToNow(new Date(conversation.last_message.created_at), {
                                                        addSuffix: false,
                                                        locale: fr,
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between gap-2">
                                            {conversation.last_message?.content && (
                                                <p className="text-xs text-muted-foreground truncate flex-1">
                                                {conversation.last_message.content}
                                                </p>
                                            )}
                                            <span className="h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center shrink-0">
                                                2
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}
