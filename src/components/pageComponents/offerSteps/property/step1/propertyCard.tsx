import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PropertyStats } from "../propertyStats";
import { verifyPropertyFooter } from "@/assets/images";
import PropertyCardSkeleton from "@/components/animations/skeletonLoading/PropertyCardSkeleton";
import NumberCounter from "@/components/animations/NumberIncrement";
import textData from "@/config/text.json";

interface PropertyCardProps {
  images: string[];
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  builtIn: number;
  hoa: string;
  propertyType: string;
  features: string[];
  description: string;
  isLoading?: boolean;
  title?: string
}

export function PropertyCard({
  images,
  price,
  beds,
  baths,
  sqft,
  builtIn,
  hoa,
  propertyType,
  features,
  description,
  isLoading = false,
  title
}: PropertyCardProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [prevImage, setPrevImage] = useState<number | null>(null);
  const [direction, setDirection] = useState<"left" | "right" | null>(null);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const nextImage = () => {
    setDirection("right");
    setPrevImage(currentImage);
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setDirection("left");
    setPrevImage(currentImage);
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  useEffect(() => {
    if (direction) {
      const timer = setTimeout(() => {
        setDirection(null);
        setPrevImage(null);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [direction]);

  useEffect(() => {
    if (isImageExpanded) {
      document.body.classList.add("overflow-visible");
    } else {
      document.body.classList.remove("overflow-visible");
    }
    return () => {
      document.body.classList.remove("overflow-visible");
    };
  }, [isImageExpanded]);

  if (isLoading) {
    return <PropertyCardSkeleton />;
  }

  const propertyCardText = textData.step1Content.propertyCard;

  return (
    <div className="w-full bg-[#F4F4F4] max-w-3xl mx-auto h-screen px-4 pt-6 pb-10">
      <div>
        <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] mb-4 text-center">
          {title}
        </h1>

        <div className="bg-[#B8D4FF] rounded-3xl overflow-hidden">
          {/* Image Carousel */}
          <div className="relative aspect-[16/10] bg-transparent px-4 pt-4 pb-2 overflow-hidden">
            {prevImage !== null && direction && (
              <div
                className={cn(
                  "absolute top-4 bottom-2 left-4 right-4 transition-transform duration-500 ease-in-out"
                )}
              >
                <img
                  src={images[prevImage] || "/placeholder.svg"}
                  alt={`Property image ${prevImage + 1}`}
                  className={cn(
                    "w-full h-full object-cover rounded-3xl",
                    direction === "right" && "animate-slide-out-left",
                    direction === "left" && "animate-slide-out-right"
                  )}
                />
              </div>
            )}
            <div
              className={cn(
                "absolute top-4 bottom-2 left-4 right-4 transition-transform duration-500 ease-in-out"
              )}
            >
              <img
                src={images[currentImage] || "/placeholder.svg"}
                alt={`Property image ${currentImage + 1}`}
                className={cn(
                  "w-full h-full object-cover rounded-3xl",
                  direction === "right" && "animate-slide-in-from-right",
                  direction === "left" && "animate-slide-in-from-left",
                  !direction && "translate-x-0"
                )}
              />
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="absolute left-7 top-1/2 -translate-y-1/2 bg-[#DEEBFFC4] hover:bg-white rounded-full z-30"
              onClick={previousImage}
            >
              <ChevronLeft className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-7 top-1/2 -translate-y-1/2 bg-[#DEEBFFC4] hover:bg-white rounded-full z-30"
              onClick={nextImage}
            >
              <ChevronRight className="h-8 w-8" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-7 bottom-5 bg-black/50 hover:bg-black/70 text-white/100 hover:text-white z-30 cursor-pointer"
              onClick={() => setIsImageExpanded(true)}
            >
              <Expand className="h-7 w-7" />
            </Button>
            <div className="absolute bottom-0 left-0 bg-[#B8D4FF] px-5 py-3 rounded-tr-[33px] z-30">
              <span className="text-[38px] font-[ClashDisplay-Medium] text-[#1354B6] leading-9">
                $<NumberCounter endValue={price} duration={4500} />
              </span>
            </div>
          </div>

          {isImageExpanded && (
            <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
              <div className="relative w-full h-full max-w-7xl max-h-[90vh]">
                <img
                  src={images[currentImage] || "/placeholder.svg"}
                  alt={`Expanded property image ${currentImage + 1}`}
                  className="w-full h-full object-contain"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white/100 hover:text-white cursor-pointer"
                  onClick={() => setIsImageExpanded(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
            </div>
          )}

          {/* Property Stats */}
          <PropertyStats
            beds={beds}
            baths={baths}
            sqft={sqft}
            builtIn={builtIn}
            hoa={hoa}
            propertyType={propertyType}
          />

          {/* Features */}
          <div className="px-6 py-4 bg-[#C9DEFF] rounded-b-[20px] relative -mt-10 z-10">
            <div className="text-[#1354B6] text-sm leading-6 pt-10">
              <p className="leading-relaxed">
                {features.map((feature, index) => {
                  const [boldPart, normalPart] = feature.split(" - ");
                  return (
                    <span key={index}>
                      <span className="font-[ClashDisplay-Semibold]">
                        +{boldPart}
                        {" - "}
                      </span>
                      {normalPart && (
                        <span className="font-[ClashDisplay-Medium]">
                          {normalPart}
                        </span>
                      )}{" "}
                    </span>
                  );
                })}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="px-6 pb-6 bg-[#DBE9FF] relative -mt-10 z-0">
            <p
              className={cn(
                "text-[#1354B6] font-[Geologica] font-light text-sm leading-7 relative pt-12",
                !isExpanded && "line-clamp-3"
              )}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center relative pt-2">
          <div className="flex items-center gap-1">
            <p className="text-[#9E9E9E] font-[Geologica] font-light text-xs">
              {propertyCardText.footer.dataSourcedFrom}
            </p>
            <img
              src={verifyPropertyFooter}
              alt="Stellar MLS"
              className="w-auto h-4 object-contain"
            />
          </div>
          <div
            className="bg-[#DBE9FF] cursor-pointer px-2 py-2 absolute rounded-b-[9px] flex justify-end bottom-0 right-0 items-center gap-2 text-[#1354B6] font-[ClashDisplay-Regular] text-sm leading-[22.8px] tracking-[7%] underline underline-offset-2 decoration-1 decoration-solid"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="uppercase">
              {isExpanded ? propertyCardText.footer.showLess : propertyCardText.footer.showMore}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}