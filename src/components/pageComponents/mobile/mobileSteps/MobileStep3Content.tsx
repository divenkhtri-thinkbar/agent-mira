import { useEffect, useRef, useState } from "react";
import {
  ChatMessage,
  WinningOfferQuestion,
} from "@/components/pageComponents/offerSteps";
import NextStep from "@/components/pageComponents/offerSteps/nextStep";
import { MessageType } from "@/components/pageComponents/offerSteps/types/messageTypes";
import textData from "@/config/text.json";
import {
  MarketGauge,
  MarketType,
} from "@/components/pageComponents/offerSteps/property/step3/marketGauge";
import { X } from "lucide-react";
import { agent } from "@/assets/images";
import AccordionContainer from "../accordianContainer";

interface MobileStep3ContentProps {
  onNextStep: () => void;
  onMarketAnalysisOptionSelect?: (optionId: string) => void;
}

export default function MobileStep3Content({
  onNextStep,
  onMarketAnalysisOptionSelect,
}: MobileStep3ContentProps) {
  const messageIdCounter = useRef(0);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [selectedMarketAnalysisId, setSelectedMarketAnalysisId] = useState<
    string | null
  >(null);
  const [hasAddedNextStep, setHasAddedNextStep] = useState<boolean>(false);
  const [isPanelOpen, setIsPanelOpen] = useState<boolean>(false); // Track panel state
  const agentAvatarUrl = agent;

  const marketGaugeData = textData.step3Content.marketGauge.data;
//   const labels = {
//     options: [
//         "Show Price Trends",
//         "Show Supply and Demand",
//         "Show Market Type"
//     ]
// };

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
        content: textData.step3Content.agentMessages.intro,
        showAvatar: true,
      });

      setTimeout(() => {
        addMessage({
          id: generateUniqueId(),
          type: "agent",
          content: textData.step3Content.agentMessages.competitivePricing,
          showAvatar: true,
        });

        setTimeout(() => {
          addMessage({
            id: generateUniqueId(),
            type: "market-gauge-card",
            content: "",
            showAvatar: false,
          });

          // Add market-analysis after market-gauge-card
          setTimeout(() => {
            addMessage({
              id: generateUniqueId(),
              type: "market-analysis",
              content: "",
              showAvatar: false,
            });
          }, 2000); // Delay after market-gauge-card
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
            case "market-gauge-card":
              return (
                <ChatMessage
                key={message.id}
                message={{
                  ...message,
                  type: "right-card",
                  content: (
                    <AccordionContainer />
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
                    isSelected: !!selectedMarketAnalysisId,
                    selectedOptionId: selectedMarketAnalysisId,
                    content: (
                      <WinningOfferQuestion
                        condition="market-analysis"
                        avatarUrl={agentAvatarUrl}
                        variant="non-locking"
                        onOptionSelect={(option) => {
                          setSelectedMarketAnalysisId(option.id);
                          onMarketAnalysisOptionSelect?.(option.id);
                          if (!hasAddedNextStep) {
                            setTimeout(() => {
                              addMessage({
                                id: generateUniqueId(),
                                type: "confirmation",
                                content: "",
                                showAvatar: false,
                              });
                              setHasAddedNextStep(true);
                            }, 1500);
                          }
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
                          textData.step3Content.agentMessages
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
      {isPanelOpen && (
        <div
          className={`fixed top-0 right-0 h-full w-full overflow-hidden bg-[#F4F4F4] shadow-lg transform transition-transform duration-300 ease-in-out z-10 ${isPanelOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="relative p-4 overflow-y-auto h-full">
            {/* Close Icon in Top-Right Corner */}
            <button
              onClick={() => setIsPanelOpen(false)}
              className="absolute top-4 right-4 p-2 border border-[#363636]/50 rounded-full"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>

            {/* Panel Content */}
            <MarketGauge
              initialMarketType={
                marketGaugeData.initialMarketType as MarketType
              }
              medianPrice={marketGaugeData.medianPrice}
              priceYoY={marketGaugeData.priceYoY}
              priceMoM={marketGaugeData.priceMoM}
              saleToListRatio={marketGaugeData.saleToListRatio}
              belowAsking={marketGaugeData.belowAsking}
              priceReduced={marketGaugeData.priceReduced}
              lastMonthChange={marketGaugeData.lastMonthChange}
              medianDays={marketGaugeData.medianDays}
              daysYoY={marketGaugeData.daysYoY}
              daysVsLast={marketGaugeData.daysVsLast}
              selectedMarketAnalysisOption={selectedMarketAnalysisId}
            />
          </div>
        </div>
      )}
    </div>
  );
}
