import type { MessageData } from "@/lib/types"
import { CHAT_URL } from "@/lib/urls"

export const postChatMessage = async (message: MessageData): Promise<MessageData> => {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    body: JSON.stringify(message)
  })
  const newMessage: MessageData = await resp.json()
  return newMessage
}

export const postChatMessages = async (messages: MessageData[]): Promise<MessageData> => {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    body: JSON.stringify(messages),
    headers: {
      "Content-Type": "application/json"
    }
  })
  const newMessage: MessageData = await resp.json()
  return newMessage
}
