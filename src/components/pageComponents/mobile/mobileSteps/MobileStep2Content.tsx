// Step2ContentMobile.tsx
import { useEffect, useRef, useState } from "react";
import {
  ChatMessage,
  WinningOfferQuestion,
} from "@/components/pageComponents/offerSteps";
import {NextStep} from "@/components/pageComponents/offerSteps/index";
import { MessageType } from "@/components/pageComponents/offerSteps/types/messageTypes";
import PropertyFilterList from "@/components/pageComponents/offerSteps/property/propertyFilterList";
import { house, agent } from "@/assets/images";
import textData from "@/config/text.json";
import { PresentPropertyCard } from "@/components/pageComponents/offerSteps/property/step2/presentPropertyCard";
import { X } from "lucide-react";
import RightBox from "../../offerSteps/property/rightBox";

// Define types for textData (reused from Step2Content)
interface Address {
  street: string;
  city: string;
  state: string;
  zip: string;
}

interface ComparableProperty {
  _comment?: string;
  imageUrl: string;
  matchPercentage: number;
  price: number;
  address: Address;
  distance: string;
  beds: number;
  baths: number;
  sqft: number;
  similarFeatures: string[];
  keyDifferences: string[];
  soldDate: string;
}

interface Step2Content {
  _comment?: string;
  agentMessages: {
    _comment?: string;
    intro: string;
    propertyMatch: string;
    presentComparables: string;
    confirmationMessage: string;
  };
  presentPropertyCard: {
    _comment?: string;
    labels: {
      title: string;
      pricePerSqFt: string;
      similarFeatures: string;
      keyDifferences: string;
      match: string;
      beds: string;
      baths: string;
      sqft: string;
    };
  };
  data: {
    _comment?: string;
    comparableProperties: ComparableProperty[];
  };
}

interface TextData {
  step2Content: Step2Content;
}

const typedTextData: TextData = textData;

interface Step2ContentMobileProps {
  onNextStep: () => void;
}

export default function MobileStep2Content({
  onNextStep,
}: Step2ContentMobileProps) {
  const messageIdCounter = useRef(0);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedWinningOptionId, setSelectedWinningOptionId] = useState<string | null>(null);
  const [isPropertySelected, setIsPropertySelected] = useState<boolean>(false);
  const [selectedCardIndex, setSelectedCardIndex] = useState<number | null>(null); // Track which comparable is expanded
  const agentAvatarUrl = agent;

  const properties = typedTextData.step2Content.data.comparableProperties.map(
    (property: ComparableProperty, index: number) => ({
      id: `property-${index}`,
      address: `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zip}`,
      imageUrl: house,
      matchPercentage: property.matchPercentage,
    })
  );

  const comparableProperties = typedTextData.step2Content.data.comparableProperties.map(
    (prop) => ({
      ...prop,
      imageUrl: house, // Using house as a placeholder; adjust as needed
    })
  );

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
        content: typedTextData.step2Content.agentMessages.intro,
        showAvatar: true,
      });

      setTimeout(() => {
        addMessage({
          id: generateUniqueId(),
          type: "agent",
          content: typedTextData.step2Content.agentMessages.propertyMatch,
          showAvatar: true,
        });

        setTimeout(() => {
          addMessage({
            id: generateUniqueId(),
            type: "agent",
            content: typedTextData.step2Content.agentMessages.presentComparables,
            showAvatar: true,
          });

          setTimeout(() => {
            addMessage({
              id: generateUniqueId(),
              type: "comparable-card",
              content: "",
              showAvatar: false,
            });

            // Add winning-offer after comparable-card
            setTimeout(() => {
              addMessage({
                id: generateUniqueId(),
                type: "winning-offer",
                content: "",
                showAvatar: false,
              });
            }, 2000); // Delay after comparable-card
          }, 2000); // Delay to show comparable card
        }, 1500);
      }, 1500);
    }
  }, [messages]);


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
            case "comparable-card":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    type: "right-card",
                    content: (
                      <RightBox />),
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
                    isSelected: !!selectedWinningOptionId,
                    content: (
                      <WinningOfferQuestion
                        condition="make-adjustment"
                        avatarUrl={agentAvatarUrl}
                        onOptionSelect={(option) => {
                          setSelectedWinningOptionId(option.id);
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
                    isSelected: isPropertySelected,
                    content: (
                      <PropertyFilterList
                        avatarUrl={agentAvatarUrl}
                        properties={properties}
                        onPropertySelect={() => {
                          setIsPropertySelected(true);
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "confirmation",
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
            case "confirmation":
              return (
                <ChatMessage
                  key={message.id}
                  message={{
                    ...message,
                    avatarUrl: agentAvatarUrl,
                    content: (
                      <NextStep
                        content={typedTextData.step2Content.agentMessages.confirmationMessage}
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
      {selectedCardIndex !== null && (
        <div
          className={`fixed top-0 right-0 h-full w-full overflow-hidden bg-[#F4F4F4] shadow-lg transform transition-transform duration-300 ease-in-out z-10 ${selectedCardIndex !== null ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="relative p-4 overflow-y-auto h-full">
            {/* Close Icon in Top-Right Corner */}
            <button
              onClick={() => setSelectedCardIndex(null)}
              className="absolute top-4 right-4 p-2 border border-[#363636]/50 rounded-full"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>

            {/* Panel Content */}
            <PresentPropertyCard
              {...comparableProperties[selectedCardIndex]}
              onPrevious={
                selectedCardIndex > 0
                  ? () => setSelectedCardIndex(selectedCardIndex - 1)
                  : undefined
              }
              onNext={
                selectedCardIndex < comparableProperties.length - 1
                  ? () => setSelectedCardIndex(selectedCardIndex + 1)
                  : undefined
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}