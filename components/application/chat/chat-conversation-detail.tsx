"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCurrentUser } from "@/stores/current-user"
import { useQuery } from "@apollo/client/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Loader2, Send, MessageSquare } from "lucide-react"
import { useState } from "react"
import { GET_CONVERSATIONS, GET_MESSAGES, GetConversationsResult, GetMessagesResult } from "@/graphql/conversations"

interface ChatConversationDetailProps {
  conversationId: string | null
}

export default function ChatConversationDetail({ conversationId }: ChatConversationDetailProps) {
  const { user } = useCurrentUser()
  const [messageInput, setMessageInput] = useState("")

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

  if (!conversationId) {
    return (
      <Card className="lg:col-span-2">
        <CardContent className="flex flex-col items-center justify-center py-20">
          <MessageSquare className="h-16 w-16 text-muted-foreground/50 mb-4" />
          <p className="text-muted-foreground">Sélectionnez une conversation pour commencer</p>
        </CardContent>
      </Card>
    )
  }

  const conversation = conversationsData?.conversationsQuery?.find((c) => c.id === conversationId)
  const otherParticipant = conversation?.participants.find((p) => p.user.id !== user?.myProfile.user_id)?.user
  const displayName = otherParticipant?.profile?.display_name || otherParticipant?.email || "Utilisateur"

  const messages = data?.messages.items || []

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    // TODO: Implement send message mutation
    console.log("[v0] Sending message:", messageInput)
    setMessageInput("")
  }

  return (
    <Card className="lg:col-span-2 flex flex-col h-[600px]">
      <CardHeader className="border-b">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            {otherParticipant?.profile?.avatar_url && (
              <AvatarImage src={otherParticipant.profile.avatar_url || "/placeholder.svg"} alt={displayName} />
            )}
            <AvatarFallback className="bg-primary text-primary-foreground">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{displayName}</h3>
            {otherParticipant?.email && <p className="text-xs text-muted-foreground">{otherParticipant.email}</p>}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">Erreur lors du chargement des messages</p>
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm text-muted-foreground">Aucun message dans cette conversation</p>
            <p className="text-xs text-muted-foreground mt-1">Envoyez le premier message pour commencer</p>
          </div>
        )}

        {!loading && messages.length > 0 && (
          <div className="space-y-4">
            {messages.map((message) => {
              const isCurrentUser = message.sender_id === user?.myProfile.user_id
              return (
                <div key={message.id} className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                  <div className={`flex gap-2 max-w-[70%] ${isCurrentUser ? "flex-row-reverse" : "flex-row"}`}>
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      {!isCurrentUser && otherParticipant?.profile?.avatar_url && (
                        <AvatarImage
                          src={otherParticipant.profile.avatar_url || "/placeholder.svg"}
                          alt={displayName}
                        />
                      )}
                      <AvatarFallback className={isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}>
                        {isCurrentUser
                          ? user?.myProfile.display_name?.charAt(0).toUpperCase() || "U"
                          : displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`flex flex-col ${isCurrentUser ? "items-end" : "items-start"}`}>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(message.created_at), {
                          addSuffix: true,
                          locale: fr,
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>

      <div className="border-t p-4">
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
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
