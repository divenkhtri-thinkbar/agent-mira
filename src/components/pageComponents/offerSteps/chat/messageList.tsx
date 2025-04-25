import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  id: string
  content: string
  sender: "agent" | "user"
  timestamp?: string
}

function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      {messages.map((message) => (
        <div key={message.id} className="flex items-start gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src={message.sender === "agent" ? "/agent-avatar.png" : "/user-avatar.png"} />
            <AvatarFallback>{message.sender === "agent" ? "A" : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <div className="bg-muted rounded-lg p-3 max-w-[80%]">
              <p className="text-sm">{message.content}</p>
            </div>
            {message.timestamp && <span className="text-xs text-muted-foreground">{message.timestamp}</span>}
          </div>
        </div>
      ))}
    </div>
  )
}

export default MessageList