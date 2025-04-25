/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useRef, useState } from "react";
import { ChatMessage, NextStep } from "@/components/pageComponents/offerSteps";
import { MessageType } from "@/components/pageComponents/offerSteps/types/messageTypes";
import { DreamHomeForm } from "@/components/pageComponents/offerSteps/property/common/uploadFile";
import RadioQuestionButton from "@/components/pageComponents/offerSteps/property/common/radioQuestiobButton";
import textData from "@/config/text.json";

interface Step5ContentProps {
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  agentAvatarUrl: string;
  onNextStep: () => void;
  onChatProgress?: (
    stage: "winning-offer" | "options" | "form-submitted"
  ) => void;
}

export default function Step5Content({
  messages,
  addMessage,
  agentAvatarUrl,
  onNextStep,
  onChatProgress,
}: Step5ContentProps) {
  const messageIdCounter = useRef(0);
  const [_selectedFeatures, setSelectedFeatures] = useState<
    Array<{ id: string; text: string }>
  >([]);
  const [isFeaturesSubmitted, setIsFeaturesSubmitted] = useState<boolean>(false);
  const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return `${Date.now()}-${messageIdCounter.current}`;
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
          type: "winning-offer",
          content: "",
          showAvatar: false,
        });
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
            if (index === 1) {
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
                              content: textData.step5Content.agentMessages.featuresSkippedResponse,
                              showAvatar: true,
                            });
                            setTimeout(() => {
                              addMessage({
                                id: generateUniqueId(),
                                type: "agent",
                                content: textData.step5Content.agentMessages.formPrompt,
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
                        }}
                        onSubmit={() => {
                          setIsFeaturesSubmitted(true);
                          setTimeout(() => {
                            addMessage({
                              id: generateUniqueId(),
                              type: "agent",
                              content: textData.step5Content.agentMessages.featuresSubmittedResponse,
                              showAvatar: true,
                            });
                            setTimeout(() => {
                              addMessage({
                                id: generateUniqueId(),
                                type: "agent",
                                content: textData.step5Content.agentMessages.formPrompt,
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
                        }}
                      />
                    ),
                  }}
                />
              );
            }
            return null;

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
                        onChatProgress?.("form-submitted");
                        setTimeout(() => {
                          addMessage({
                            id: generateUniqueId(),
                            type: "agent",
                            content: textData.step5Content.agentMessages.formResponse,
                            showAvatar: true,
                          });
                          setTimeout(() => {
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

          case "confirmation":
            return (
              <ChatMessage
                key={message.id}
                message={{
                  ...message,
                  avatarUrl: agentAvatarUrl,
                  content: (
                    <NextStep
                      content={textData.step5Content.agentMessages.confirmationMessage}
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