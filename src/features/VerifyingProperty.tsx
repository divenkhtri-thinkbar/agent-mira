import { useEffect, useRef, useState } from "react";
import {
  AddressInput,
  ChatMessage,
  NextStep,
  // PropertyForm,
  WinningOfferQuestion,
} from "@/components/pageComponents/offerSteps";
import { MessageType } from "@/components/pageComponents/offerSteps/types/messageTypes";
import textData from '@/config/text.json';

interface Step1ContentProps {
  messages: MessageType[];
  addMessage: (message: MessageType) => void;
  agentAvatarUrl: string;
  onNextStep: () => void;
  onChatProgress?: (
    stage: "address-submitted" | "winning-offer" | "options"
  ) => void;
  address?: string;
  setAddress: (address: string) => void;
  selectedCardId: number | null;
  handleCardSelect: (id: number) => void;
}

export default function Step1Content({
  messages,
  addMessage,
  agentAvatarUrl,
  onNextStep,
  onChatProgress,
  address,
  setAddress,
  selectedCardId,
}: Step1ContentProps) {
  const messageIdCounter = useRef(0);
  const [selectedWinningOptionId, setSelectedWinningOptionId] = useState<string | null>(null);
  const [selectedOptionsId, setSelectedOptionsId] = useState<string | null>(null);
  // const [isFormSubmitted, setIsFormSubmitted] = useState<boolean>(false);

  const generateUniqueId = () => {
    messageIdCounter.current += 1;
    return `${Date.now()}-${messageIdCounter.current}`;
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
  }, [messages, addMessage]);

  useEffect(() => {
    if (
      address &&
      selectedCardId !== null &&
      messages.some((msg) => msg.type === "address-input")
    ) {
      const hasResponseMessage = messages.some(
        (msg) =>
          msg.type === "agent" &&
          msg.content === textData.step1Content.agentMessages.addressReceived
      );

      if (!hasResponseMessage) {
        addMessage({
          id: generateUniqueId(),
          type: "agent",
          content: textData.step1Content.agentMessages.addressReceived,
          showAvatar: true,
        });
        onChatProgress?.("address-submitted");
        setTimeout(() => {
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
    }
  }, [address, selectedCardId, messages, addMessage, onChatProgress]);

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
                  isSelected: !!selectedWinningOptionId,
                  content: (
                    <WinningOfferQuestion
                      condition={textData.step1Content.winningOfferQuestion.condition}
                      avatarUrl={agentAvatarUrl}
                      onOptionSelect={(option) => {
                        setSelectedWinningOptionId(option.id);
                        setTimeout(() => {
                          addMessage({
                            id: generateUniqueId(),
                            type: "agent",
                            content: textData.step1Content.agentMessages.winningOfferResponse,
                            showAvatar: true,
                          });
                          onChatProgress?.("winning-offer");
                          addMessage({
                            id: generateUniqueId(),
                            type: "agent",
                            content: textData.step1Content.agentMessages.optionsResponse,
                            showAvatar: true,
                          });
                          addMessage({
                            id: generateUniqueId(),
                            type: "options",
                            content: "",
                          });
                          onChatProgress?.("options");
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
                  isSelected: !!selectedOptionsId,
                  content: (
                    <WinningOfferQuestion
                      condition={textData.step1Content.optionsQuestion.condition}
                      avatarUrl={agentAvatarUrl}
                      onOptionSelect={(option) => {
                        setSelectedOptionsId(option.id);
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
          // case "form":
          //   return (
          //     <ChatMessage
          //       key={message.id}
          //       message={{
          //         ...message,
          //         avatarUrl: agentAvatarUrl,
          //         isSelected: isFormSubmitted,
          //         content: (
          //           <PropertyForm
          //             key={message.id}
          //             onSubmit={() => {
          //               setIsFormSubmitted(true);
          //               addMessage({
          //                 id: generateUniqueId(),
          //                 type: "confirmation",
          //                 content: "",
          //               });
          //             }}
          //           />
          //         ),
          //       }}
          //     />
          //   );
          case "confirmation":
            return (
              <ChatMessage
                key={message.id}
                message={{
                  ...message,
                  avatarUrl: agentAvatarUrl,
                  content: (
                    <NextStep
                      content={textData.step1Content.agentMessages.confirmationMessage}
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