import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { chat } from "@/config/text.json";


function MessageInput({ onSend }: { onSend: (message: string) => void }) {
  return (
    <div className="border-t p-4 flex gap-2">
      <Input
        placeholder={chat.placeholder}
        className="flex-1"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onSend(e.currentTarget.value)
            e.currentTarget.value = ""
          }
        }}
      />
      <Button size="icon">
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default MessageInput