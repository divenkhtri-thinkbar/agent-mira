import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Play } from "lucide-react";
import { useState } from "react";

interface VideoSliderProps {
  videos: string[];
  initialIndex?: number;
  title?: string;
}

export function VideoCard({
  videos,
  title,
  initialIndex = 0,
}: VideoSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? videos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === videos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="flex flex-col px-14 py-4 w-full h-full items-center justify-center">
      <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 textColor mb-4 text-center">
        {title}
      </h1>

      {/* Video Container */}
      <div className="max-w-5xl w-full mx-auto overflow-hidden rounded-[32px] relative">
        <div className="relative h-[560px] w-full">
          {/* Current Video Thumbnail */}
          <div className="h-full w-full relative">
            <img
              src={videos[currentIndex] || "/placeholder.svg"}
              alt={`Video thumbnail ${currentIndex + 1}`}
              className="h-full w-full object-cover rounded-3xl transition-all duration-300 ease-in-out"
            />
            {/* Black Overlay */}
            <div className="absolute inset-0 bg-black/20 rounded-3xl"></div>
            {/* Play Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-transparent border-white border-2 hover:bg-black/70 z-10"
            >
              <Play className="w-8 h-8 text-white" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="flex justify-center gap-4 mt-20">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePrevious}
          className="w-12 h-12 rounded-full bg-[#CBCCCD] hover:bg-gray-300/80"
          disabled={videos.length <= 1}
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleNext}
          className="w-12 h-12 rounded-full bg-[#CBCCCD] hover:bg-gray-300/80"
          disabled={videos.length <= 1}
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  );
}
