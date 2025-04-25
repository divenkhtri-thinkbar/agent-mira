import { cn } from "@/lib/utils";
import textData from "@/config/text.json";

interface TabsProps {
  activeTab: "home" | "neighbourhood" | "city";
  setActiveTab: (tab: "home" | "neighbourhood" | "city") => void;
  variant:string;
}

export default function Tabs({ activeTab, setActiveTab,variant }: TabsProps) {
  const tabsText = textData.step3Content.marketGauge.tabs;
  const tabs = [
    { id: "home", label: tabsText.home },
    { id: "neighbourhood", label: tabsText.neighbourhood },
    { id: "city", label: tabsText.city },
  ];

  return (
    <div className={` ${variant==="mobile" ? "w-full  flex justify-center bg-[#E3EEFF]": "flex gap-1"}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id as typeof activeTab)}
          className={cn(
            "flex-1 py-2 px-4 text-[10px] sm:text-sm font-medium bg-[#E6EEFF] text-white rounded-t-lg transition-colors",
            activeTab === tab.id ? "bg-[#1354B6] " : "hover:bg-white/50 bg-[#1354B6] opacity-50"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}