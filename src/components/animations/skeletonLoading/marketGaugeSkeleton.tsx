import { verifyProperty } from "@/assets/images";
import CircularLoading from "../circularLoading";
import textData from "@/config/text.json";

interface SkeletonMarketGaugeProps {
  selectedMarketAnalysisOption?: string | null;
}

// Skeleton Component for MarketGauge
export function SkeletonMarketGauge({
  selectedMarketAnalysisOption,
}: SkeletonMarketGaugeProps) {
  return (
    <>
      <div className="overflow-hidden">
        {/* Skeleton for Tabs */}
        <div className="flex gap-1">
          {[
            { text: "Home", isFirst: true },
            { text: "Neighbourhood", isFirst: false },
            { text: "City", isFirst: false },
          ].map(({ text, isFirst }, idx) => (
            <div
              key={idx}
              className={`flex-1 h-10 ${
                isFirst ? "bg-[#E5E5E5]" : "bg-[#E5E5E5]/20"
              } rounded-t-lg animate-pulse flex items-center justify-center`}
            >
              <span
                className={`font-[ClashDisplay-Medium] text-[#FFFFFF] ${
                  isFirst ? "text-lg" : "text-sm"
                }`}
              >
                {text}
              </span>
            </div>
          ))}
        </div>

        {/* Skeleton for Speedometer with Image */}
        <div className="bg-[#E5E5E5] border-4 border-[#E5E5E5] rounded-r-[10px] relative overflow-hidden">
          <div className="relative w-full flex justify-center items-center">
            <img
              src={verifyProperty}
              alt="Speedometer Loading"
              className="w-full h-full object-cover rounded-[10px]"
            />
            <div className="absolute inset-0 bg-gray-200/70" />
          </div>
          {/* Skeleton for header text */}
          <div className="absolute bottom-0 left-0 bg-[#E5E5E5] px-3 py-0.5 rounded-tr-[10px]">
            <div className="w-24 h-6 rounded animate-pulse" />
          </div>
        </div>

        {/* Skeleton for StatsSection */}
        <div className="space-y-0">
          {Array.from({
            length: selectedMarketAnalysisOption === "2" ? 3 : 4,
          }).map((_, idx) => (
            <div
              key={idx}
              className="flex items-end justify-between relative h-18 border-4 rounded-r-[10px] border-t-0 bg-white border-[#E5E5E5]"
            >
              <div className="flex items-end gap-14">
                {/* Icon Placeholder */}
                <div className="absolute top-0 left-0 p-1 bg-[#E5E5E5] rounded-full rounded-tl-none">
                  <div className="w-6 h-6 rounded-full bg-white" />
                </div>
                {/* Label Placeholder */}
              </div>
            </div>
          ))}
          {/* Placeholder for "Other" stat in default/option 1 */}
          {(!selectedMarketAnalysisOption ||
            selectedMarketAnalysisOption === "1") && (
            <div className="flex items-end justify-between relative h-18 border-4 border-t-0 border-[#E5E5E5] rounded-[10px]">
              <div className="flex items-end gap-14">
                <div className="absolute top-0 left-0 p-1 bg-[#E5E5E5] rounded-full rounded-tl-none">
                  <div className="w-6 h-6 rounded-full bg-white/50" />
                </div>
              </div> 
            </div>
          )}
        </div>
      </div>

      {/* Circular Loading Overlay */}
      <CircularLoading message={textData.step3Content.marketConditionsLoadingMessage} />
    </>
  );
}
