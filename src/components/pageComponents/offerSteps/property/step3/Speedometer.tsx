import { useEffect, useState } from "react";
import ReactSpeedometer from "react-d3-speedometer";
import textData from "@/config/text.json";

type MarketType = "seller" | "balanced" | "buyer";

interface SpeedometerProps {
  marketType: MarketType;
  selectedMarketAnalysisOption?: string | null;
}

export default function Speedometer({
  marketType,
  selectedMarketAnalysisOption,
}: SpeedometerProps) {
  const getSpeedometerValue = (type: MarketType): number => {
    switch (type) {
      case "seller":
        return 250;
      case "balanced":
        return 500;
      case "buyer":
        return 750;
      default:
        return 500;
    }
  };

  const speedometerText = textData.step3Content.marketGauge.speedometer;
  const headerOptions = speedometerText.headerOptions;

  const getHeaderText = () => {
    switch (selectedMarketAnalysisOption) {
      case "1":
        return headerOptions.priceTrends;
      case "2":
        return headerOptions.supplyAvailability;
      case "3":
        return headerOptions.demandCompetition;
      default:
        return headerOptions.priceTrends;
    }
  };

  const getSpeedometerDimensions = () => {
    const width = window.innerWidth;
    if (width >= 1520) {
      return { width: 400, height: 200, ringWidth: 170,needleHeightRatio:0.7 };
    } else if (width >= 1367) {
      return { width: 350, height: 200, ringWidth: 140,needleHeightRatio:0.7 };
    } else if (width >= 1366) {
      return { width: 350, height: 200, ringWidth: 130,needleHeightRatio:0.7 };
    } else if (width >= 1280) {
      return { width: 300, height: 200, ringWidth: 110,needleHeightRatio:0.7 };
    } else if (width >= 1200) {
      return { width: 250, height: 170, ringWidth: 90,needleHeightRatio:0.7 };
    } else if (width >= 1024) {
      return { width: 250, height: 200, ringWidth: 170,needleHeightRatio:0.7 };
    } else {
      return {width: 205, height: 105, ringWidth: 80,needleHeightRatio:0.7 };
    }
  };

  const [dimensions, setDimensions] = useState(getSpeedometerDimensions());

  useEffect(() => {
    const handleResize = () => {
      setDimensions(getSpeedometerDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-white p-4 sm:p-6 pb-4 border-4 border-[#B8D4FF] relative w-full max-w-3xl mx-auto">
      <div className="relative w-full flex justify-center items-center mb-12 sm:mb-16">
        <div className="relative">
          <ReactSpeedometer
            maxValue={1000}
            value={getSpeedometerValue(marketType)}
            segments={3}
            segmentColors={["#F9462D", "#F7BE2D", "#3FE972"]}
            needleColor="#fff"
            ringWidth={dimensions.ringWidth}
            width={dimensions.width}
            height={dimensions.height}
            maxSegmentLabels={0}
            needleTransitionDuration={500}
            currentValueText=""
            textColor="transparent"
            forceRender={true}
          />
          <div
            className="absolute font-[ClashDisplay-Medium] text-sm sm:text-base md:text-lg leading-4 text-wrap text-white/80 text-center"
            style={{ left: "50%", top: "25%", transform: "translateX(-50%)" }}
          >
            {speedometerText.balancedMarket} <br /> 
          </div>
          <div className="absolute w-full font-[ClashDisplay-Medium] text-sm sm:text-base md:text-lg leading-7 textColor flex justify-between mb-0">
            <span style={{ marginLeft: "20px" }}>{speedometerText.sellersMarket}</span>
            <span style={{ marginRight: "20px" }}>{speedometerText.buyersMarket}</span>
          </div>
        </div>
      </div>
      <div className="font-[ClashDisplay-Medium] absolute bottom-0 left-0 bg-[#B8D4FF] px-3 py-0.5 rounded-tr-[10px] text-sm sm:text-base md:text-lg font-medium text-blue-800/70">
        {getHeaderText()}
      </div>
    </div>
  );
}