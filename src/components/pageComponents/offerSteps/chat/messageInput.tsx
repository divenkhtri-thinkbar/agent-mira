import { SendHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function MessageInput({ onSend }: { onSend: (message: string) => void }) {
  return (
    <div className="border-t p-4 flex gap-2">
      <Input
        placeholder="Have any questions you can ask us"
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