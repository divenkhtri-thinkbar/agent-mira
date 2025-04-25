import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { agent } from "@/assets/images";
import Step1Content from "@/features/VerifyingProperty";
import Step2Content from "@/features/PresentingComparable";
import Step3Content from "@/features/AnalyzingMarket";
import Step4Content from "@/features/PropertyCondition";
import ChatHeader from "./chat/chatHeader";
import { MessageType } from "./types/messageTypes";
import UserQueryMessage from "./userQuery/userQueryMessage";
import Step6Content from "@/features/RecommendedOffer";
import Step5Content from "@/features/PersonalizingOffer";

interface ChatContainerProps {
  currentStep: number;
  onNextStep: () => void;
  onChatProgress?: (
    stage:
      | "winning-offer"
      | "options"
      | "address-submitted"
      | "form-submitted"
      | "initial"
      | "review-offer"
      | "customize-offer"
      | "confirmation"
      | "quality-score"
      | "inside-scoop"
      | "repairs"
      | "in-person"
      | "first-impression"
      | "form"
  ) => void;
  address?: string;
  setAddress: (address: string) => void;
  selectedCardId: number | null;
  handleCardSelect: (id: number) => void;
  onMarketAnalysisOptionSelect?: (optionId: string) => void;
}

function ChatContainer({
  currentStep,
  onNextStep,
  onChatProgress,
  address,
  setAddress,
  selectedCardId,
  handleCardSelect,
  onMarketAnalysisOptionSelect,
}: ChatContainerProps) {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const agentAvatarUrl = agent;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([]);
  }, [currentStep]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  const addMessage = (message: MessageType) => {
    setMessages((prev) => [...prev, message]);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1Content
            messages={messages}
            addMessage={addMessage}
            agentAvatarUrl={agentAvatarUrl}
            onNextStep={onNextStep}
            onChatProgress={onChatProgress}
            address={address}
            setAddress={setAddress}
            selectedCardId={selectedCardId}
            handleCardSelect={handleCardSelect}
          />
        );
      case 2:
        return (
          <Step2Content
            messages={messages}
            addMessage={addMessage}
            agentAvatarUrl={agentAvatarUrl}
            onNextStep={onNextStep}
          />
        );
      case 3:
        return (
          <Step3Content
            messages={messages}
            addMessage={addMessage}
            agentAvatarUrl={agentAvatarUrl}
            onNextStep={onNextStep}
            onMarketAnalysisOptionSelect={onMarketAnalysisOptionSelect} // Pass callback
          />
        );
      case 4:
        return (
          <Step4Content
            messages={messages}
            addMessage={addMessage}
            agentAvatarUrl={agentAvatarUrl}
            onNextStep={onNextStep}
            onChatProgress={onChatProgress} // Pass the prop
          />
        );
      case 5:
        return (
          <Step5Content
            messages={messages}
            addMessage={addMessage}
            agentAvatarUrl={agentAvatarUrl}
            onNextStep={onNextStep}
            onChatProgress={onChatProgress}
          />
        );
      case 6:
        return (
          <Step6Content
            messages={messages}
            addMessage={addMessage}
            agentAvatarUrl={agentAvatarUrl}
            onChatProgress={onChatProgress} // Pass the prop
          />
        );
      default:
        return <div>Step {currentStep} content coming soon!</div>;
    }
  };

  const handleSendMessage = (message: string) => {
  };

  return (
    <div className="flex flex-col h-[100%] w-full mx-auto bg-white relative">
      {/* Chat Header */}
      <ChatHeader />

      {/* Scrollable Chat Content */}
      <ScrollArea className="flex-1 p-4 px-10 overflow-auto" ref={scrollRef}>
        <div className="space-y-4">{renderStepContent()}</div>
      </ScrollArea>

      {/* Fixed UserQueryMessage at the Bottom (constrained to ChatContainer width) */}
      <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200">
        <div className="mx-auto w-full">
          {/* <UserQueryMessage onSendMessage={handleSendMessage} /> */}
        </div>
      </div>
    </div>
  );
}

export default ChatContainer;
