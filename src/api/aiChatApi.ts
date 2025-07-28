import type { MessageData, ChatResponse } from "@/lib/types";
import { CHAT_URL } from "@/lib/urls";

export const postChatMessage = async (message: MessageData, conversationId: string | null): Promise<ChatResponse> => {
  const postBody = {
    message: message.content,
    conversation_id: conversationId,
    images_urls: message.imagesUrls
  };
 
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    body: JSON.stringify(postBody),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data: ChatResponse = await resp.json();
  return data;
};

export const postChatMessages = async (messages: MessageData[]): Promise<MessageData[]> => {
  const resp = await fetch(CHAT_URL, {
    method: "POST",
    body: JSON.stringify(messages),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const newMessage: MessageData[] = await resp.json();
  return newMessage;
};
