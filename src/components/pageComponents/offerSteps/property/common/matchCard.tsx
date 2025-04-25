import { ReactNode } from "react";

interface MatchDetailCardProps {
  icon: ReactNode;
  iconPlacement?: "left" | "right";
  textStyle?: "bullet" | "lineSeparated";
  title: string;
  text: string[];
}

export function MatchDetailCard({
  icon,
  iconPlacement = "left",
  textStyle = "lineSeparated",
  title,
  text,
}: MatchDetailCardProps) {
  const iconPositionClass = iconPlacement === "left" ? "-left-1" : "-right-1";
  const textPaddingClass = iconPlacement === "left" ? "pl-5" : "pr-5";
  const textAlignClass = iconPlacement === "right" ? "text-center py-2" : "mb-2";

  const renderText = () => {
    if (textStyle === "bullet") {
      if(text?.length === 0 || text === null || text === undefined) return <p className={`font-[Geologica] font-light text-xs text-[#0036AB] ${textAlignClass}`}>No Data Found</p>
      return (
        <ul className={`font-[Geologica] font-light text-xs text-[#0036AB] list-disc ${textAlignClass} ${iconPlacement === "left" ? "pl-4" : "pl-0"}`}>
          {text.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
    return (
      <p className={`font-[Geologica] font-light text-xs text-[#0036AB] ${textAlignClass}`}>
        {text.join(" | ")}
      </p>
    );
  };

  return (
    <div className="relative bg-white rounded-xl px-4 py-2">
      <div
        className={`absolute -top-1 ${iconPositionClass} p-1 bg-[#0036AB] border-4 border-[#B8D4FF] rounded-full z-10`}
      >
        {icon}
      </div>
      <div className={`flex items-center  ${textPaddingClass} ${iconPlacement === "right" ? "justify-center" : ""}`}>
        <h4 className={`font-[Geologica] font-semibold text-sm text-[#1354B6] ${textAlignClass}`}>
          {title}
        </h4>
      </div>
      {renderText()}
    </div>
  );
}