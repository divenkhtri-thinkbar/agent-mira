import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type MarketType = "seller" | "balanced" | "buyer";

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
}: MarketGaugeProps) {
  const [activeTab, setActiveTab] = useState<"home" | "city" | "county">("county");
  const [marketType, setMarketType] = useState<MarketType>(initialMarketType);

  // Simulate market type change based on tab
  useEffect(() => {
    const marketTypes: MarketType[] = ["seller", "balanced", "buyer"];
    const index = Math.floor(Math.random() * marketTypes.length); // Random simulation
    setMarketType(marketTypes[index]);
  }, [activeTab]);

  // Define rotation angles for the arrow based on market type
  const getRotation = (type: MarketType) => {
    switch (type) {
      case "seller":
        return -60; // Points left (seller's market)
      case "balanced":
        return 0; // Points straight up (balanced)
      case "buyer":
        return 60; // Points right (buyer's market)
      default:
        return 0;
    }
  };

  return (
    <div className="px-20 py-4 w-full h-full items-center justify-center bg-[#F4F4F4]">
      <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 textColor mb-4 text-center">
        Analyzing Current Market Conditions
      </h1>
      <div className="overflow-hidden">
        {/* Tabs */}
        <div className="flex gap-1">
          {[
            { id: "county", label: "County" },
            { id: "home", label: "Home Category" },
            { id: "city", label: "City" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                "flex-1 py-2 px-4 text-sm font-medium bg-[#E6EEFF] textColor rounded-t-lg transition-colors",
                activeTab === tab.id ? "bg-[#B8D4FF]" : "hover:bg-white/50"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Gauge with Indicator and Price Trends */}
        <div className="bg-white p-6 pb-4 border-4 border-[#B8D4FF] relative">
          <div className="relative w-full h-32 flex justify-center items-end mb-10">
            <div className="relative w-48 h-24 overflow-hidden">
              <div className="absolute bottom-0 w-full h-24 rounded-t-full bg-gray-200">
                <div
                  className="absolute top-0 left-0 w-1/3 h-full bg-red-500"
                  style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}
                />
                <div
                  className="absolute top-0 left-1/3 w-1/3 h-full bg-yellow-500"
                  style={{ clipPath: "polygon(0 100%, 50% 0, 100% 100%)" }}
                />
                <div
                  className="absolute top-0 right-0 w-1/3 h-full bg-green-500"
                  style={{ clipPath: "polygon(0 100%, 0% 0, 100% 100%)" }}
                />
              </div>
            </div>
            {/* Indicator Arrow */}
            <motion.div
              className="absolute w-8 h-8 flex justify-center items-center"
              style={{ bottom: "0", transformOrigin: "center bottom" }}
              initial={{ rotate: getRotation(initialMarketType) }}
              animate={{ rotate: getRotation(marketType) }}
              transition={{ type: "spring", stiffness: 100, damping: 15 }}
            >
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                <path
                  d="M8 2L8 20M8 2L4 6M8 2L12 6"
                  stroke="black"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
            {/* Labels */}
            <div className="absolute w-full flex justify-between text-xs mt-4 text-gray-600">
              <span className="ml-6">Seller's</span>
              <span className="text-center w-full">Balanced</span>
              <span className="mr-6">Buyer's</span>
            </div>
          </div>
          {/* Price Trends - Bottom Left */}
          <div className="font-[ClashDisplay-Medium] absolute bottom-0 left-0 bg-[#B8D4FF] px-3 py-0.5 rounded-tr-[10px] text-lg font-medium text-blue-800/70">
            Price Trends
          </div>
        </div>

        {/* Stats */}
        <div className="bg-white space-y-6 ">
          <div className=" ">
            {/* Median Price */}
            <div className="flex items-end justify-between relative h-18 border-4 border-t-0 border-[#B8D4FF] ">
              <div className="flex items-end gap-14">
                <div className="absolute top-0 left-0 p-1 bg-[#B8D4FF] rounded-full rounded-tl-none">
                  <div className="  w-6 h-6 rounded-full bg-[#1354B6] flex items-center justify-center text-[#37D3AE] font-medium">
                    $
                  </div>
                </div>
                <span className="font-[ClashDisplay-Medium] text-base  textColor ml-2 mb-1">
                  Median Price
                </span>
              </div>
              <div className="text-right px-2 mb-2">
                <div className="text-xl font-semibold text-blue-900">
                  ${medianPrice.toLocaleString()}
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-red-500">↑ {priceYoY}% YoY</span>
                  <span className="text-green-500">↑ {priceMoM}% MoM</span>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between relative h-18 border-4 border-t-0 border-[#B8D4FF] ">
              <div className="flex items-end gap-14">
                <div className="absolute top-0 left-0 p-1 bg-[#B8D4FF] rounded-full rounded-tl-none">
                  <div className="  w-6 h-6 rounded-full bg-[#1354B6] flex items-center justify-center text-[#37D3AE] font-medium">
                    %
                  </div>
                </div>
                <span className="font-[ClashDisplay-Medium] text-base  textColor ml-2 mb-1">
                  Sale To List Ratio
                </span>
              </div>
              <div className="text-right px-2 mb-2">
                <div className="text-xl font-semibold text-blue-900">
                  {saleToListRatio}%
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-green-500">
                    {belowAsking}% Below Asking On Avg.
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between relative h-18 border-4 border-t-0 border-[#B8D4FF] ">
              <div className="flex items-end gap-14">
                <div className="absolute top-0 left-0 p-1 bg-[#B8D4FF] rounded-full rounded-tl-none">
                  <div className="  w-6 h-6 rounded-full bg-[#1354B6] flex items-center justify-center text-[#37D3AE] font-medium">
                    ↓
                  </div>
                </div>
                <span className="font-[ClashDisplay-Medium] text-base  textColor ml-2 mb-1">
                  Price Reduced Listings
                </span>
              </div>
              <div className="text-right px-2 mb-2">
                <div className="text-xl font-semibold text-blue-900">
                  {priceReduced}%
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-red-500">
                    +{lastMonthChange}% From Last Month
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between relative h-18 border-4 border-t-0 border-[#B8D4FF] ">
              <div className="flex items-end gap-14">
                <div className="absolute top-0 left-0 p-1 bg-[#B8D4FF] rounded-full rounded-tl-none">
                  <div className="  w-6 h-6 rounded-full bg-[#1354B6] flex items-center justify-center text-[#37D3AE] font-medium">
                    ⊙
                  </div>
                </div>
                <span className="font-[ClashDisplay-Medium] text-base  textColor ml-2 mb-1">
                  Median Days on Market
                </span>
              </div>
              <div className="text-right px-2 mb-2">
                <div className="text-xl font-semibold text-blue-900">
                  {medianDays} Days
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-red-500">{daysYoY}% YoY</span>
                  <span className="text-green-500">
                    {daysVsLast} Days VsLast
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Section */}
        <div className="flex items-end justify-between relative h-18 border-4 border-t-0 border-[#B8D4FF] bg-black/5 ">
          <div className="flex items-end gap-14 ">
            <div className="absolute top-0 left-0 p-1 bg-[#B8D4FF] rounded-full rounded-tl-none">
              <div className="  w-6 h-6 rounded-full bg-[#1354B6] flex items-center justify-center text-[#37D3AE] font-medium"></div>
            </div>
            <span className="font-[ClashDisplay-Medium] text-base  textColor ml-2 mb-1">
              Other
            </span>
          </div>
          <div className="text-right px-2 mb-2">
            <div className="text-xl font-semibold text-blue-900">0000</div>
            <div className="flex justify-end gap-2 text-xs">
              <span className="text-red-500 text-right">-----</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
