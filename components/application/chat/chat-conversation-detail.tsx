"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/stores/current-user"
import { useMutation, useQuery, useSubscription } from "@apollo/client/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2, Send, MessageSquare } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import {
    GET_CONVERSATIONS,
    GET_MESSAGES,
    SEND_MESSAGE,
    MESSAGE_ADDED_SUBSCRIPTION,
    type GetConversationsResult,
    type GetMessagesResult,
    type SendMessageResult,
    type MessageAddedResult,
} from "@/graphql/conversations"

interface ChatConversationDetailProps {
    conversationId: string | null
    onBack?: () => void
}

const shouldGroupMessages = (currentMsg: any, previousMsg: any, currentUserId: string | undefined): boolean => {
    if (!previousMsg || !currentMsg) return false

    if (currentMsg.sender_id !== previousMsg.sender_id) return false

    const timeDiff = new Date(currentMsg.created_at).getTime() - new Date(previousMsg.created_at).getTime()
    return timeDiff < 60000
}

export default function ChatConversationDetail({ conversationId, onBack }: ChatConversationDetailProps) {
    const { user } = useCurrentUser()
    const [messageInput, setMessageInput] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const { data: conversationsData } = useQuery<GetConversationsResult>(GET_CONVERSATIONS, {
        fetchPolicy: "cache-first",
    })

    const { data, loading, error } = useQuery<GetMessagesResult>(GET_MESSAGES, {
        variables: {
            conversation_id: conversationId,
            limit: 50,
        },
        skip: !conversationId,
        fetchPolicy: "network-only",
        errorPolicy: "all",
    })

    const [sendMessage, { loading: sendingMessage }] = useMutation<SendMessageResult>(SEND_MESSAGE, {
        refetchQueries: [
            {
                query: GET_MESSAGES,
                variables: {
                    conversation_id: conversationId,
                    limit: 50,
                },
            },
            {
                query: GET_CONVERSATIONS,
            },
        ],
        onError: (error) => {
            console.error("Error sending message:", error)
        },
    })

    const { data: subscriptionData, error: subscriptionError } = useSubscription<MessageAddedResult>(
        MESSAGE_ADDED_SUBSCRIPTION,
        {
            variables: { conversation_id: conversationId },
            skip: !conversationId,
            onData: ({ data }) => {
                console.log("New message received:", data.data?.messageAdded)
            },
            onError: (error) => {
                console.error("Subscription error:", error)
            },
            shouldResubscribe: true,
        },
    )

    useEffect(() => {
        if (subscriptionError) {
            console.error("Subscription connection error:", subscriptionError)
        }
    }, [subscriptionError])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [data?.messages.items])

    if (!conversationId) {
        return (
            <div className="flex flex-col items-center justify-center h-full py-20 px-6">
                <div className="h-20 w-20 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-10 w-10 text-primary/50" />
                </div>
                <p className="text-sm font-medium text-center">Sélectionnez une conversation</p>
                <p className="text-xs text-muted-foreground text-center mt-1">
                    Choisissez une conversation pour commencer à discuter
                </p>
            </div>
        )
    }

    const conversation = conversationsData?.conversationsQuery?.find((c) => c.id === conversationId)
    const otherParticipant = conversation?.participants.find((p) => p.user.id !== user?.myProfile.user_id)?.user
    const displayName = otherParticipant?.profile?.display_name || otherParticipant?.email || "Utilisateur"

    const messages = data?.messages.items || []

    const handleSendMessage = async () => {
        if (!messageInput.trim() || !conversationId) return

        try {
            await sendMessage({
                variables: {
                content: messageInput.trim(),
                conversation_id: conversationId,
                },
            })
            setMessageInput("")
        } catch (error) {
            console.error("Failed to send message:", error)
        }
    }

    return (
        <div className="flex flex-col h-full overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3 border-b shrink-0">
                {onBack && (
                    <Button variant="ghost" size="icon" onClick={onBack} className="h-9 w-9 shrink-0 hover:bg-background">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="m15 18-6-6 6-6" />
                        </svg>
                    </Button>
                )}
                <Avatar className="h-10 w-10 border-2 border-background shadow-sm">
                    {otherParticipant?.profile?.avatar_url && (
                        <AvatarImage src={otherParticipant.profile.avatar_url || "/placeholder.svg"} alt={displayName} />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                        {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{displayName}</h3>
                    {otherParticipant?.email && (
                        <p className="text-xs text-muted-foreground truncate">{otherParticipant.email}</p>
                    )}
                </div>
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4">
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                )}

                {error && (
                    <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-4">
                        <p className="text-sm text-destructive">Erreur lors du chargement des messages</p>
                    </div>
                )}

                {!loading && !error && messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                            <MessageSquare className="h-8 w-8 text-muted-foreground/50" />
                        </div>
                        <p className="text-sm font-medium">Aucun message</p>
                        <p className="text-xs text-muted-foreground mt-1">Envoyez le premier message</p>
                    </div>
                )}

                {!loading && messages.length > 0 && (
                    <div className="space-y-1">
                        {messages.map((message, index) => {
                            const isCurrentUser = message.sender_id === user?.myProfile.user_id
                            const previousMessage = index > 0 ? messages[index - 1] : null
                            const isGrouped = shouldGroupMessages(message, previousMessage, user?.myProfile.user_id)
                            const nextMessage = index < messages.length - 1 ? messages[index + 1] : null
                            const isLastInGroup = !shouldGroupMessages(nextMessage, message, user?.myProfile.user_id)

                            return (
                                <div
                                    key={message.id}
                                    className={cn("flex", isCurrentUser ? "justify-end" : "justify-start", isGrouped ? "mt-0.5" : "mt-4")}
                                >
                                    <div className={cn("flex gap-2 max-w-[85%]", isCurrentUser ? "flex-row-reverse" : "flex-row")}>
                                        {!isCurrentUser && (
                                            <Avatar
                                                className={cn(
                                                    "h-7 w-7 flex-shrink-0 border border-background shadow-sm",
                                                    isGrouped ? "invisible" : "visible",
                                                )}
                                            >
                                                {otherParticipant?.profile?.avatar_url && (
                                                    <AvatarImage
                                                        src={otherParticipant.profile.avatar_url || "/placeholder.svg"}
                                                        alt={displayName}
                                                    />
                                                )}
                                                <AvatarFallback className="bg-muted text-xs">
                                                    {displayName.charAt(0).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
                                        <div className={cn("flex flex-col", isCurrentUser ? "items-end" : "items-start")}>
                                            <div
                                                className={cn(
                                                "rounded-2xl px-4 py-2.5 shadow-sm",
                                                isCurrentUser
                                                    ? "bg-primary text-primary-foreground rounded-br-md"
                                                    : "bg-muted rounded-bl-md",
                                                )}
                                            >
                                                <p className="text-sm leading-relaxed">{message.content}</p>
                                            </div>
                                            {isLastInGroup && (
                                                <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                                    {formatDistanceToNow(new Date(message.created_at), {
                                                        addSuffix: true,
                                                        locale: fr,
                                                    })}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <div className="border-t p-4 shrink-0 bg-background">
                <div className="flex gap-2">
                    <Input
                        placeholder="Écrivez votre message..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault()
                                handleSendMessage()
                            }
                        }}
                        disabled={sendingMessage}
                        className="rounded-full border-muted-foreground/20 focus-visible:ring-primary"
                    />
                    <Button
                        onClick={handleSendMessage}
                        size="icon"
                        disabled={sendingMessage || !messageInput.trim()}
                        className="rounded-full h-10 w-10 shrink-0 shadow-sm"
                    >
                        {sendingMessage ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    )
}
