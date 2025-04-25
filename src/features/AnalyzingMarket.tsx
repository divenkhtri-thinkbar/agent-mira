import { useEffect, useRef, useState, createRef } from "react";
import {
  ChatMessage,
  WinningOfferQuestion,
} from "@/components/pageComponents/offerSteps";
import NextStep from "@/components/pageComponents/offerSteps/nextStep";
import { MessageType } from "@/components/pageComponents/offerSteps/types/messageTypes";
import textData from '@/config/text.json';

interface Step3ContentProps {
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  agentAvatarUrl: string;
  onNextStep: () => void;
  onMarketAnalysisOptionSelect?: (optionId: string) => void;
}

export default function Step3Content({ 
  messages, 
  addMessage, 
  agentAvatarUrl, 
  onNextStep, 
  onMarketAnalysisOptionSelect 
}: Step3ContentProps) {
  const messageIdCounter = useRef(0);
  const [selectedMarketAnalysisId, setSelectedMarketAnalysisId] = useState<string | null>(null);
  const [hasAddedNextStep, setHasAddedNextStep] = useState<boolean>(false);
  const optionRefs = useRef<React.RefObject<HTMLDivElement | null>[]>([]);

  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return `${Date.now()}-${messageIdCounter.current}`;
  };

  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        id: generateUniqueId(),
        type: "agent",
        content: textData.step3Content.agentMessages.intro,
        showAvatar: true,
      });

      setTimeout(() => {
        addMessage({
          id: generateUniqueId(),
          type: "agent",
          content: textData.step3Content.agentMessages.competitivePricing,
          showAvatar: true,
        });

        setTimeout(() => {
          addMessage({
            id: generateUniqueId(),
            type: "market-analysis",
            content: "",
            showAvatar: false,
          });
        }, 1500);
      }, 1500);
    }
  }, [messages, addMessage]);

  return (
    <>
      {messages.map((message, index) => {
        const isFirstAgentMessage =
          message.type === "agent" && (index === 0 || messages[index - 1].type !== "agent");
        switch (message.type) {
          case "agent":
            return (
              <ChatMessage
                key={message.id}
                message={{ ...message, showAvatar: isFirstAgentMessage, avatarUrl: agentAvatarUrl }}
              />
            );


          case "market-analysis":
            if (optionRefs.current.length === 0) {
              optionRefs.current = Array(3).fill(null).map(() => createRef<HTMLDivElement>());
            }

            return (
              <ChatMessage
                key={message.id}
                message={{
                  ...message,
                  avatarUrl: agentAvatarUrl,
                  isSelected: !!selectedMarketAnalysisId,
                  selectedOptionId: selectedMarketAnalysisId,
                  optionRefs: optionRefs.current,
                  content: (
                    <WinningOfferQuestion
                      condition="market-analysis"
                      avatarUrl={agentAvatarUrl}
                      variant="non-locking"
                      optionRefs={optionRefs.current}
                      onOptionSelect={(option) => {
                        setSelectedMarketAnalysisId(option.id);
                        onMarketAnalysisOptionSelect?.(option.id);
                        if (!hasAddedNextStep) {
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "agent",
                              content: (
                                <NextStep
                                  content={textData.step3Content.agentMessages.confirmationMessage}
                                  key="3"
                                  onNextStep={onNextStep}
                                />
                              ),
                              showAvatar: false,
                            });
                            setHasAddedNextStep(true);
                          }, 1500);
                        }
                      }}
                    />
                  ),
                }}
              />
            );

          default:
            return <ChatMessage key={message.id} message={message} />;
        }
      })}
    </>
  );
}