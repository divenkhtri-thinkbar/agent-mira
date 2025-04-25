import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight } from "lucide-react"

interface ChatInputProps {
  onSend: (message: string) => void
  placeholder?: string
  suggestions?: string[]
}

function ChatInput({ onSend, placeholder = "Type a message...", suggestions }: ChatInputProps) {
  const [value, setValue] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const handleSend = () => {
    if (value.trim()) {
      onSend(value)
      setValue("")
    }
  }

  return (
    <div className="relative">
      {suggestions && showSuggestions && value && (
        <div className="absolute bottom-full w-full bg-background border rounded-lg shadow-lg mb-2">
          {suggestions
            .filter((s) => s.toLowerCase().includes(value.toLowerCase()))
            .map((suggestion) => (
              <div
                key={suggestion}
                className="p-2 hover:bg-muted cursor-pointer text-sm"
                onClick={() => {
                  setValue(suggestion)
                  setShowSuggestions(false)
                }}
              >
                {suggestion}
              </div>
            ))}
        </div>
      )}
      <div className="flex gap-2 p-4 border rounded-full bg-background">
        <Input
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setShowSuggestions(true)
          }}
          placeholder={placeholder}
          className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend()
            }
          }}
        />
        <Button size="icon" className="rounded-full shrink-0" onClick={handleSend}>
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default ChatInput

