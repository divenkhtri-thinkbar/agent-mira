import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { useState, useEffect } from "react";

interface Step {
  id: number;
  title: string;
}

interface ProgressNavProps {
  currentStep: number;
  steps: Step[];
}

const tabColors = [
  "#5D9DFE",
  "#468FFE",
  "#2F7CF2",
  "#0D64E9",
  "#1058C5",
  "#0B43BE",
];

const PADDING = 110;

const getResponsiveStyles = (
  index: number,
  stepsCount: number,
  screenWidth: number
) => {
  const maxContainerWidth = Math.min(screenWidth, 1920);
  const availableWidth =
    screenWidth < 768 ? maxContainerWidth : maxContainerWidth - PADDING;

  const minTabWidth = 150;
  const maxTabWidth = 302;
  let tabWidth: number;
  let overlap: number;

  if (screenWidth < 768) {
    tabWidth = Math.max(
      minTabWidth,
      Math.min(maxTabWidth, availableWidth / stepsCount)
    );
    overlap = 20;
  } else if (screenWidth >= 768 && screenWidth < 1024) {
    tabWidth = Math.max(
      minTabWidth,
      Math.min(240, availableWidth / stepsCount)
    );
    overlap = 25;
  } else if (screenWidth >= 1024 && screenWidth < 1280) {
    tabWidth = Math.max(
      minTabWidth,
      Math.min(260, availableWidth / stepsCount)
    );
    overlap = 38;
  } else if (screenWidth >= 1280 && screenWidth < 1536) {
    tabWidth = Math.max(
      minTabWidth,
      Math.min(280, availableWidth / stepsCount)
    );
    overlap = 39;
  } else {
    tabWidth = Math.max(
      minTabWidth,
      Math.min(maxTabWidth, availableWidth / stepsCount)
    );
    overlap = 40;
  }

  const totalWidth = tabWidth + (stepsCount - 1) * (tabWidth - overlap);
  if (totalWidth > availableWidth) {
    tabWidth = (availableWidth + (stepsCount - 1) * overlap) / stepsCount;
    overlap = Math.max(10, overlap * (availableWidth / totalWidth));
  }

  const leftOffset = `calc(${index} * (${tabWidth}px - ${overlap}px))`;

  return { tabWidth: `${tabWidth}px`, leftOffset, overlap: `${overlap}px` };
};

export function ProgressNav({ currentStep, steps }: ProgressNavProps) {
  const navigate = useNavigate();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleStepClick = (
    stepNumber: number,
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    if (!event.ctrlKey && !event.metaKey && event.button !== 1) {
      event.preventDefault();
      navigate(`/offer-process/${stepNumber}`);
    }
  };

  return (
    <div className="w-full max-w-[1920px] mx-auto group progress-nav">
      <div 
        className={cn(
          "relative bg-[#0B43BE] w-full rounded-none overflow-x-auto overflow-y-hidden custom-scrollbar whitespace-nowrap",
          windowWidth <= 1350 ? "h-[96px]" : "h-[80px]"
        )}
      >
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber <= currentStep;
          const isActive = currentStep === stepNumber;
          const zIndex = steps.length - index;

          const { tabWidth, leftOffset } = getResponsiveStyles(
            index,
            steps.length,
            windowWidth
          );

          return (
            <a
              key={step.id}
              href={`/offer-process/${stepNumber}`}
              className={cn(
                "absolute h-full flex items-center justify-center transition-all rounded-r-full duration-200 px-4 md:px-8 no-underline",
                isActive && "border-[#37D3AE] border-[4px] rounded-r-full",
                isCompleted && "rounded-r-full"
              )}
              style={{
                width: tabWidth,
                left: leftOffset,
                backgroundColor: tabColors[index],
                zIndex: zIndex,
              }}
              onClick={(e) => handleStepClick(stepNumber, e)}
            >
              <div className="relative z-30 px-4 md:px-6 py-2">
                <p
                  className={cn(
                    "text-center text-xs md:text-sm text-wrap leading-normal truncate",
                    isActive ? "text-white font-medium" : "text-white/60"
                  )}
                >
                  {step.title}
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}