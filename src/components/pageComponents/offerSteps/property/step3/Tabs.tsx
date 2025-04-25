import { cn } from "@/lib/utils";
import textData from "@/config/text.json";

interface TabsProps {
  activeTab: "county" | "home" | "city";
  setActiveTab: (tab: "county" | "home" | "city") => void;
}

export default function Tabs({ activeTab, setActiveTab }: TabsProps) {
  const tabsText = textData.step3Content.marketGauge.tabs;
  const tabs = [
    { id: "county", label: tabsText.county },
    { id: "city", label: tabsText.city },
    { id: "home", label: tabsText.home },
  ];

  return (
    <div className="flex gap-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as typeof activeTab)}
          className={cn(
            "cursor-pointer flex-1 py-2 px-4 text-sm font-medium bg-[#E6EEFF] textColor rounded-t-lg transition-colors",
            activeTab === tab.id ? "bg-[#B8D4FF]" : "hover:bg-white/50"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}