import { Check, CircleAlert } from "lucide-react";

interface LabelProps {
  text: string;
  variant?: "normal" | "repairsDone" | "qualityScore";
  className?: string;
}

export const Label = ({ text, variant = "normal", className }: LabelProps) => {
  const baseStyles = "rounded-full flex items-center justify-center gap-2 pr-8";

  const variantStyles = {
    normal: {
      bg: "bg-white",
      border: "border-2 border-[#1354B6]",
      iconColor: "text-[#1354B6]",
      textColor: "textColor",
      Icon: Check,
    },
    repairsDone: {
      bg: "bg-white",
      border: "border-2 border-[#B61313]",
      iconColor: "text-[#B61313]",
      textColor: "text-[#B61313]",
      Icon: CircleAlert,
    },
    qualityScore: {
      bg: "bg-[#DBE9FF]",
      border: "border-2 border-[#1354B6]",
      iconColor: "text-[#1354B6]",
      textColor: "textColor",
      Icon: Check,
    },
  };

  const { bg, border, iconColor, textColor, Icon } = variantStyles[variant];

  return (
    <div className={`${baseStyles} ${bg} ${className}`}>
      <div className={`${border} rounded-full p-2 flex-shrink-0`}>
        <Icon className={`${iconColor} w-6 h-6`} />
      </div>
      <h1 className={`font-[Geologica] text-lg leading-7 ${textColor} text-center`}>
        {text}
      </h1>
    </div>
  );
};