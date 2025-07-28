import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { postChatMessage } from "@/api/aiChatApi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MessageData, TempImage, TempImageData } from "@/lib/types";
import TempImagesPreview from "@/components/ImagePreviewContainer";
import { postImages } from "@/api/imagesApi";

const AiAdminPage = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollAreaRef = useRef(null);
  const [input, setInput] = useState("");
  const [tempImages, setTempImages] = useState<TempImage[]>([]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const userMessage: MessageData = {
      role: "user",
      content: input,
      id: uuidv4(),
    };
    if (tempImages.length > 0) {
      console.log("Enter here")
      userMessage.imagesUrls = tempImages.map((ti) => ti.url)
    }
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setInput("");
    setTempImages([])
    const chatResponse = await postChatMessage(userMessage, conversationId);
    if (!conversationId) {
      setConversationId(chatResponse.conversation_id);
    }
    const newMessage = chatResponse.messages[0].content;
    const assistantMessage: MessageData = {
      role: "assistant",
      content: newMessage,
      id: uuidv4(),
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    try {
      const base64Images = await Promise.all(
        files.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = () => reject(new Error("Failed to read file"));
              reader.readAsDataURL(file);
            })
        )
      );

      const postData: TempImageData[] = base64Images.map((bi) => (
        {base64_data: bi}
      ))
      const newImageUrls = await postImages(postData);

      setTempImages((prev) => [...prev, ...newImageUrls]);
    } catch (err) {
      console.error("Bulk image upload failed", err);
    }

    e.target.value = "";
  };

  return (
    <section className="min-h-screen p-4">
      <section className="max-w-5xl mx-auto">
        <Card className="h-[80vh] flex flex-col shadow-xl overflow-y-auto">
          <CardHeader className="border-b bg-white/50 backdrop-blur-sm">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Bot className="h-8 w-8 text-blue-600" />
              AI Admin Agent
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Chat with your AI assistant. Ask questions, get help, or just have a conversation!
            </p>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <Bot className="h-16 w-16 text-blue-600 opacity-50" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Welcome to AI Chat!</h3>
                    <p className="text-sm text-gray-500 mt-2">Start a conversation by typing a message below.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 bg-blue-600">
                          <AvatarFallback>
                            <Bot className="h-4 w-4 text-black" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      {/* Images Row */}
                      {message.imagesUrls && message.imagesUrls?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-2">
                          {message.imagesUrls.map((imgUrl: string, index: number) => (
                            <div key={index} className="rounded-md overflow-hidden border w-24 h-24">
                              <img
                                src={imgUrl}
                                alt={`image-${index}`}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"
                        }`}
                      >
                        <span key={`${message.id}`}>
                          {message.content.split("\n").map((line, index) => (
                            <span key={index}>
                              {line}
                              {index < message.content.split("\n").length - 1 && <br />}
                            </span>
                          ))}
                        </span>
                      </div>

                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 bg-gray-600">
                          <AvatarFallback>
                            <User className="h-4 w-4 text-black" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="h-8 w-8 bg-blue-600">
                        <AvatarFallback>
                          <Bot className="h-4 w-4 text-black" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-white border shadow-sm rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2 text-gray-500">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>

            {tempImages && <TempImagesPreview tempImages={tempImages} onRemove={() => {}} />}

            <div className="border-t bg-white/50 backdrop-blur-sm p-4">
              <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message here..."
                  disabled={isLoading}
                  className="flex-1"
                  autoFocus
                />

                {/* Image Upload Button */}
                <label className="relative cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={isLoading}
                  />
                  <Button type="button" variant="outline" className="px-2 py-1 h-10" disabled={isLoading}>
                    📷
                  </Button>
                </label>

                <Button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2 text-center">Press Enter to send your message</p>
            </div>
          </CardContent>
        </Card>
      </section>
    </section>
  );
};

export default AiAdminPage;
