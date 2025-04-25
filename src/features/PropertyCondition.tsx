import { useEffect, useRef, useState, createRef } from "react";
import {
  ChatMessage,
  WinningOfferQuestion,
} from "@/components/pageComponents/offerSteps";
import NextStep from "@/components/pageComponents/offerSteps/nextStep";
import { MessageType } from "@/components/pageComponents/offerSteps/types/messageTypes";
import textData from "@/config/text.json";
import { DreamHomeForm } from "@/components/pageComponents/offerSteps/property/common/uploadFile";

interface Step4ContentProps {
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  agentAvatarUrl: string;
  onNextStep: () => void;
  onChatProgress?: (
    stage:
      | "initial"
      | "inside-scoop"
      | "in-person"
      | "confirmation"
      | "quality-score"
  ) => void;
  onMarketAnalysisOptionSelect?: (optionText: string) => void;
}

export default function Step4Content({
  messages,
  addMessage,
  agentAvatarUrl,
  onNextStep,
  onChatProgress,
  onMarketAnalysisOptionSelect,
}: Step4ContentProps) {
  const messageIdCounter = useRef(0);
  const [selectedQualityScoreId, setSelectedQualityScoreId] = useState<string | null>(null);
  const [selectedInsideScoopId, setSelectedInsideScoopId] = useState<string | null>(null);
  const [selectedRepairsNeededId, setSelectedRepairsNeededId] = useState<string | null>(null);
  const [selectedInPersonId, setSelectedInPersonId] = useState<string | null>(null);
  const [selectedFirstImpressionId, setSelectedFirstImpressionId] = useState<string | null>(null);
  const [selectedMarketAnalysisId, setSelectedMarketAnalysisId] = useState<string | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
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
        content: textData.step4Content.agentMessages.intro,
        showAvatar: true,
      });
      onChatProgress?.("initial");
      setTimeout(() => {
        addMessage({
          id: generateUniqueId(),
          type: "agent",
          content: textData.step4Content.agentMessages.standOutFeatures,
          showAvatar: true,
        });
        setTimeout(() => {
          addMessage({
            id: generateUniqueId(),
            type: "winning-offer",
            content: "",
            showAvatar: false,
          });
        }, 1500);
      }, 1500);
    }
  }, [messages, addMessage, onChatProgress]);

  return (
    <>
      {messages.map((message, index) => {
        const isFirstAgentMessage =
          message.type === "agent" &&
          (index === 0 || messages[index - 1].type !== "agent");

        switch (message.type) {
          case "agent":
            return (
              <ChatMessage
                key={message.id}
                message={{
                  ...message,
                  showAvatar: isFirstAgentMessage,
                  avatarUrl: agentAvatarUrl,
                }}
              />
            );

          case "winning-offer":
            return (
              <ChatMessage
                key={message.id}
                message={{
                  ...message,
                  avatarUrl: agentAvatarUrl,
                  isSelected: !!selectedQualityScoreId,
                  content: (
                    <WinningOfferQuestion
                      condition="know-about-quality-score"
                      avatarUrl={agentAvatarUrl}
                      onOptionSelect={(option) => {
                        setSelectedQualityScoreId(option.id);
                        setTimeout(() => {
                          addMessage({
                            id: generateUniqueId(),
                            type: "market-analysis",
                            content: "",
                            showAvatar: false,
                          });
                          onChatProgress?.("inside-scoop");
                        }, 1500);
                      }}
                    />
                  ),
                }}
              />
            );

          case "market-analysis":
            if (optionRefs.current.length === 0) {
              optionRefs.current = Array(5)
                .fill(null)
                .map(() => createRef<HTMLDivElement>());
            }
            return (
              <ChatMessage
                key={message.id}
                message={{
                  ...message,
                  avatarUrl: agentAvatarUrl,
                  isSelected: !!selectedInsideScoopId,
                  selectedOptionId: selectedMarketAnalysisId,
                  optionRefs: optionRefs.current,
                  content: (
                    <WinningOfferQuestion
                      condition="inside-scoop"
                      avatarUrl={agentAvatarUrl}
                      variant="non-locking"
                      optionRefs={optionRefs.current}
                      onOptionSelect={(option) => {
                        setSelectedInsideScoopId(option.id);
                        setSelectedMarketAnalysisId(option.id);
                        onMarketAnalysisOptionSelect?.(option.text);
                        setTimeout(() => {
                          addMessage({
                            id: generateUniqueId(),
                            type: "filter-properties",
                            content: "",
                            showAvatar: false,
                          });
                        }, 1500);
                      }}
                    />
                  ),
                }}
              />
            );
          case "filter-properties":
            return (
              <ChatMessage
                key={message.id}
                message={{
                  ...message,
                  avatarUrl: agentAvatarUrl,
                  isSelected: !!selectedRepairsNeededId,
                  content: (
                    <WinningOfferQuestion
                      condition="repairs-needed"
                      avatarUrl={agentAvatarUrl}
                      onOptionSelect={(option) => {
                        setSelectedRepairsNeededId(option.id);
                        setTimeout(() => {
                          addMessage({
                            id: generateUniqueId(),
                            type: "agent",
                            content: textData.step4Content.agentMessages.repairsAssurance,
                            showAvatar: true,
                          });
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "market-insights",
                              content: "",
                              showAvatar: false,
                            });
                            onChatProgress?.("in-person");
                          }, 1500);
                        }, 1500);
                      }}
                    />
                  ),
                }}
              />
            );

          case "market-insights":
            return (
              <ChatMessage
                key={message.id}
                message={{
                  ...message,
                  avatarUrl: agentAvatarUrl,
                  isSelected: !!selectedInPersonId,
                  content: (
                    <WinningOfferQuestion
                      condition="property-in-person"
                      avatarUrl={agentAvatarUrl}
                      onOptionSelect={(option) => {
                        setSelectedInPersonId(option.id);
                        setTimeout(() => {
                          addMessage({
                            id: generateUniqueId(),
                            type: "options",
                            content: "",
                            showAvatar: false,
                          });
                        }, 1500);
                      }}
                    />
                  ),
                }}
              />
            );

          case "options":
            return (
              <ChatMessage
                key={message.id}
                message={{
                  ...message,
                  avatarUrl: agentAvatarUrl,
                  isSelected: !!selectedFirstImpressionId,
                  content: (
                    <WinningOfferQuestion
                      condition="first-impression"
                      avatarUrl={agentAvatarUrl}
                      onOptionSelect={(option) => {
                        setSelectedFirstImpressionId(option.id);
                        setTimeout(() => {
                          addMessage({
                            id: generateUniqueId(),
                            type: "agent",
                            content: textData.step4Content.agentMessages.firstImpressionPrompt,
                            showAvatar: true,
                          });
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "agent",
                              content: textData.step4Content.agentMessages.submitAnswerPrompt,
                              showAvatar: true,
                            });
                            setTimeout(() => {
                              addMessage({
                                id: generateUniqueId(),
                                type: "agent",
                                content: textData.step4Content.agentMessages.dreamHomePrompt,
                                showAvatar: true,
                              });
                              setTimeout(() => {
                                addMessage({
                                  id: generateUniqueId(),
                                  type: "form",
                                  content: "",
                                  showAvatar: false,
                                });
                              }, 1500);
                            }, 1500);
                          }, 1500);
                        }, 1500);
                      }}
                    />
                  ),
                }}
              />
            );

          case "form":
            return (
              <ChatMessage
                key={message.id}
                message={{
                  ...message,
                  avatarUrl: agentAvatarUrl,
                  isSelected: isFormSubmitted,
                  content: (
                    <DreamHomeForm
                      key={message.id}
                      onSubmit={() => {
                        setIsFormSubmitted(true);
                        setTimeout(() => {
                          addMessage({
                            id: generateUniqueId(),
                            type: "agent",
                            content: textData.step4Content.agentMessages.formResponse,
                            showAvatar: true,
                          });
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "confirmation",
                              content: "",
                              showAvatar: false,
                            });
                            onChatProgress?.("confirmation");
                          }, 1500);
                        }, 1500);
                      }}
                    />
                  ),
                }}
              />
            );

          case "confirmation":
            return (
              <ChatMessage
                key={message.id}
                message={{
                  ...message,
                  avatarUrl: agentAvatarUrl,
                  content: (
                    <NextStep
                      content={textData.step4Content.agentMessages.confirmationMessage}
                      onNextStep={onNextStep}
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