import { ArrowRight } from "lucide-react";
import { agent } from "@/assets/images";
import { useState } from "react";
import textData from "@/config/text.json";
import {
  MarketGauge,
  MarketType,
} from "@/components/pageComponents/offerSteps/property/step3/marketGauge";
import Speedometer from "../offerSteps/property/step3/Speedometer";
import Tabs from "../offerSteps/property/step3/Tabs";

interface DropdownMobileRightCardProps {
  onToggle: () => void;
  isExpanded: boolean;
  imageSrc?: string;
  topText?: string;
  boldText?: string;
  subtitle?: string;
  label?: string;
}

const DropdownMobileRightCard: React.FC<DropdownMobileRightCardProps> = ({
  onToggle,
  isExpanded,
  imageSrc = agent,
  topText,
  boldText,
  subtitle,
  label,
}) => {
  const marketGaugeData = textData.step3Content.marketGauge.data;
  const [activeTab, setActiveTab] = useState<"home" | "neighbourhood" | "city">("home");
  const [selectedMarketAnalysisId, setSelectedMarketAnalysisId] = useState<string | null>(null);

  return (
    <div className="flex items-center justify-end z-50 pb-2">
      <div className="w-62 h-auto p-2 flex flex-col bg-[#E3EEFF] rounded-[20px] text-center items-center cursor-pointer">
        <div
          onClick={onToggle} // Use the prop function
          className={`w-full ${isExpanded ? "pb-2" : "pb-0"} flex gap-2 items-center`}
        >
          <button className="h-6 w-6 rounded-full bg-[#1354B6]"></button>
          <h1 className="font-[Geologica] text-[12px] font-normal textColor">
            {label}
          </h1>
        </div>

        <div
          className={`content-box overflow-hidden transition-all duration-400 ease-in-out ${
            isExpanded ? "opacity-100 max-h-screen" : "opacity-0 max-h-0"
          }`}
        >
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} variant={"mobile"} />
          <Speedometer variant={"mobile"} />
        </div>
      </div>

      <div className="bg-[#1354B6] text-white p-2 rounded-full ml-2 rotate-[-45deg] flex items-center justify-center">
        <ArrowRight strokeWidth={1.5} className="h-5 w-5" />
      </div>
    </div>
  );
};

export default DropdownMobileRightCard;