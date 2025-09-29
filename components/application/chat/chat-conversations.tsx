"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const { user } = useCurrentUser()
  const { data, loading, error } = useQuery<GetConversationsResult>(GET_CONVERSATIONS, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  })

  const conversations = data?.conversationsQuery

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Conversations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        )}

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="text-sm text-destructive">Erreur lors du chargement des conversations</p>
          </div>
        )}

        {!loading && !error && (!conversations || conversations.length === 0) && (
          <div className="text-center py-10 px-6 bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30">
            <div className="flex flex-col items-center space-y-4">
              <MessageSquare className="size-8 text-muted-foreground/50 mb-3" />
              <p className="text-sm text-muted-foreground">Aucune conversation</p>
            </div>
          </div>
        )}

        {!loading && conversations && conversations.length > 0 && (
          <div className="space-y-3">
            {conversations.map((conversation) => {
              const otherParticipant = conversation.participants.find(
                (p) => p.user.id !== user?.myProfile.user_id,
              )?.user

              const displayName = otherParticipant?.profile?.display_name || otherParticipant?.email || "Utilisateur"

              const isSelected = selectedConversationId === conversation.id

              return (
                <div
                  key={conversation.id}
                  onClick={() => onSelectConversation?.(conversation.id)}
                  className={`flex items-start gap-3 rounded-lg border p-3 hover:bg-accent/50 transition-colors cursor-pointer ${
                    isSelected ? "bg-accent border-primary" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10">
                    {otherParticipant?.profile?.avatar_url && (
                      <AvatarImage src={otherParticipant.profile.avatar_url || "/placeholder.svg"} alt={displayName} />
                    )}
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{displayName}</p>
                      {conversation.last_message?.created_at && (
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {formatDistanceToNow(new Date(conversation.last_message.created_at), {
                            addSuffix: true,
                            locale: fr,
                          })}
                        </span>
                      )}
                    </div>
                    {conversation.last_message?.content && (
                      <p className="text-sm text-muted-foreground truncate">{conversation.last_message.content}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
