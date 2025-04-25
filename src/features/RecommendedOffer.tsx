import { useEffect, useRef, useState } from "react";
import {
  ChatMessage,
  WinningOfferQuestion,
} from "@/components/pageComponents/offerSteps";
import { MessageType } from "@/components/pageComponents/offerSteps/types/messageTypes";
import OfferAdjustmentSlider from "@/components/pageComponents/offerSteps/property/common/offerAdjustmentSlider";
import textData from "@/config/text.json";

interface Step6ContentProps {
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  agentAvatarUrl: string;
  onChatProgress?: (stage: "initial" | "review-offer" | "customize-offer" | "confirmation") => void;
}

export default function Step6Content({
  messages,
  addMessage,
  agentAvatarUrl,
  onChatProgress,
}: Step6ContentProps) {
  const messageIdCounter = useRef(0);
  const [selectedCustomizeOptionId, setSelectedCustomizeOptionId] = useState<string | unknown>(null);
  const [selectedDownloadOptionId, setSelectedDownloadOptionId] = useState<string | null>(null);

  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return `${Date.now()}-${messageIdCounter.current}`;
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
          type: "agent",
          content: textData.step6Content.agentMessages.reviewOfferPrompt,
          showAvatar: true,
        });
        onChatProgress?.("review-offer");
        setTimeout(() => {
          addMessage({
            id: generateUniqueId(),
            type: "winning-offer",
            content: "",
            showAvatar: false,
          });
          onChatProgress?.("customize-offer");
        }, 6000);
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
            if (index === 2) {
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
                              content: textData.step6Content.agentMessages.offerSubmittedResponse,
                              showAvatar: true,
                            });
                            setTimeout(() => {
                              addMessage({
                                id: generateUniqueId(),
                                type: "agent",
                                content: textData.step6Content.agentMessages.expertReviewMessage,
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
                          }, 1500);
                        }}
                        initialOffer={5005000}
                      />
                    ),
                  }}
                />
              );
            }
            return null;

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