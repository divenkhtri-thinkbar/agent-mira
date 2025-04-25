import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";
import { CircleCheckBig } from "lucide-react";
import textData from "@/config/text.json";

interface ImageSliderProps {
  images: string[];
  initialIndex?: number;
  variant?: "fixed" | "repairs";
}

export function ImageCard({ images, initialIndex = 0 }: ImageSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const imageCardText = textData.step4Content.imageCard;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // const labelVariant = variant === 'repairs' ? 'repairsDone' : 'normal';

  return (
    <div className="flex flex-col px-14 py-4 w-full h-full items-center justify-center">
      <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 textColor mb-4 text-center">
        {imageCardText.title}
      </h1>

      {/* Label above image */}
      <div className="p-2 pr-14 bg-[#B8D4FF] rounded-full flex items-center justify-center gap-2 mb-6">
        <div className="bg-[#1354B6] rounded-full p-2 flex-shrink-0">
          <CircleCheckBig className="text-[#37D3AE] w-6 h-6" />
        </div>
        <h1 className="font-[Geologica] text-lg leading-7 textColor text-center">
          {imageCardText.standOutFeature}
        </h1>
      </div>

      {/* Image Container */}
      <div className="max-w-5xl w-full mx-auto overflow-hidden rounded-[32px] relative">
        <div className="relative  w-full">
          {/* Current Image */}
          <div className="h-full w-full p-3">
            <img
              src={images[currentIndex] || "/placeholder.svg"}
              alt={`Property image ${currentIndex + 1}`}
              className="h-full w-full object-contain rounded-3xl transition-all duration-300 ease-in-out"
            />
          </div>

          {/* Label 1: Top 50 Left 20 */}
          {/* <Label
            text={labels.fence}
            variant={labelVariant}
            className="absolute top-[49%] left-[7%]"
          /> */}

          {/* Label 2: Bottom 40 Left 30 */}
          {/* <Label
            text={labels.patio}
            variant={labelVariant}
            className="absolute bottom-[35%] left-[30%]"
          /> */}
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center gap-4 ">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="w-12 h-12 rounded-full bg-[#CBCCCD] hover:bg-gray-300/80"
          disabled={images.length <= 1}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-[#CBCCCD] hover:bg-gray-300/80"
          disabled={images.length <= 1}
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  );
}
