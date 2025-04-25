import { useEffect, useRef, useState } from "react";
import {
  ChatMessage,
  WinningOfferQuestion,
} from "@/components/pageComponents/offerSteps";
import NextStep from "@/components/pageComponents/offerSteps/nextStep";
import { MessageType } from "@/components/pageComponents/offerSteps/types/messageTypes";
import PropertyFilterList from "@/components/pageComponents/offerSteps/property/propertyFilterList";
import { house } from "@/assets/images";
import textData from '@/config/text.json';

// Define types for textData
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

// Assert type for textData
const typedTextData: TextData = textData;

interface Step2ContentProps {
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  agentAvatarUrl: string;
  onNextStep: () => void;
}

export default function Step2Content({
  messages,
  addMessage,
  agentAvatarUrl,
  onNextStep,
}: Step2ContentProps) {
  const properties = typedTextData.step2Content.data.comparableProperties.map((property: ComparableProperty, index: number) => ({
    id: `property-${index}`, // Generate a unique ID
    address: `${property.address.street}, ${property.address.city}, ${property.address.state} ${property.address.zip}`, // Convert Address to string
    imageUrl: house, // Override with house image
    matchPercentage: property.matchPercentage,
  }));

  const messageIdCounter = useRef(0);
  const [selectedWinningOptionId, setSelectedWinningOptionId] = useState<string | null>(null);
  const [isPropertySelected, setIsPropertySelected] = useState<boolean>(false);

  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return `${Date.now()}-${messageIdCounter.current}`;
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
              type: "winning-offer",
              content: "",
              showAvatar: false,
            });
          }, 7000); // Changed from 1500ms to 8000ms (8 seconds)
        }, 1500);
      }, 1500);
    }
  }, [messages, addMessage]);

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
                            content: (
                              <NextStep
                                content={typedTextData.step2Content.agentMessages.confirmationMessage}
                                key="2"
                                onNextStep={onNextStep}
                              />
                            ),
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
                      key={message.id}
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