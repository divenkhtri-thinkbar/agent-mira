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
  const properties = textData.step2Content.data.comparableProperties.map((property: any) => ({
    ...property,
    imageUrl: house, // Add the image reference here since it’s not in text.json
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
        content: textData.step2Content.agentMessages.intro,
        showAvatar: true,
      });

      setTimeout(() => {
        addMessage({
          id: generateUniqueId(),
          type: "agent",
          content: textData.step2Content.agentMessages.propertyMatch,
          showAvatar: true,
        });

        setTimeout(() => {
          addMessage({
            id: generateUniqueId(),
            type: "agent",
            content: textData.step2Content.agentMessages.presentComparables,
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
                                content={textData.step2Content.agentMessages.confirmationMessage}
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
                      content={textData.step2Content.agentMessages.confirmationMessage}
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