import { gql } from "@apollo/client"

export type GetConversationsResult = {
    conversationsQuery:
        |   {
                id: string
                last_message: {
                    content: string
                    sender_id: string
                    created_at: string
                }
                participants: {
                    user: {
                        id: string
                        email: string
                        profile: {
                            avatar_url: string | null
                            display_name: string | null
                        }
                    }
                }[]
            }[]
        | null
}

export const GET_CONVERSATIONS = gql`
    query GetConversations {
        conversationsQuery {
            id
            last_message {
                content
                sender_id
                created_at
            }
            participants {
                user {
                    id
                    email
                    profile {
                        avatar_url
                        display_name
                    }
                }
            }
        }
    }
`

export type Message = {
    id: string
    content: string
    sender_id: string
    conversation_id: string
    created_at: string
    updated_at: string
    is_read: boolean
    reply_to_id: string | null
    type: string
}

export type GetMessagesResult = {
    messages: {
        items: Message[]
        nextCursor: string | null
    }
}

export const GET_MESSAGES = gql`
    query GetMessages($conversation_id: String!, $cursor: String, $limit: Float) {
        messages(conversation_id: $conversation_id, cursor: $cursor, limit: $limit) {
            items {
                id
                content
                sender_id
                conversation_id
                created_at
                updated_at
                is_read
                reply_to_id
                type
            }
            nextCursor
        }
    }
`

export type SendMessageResult = {
    sendMessage: Message
}

export const SEND_MESSAGE = gql`
    mutation SendMessage($content: String!, $conversation_id: String!) {
        sendMessage(content: $content, conversation_id: $conversation_id) {
            id
            content
            sender_id
            conversation_id
            created_at
            updated_at
            is_read
            reply_to_id
            type
        }
    }
`;

export type MessageAddedResult = {
    messageAdded: Message
}

export const MESSAGE_ADDED_SUBSCRIPTION = gql`
    subscription MessageAdded($conversation_id: String!) {
        messageAdded(conversation_id: $conversation_id) {
            id
            content
            sender_id
            conversation_id
            created_at
            updated_at
            is_read
            reply_to_id
            type
        }
    }
`;