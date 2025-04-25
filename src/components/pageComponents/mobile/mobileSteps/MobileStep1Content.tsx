import { useEffect, useRef, useState } from "react";
import {
  AddressInput,
  ChatMessage,
  NextStep,
  PropertyForm,
  WinningOfferQuestion,
} from "@/components/pageComponents/offerSteps";
import { MessageType } from "@/components/pageComponents/offerSteps/types/messageTypes";
import textData from "@/config/text.json";
import { PropertyView } from "@/components/pageComponents/offerSteps";
import { PropertyCard } from "@/components/pageComponents/offerSteps/property/step1/propertyCard";
import { verifyProperty, house, Lawn, agent, map } from "@/assets/images";
import MobileRightCard from "../MobileRightCard";
import { X } from "lucide-react";

interface Step1ContentMobileProps {
  onNextStep: () => void;
}

export default function MobileStep1Content({
  onNextStep,
}: Step1ContentMobileProps) {
  const messageIdCounter = useRef(0);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [selectedCardType, setSelectedCardType] = useState<
    "property-view" | "property-card" | null
  >(null);
  const [isPropertyLoading, setIsPropertyLoading] = useState(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const agentAvatarUrl = agent;

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
        content: textData.step1Content.agentMessages.intro,
        showAvatar: true,
      });
      addMessage({
        id: generateUniqueId(),
        type: "agent",
        content: textData.step1Content.agentMessages.requestAddress,
        showAvatar: true,
      });
      addMessage({
        id: generateUniqueId(),
        type: "address-input",
        content: "",
        showAvatar: false,
      });
    }
  }, [messages]);

  useEffect(() => {
    if (address) {
      setIsPropertyLoading(true);
      setTimeout(() => {
        setIsPropertyLoading(false);
        addMessage({
          id: generateUniqueId(),
          type: "property-view",
          content: "",
          showAvatar: false,
        });
        addMessage({
          id: generateUniqueId(),
          type: "agent",
          content: textData.step1Content.agentMessages.addressReceived,
          showAvatar: true,
        });
        setTimeout(() => {
          addMessage({
            id: generateUniqueId(),
            type: "winning-offer",
            content: "",
            showAvatar: false,
          });
        }, 2000);
      }, 1000);
    }
  }, [address]);

  const propertyData = {
    ...textData.step1Content.propertyCard.data,
    images: [verifyProperty, house, Lawn],
  };

  const handleCardClick = (type: "property-view" | "property-card") => {
    setSelectedCardType(selectedCardType === type ? null : type);
  };

  return (
    <div className="h-full w-full flex flex-col relative">
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
            case "address-input":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    avatarUrl: agentAvatarUrl,
                    content: (
                      <AddressInput
                        onSubmit={(submittedAddress) => {
                          setAddress(submittedAddress);
                        }}
                      />
                    ),
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
                    content: (
                      <WinningOfferQuestion
                        condition={
                          textData.step1Content.winningOfferQuestion.condition
                        }
                        avatarUrl={agentAvatarUrl}
                        onOptionSelect={() => {
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "agent",
                              content:
                                textData.step1Content.agentMessages
                                  .winningOfferResponse,
                              showAvatar: true,
                            });
                            addMessage({
                              id: generateUniqueId(),
                              type: "agent",
                              content:
                                textData.step1Content.agentMessages
                                  .propertyRespone,
                              showAvatar: true,
                            });
                            // Add property-card before options
                            addMessage({
                              id: generateUniqueId(),
                              type: "property-card",
                              content: "",
                              showAvatar: false,
                            });
                            // Add options after property-card
                            setTimeout(() => {
                              addMessage({
                                id: generateUniqueId(),
                                type: "options",
                                content: "",
                                showAvatar: false,
                              });
                            }, 1500); // Delay options after property-card
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
                    content: (
                      <WinningOfferQuestion
                        condition={
                          textData.step1Content.optionsQuestion.condition
                        }
                        avatarUrl={agentAvatarUrl}
                        onOptionSelect={() => {
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "form",
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
            case "form":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    avatarUrl: agentAvatarUrl,
                    isSelected: isFormSubmitted,
                    content: (
                      <PropertyForm
                        key={message.id}
                        onSubmit={() => {
                          setIsFormSubmitted(true);
                          addMessage({
                            id: generateUniqueId(),
                            type: "confirmation",
                            content: "",
                          });
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
                        content={
                          textData.step1Content.agentMessages
                            .confirmationMessage
                        }
                        onNextStep={onNextStep}
                      />
                    ),
                  }}
                />
              );
            case "property-view":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    type: "right-card" as const,
                    content: (
                      <MobileRightCard
                        onClick={() =>
                          handleCardClick(message.type as "property-view")
                        }
                        imageSrc={map}
                        subtitle="18, xyz street, miami florida 12.08.2025"
                      />
                    ),
                    showAvatar: false,
                    avatarUrl: undefined,
                  }}
                />
              );
            case "property-card":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    type: "right-card" as const,
                    content: (
                      <MobileRightCard
                        onClick={() =>
                          handleCardClick(message.type as "property-card")
                        }
                        imageSrc={verifyProperty}
                        boldText="$ 223,000"
                      />
                    ),
                    showAvatar: false,
                    avatarUrl: undefined,
                  }}
                />
              );
            default:
              return null;
          }
        })}
      </div>

{/* Sliding Panel for Expanded Content */}
{selectedCardType && (
        <div
          className={`fixed top-0 right-0 h-full w-full overflow-hidden ${
            selectedCardType === "property-view" ? "bg-[#B8D4FF]" : ""
          } shadow-lg transform transition-transform duration-300 ease-in-out z-10 ${
            selectedCardType ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="relative p-4 overflow-y-auto h-full flex flex-col">
            {/* Close Icon in Top-Right Corner */}
            <button
              onClick={() => setSelectedCardType(null)}
              className="absolute top-4 right-4"
            >
              <X className="h-8 w-8 text-[#1354B6]" />
            </button>

            {/* Header for the Panel */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-[ClashDisplay-Medium] text-[#1354B6] mb-6">
              {selectedCardType === "property-view"
                ? "Fetching Property Address"
                : "Verifying Property Information"}
            </h1>

            {/* Panel Content */}
            <div className="flex-1">
              {isPropertyLoading ? (
                <div>Loading property details...</div>
              ) : selectedCardType === "property-view" ? (
                <PropertyView
                  address={
                    address || textData.step1Content.defaultPropertyViewAddress
                  }
                  isLoading={false}
                />
              ) : (
                <PropertyCard {...propertyData} isLoading={false} />
              )}
            </div>

            {/* Conditional "View on Google Map" Text */}
            {selectedCardType === "property-view" && (
              <div className="mt-auto text-center">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    address || textData.step1Content.defaultPropertyViewAddress
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#1354B6] text-sm sm:text-base md:text-lg font-[ClashDisplay-Medium] underline"
                >
                  View on Google Map
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
