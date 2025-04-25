"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import ChatOptionButtonWithDescription from "./chatOptionButtonWithDescription";
import textData from "@/config/text.json";
import { X } from "lucide-react";
import NumberCounter from "@/components/animations/NumberIncrement";

interface OfferAdjustmentSliderProps {
  onSubmit: (offerAmount: number) => void;
  onSkip?: () => void;
  initialOffer?: number;
  minOffer?: number;
  maxOffer?: number;
}

export function OfferAdjustmentSlider({
  onSubmit,
  onSkip,
  initialOffer = 500500,
  minOffer = initialOffer * 0.97,
  maxOffer = initialOffer * 1.03,
}: OfferAdjustmentSliderProps) {
  const [offerValue, setOfferValue] = useState(initialOffer);
  const [submitted, setSubmitted] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const sliderText = textData.step6Content.offerAdjustmentSlider;
  const adjustmentOptions = sliderText.adjustmentOptions.map((opt) => ({
    id: opt.text.toLowerCase().replace(/\s+/g, "-"),
    text: opt.text,
    description: opt.description,
    icon: opt.icon,
  }));
  const buttons = sliderText.buttons;

  // Handle slider value change
  const handleSliderChange = (value: number[]) => {
    if (submitted) return;
    setOfferValue(value[0]);
  };

  // Handle form submission
  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    onSubmit(offerValue);
  };

  // Handle skip action
  const handleSkip = () => {
    if (submitted) return;
    setSubmitted(true);
    if (onSkip) {
      onSkip();
    } else {
      onSubmit(initialOffer);
    }
  };

  // Handle option selection
  const handleOptionSelect = (option: {
    id: string;
    text: string;
    description: string;
    icon?: string;
  }) => {
    console.log("Selected option:", option);
  };

  // Toggle side panel
  const togglePanel = () => {
    setIsPanelOpen(!isPanelOpen);
  };

  const finalOfferText = textData.step6Content.finalOfferCard;
  const offerSection = finalOfferText.offerSection;
  const liveMetrics = finalOfferText.liveMetricsSection;

  return (
    <div className="space-y-4 relative">
      <div className="agentChat py-1">{sliderText.agentMessage}</div>
      <div className="flex justify-end gap-2">
        <button
          onClick={handleSkip}
          className="font-[ClashDisplay-Medium] px-6 py-3 text-white rounded-full text-sm bg-[#1354B6]"
          disabled={submitted}
        >
          Skip
        </button>
        <button
          onClick={togglePanel}
          className="font-[ClashDisplay-Medium] px-6 py-3 text-white rounded-full text-sm bg-[#1354B6]"
          disabled={submitted}
        >
          Adjust offer
        </button>
      </div>

      {/* Sliding Side Panel */}
      {isPanelOpen && (
        <div className="fixed top-0 right-0 h-screen w-full overflow-auto bg-[#fff] shadow-lg transform transition-transform duration-300 ease-in-out z-50 "> 
          <div className="relative p-4 ">
            {/* Close Icon in Top-Right Corner */}
            <button onClick={togglePanel} className="absolute top-4 right-4">
              <X className="h-8 w-8 text-[#1354B6]" />
            </button>

            {/* Header for the Panel */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-[ClashDisplay-Medium] text-[#1354B6] mb-6">
              Adjust offer
            </h1>

            {/* Offer Section */}
            <div className="bg-[#B8D4FF] mb-6 rounded-[16px] px-2 py-2">
              <div className="bg-[#B8D4FF] rounded-[16px] relative mb-2">
                <div className="relative rounded-[20px]">
                  <div className="text-center space-y-2 py-3 overflow-visible">
                    <h3 className="textColor text-xs sm:text-sm md:text-base font-[ClashDisplay-Medium]">
                      {offerSection.recommendationLabel}
                    </h3>
                    <div className="relative flex justify-center items-center gap-1">
                      <div className="bg-[#0036AB] text-white text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] leading-8 px-16 py-0 sm:px-16 md:px-20 lg:px-10 lg:py-0 rounded-full inline-flex items-center">
                        $<NumberCounter endValue={787800} duration={8500} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Live Metrics Section */}
                <div className="grid grid-cols-5 gap-2">
                  <div className="bg-white rounded-[18px] px-2 py-1 text-center overflow-hidden">
                    <div className="text-[10px] sm:text-xs md:text-sm lg:text-xs textColor font-[Geologica] font-light text-wrap">
                      {liveMetrics.winProbability}
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] textColor py-2 sm:py-3 md:py-4 lg:py-6">
                      <NumberCounter endValue={89} duration={3500} />%
                    </div>
                  </div>

                  <div className="bg-white rounded-[18px] px-2 py-1 col-span-2">
                    <div className="text-[10px] sm:text-xs md:text-sm textColor font-[Geologica] font-light">
                      {liveMetrics.offerStrategy}
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] leading-tight textColor py-2 sm:py-4 md:py-10">
                      {liveMetrics.moreAggressive}
                    </div>
                  </div>

                  <div className="bg-white rounded-[18px] px-2 py-1 col-span-2">
                    <div className="text-[10px] sm:text-xs md:text-sm font-[ClashDisplay-Medium] textColor">
                      {liveMetrics.marketConditions}
                    </div>
                    <div className="mt-1">
                      <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] textColor">
                        Seller's market
                      </div>
                      <div className="text-[10px] sm:text-sm md:text-base font-[ClashDisplay-Medium] text-[#37D3AE]">
                        High competition
                      </div>
                    </div>
                  </div>

                  <div className="col-span-3 bg-white rounded-xl px-2 py-1">
                    <div className="text-[10px] sm:text-xs md:text-sm textColor font-[Geologica] font-light">
                      {liveMetrics.yourOffer}
                    </div>
                    <div className="flex flex-col items-center mt-2">
                      <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] textColor">
                        $<NumberCounter endValue={787800} duration={8500} />
                      </div>
                      <div className="text-[10px] sm:text-xs md:text-sm textColor font-[Geologica] font-light flex items-center">
                        ($
                        <NumberCounter endValue={10000} duration={8500} />)
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#E0E0E0] rounded-xl px-2 py-1 col-span-2">
                    <div className="text-[10px] sm:text-xs md:text-sm font-[ClashDisplay-Medium] text-[#717171]">
                      {liveMetrics.listOffer}
                    </div>
                    <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] text-[#585858] mt-2">
                      $<NumberCounter endValue={780800} duration={8500} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel Content (Elements after SidePanel Comment) */}
            <ChatOptionButtonWithDescription
              options={adjustmentOptions}
              onSelect={handleOptionSelect}
              variant="non-locking"
              submitted={submitted}
            />

            {/* Instruction */}
            <p className="text-[#000] text-lg font-[Geologica] font-semibold mt-6">
              {sliderText.sliderTitle}
            </p>

            {/* Instruction */}
            <p className="text-[#8D8D8D] text-xs font-[Geologica] font-normal">
              {sliderText.instruction}
            </p>

            {/* Slider Section */}
            <div className="space-y-2 mt-4">
              <div className="relative flex items-center w-full">
                <Slider
                  value={[offerValue]}
                  min={minOffer}
                  max={maxOffer}
                  step={1000}
                  onValueChange={handleSliderChange}
                  disabled={submitted}
                  className="w-full"
                />

                <span className="absolute bottom-[-25px] left-0 text-[#272727] text-sm font-[Geologica] font-normal">
                  ${minOffer.toLocaleString()} (-3%)
                </span>

                <span className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 text-[#272727] text-sm font-[Geologica] font-normal">
                  ${offerValue.toLocaleString()}
                </span>

                <span className="absolute bottom-[-25px] right-0 text-[#272727] text-sm font-[Geologica] font-normal">
                  ${maxOffer.toLocaleString()} (+3%)
                </span>
              </div>

              <div className="flex justify-center mt-14 ">
                <input
                  type="text"
                  value={`$${offerValue.toLocaleString()}`}
                  readOnly
                  className={`w-full p-2 py-3 rounded-full text-[#0036AB] text-2xl font-[ClashDisplay-Medium] text-center focus:outline-none ${
                    submitted ? "bg-[#B8D4FF] py-2" : "bg-black/10 "
                  }`}
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 mt-6">
              <button
                type="button"
                onClick={handleSkip}
                className={`flex-1 py-2 bg-[#0036AB]/50 text-white rounded-full text-sm font-[ClashDisplay-Medium] ${
                  submitted
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-[#1354B6]"
                }`}
                disabled={submitted}
              >
                {buttons.skip}
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className={`flex-1 py-2 bg-[#0036AB] text-white rounded-full text-sm font-[ClashDisplay-Medium] ${
                  submitted
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-[#1354B6]"
                }`}
                disabled={submitted}
              >
                {buttons.submit}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OfferAdjustmentSlider;
