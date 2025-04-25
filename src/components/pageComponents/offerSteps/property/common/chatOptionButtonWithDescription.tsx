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
    description: string;
    icon?: string;
  }>;
  onSelect: (option: { id: string; text: string; description: string; icon?: string }) => void;
  variant?: "default" | "non-locking" | "with-description";
  optionRefs?: React.RefObject<HTMLDivElement>[];
  submitted?: boolean;
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

export function ChatOptionButtonWithDescription({
  options,
  onSelect,
  variant = "default",
  optionRefs,
  submitted = false,
}: OptionSelectorProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const handleOptionClick = (option: {
    id: string;
    text: string;
    description: string;
    icon?: string;
  }) => {
    if (submitted || (variant === "default" && selectedOptionId)) return;
    setSelectedOptionId(option.id);
    onSelect(option);
  };

  const isSideBySide = variant === "with-description";

  return (
    <div className={cn("space-y-2", isSideBySide && "flex flex-wrap gap-2 justify-center")}>
      {options.map((option, index) => {
        const Icon = option.icon ? iconMap[option.icon as keyof typeof iconMap] || Search : null;
        const isSelected = selectedOptionId === option.id;
        const isDisabled =
          (variant === "default" && selectedOptionId !== null && !isSelected) ||
          submitted;

        return (
          <div
            key={option.id}
            ref={optionRefs && optionRefs[index]}
            className={cn(
              "flex items-center rounded-full justify-start gap-3 text-left p-2 cursor-pointer",
              isSideBySide ? "w-auto px-4" : "w-full",
              isSelected
                ? "bg-[#fff] border-2 border-green-500"
                : "bg-[#1354B6]",
              isDisabled
                ? "opacity-50 cursor-not-allowed"
                : !isSelected && "hover:bg-blue-500"
            )}
            onClick={() => handleOptionClick(option)}
          >
            {Icon && (
              <div
                className={cn(
                  "rounded-full p-4",
                  isSelected ? "bg-[#B8D4FF]" : "bg-[#fff]"
                )}
              >
                <Icon className={cn("w-6 h-6 text-[#1354B6]")} />
              </div>
            )}
            <div className="flex flex-col">
              <span
                className={cn(
                  "font-[Geologica] font-light text-wrap text-base truncate",
                  isSelected ? "text-[#1354B6]" : "text-[#F4F4F4]"
                )}
              >
                {option.text}
              </span>
              <p
                className={cn(
                  "font-[Geologica] font-light text-sm text-wrap",
                 isSelected ? "text-[#1354B6]" : "text-[#F4F4F4]"
                )}
              >
                {option.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default ChatOptionButtonWithDescription;