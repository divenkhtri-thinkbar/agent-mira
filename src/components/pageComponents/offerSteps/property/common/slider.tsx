"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import ChatOptionButtonWithDescription from "./chatOptionButtonWithDescription";

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
  initialOffer = 5504000,
  minOffer = initialOffer * 0.97,
  maxOffer = initialOffer * 1.03,
}: OfferAdjustmentSliderProps) {
  const [offerValue, setOfferValue] = useState(initialOffer);
  const [submitted, setSubmitted] = useState(false);

  const adjustmentOptions = [
    {
      id: "adjust-offer",
      text: "Adjust your offer",
      description: "Fine-tune your bid to optimize your chances",
      icon: "sparkles",
    },
    {
      id: "adjust-offesr",
      text: "Adjust your offer conservatively",
      description: "Make a cautious adjustment",
      icon: "shield",
    },
    {
      id: "adjust-ofsfer",
      text: "Adjust your offer aggressively",
      description: "Go bold to stand out",
      icon: "trending-up",
    },
  ];

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
  };

  return (
    <div className="space-y-4">
      <div className="agentChat py-1">
        Now would you like to customise your offer? How competitive would you
        like your offer to be?
      </div>
      <ChatOptionButtonWithDescription
        options={adjustmentOptions}
        onSelect={handleOptionSelect}
        variant="non-locking"
        submitted={submitted}
      />

      {/* Instruction */}
      <p className="text-[#8D8D8D] text-xs font-[Geologica] font-normal">
        Move the slider to see how different offer amounts affect your win
        probability and market position
      </p>

      {/* Slider Section */}
      <div className="space-y-2">
        <div className="relative flex items-center w-full">
          {/* Slider */}
          <Slider
            value={[offerValue]}
            min={minOffer}
            max={maxOffer}
            step={1000}
            onValueChange={handleSliderChange}
            disabled={submitted}
            className="w-full"
          />

          {/* Min Offer (Left End) */}
          <span className="absolute bottom-[-25px] left-0 text-[#272727] text-sm font-[Geologica] font-normal">
            ${minOffer.toLocaleString()} (-3%)
          </span>

          {/* Current Offer Value (Centered) */}
          <span className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 text-[#272727] text-sm font-[Geologica] font-normal">
            ${offerValue.toLocaleString()}
          </span>

          {/* Max Offer (Right End) */}
          <span className="absolute bottom-[-25px] right-0 text-[#272727] text-sm font-[Geologica] font-normal">
            ${maxOffer.toLocaleString()} (+3%)
          </span>
        </div>

        {/* Value Field */}
        <div className="flex justify-center mt-14">
          <input
            type="text"
            value={`$${offerValue.toLocaleString()}`}
            readOnly
            className={`w-full p-2 py-3 rounded-full text-[#0036AB] text-2xl font-[ClashDisplay-Medium] text-center focus:outline-none ${submitted? 'bg-white/60 py-2' : 'bg-white'}`}
          />
        </div>
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 mt-6">
        <button
          type="button"
          onClick={handleSkip}
          className={`flex-1 py-2 bg-[#0036AB]/50 text-white rounded-full text-sm font-[ClashDisplay-Medium] ${
            submitted ? "cursor-not-allowed opacity-50" : "hover:bg-[#1354B6]"
          }`}
          disabled={submitted}
        >
          Skip
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className={`flex-1 py-2 bg-[#0036AB] text-white rounded-full text-sm font-[ClashDisplay-Medium] ${
            submitted ? "cursor-not-allowed opacity-50" : "hover:bg-[#1354B6]"
          }`}
          disabled={submitted}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

export default OfferAdjustmentSlider;
