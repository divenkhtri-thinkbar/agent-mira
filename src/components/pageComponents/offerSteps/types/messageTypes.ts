import { JSX } from "react";

export type MessageType = {
  id: string;
  type:
    | "agent"
    | "user"
    | "options"
    | "form"
    | "loading"
    | "address-input"
    | "confirmation"
    | "winning-offer" // General winning offer (can be reused elsewhere)
    | "market-analysis"
    | "filter-properties"
    | "market-insights"
    | "know-about-quality-score" // Step 4 specific
    | "inside-scoop" // Step 4 specific
    | "repairs-needed" // Step 4 specific
    | "property-in-person" // Step 4 specific
    | "first-impression" // Step 4 specific
    | "features-looking" // Step 4 specific
    | "right-card"
    | "property-view"
    | "comparable-card"
    | "market-gauge-card"
    | "initial-card"
    | "in-person-card"
    | "confirmation-card"
    | "video-card"
    | "customize-offer-card"
    | "review-offer-card"
    | "c"
    | "property-card";
  content: string | JSX.Element;
  options?: Array<{ id: string; text: string; icon: string }>;
  showAvatar?: boolean;
  isError?: boolean;
  selectedMarketAnalysisOption?: string;
  optionRefs?: React.RefObject<HTMLDivElement | null>[]; // Updated to allow null
};

export default interface Message {
  id: string;
  timestamp?: string;
  message: MessageType;
}
