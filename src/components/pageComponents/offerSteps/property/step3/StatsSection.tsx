import textData from "@/config/text.json";

interface StatsSectionProps {
  selectedMarketAnalysisOption?: string | null;
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

interface StatItemProps {
  icon: string;
  label: string;
  value: string | number;
  subStats?: { text: string; color: string }[];
  isPlaceholder?: boolean;
}

const StatItem = ({ icon, label, value, subStats, isPlaceholder = false }: StatItemProps) => (
  <div
    className={`flex items-end justify-between relative h-18 xl:h-22 2xl:h-18 border-4 border-t-0 border-[#B8D4FF] ${
      isPlaceholder ? "bg-black/5" : ""
    }`}
  >
    <div className="flex items-end gap-14 xl:gap-28">
      <div className="absolute top-0 left-0 p-1 bg-[#B8D4FF] rounded-full rounded-tl-none ">
        <div className="w-6 h-6 rounded-full bg-[#1354B6] flex items-center justify-center text-[#37D3AE] font-medium">
          {icon}
        </div>
      </div>
      <span className="lg:pt-20 font-[ClashDisplay-Medium] text-base lg:text-xs xl:text-sm textColor ml-2 py-1">{label}</span>
    </div>
    <div className="text-right px-2 mb-2">
      <div className="text-xl font-semibold text-blue-900">{value}</div>
      {subStats && (
        <div
          className={`text-xs text-right ${
            label === textData.step3Content.marketGauge.stats.supplyAvailability.monthsOfInventory ? "flex flex-col items-end" : "flex items-center gap-2"
          }`}
        >
          {subStats.map((stat, idx) => (
            <span key={idx} className={stat.color}>
              {stat.text}
            </span>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default function StatsSection({
  selectedMarketAnalysisOption,
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
}: StatsSectionProps) {
  const statsText = textData.step3Content.marketGauge.stats;

  const getStats = () => {
    switch (selectedMarketAnalysisOption) {
      case "1":
        return [
          {
            icon: "$",
            label: statsText.priceTrends.medianPrice,
            value: `$${medianPrice.toLocaleString()}`,
            subStats: [
              { text: `↑ ${priceYoY}% YoY`, color: "text-red-500" },
              { text: `↑ ${priceMoM}% MoM`, color: "text-green-500" },
            ],
          },
          {
            icon: "%",
            label: statsText.priceTrends.saleToListRatio,
            value: `${saleToListRatio}%`,
            subStats: [{ text: `${belowAsking}${statsText.priceTrends.belowAskingOnAvg}`, color: "text-green-500" }],
          },
          {
            icon: "↓",
            label: statsText.priceTrends.priceReducedListings,
            value: `${priceReduced}%`,
            subStats: [{ text: `+${lastMonthChange}${statsText.priceTrends.fromLastMonth}`, color: "text-red-500" }],
          },
          {
            icon: "⊙",
            label: statsText.priceTrends.medianDaysOnMarket,
            value: `${medianDays} ${statsText.priceTrends.days}`,
            subStats: [
              { text: `${daysYoY}% YoY`, color: "text-red-500" },
              { text: `${daysVsLast} ${statsText.priceTrends.days} VsLast`, color: "text-green-500" },
            ],
          },
          {
            icon: "",
            label: statsText.priceTrends.other,
            value: "0000",
            subStats: [{ text: "-----", color: "text-red-500" }],
            isPlaceholder: true,
          },
        ];

      case "2":
        return [
          {
            icon: "📋",
            label: statsText.supplyAvailability.activeListings,
            value: "4601",
            subStats: [{ text: "-25% YoY", color: "text-[#FF4646]" }],
          },
          {
            icon: "%",
            label: statsText.supplyAvailability.absorptionRate,
            value: "14%",
            subStats: [{ text: statsText.supplyAvailability.monthly, color: "text-[#797979]" }],
          },
          {
            icon: "📅",
            label: statsText.supplyAvailability.monthsOfInventory,
            value: "6",
            subStats: [
              { text: `${statsText.supplyAvailability.lastMonth}: 2.4`, color: "text-[#797979]" },
              { text: `${statsText.supplyAvailability.twoMonthsAgo}: 2.8`, color: "text-[#797979]" },
            ],
          },
        ];

      case "3":
        return [
          {
            icon: "$",
            label: statsText.demandCompetition.cashTransactions,
            value: "31%",
            subStats: [
              { text: "1% YoY", color: "text-[#3FE972]" },
              { text: "3% MoM", color: "text-[#3FE972]" },
              { text: statsText.demandCompetition.ofAllSales, color: "text-[#797979]" },
            ],
          },
          {
            icon: "↕",
            label: statsText.demandCompetition.priceChanges,
            value: "24%",
            subStats: [{ text: `${statsText.demandCompetition.timeToDrop}: 21d`, color: "text-[#1354B6]" }],
          },
          {
            icon: "⚡",
            label: statsText.demandCompetition.marketActivity,
            value: "8%",
            subStats: [{ text: `${statsText.demandCompetition.newListings} +15%`, color: "text-[#1354B6]" }],
          },
          {
            icon: "⏱",
            label: statsText.demandCompetition.timing,
            value: "45%",
            subStats: [{ text: `${statsText.demandCompetition.avgTimeToClose}: 35d`, color: "text-[#1354B6]" }],
          },
        ];

      default:
        return [
          {
            icon: "$",
            label: statsText.priceTrends.medianPrice,
            value: `$${medianPrice.toLocaleString()}`,
            subStats: [
              { text: `↑ ${priceYoY}% YoY`, color: "text-red-500" },
              { text: `↑ ${priceMoM}% MoM`, color: "text-green-500" },
            ],
          },
          {
            icon: "%",
            label: statsText.priceTrends.saleToListRatio,
            value: `${saleToListRatio}%`,
            subStats: [{ text: `${belowAsking}${statsText.priceTrends.belowAskingOnAvg}`, color: "text-green-500" }],
          },
          {
            icon: "↓",
            label: statsText.priceTrends.priceReducedListings,
            value: `${priceReduced}%`,
            subStats: [{ text: `+${lastMonthChange}${statsText.priceTrends.fromLastMonth}`, color: "text-red-500" }],
          },
          {
            icon: "⊙",
            label: statsText.priceTrends.medianDaysOnMarket,
            value: `${medianDays} ${statsText.priceTrends.days}`,
            subStats: [
              { text: `${daysYoY}% YoY`, color: "text-red-500" },
              { text: `${daysVsLast} ${statsText.priceTrends.days} VsLast`, color: "text-green-500" },
            ],
          },
          {
            icon: "",
            label: statsText.priceTrends.other,
            value: "0000",
            subStats: [{ text: "-----", color: "text-red-500" }],
            isPlaceholder: true,
          },
        ];
    }
  };

  return (
    <div className="bg-white space-y-0">
      {getStats().map((stat, idx) => (
        <StatItem
          key={idx}
          icon={stat.icon}
          label={stat.label}
          value={stat.value}
          subStats={stat.subStats}
          isPlaceholder={stat.isPlaceholder}
        />
      ))}
    </div>
  );
}