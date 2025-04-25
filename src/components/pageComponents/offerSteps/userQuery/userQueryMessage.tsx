import {
  ChevronRight,
  ChevronUp,
  ChevronDown,
  MessageCircle,
} from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { agent, User } from "@/assets/images";

interface Message {
  text: string;
  isUser: boolean;
}

interface UserQueryMessageProps {
  onSendMessage: (message: string) => void;
  initialMessage?: string;
}

const UserQueryMessage: React.FC<UserQueryMessageProps> = ({
  onSendMessage,
  initialMessage = "",
}) => {
  const [message, setMessage] = useState<string>(initialMessage);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatInitialized, setIsChatInitialized] = useState<boolean>(false);
  const [isChatExpanded, setIsChatExpanded] = useState<boolean>(true);
  const chatBodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle message input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  // Handle sending message
  const handleSend = () => {
    if (message.trim()) {
      const userMessage: Message = { text: message, isUser: true };
      setMessages((prevMessages) => [...prevMessages, userMessage]);
      if (!isChatInitialized) {
        setIsChatInitialized(true);
        setIsChatExpanded(true);
      }

      setTimeout(() => {
        const agentResponse: Message = {
          text: "An illogical or surprising lack of compatibility or similarity between two or more facts.",
          isUser: false,
        };
        setMessages((prevMessages) => [...prevMessages, agentResponse]);
      }, 500);

      onSendMessage(message);
      setMessage("");
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Toggle chat accordion
  const toggleChatAccordion = () => {
    setIsChatExpanded((prev) => !prev);
  };

  // Dynamic background color based on message presence for input
  const inputBackgroundColor = message.trim() ? "#B8D4FF" : "white";

  // Auto-scroll chat body to the latest message when expanded
  useEffect(() => {
    if (isChatExpanded && isChatInitialized && chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [messages, isChatExpanded, isChatInitialized]);

  return (
    <div
      className={`flex flex-col w-full pb-5 duration-500 ease-in-out transition-[box-shadow,background-color] ${
        isChatInitialized && isChatExpanded
          ? "bg-[#B8D4FF] shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1),0_-2px_4px_-1px_rgba(0,0,0,0.06)]"
          : "bg-transparent shadow-none"
      }`}
    >
      <div className="relative mb-4 px-14">
        {/* Chat body with accordion functionality */}
        {isChatInitialized && (
          <div className="relative">
            <button
              onClick={toggleChatAccordion}
              className="absolute top-4 left-1/2 -translate-x-1/2 -translate-y-full px-5 py-0.5 bg-[#B8D4FF] rounded-full z-10 cursor-pointer hover:bg-[#A0C1FF] transition-colors shadow-[2px_2px_2px_0px_rgba(0,0,0,0.15)]"
              aria-label="Toggle chat expansion"
            >
              {isChatExpanded ? (
                <ChevronUp className="w-5 h-5 text-[#1354B6]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-[#1354B6]" />
              )}
            </button>
            <div
              ref={chatBodyRef}
              className={`
                rounded-lg overflow-y-auto transition-all duration-500 ease-in-out chat-body
                ${isChatExpanded ? "max-h-[400px] p-4" : "max-h-0 p-0"}
                ${isChatExpanded ? "overflow-auto" : "overflow-hidden"}
              `}
            >
              <div className="min-h-0">
                {messages.map((msg, index) => (
                  <div key={index} className="mb-2">
                    {msg.isUser ? (
                      <div className="flex flex-row-reverse items-start gap-0">
                        <Avatar className="w-10 h-10 p-1 flex items-center justify-center bg-white rounded-full rounded-l-none">
                          <AvatarImage
                            src={User}
                            alt="User"
                            className="rounded-full"
                          />
                          <AvatarFallback>
                            <MessageCircle className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white rounded-sm p-3 rounded-tr-none text-wrap">
                          {msg.text}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-0">
                        <Avatar className="w-10 h-10 p-1 flex items-center justify-center bg-white rounded-full rounded-r-none">
                          <AvatarImage
                            src={agent}
                            alt="Agent Mira"
                            className="rounded-full"
                          />
                          <AvatarFallback>
                            <MessageCircle className="w-4 h-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="bg-white rounded-sm p-3 rounded-tl-none text-wrap">
                          {msg.text}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input field */}
      <div className="flex justify-center px-14">
        <div className="flex items-center w-full max-w-3xl border rounded-full px-3 py-2 bg-white">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Have any questions you can ask us"
            className={`flex-1 p-2 rounded-md focus:outline-none transition-colors ${inputBackgroundColor} placeholder:font-[Geologica] placeholder:font-medium placeholder:text-[14px] placeholder:leading-[15px] placeholder:tracking-[0]`}
            aria-label="Message input"
          />
          <button
            onClick={handleSend}
            className="text-black p-2 rounded-r-md cursor-pointer"
            aria-label="Send message"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserQueryMessage;