
import { useState, useEffect } from "react";
import Tabs from "./Tabs";
import Speedometer from "./Speedometer";
import StatsSection from "./StatsSection";
import { SkeletonMarketGauge } from "@/components/animations/skeletonLoading/marketGaugeSkeleton";

export type MarketType = "seller" | "balanced" | "buyer";

interface MarketGaugeProps {
  initialMarketType: MarketType;
  medianPrice: number;
  priceYoY: number;
  priceMoM: number;
  saleToListRatio: number;
  belowAsking: number;
  priceReduced: number;
  lastMonthChange: number;
  medianDays: number;
  daysYoY: number;
  daysVsLast: number;
  selectedMarketAnalysisOption?: string | null;
  isLoading?: boolean;
  label:string;
  variant:string;
}

export function MarketGauge({
  initialMarketType,
  medianPrice,
  priceYoY,
  priceMoM,
  saleToListRatio,
  belowAsking,
  priceReduced,
  lastMonthChange,
  medianDays,
  daysYoY,
  daysVsLast,
  selectedMarketAnalysisOption,
  isLoading = false,
}: MarketGaugeProps) {
  const [activeTab, setActiveTab] = useState<"home" | "neighbourhood" | "city">("home");
  const [marketType, setMarketType] = useState<MarketType>(initialMarketType);

  useEffect(() => {
    const tabToMarketType: Record<typeof activeTab, MarketType> = {
      home: "seller",
      neighbourhood: "balanced",
      city: "buyer",
    };
    setMarketType(tabToMarketType[activeTab]);
  }, [activeTab]);

  return (
    <div className="px-20 py-4 w-full h-full items-center justify-center bg-[#F4F4F4]">
      <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 textColor mb-4 text-center">
        Analyzing Current Market Conditions
      </h1>
      {isLoading ? (
        <SkeletonMarketGauge selectedMarketAnalysisOption={selectedMarketAnalysisOption} />
      ) : (
        <div className="overflow-hidden">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} variant={"desktop"} />
          <Speedometer marketType={marketType} selectedMarketAnalysisOption={selectedMarketAnalysisOption} />
          <StatsSection
            selectedMarketAnalysisOption={selectedMarketAnalysisOption}
            medianPrice={medianPrice}
            priceYoY={priceYoY}
            priceMoM={priceMoM}
            saleToListRatio={saleToListRatio}
            belowAsking={belowAsking}
            priceReduced={priceReduced}
            lastMonthChange={lastMonthChange}
            medianDays={medianDays}
            daysYoY={daysYoY}
            daysVsLast={daysVsLast}
          />
        </div>
      )}
    </div>
  );
}