import { cn } from "@/lib/utils";
import {
  Building2,
  Search,
  Shield,
  Sparkles,
  TrendingUp,
  Scale,
  PieChart,
} from "lucide-react";
import { useState } from "react";

interface OptionSelectorProps {
  options: Array<{
    id: string;
    text: string;
    icon?: string;
  }>;
  onSelect: (option: { id: string; text: string; icon?: string }) => void;
  variant?:
    | "default"
    | "non-locking"
    | "know-about-quality-score"
    | "side-by-side"
    | "data-switch";
    optionRefs?: React.RefObject<HTMLDivElement | null>[]; 
}

const iconMap = {
  sparkles: Sparkles,
  building: Building2,
  shield: Shield,
  search: Search,
  check: Sparkles,
  x: Shield,
  meh: Search,
  "trending-up": TrendingUp,
  scale: Scale,
  "pie-chart": PieChart,
};

export function ChatOptionButton({
  options,
  onSelect,
  variant = "default",
  optionRefs,
}: OptionSelectorProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const handleOptionClick = (option: {
    id: string;
    text: string;
    icon?: string;
  }) => {
    if (
      variant !== "non-locking" &&
      selectedOptionId &&
      variant !== "know-about-quality-score" &&
      variant !== "side-by-side" &&
      variant !== "data-switch" // Allow re-selection for data-switch
    )
      return; // Lock for default variant only
    setSelectedOptionId(option.id);
    onSelect(option);
  };

  const isSideBySide =
    variant === "know-about-quality-score" || variant === "side-by-side";
  const isDataSwitch = variant === "non-locking";

  return (
    <div
      className={cn(
        "space-y-2",
        isSideBySide && "flex flex-wrap gap-2 justify-center"
      )}
    >
      {options.map((option, index) => {
        const Icon = option.icon
          ? iconMap[option.icon as keyof typeof iconMap] || Search
          : null;
        const isSelected = selectedOptionId === option.id;
        const isDisabled =
          variant === "default" && selectedOptionId !== null && !isSelected;

        return (
          <div
            key={option.id}
            ref={optionRefs && optionRefs[index]}
            className={cn(
              "flex items-center rounded-full justify-start gap-3 text-left p-2 cursor-pointer",
              isSideBySide ? "sm:h-12 sm:w-40 px-2 h-10" : "w-full",
              isDataSwitch
                ? isSelected
                ? "bg-[#37D3AE]" // Green for selected data-switch
                : "bg-[#1354B6] hover:bg-[#5D9DFE]" // Dark blue for unselected data-switch
                : isSelected
                ? "bg-[#FFFFFF] border-2 border-green-500" // White with green border for selected (non-data-switch)
           
                : isSideBySide
                ? "bg-[#1354B6] hover:bg-[#5D9DFE]" // Dark blue for unselected side-by-side
                : "bg-[#1354B6] hover:bg-[#5D9DFE]", // Dark blue for unselected default
              isDisabled && "opacity-50 cursor-not-allowed"
            )}
            onClick={() => handleOptionClick(option)}
          >
            {Icon && !isSideBySide && (
              <div
                className={cn(
                  "rounded-full p-4",
                  isSelected
                    ? isDataSwitch
                      ? "bg-[#B8D4FF]" // Light blue for selected data-switch icon background
                      : "bg-[#96C0FF]" // Lighter blue for selected (non-data-switch) icon background
                    : "bg-[#B8D4FF]" // Default unselected icon background
                )}
              >
                <Icon className={cn("w-6 h-6 text-[#1354B6]")} />
              </div>
            )}
            <span
              className={cn(
                "font-[Geologica] font-light text-wrap text-base truncate",
                isSideBySide ? "px-2 text-center flex-1" : "",
                isSelected
                  ? "text-[#1354B6]" // Dark blue text for all selected states
                  : isDataSwitch
                  ? "text-[#F4F4F4]" // White text for unselected data-switch
                  : isSideBySide
                  ? "text-[#fff]" // Near-black text for unselected side-by-side
                  : "text-[#fff]" // White text for unselected non-data-switch (default)
              )}
            >
              {option.text}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export default ChatOptionButton;
