// MobileStep5Content.tsx
import { useEffect, useRef, useState } from "react";
import { ChatMessage, NextStep } from "@/components/pageComponents/offerSteps";
import { MessageType } from "@/components/pageComponents/offerSteps/types/messageTypes";
import { DreamHomeForm } from "@/components/pageComponents/offerSteps/property/common/uploadFile";
import RadioQuestionButton from "@/components/pageComponents/offerSteps/property/common/radioQuestiobButton";
import textData from "@/config/text.json";
import MobileRightCard from "../MobileRightCard";
import { PropertyCard } from "@/components/pageComponents/offerSteps/property/step1/propertyCard";
import { VideoCard } from "@/components/pageComponents/offerSteps/property/step4/videoCard";
import { X } from "lucide-react";
import { agent, verifyProperty, Lawn, house } from "@/assets/images";

interface MobileStep5ContentProps {
  onNextStep: () => void;
  onChatProgress?: (
    stage: "winning-offer" | "options" | "form-submitted"
  ) => void;
}

export default function MobileStep5Content({
  onNextStep,
  onChatProgress,
}: MobileStep5ContentProps) {
  const messageIdCounter = useRef(0);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<
    Array<{ id: string; text: string }>
  >([]);
  const [isFeaturesSubmitted, setIsFeaturesSubmitted] =
    useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);
  const [panelStage, setPanelStage] = useState<"property" | "video" | null>(
    null
  ); // Track panel content
  const agentAvatarUrl = agent;

  const propertyData = {
    ...textData.step1Content.propertyCard.data,
    images: [verifyProperty, Lawn, house], // Adjust images as needed
  };
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
        content: textData.step5Content.agentMessages.intro,
        showAvatar: true,
      });
      setTimeout(() => {
        addMessage({
          id: generateUniqueId(),
          type: "property-card",
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
          onChatProgress?.("winning-offer");
        }, 1500);
      }, 1500);
    }
  }, [messages, onChatProgress]);

  const handleCardClick = (stage: "property" | "video") => {
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
            case "property-card":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    type: "right-card",
                    content: (
                      <MobileRightCard
                        onClick={() => handleCardClick("property")}
                        imageSrc={verifyProperty}
                        topText="View Property details"
                        
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
                    isSelected: isFeaturesSubmitted,
                    content: (
                      <RadioQuestionButton
                        condition="feedback"
                        avatarUrl={agentAvatarUrl}
                        onOptionSelect={(selectedOptions) => {
                          setSelectedFeatures(selectedOptions);
                        }}
                        onSkip={() => {
                          setSelectedFeatures([]);
                          setIsFeaturesSubmitted(true);
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "agent",
                              content:
                                textData.step5Content.agentMessages
                                  .featuresSkippedResponse,
                              showAvatar: true,
                            });
                            setTimeout(() => {
                              addMessage({
                                id: generateUniqueId(),
                                type: "form",
                                content: "",
                                showAvatar: false,
                              });
                              onChatProgress?.("options");
                            }, 1500);
                          }, 1500);
                        }}
                        onSubmit={() => {
                          setIsFeaturesSubmitted(true);
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "agent",
                              content:
                                textData.step5Content.agentMessages
                                  .featuresSubmittedResponse,
                              showAvatar: true,
                            });
                            setTimeout(() => {
                              addMessage({
                                id: generateUniqueId(),
                                type: "form",
                                content: "",
                                showAvatar: false,
                              });
                              onChatProgress?.("options");
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
                        text="Now you can type, upload images to describe your dream home."
                        onSubmit={() => {
                          setIsFormSubmitted(true);
                          onChatProgress?.("form-submitted");
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "agent",
                              content:
                                textData.step5Content.agentMessages
                                  .formResponse,
                              showAvatar: true,
                            });
                            setTimeout(() => {
                              addMessage({
                                id: generateUniqueId(),
                                type: "video-card",
                                content: "",
                                showAvatar: false,
                              });
                              addMessage({
                                id: generateUniqueId(),
                                type: "confirmation",
                                content: "",
                                showAvatar: false,
                              });
                            }, 1500);
                          }, 1500);
                        }}
                      />
                    ),
                  }}
                />
              );
            case "video-card":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    type: "right-card",
                    content: (
                      <MobileRightCard
                      onClick={() => handleCardClick("video")}
                      imageSrc={verifyProperty}
                      subtitle="View Your Uploads"
                      
                    />
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
                        content={
                          textData.step5Content.agentMessages
                            .confirmationMessage
                        }
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
            {panelStage === "property" && (
              <PropertyCard {...propertyData} isLoading={false} />
            )}
            {panelStage === "video" && (
              <VideoCard videos={videoThumbnails} initialIndex={0} />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
