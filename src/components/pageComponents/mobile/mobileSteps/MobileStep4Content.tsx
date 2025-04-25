// MobileStep4Content.tsx
import { useEffect, useRef, useState } from "react";
import {
  ChatMessage,
  WinningOfferQuestion,
} from "@/components/pageComponents/offerSteps";
import NextStep from "@/components/pageComponents/offerSteps/nextStep";
import { MessageType } from "@/components/pageComponents/offerSteps/types/messageTypes";
import textData from "@/config/text.json";
import MobileRightCard from "../MobileRightCard";
import { ImageCard } from "@/components/pageComponents/offerSteps/property/step4/imageCard";
import { QualityScoreCard } from "@/components/pageComponents/offerSteps/property/step4/qualityScore";
import { VideoCard } from "@/components/pageComponents/offerSteps/property/step4/videoCard";
import { DreamHomeForm } from "@/components/pageComponents/offerSteps/property/common/uploadFile";
import { X } from "lucide-react";
import { agent, verifyProperty, Lawn, house } from "@/assets/images";

interface MobileStep4ContentProps {
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
  handleInsideScoop?: (optionText: string) => void;
}

export default function MobileStep4Content({
  onNextStep,
  onChatProgress,
  onMarketAnalysisOptionSelect,
  handleInsideScoop,
}: MobileStep4ContentProps) {
  const messageIdCounter = useRef(0);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedQualityScoreId, setSelectedQualityScoreId] = useState<string | null>(null);
  const [selectedInsideScoopId, setSelectedInsideScoopId] = useState<string | null>(null);
  const [selectedRepairsNeededId, setSelectedRepairsNeededId] = useState<string | null>(null);
  const [selectedInPersonId, setSelectedInPersonId] = useState<string | null>(null);
  const [selectedFirstImpressionId, setSelectedFirstImpressionId] = useState<string | null>(null);
  const [selectedMarketAnalysisId, setSelectedMarketAnalysisId] = useState<string | null>(null);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [hasTriggeredFilterProperties, setHasTriggeredFilterProperties] = useState<boolean>(false);
  const [panelStage, setPanelStage] = useState<
    "initial" | "inside-scoop" | "in-person" | "confirmation" | null
  >(null); // Track panel content
  const agentAvatarUrl = agent;

  const images = [verifyProperty, Lawn, house];
  const videoThumbnails = [verifyProperty, Lawn, house];

  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return `${Date.now()}-${messageIdCounter.current}`;
  };

  const addMessage = (message: MessageType) => {
    setMessages((prev) => [...prev, message]);
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
            type: "initial-card",
            content: "",
            showAvatar: false,
          });
          setTimeout(() => {
            addMessage({
              id: generateUniqueId(),
              type: "winning-offer",
              content: "",
              showAvatar: false,
            });
          }, 2000);
        }, 1500);
      }, 1500);
    }
  }, [messages, onChatProgress]);

  const handleCardClick = (stage: "initial" | "inside-scoop" | "in-person" | "confirmation") => {
    setPanelStage(panelStage === stage ? null : stage); // Toggle panel visibility and stage
  };

  return (
    <div className="h-full w-full p-4 flex flex-col relative">
      {/* Chat Body */}
      <div className="flex-1 overflow-y-auto space-y-4">
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
            case "initial-card":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    type: "right-card",
                    content: (
                      <MobileRightCard onClick={() => handleCardClick("initial")} />
                    ),
                    showAvatar: false,
                    avatarUrl: undefined,
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
                              type: "inside-scoop",
                              content: "",
                              showAvatar: false,
                            });
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
            case "inside-scoop":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    type: "right-card",
                    content: (
                      <MobileRightCard onClick={() => handleCardClick("inside-scoop")} />
                    ),
                    showAvatar: false,
                    avatarUrl: undefined,
                  }}
                />
              );
            case "market-analysis":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    avatarUrl: agentAvatarUrl,
                    isSelected: !!selectedInsideScoopId,
                    selectedOptionId: selectedMarketAnalysisId,
                    content: (
                      <WinningOfferQuestion
                        condition="inside-scoop"
                        avatarUrl={agentAvatarUrl}
                        variant="non-locking"
                        onOptionSelect={(option) => {
                          console.log("Selected option:", option.text);
                          setSelectedInsideScoopId(option.id);
                          setSelectedMarketAnalysisId(option.id);
                          onMarketAnalysisOptionSelect?.(option.text);
                          handleInsideScoop?.(option.text);
                          if (!hasTriggeredFilterProperties) {
                            setHasTriggeredFilterProperties(true);
                            setTimeout(() => {
                              addMessage({
                                id: generateUniqueId(),
                                type: "filter-properties",
                                content: "",
                                showAvatar: false,
                              });
                            }, 1500);
                          }
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
                                type: "in-person-card",
                                content: "",
                                showAvatar: false,
                              });
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
            case "in-person-card":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    type: "right-card",
                    content: (
                      <MobileRightCard onClick={() => handleCardClick("in-person")} />
                    ),
                    showAvatar: false,
                    avatarUrl: undefined,
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
                                type: "confirmation-card",
                                content: "",
                                showAvatar: false,
                              });
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
            case "confirmation-card":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    type: "right-card",
                    content: (
                      <MobileRightCard onClick={() => handleCardClick("confirmation")} />
                    ),
                    showAvatar: false,
                    avatarUrl: undefined,
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
              return null;
          }
        })}
      </div>

      {/* Sliding Panel for Expanded Content */}
      {panelStage && (
        <div
          className={`fixed top-0 right-0 h-full w-full overflow-hidden bg-[#F4F4F4] shadow-lg transform transition-transform duration-300 ease-in-out z-10 ${
            panelStage ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="relative p-4 overflow-y-auto h-full">
            {/* Close Icon in Top-Right Corner */}
            <button
              onClick={() => setPanelStage(null)}
              className="absolute top-4 right-4 p-2 border border-[#363636]/50 rounded-full"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>

            {/* Panel Content */}
            {panelStage === "initial" && <ImageCard images={images} />}
            {panelStage === "inside-scoop" && (
              <QualityScoreCard
                initialIndex={0}
                notchText={selectedMarketAnalysisId || "Exterior"}
              />
            )}
            {panelStage === "in-person" && <ImageCard images={images} variant="repairs" />}
            {panelStage === "confirmation" && <VideoCard videos={videoThumbnails} initialIndex={0} />}
          </div>
        </div>
      )}
    </div>
  );
}