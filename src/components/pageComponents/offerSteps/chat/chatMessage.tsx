import { Avatar } from "@/components/ui/avatar";
import { MessageCircle, RotateCw, ChevronRight } from "lucide-react";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { agent } from "@/assets/images";
import { JSX, useEffect, useState } from "react";
import { MessageType } from "../types/messageTypes";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: MessageType & {
    avatarUrl?: string;
    content: string | JSX.Element;
    onReload?: () => void;
    isSelected?: boolean;
    selectedOptionId?: string | null | undefined;
    optionRefs?: React.RefObject<HTMLDivElement | null>[];
  };
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-gray-400 border-t-gray-600 rounded-full animate-spin"></div>
  </div>
);

const MessageAvatar = ({
  avatarUrl,
  showAvatar,
}: {
  avatarUrl?: string;
  showAvatar?: boolean;
}) => (
  <>
    {showAvatar && (
      <Avatar className="w-12 h-12 p-1 bg-[#ECECEC] rounded-r-none">
        <AvatarImage
          src={avatarUrl || agent}
          alt="Agent Mira"
          className="rounded-full"
        />
        <AvatarFallback>
          <MessageCircle className="w-4 h-4" />
        </AvatarFallback>
      </Avatar>
    )}
  </>
);

const MessageContainer = ({
  children,
  showAvatar,
  isSelected,
  variant,
}: {
  children: React.ReactNode;
  showAvatar?: boolean;
  isSelected?: boolean;
  variant?: string;
}) => (
  <div
    className={cn(
      "rounded-xs p-3 pb-4 max-w-3xl w-full",
      variant === "market-analysis"
        ? "bg-[#B8D4FF]"
        : isSelected
        ? "bg-[#B8D4FF]"
        : "bg-[#ECECEC]",
      showAvatar ? "rounded-tl-none" : "ml-12"
    )}
  >
    {children}
  </div>
);

function ChatMessage({ message }: ChatMessageProps) {
  const [arrowTop, setArrowTop] = useState<number>(0);
  const isAgentMessage = [
    "agent",
    "address-input",
    "winning-offer",
    "options",
    "form",
    "confirmation",
    "filter-properties",
    "market-insights",
    "market-analysis",
  ].includes(message.type);

  useEffect(() => {
    if (
      message.type === "market-analysis" &&
      message.selectedOptionId &&
      message.optionRefs
    ) {
      const selectedIndex = parseInt(message.selectedOptionId) - 1;
      const selectedRef = message.optionRefs[selectedIndex];
      if (selectedRef?.current) {
        const offsetTop = selectedRef.current.offsetTop;
        setArrowTop(offsetTop + selectedRef.current.offsetHeight / 2 - 20);
      }
    }
  }, [message.selectedOptionId, message.optionRefs, message.type]);

  if (isAgentMessage) {
    if (message.type === "market-analysis") {
      return (
        <div className="flex items-start gap-0 relative pr-7 w-full max-w-3xl mx-auto">
          <MessageAvatar
            avatarUrl={message.avatarUrl}
            showAvatar={message.showAvatar}
          />
          <div className="flex items-start relative w-full">
            <MessageContainer
              showAvatar={message.showAvatar}
              isSelected={message.isSelected}
              variant="market-analysis"
            >
              <div className="agentChat pb-1 w-full">{message.content}</div>
            </MessageContainer>
            {message.selectedOptionId && (
              <div
                className="absolute -right-6 bg-[#B8D4FF] rounded-r-full pr-2 h-14 flex items-center justify-center"
                style={{ top: `${arrowTop}px` }}
              >
                <ChevronRight className="w-6 h-6 text-[#0C0C0C]" />
              </div>
            )}
          </div>
        </div>
      );
    }

    // Submitted User Option

    return (
      <div className="flex items-start gap-0 relative pr-7 w-full max-w-3xl mx-auto">
        <MessageAvatar
          avatarUrl={message.avatarUrl}
          showAvatar={message.showAvatar}
        />
        <div className="flex items-start relative w-full">
          <MessageContainer
            showAvatar={message.showAvatar}
            isSelected={message.isSelected}
          >
            <div className=" agentChat pb-1 w-full">{message.content}</div>
          </MessageContainer>
          {message.isSelected && (
            <div className="absolute top-0 -right-7 bg-[#B8D4FF] rounded-r-full p-1.5 flex items-center justify-center cursor-pointer">
              <div className="bg-[#1354B6] p-2 rounded-full">
                <RotateCw className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (message.type === "loading") {
    return (
      <div className="flex items-start gap-0 w-full max-w-3xl mx-auto">
        <MessageAvatar
          avatarUrl={message.avatarUrl}
          showAvatar={message.showAvatar}
        />
        <MessageContainer showAvatar={message.showAvatar}>
          <LoadingSpinner />
        </MessageContainer>
      </div>
    );
  }

  return null;
}

export default ChatMessage;
