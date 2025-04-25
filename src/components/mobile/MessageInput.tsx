// src/components/common/mobile/MessageInput.tsx
import React, { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import textData from "@/config/text.json";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/index";
import placeholder  from "../../assets/images/placeholder.png";
import UserProject from "../../assets/images/userProject.png"



interface Message {
  text: string;
  isUser: boolean; // true for user, false for agent
}

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (e: React.FormEvent) => void; 
}

const MessageInput: React.FC<MessageInputProps> = ({ value, onChange, onSubmit }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]); // Internal message state


  const{chat}=textData;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim()) return;

    // Add user message to internal state
    setMessages((prev) => [...prev, { text: value, isUser: true }]);
    onChange(""); 
    setIsChatOpen(true); // Open accordion

    // Simulate agent response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: chat.userResponse, isUser: false },
      ]);
    }, 1000);

    // Optionally notify parent (won’t affect accordion messages)
    if (onSubmit) onSubmit(e);
  };

  const handleClose = () => {
    setIsChatOpen(false); // Close accordion
  };

  return (
    <form onSubmit={handleFormSubmit} className="p-[16px] pt-0 w-full overflow-y-auto">
      <div className="bg-[#E3EEFF] rounded-br-[12px] rounded-bl-[12px] rounded-t-[12px]">
        <div className="justify-center align-center flex py-2">
          <ChevronDown color="#B8D4FF"
          onClick={handleClose} />
        </div>

        {/* Chat Messages Inside Accordion */}
        {isChatOpen && (
          <div className="px-4 pb-2 max-h-64 overflow-y-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isUser ? "justify-start flex-row-reverse" : "justify-start flex-row"}`}
              >
              <div>
              <Avatar className={`h-8 w-8 p-1 bg-white ${message.isUser? "rounded-r-full":"rounded-l-full"}`}>
              <AvatarImage src={`${message.isUser? UserProject: placeholder }`} alt="User" className="rounded-full"/>
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
              </div>
                <div
                  className={`max-w-[70%] p-2 rounded-lg h-auto break-words font-[Geologica] text-[12px] font-normal min-h-12 ${
                    message.isUser ? "bg-white text-right rounded-tr-none" : "rounded-tl-none bg-white text-left"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Input Area */}
        <div className="flex gap-2 items-center bg-white rounded-full shadow-[0px_0px_5px_0px_#797979] p-2 font-[Geologica] text-[12px] font-normal">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="flex-1 p- border-none rounded-lg text-sm focus:outline-none"
            placeholder="Have any questions you can ask us"
          />
          <ChevronRight
            strokeWidth={1.4}
            className="cursor-pointer"
            onClick={handleClose}
          />
        </div>
      </div>
    </form>
  );
};

export default MessageInput;