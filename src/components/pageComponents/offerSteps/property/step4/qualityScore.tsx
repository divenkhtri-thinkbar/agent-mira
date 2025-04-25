import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, CircleHelp, Expand, X } from "lucide-react";
import { useState } from "react";
import { Label } from "../common/Label";
import { ScrollArea } from "@/components/ui/scroll-area";
import textData from "@/config/text.json";

interface QualityScoreCardProps {
  images: string[];
  initialIndex?: number;
  notchText?: string;
}

export function QualityScoreCard({
  images,
  initialIndex = 0,
  notchText = "Exterior",
}: QualityScoreCardProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const qualityScoreText = textData.step4Content.qualityScoreCard;
  const labels = qualityScoreText.labels;
  const dropdown = qualityScoreText.dropdown;
  const scoreData = dropdown.scores;

  const currentScore = 5; // Hardcoded to match the "Box below" score; make dynamic if needed
  const currentScoreData = scoreData.find(score => score.score === currentScore);

  const handlePrevious = () => {
    setDirection("right");
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setTimeout(() => setDirection(null), 500);
  };

  const handleNext = () => {
    setDirection("left");
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setTimeout(() => setDirection(null), 500);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <div className="flex flex-col px-4 sm:px-14 py-4 w-full h-full items-center justify-center gap-6">
      <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 textColor text-center">
        {qualityScoreText.title}
      </h1>

      {/* Div 1 */}
      <div className="w-full flex flex-col items-center">
        <div className="flex justify-between items-center w-full max-w-5xl relative">
          <div className="px-4 py-2 rounded-t-[25px] bg-[#DBE9FF]">
            <span className="font-[Geologica] text-lg textColor">
              {qualityScoreText.overallQualityScore}
            </span>
          </div>
          <Button
            variant="ghost"
            className="bg-transparent flex items-center gap-2 relative"
            onClick={toggleDropdown}
          >
            <span className="text-sm textColor text-wrap">{qualityScoreText.qualityScoreLabel}</span>
            <div className="bg-[#1354B6] rounded-full p-1">
              <CircleHelp className="w-5 h-5 text-white" />
            </div>
          </Button>

          {/* Responsive Dropdown with ScrollArea and Close Icon */}
          {isDropdownOpen && (
            <div className="absolute top-full right-0 mt-2 w-full max-w-[90%] sm:max-w-[450px] bg-[#B8D4FF] rounded-lg shadow-lg p-4 z-50">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-3 right-10 w-6 h-6 rounded-full hover:bg-[#A0C1FF]"
                onClick={closeDropdown}
                aria-label="Close dropdown"
              >
                <X className="w-4 h-4 text-[#1354B6]" />
              </Button>
              <ScrollArea className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[470px] pr-4">
                <h2 className="font-[ClashDisplay-Medium] text-lg text-[#0246AC] mb-8">
                  {dropdown.title}
                </h2>
                <div className="space-y-8">
                  {scoreData.map(({ score, title, description }) => (
                    <div key={score} className="flex items-center gap-3">
                      <p
                        className={cn(
                          "bg-[#DBE9FF] text-[#0036AB] rounded-full p-2 px-4 font-[ClashDisplay-Medium] text-xl",
                          score === currentScore && "border-4 border-[#37D3AE]"
                        )}
                      >
                        {score}
                      </p>
                      <div className="flex flex-col">
                        <p className="font-[ClashDisplay-Semibold] text-base text-[#0246AC]">
                          {title}
                        </p>
                        <p className="font-[Geologica] font-extralight text-sm text-[#0246AC]">
                          {description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>

        {/* Box below */}
        <div className="w-full max-w-5xl bg-[#DBE9FF] rounded-[33px] rounded-tl-none p-2 mt-0">
          <div className="flex items-center gap-4 bg-[#F5F7FA] p-4 rounded-[25px]">
            <p className="bg-[#DBE9FF] text-[#0036AB] rounded-full p-3 px-5 font-[ClashDisplay-Medium] text-2xl">
              {currentScore}
            </p>
            <div className="flex flex-col">
              <p className="font-[ClashDisplay-Semibold] text-lg text-[#0246AC]">
                {currentScoreData?.title}
              </p>
              <p className="font-[Geologica] font-extralight text-base text-[#0246AC]">
                {currentScoreData?.description}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Div 2 */}
      <div className="w-full max-w-5xl bg-[#DBE9FF] rounded-[32px] relative">
        {/* Notch Text */}
        <div className="absolute top-6 left-10 bg-[#DBE9FF] px-8 py-1 rounded-b-[25px] -translate-y-1/2 z-20">
          <span className="font-[ClashDisplay-Medium] text-xl textColor">
            {notchText}
          </span>
        </div>

        {/* Image Container */}
        <div className="relative h-[450px] w-full overflow-hidden">
          <div className="h-full w-full p-2 absolute inset-0">
            <img
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Property image ${currentIndex + 1}`}
              className={cn(
                "h-full w-full object-cover rounded-3xl transition-all",
                direction === "left" && "animate-slide-in-from-right",
                direction === "right" && "animate-slide-in-from-left",
                !direction && "translate-x-0"
              )}
            />
          </div>

          {/* Label 1: Top 50 Left 20 */}
          <Label
            text={labels.fence}
            variant="qualityScore"
            className="absolute top-[49%] left-[7%]"
          />

          {/* Label 2: Bottom 40 Left 30 */}
          <Label
            text={labels.patio}
            variant="qualityScore"
            className="absolute bottom-[35%] left-[34%]"
          />

          {/* Navigation Arrows */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrevious}
            className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/75 hover:bg-gray-300/80"
            disabled={images.length <= 1}
          >
            <ArrowLeft className="w-6 h-6 text-black" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/75 hover:bg-gray-300/80"
            disabled={images.length <= 1}
          >
            <ArrowRight className="w-6 h-6 text-black" />
          </Button>

          {/* Expand Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute bottom-0 right-0 m-4 w-12 h-12 rounded-full bg-black/50 hover:bg-gray-300/80"
          >
            <Expand className="w-6 h-6 text-white" />
          </Button>
        </div>

        {/* Box below image */}
        <div className="w-full max-w-5xl bg-[#DBE9FF] rounded-b-[33px] px-4 pb-3 mt-0">
          <div className="flex items-center gap-4">
            <p className="text-[#0036AB] p-3 px-5 font-[ClashDisplay-Medium] text-2xl">
              {currentScore}
            </p>
            <div className="flex flex-col">
              <p className="font-[ClashDisplay-Semibold] text-lg text-[#0246AC]">
                {currentScoreData?.title}
              </p>
              <p className="font-[Geologica] font-extralight text-base text-[#0246AC]">
                {currentScoreData?.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}