// MobileStep6Content.tsx
import { useEffect, useRef, useState } from "react";
import {
  ChatMessage,
  WinningOfferQuestion,
} from "@/components/pageComponents/offerSteps";
import { MessageType } from "@/components/pageComponents/offerSteps/types/messageTypes";
import OfferAdjustmentSlider from "@/components/pageComponents/offerSteps/property/common/offerAdjustmentSlider";
import textData from "@/config/text.json";
import MobileRightCard from "../MobileRightCard";
import { X } from "lucide-react";
import { agent, verifyProperty } from "@/assets/images";
import HorizontalFinalOfferCard from "../../offerSteps/property/step6/mobileFinalOffer";

interface MobileStep6ContentProps {
  onChatProgress?: (
    stage: "initial" | "review-offer" | "customize-offer" | "confirmation"
  ) => void;
}

export default function MobileStep6Content({
  onChatProgress,
}: MobileStep6ContentProps) {
  const messageIdCounter = useRef(0);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedCustomizeOptionId, setSelectedCustomizeOptionId] = useState<
    string | unknown
  >(null);
  const [selectedDownloadOptionId, setSelectedDownloadOptionId] = useState<
    string | null
  >(null);
  const [panelStage, setPanelStage] = useState<
    "initial" | "review-offer" | "customize-offer" | "confirmation" | null
  >(null); // Track panel content
  const agentAvatarUrl = agent;

  const offerData = {
    ...textData.step6Content.finalOfferCard.data,
    propertyImage: verifyProperty, // Using verifyProperty as a placeholder; adjust as needed
  };

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
        content: textData.step6Content.agentMessages.intro,
        showAvatar: true,
      });
      onChatProgress?.("initial");
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
            type: "agent",
            content: textData.step6Content.agentMessages.reviewOfferPrompt,
            showAvatar: true,
          });
          onChatProgress?.("review-offer");
          setTimeout(() => {
            addMessage({
              id: generateUniqueId(),
              type: "review-offer-card",
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
              onChatProgress?.("customize-offer");
            }, 2000);
          }, 1500);
        }, 1500);
      }, 1500);
    }
  }, [messages, onChatProgress]);

  const handleCardClick = (
    stage: "initial" | "review-offer" | "customize-offer" | "confirmation"
  ) => {
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
                      <MobileRightCard
                        onClick={() => handleCardClick("initial")}
                        imageSrc={verifyProperty}
                        boldText="Offer Savant Recomendation"
                        subtitle="18, xyz street, miami florida"
                      />
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
                    isSelected: !!selectedCustomizeOptionId,
                    content: (
                      <OfferAdjustmentSlider
                        onSubmit={(offerAmount) => {
                          setSelectedCustomizeOptionId(offerAmount);
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "agent",
                              content:
                                textData.step6Content.agentMessages
                                  .offerSubmittedResponse,
                              showAvatar: true,
                            });
                            setTimeout(() => {
                              addMessage({
                                id: generateUniqueId(),
                                type: "agent",
                                content:
                                  textData.step6Content.agentMessages
                                    .expertReviewMessage,
                                showAvatar: true,
                              });
                              setTimeout(() => {
                                addMessage({
                                  id: generateUniqueId(),
                                  type: "customize-offer-card",
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
                          }, 1500);
                        }}
                        initialOffer={5005000}
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
                    isSelected: !!selectedDownloadOptionId,
                    content: (
                      <WinningOfferQuestion
                        condition="download-report"
                        avatarUrl={agentAvatarUrl}
                        onOptionSelect={(option) => {
                          setSelectedDownloadOptionId(option.id);
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "confirmation-card",
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
            {panelStage === "initial" && (
              <HorizontalFinalOfferCard {...offerData} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
