import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";
import { postChatMessages } from "@/api/aiChatApi";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { MessageData } from "@/lib/types";

const AiAdminPage = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef(null);
  const [input, setInput] = useState("")

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setInput(value)
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const userMessage: MessageData = {
      role: "user",
      content: input
    }
    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setInput("")
    const assistantMessage = await postChatMessages([...messages, userMessage])
    setMessages((prev) => [...prev, assistantMessage])
    setIsLoading(false)
  }

  return (
    <section className="min-h-screen p-4">
      <section className="max-w-5xl mx-auto">
        <Card className="h-[80vh] flex flex-col shadow-xl">
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

                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user" ? "bg-blue-600 text-white" : "bg-white border shadow-sm"
                        }`}
                      >
                        <span key={`${message.id}`}>{message.content}</span>
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
            
            <div className="border-t bg-white/50 backdrop-blur-sm p-4">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Type your message here..."
                  disabled={isLoading}
                  className="flex-1"
                  autoFocus
                />
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
