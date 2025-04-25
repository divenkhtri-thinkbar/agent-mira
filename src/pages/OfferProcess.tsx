/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ResizablePanel,
  ChatContainer,
} from "@/components/pageComponents/offerSteps";
import { ProgressNav } from "@/components/pageComponents/offerSteps/processSteps";
import Layout from "@/layouts/OfferLayout";
import { useEffect, useState } from "react";
import RightPanelContainer from "@/components/pageComponents/offerSteps/rightContainer";
import textData from "@/config/text.json";
import { useNavigate, useParams } from "react-router";

const steps = textData.offerProcess.steps;

export default function OfferProcess() {
  const { step } = useParams<{ step?: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [showPropertyView, setShowPropertyView] = useState(true);
  const [showPropertyCard, setShowPropertyCard] = useState(false);
  const [isPropertyLoading, setIsPropertyLoading] = useState(true);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [qualityScoreNotchText, setQualityScoreNotchText] = useState<
    string | null
  >(null); // Renamed for clarity
  const [selectedCardId, setSelectedCardId] = useState<number | null>(null);
  const [marketAnalysisOption, setMarketAnalysisOption] = useState<
    string | null
  >(null);
  const [showVideoCard, setShowVideoCard] = useState(false);
  const [step4Stage, setStep4Stage] = useState<
    | "initial"
    | "quality-score"
    | "inside-scoop"
    | "repairs"
    | "in-person"
    | "first-impression"
    | "form"
    | "confirmation"
  >("initial");
  const [step6Stage, setStep6Stage] = useState<
    "initial" | "review-offer" | "customize-offer" | "confirmation"
  >("initial");
  const [_selectedMarketAnalysisText, _setSelectedMarketAnalysisText] = useState<
    string | null
  >(null); // New state for text

  useEffect(() => {
    const stepNum = step ? parseInt(step, 10) : 1;
    if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= steps.length) {
      setCurrentStep(stepNum);
    } else {
      navigate("/offer-process/1"); // Redirect to step 1 if invalid
    }
  }, [step, navigate]);

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      setShowPropertyView(false);
      setShowPropertyCard(false);
      setIsPropertyLoading(false);
      setShowVideoCard(false);
      setStep4Stage("initial");
      setStep6Stage("initial");
    }
  };

  const handleInsideScoop = (optionText: string) => {
    console.log("handleInsideScoop called with:", optionText);
    setQualityScoreNotchText(optionText);
  };

  const handleChatProgress = (
    stage:
      | "address-submitted"
      | "winning-offer"
      | "options"
      | "form-submitted"
      | "initial"
      | "review-offer"
      | "customize-offer"
      | "confirmation"
      | "quality-score"
      | "inside-scoop"
      | "repairs"
      | "in-person"
      | "first-impression"
      | "form"
  ) => {
    if (stage === "address-submitted") {
      setIsPropertyLoading(false);
      setShowPropertyView(true);
      setShowPropertyCard(false);
      setShowVideoCard(false);
    } else if (stage === "winning-offer") {
      setShowPropertyView(false);
      setShowPropertyCard(true);
      setIsPropertyLoading(true);
      setShowVideoCard(false);
    } else if (stage === "options") {
      setShowPropertyView(false);
      setShowPropertyCard(true);
      setIsPropertyLoading(false);
      setShowVideoCard(false);
    } else if (stage === "form-submitted") {
      setShowVideoCard(true);
      setShowPropertyCard(false);
      setIsPropertyLoading(false);
    }
    // Step 6 stages
    else if (currentStep === 6 && stage === "initial") {
      setStep6Stage("initial");
      setIsPropertyLoading(false);
    } else if (currentStep === 6 && stage === "review-offer") {
      setStep6Stage("review-offer");
      setIsPropertyLoading(false);
    } else if (currentStep === 6 && stage === "customize-offer") {
      setStep6Stage("customize-offer");
      setIsPropertyLoading(false);
    } else if (currentStep === 6 && stage === "confirmation") {
      setStep6Stage("confirmation");
      setIsPropertyLoading(false);
    }
    // Step 4 stages
    else if (currentStep === 4 && stage === "initial") {
      setStep4Stage("initial");
      setIsPropertyLoading(false);
    } else if (currentStep === 4 && stage === "quality-score") {
      setStep4Stage("quality-score");
      setIsPropertyLoading(false);
    } else if (currentStep === 4 && stage === "inside-scoop") {
      setStep4Stage("inside-scoop");
      setIsPropertyLoading(false);
    } else if (currentStep === 4 && stage === "repairs") {
      setStep4Stage("repairs");
      setIsPropertyLoading(false);
    } else if (currentStep === 4 && stage === "in-person") {
      setStep4Stage("in-person");
      setIsPropertyLoading(false);
    } else if (currentStep === 4 && stage === "first-impression") {
      setStep4Stage("first-impression");
      setIsPropertyLoading(false);
    } else if (currentStep === 4 && stage === "form") {
      setStep4Stage("form");
      setIsPropertyLoading(false);
    } else if (currentStep === 4 && stage === "confirmation") {
      setStep4Stage("confirmation");
      setIsPropertyLoading(false);
    }
  };

  const handleCardSelect = (id: number) => {
    setSelectedCardId((prevId) => (prevId === id ? null : id));
  };

  const handleMarketAnalysisOptionSelect = (optionId: string) => {
    setMarketAnalysisOption(optionId);
  };
  const getHeaderAddress = () => {
    if (selectedCardId !== null) {
      return address || "Selected Property Address";
    } else if (address) {
      return address;
    }
    return "New offer";
  };
  return (
    <Layout
      address={address}
      selectedCardId={selectedCardId}
      handleCardSelect={handleCardSelect}
    >
      <main className="h-screen w-full flex flex-col overflow-hidden">
        <ProgressNav currentStep={currentStep} steps={steps} />
        <div className="flex-1 overflow-hidden">
          <ResizablePanel
            leftPanel={
              <div className="relative z-10 h-full bg-white">
                <ChatContainer
                  currentStep={currentStep}
                  onNextStep={handleNextStep}
                  onChatProgress={handleChatProgress}
                  address={address}
                  setAddress={setAddress}
                  selectedCardId={selectedCardId}
                  handleCardSelect={handleCardSelect}
                  onMarketAnalysisOptionSelect={
                    handleMarketAnalysisOptionSelect
                  }
                  headerAddress={getHeaderAddress()}
                  handleInsideScoop={handleInsideScoop}
                />
              </div>
            }
            rightPanel={
              <div className="relative z-0 h-full overflow-y-auto">
                <RightPanelContainer
                  currentStep={currentStep}
                  showPropertyView={showPropertyView}
                  showPropertyCard={showPropertyCard}
                  isPropertyLoading={isPropertyLoading}
                  address={address}
                  marketAnalysisOption={marketAnalysisOption}
                  showVideoCard={showVideoCard}
                  step4Stage={step4Stage}
                  step6Stage={step6Stage}
                  handleInsideScoop={handleInsideScoop}
                  selectedMarketAnalysisText={qualityScoreNotchText} // Pass the selected text
                />
              </div>
            }
          />
        </div>
      </main>
    </Layout>
  );
}
