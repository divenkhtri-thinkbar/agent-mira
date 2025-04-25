import { useState, useEffect, useCallback } from "react";
import { PropertyView } from "@/components/pageComponents/offerSteps";
import { PropertyCard } from "@/components/pageComponents/offerSteps/property/step1/propertyCard";
import { verifyProperty, house, Lawn } from "@/assets/images";
import { PresentPropertyCard } from "./property/step2/presentPropertyCard";
import { MarketGauge, MarketType } from "./property/step3/marketGauge";
import { cn } from "@/lib/utils";
import { ImageCard } from "./property/step4/imageCard";
import { QualityScoreCard } from "./property/step4/qualityScore";
import { VideoCard } from "./property/step4/videoCard";
import { FinalOfferCard } from "./property/step6/finalOfferCard";
import { FinalOfferStaggerCard } from "./property/step6/finalOfferStaggerCard";
import { FinalOfferStaggerCardSkeleton } from "@/components/animations/skeletonLoading/finalOfferCardSkeleton";
import textData from "@/config/text.json";

interface PresentPropertyCardProps {
  imageUrl: string;
  matchPercentage: number;
  price: number;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  distance: string;
  beds: number;
  baths: number;
  sqft: number;
  similarFeatures: string[];
  keyDifferences: string[];
  soldDate: string;
  onPrevious?: () => void;
  onNext?: () => void;
}

interface RightPanelContainerProps {
  currentStep: number;
  showPropertyView: boolean;
  showPropertyCard: boolean;
  isPropertyLoading: boolean;
  address?: string;
  marketAnalysisOption?: string | null;
  showVideoCard?: boolean;
  step4Stage?:
    | "initial"
    | "quality-score"
    | "inside-scoop"
    | "repairs"
    | "in-person"
    | "first-impression"
    | "form"
    | "confirmation";
  step6Stage?: "initial" | "review-offer" | "customize-offer" | "confirmation";
  handleInsideScoop?: ((optionText: string) => void) | null;
  selectedMarketAnalysisText?: string | null;
}

export default function RightPanelContainer({
  currentStep,
  showPropertyView,
  showPropertyCard,
  isPropertyLoading,
  address,
  marketAnalysisOption,
  showVideoCard = false, // Default to false
  step4Stage = "initial",
  step6Stage = "initial",
  selectedMarketAnalysisText = null,
}: RightPanelContainerProps) {
  const [shouldAnimatePropertyView, setShouldAnimatePropertyView] =
    useState(false);
  const [shouldAnimatePropertyCard, setShouldAnimatePropertyCard] =
    useState(false);
  const [shouldAnimateMarketGauge, setShouldAnimateMarketGauge] =
    useState(false);
  const [prevContent, setPrevContent] = useState<string | null>(null);
  const [currentComparableIndex, setCurrentComparableIndex] = useState(0);

  const imageMap = {
    verifyProperty: verifyProperty,
    house: house,
    Lawn: Lawn,
  };

  const propertyData = {
    ...textData.step1Content.propertyCard.data,
    images: textData.step1Content.propertyCard.data.images.map(
      (imgName: string) => imageMap[imgName as keyof typeof imageMap]
    ),
  };

  const comparableProperties: PresentPropertyCardProps[] =
    textData.step2Content.data.comparableProperties.map((prop) => ({
      ...prop,
      imageUrl: imageMap[prop.imageUrl as keyof typeof imageMap],
    }));

  const marketGaugeData = textData.step3Content.marketGauge.data;

  const offerData = {
    ...textData.step6Content.finalOfferCard.data,
    propertyImage:
      imageMap[
        textData.step6Content.finalOfferCard.data
          .propertyImage as keyof typeof imageMap
      ],
  };

  const images = [verifyProperty, Lawn, house];
  const videoThumbnails = [verifyProperty, Lawn, house];

  const getCurrentContent = useCallback(() => {
    if (currentStep === 1) {
      return showPropertyView
        ? "PropertyView"
        : showPropertyCard
        ? "PropertyCard"
        : null;
    } else if (currentStep === 2) {
      return "PresentPropertyCard";
    } else if (currentStep === 3) {
      return "MarketGauge";
    } else if (currentStep === 4) {
      if (step4Stage === "initial") return "ImageCard";
      if (step4Stage === "inside-scoop") return "QualityScoreCard";
      if (step4Stage === "in-person") return "ImageCardRepairs";
      if (step4Stage === "confirmation") return "VideoCard";
    } else if (currentStep === 5) {
      return showVideoCard ? "VideoCard" : "PropertyCard";
    } else if (currentStep === 6) {
      if (step6Stage === "initial") return "FinalOfferStaggerCardSkeleton";
      if (step6Stage === "review-offer") return "FinalOfferStaggerCard";
      if (step6Stage === "customize-offer" || step6Stage === "confirmation")
        return "FinalOfferCard";
    }
    return null;
  }, [
    currentStep,
    showPropertyView,
    showPropertyCard,
    showVideoCard,
    step4Stage,
    step6Stage,
  ]);

  useEffect(() => {
    const currentContent = getCurrentContent();

    // Only trigger animation if content changes
    if (currentContent !== prevContent && !isPropertyLoading) {
      setShouldAnimatePropertyView(false);
      setShouldAnimatePropertyCard(false);
      setShouldAnimateMarketGauge(false);

      setTimeout(() => {
        if (currentStep === 1) {
          if (showPropertyView) setShouldAnimatePropertyView(true);
          if (showPropertyCard) setShouldAnimatePropertyCard(true);
        } else if (currentStep === 2) {
          setShouldAnimatePropertyView(true);
        } else if (currentStep === 3) {
          setShouldAnimateMarketGauge(true);
        } else if (currentStep === 4) {
          setShouldAnimateMarketGauge(true);
        } else if (currentStep === 5) {
          setShouldAnimatePropertyCard(true);
        } else if (currentStep === 6) {
          setShouldAnimateMarketGauge(true);
        }
        setPrevContent(currentContent); // Update prevContent after animation
      }, 50);
    }
  }, [
    currentStep,
    isPropertyLoading,
    showPropertyView,
    showPropertyCard,
    showVideoCard,
    step4Stage,
    step6Stage,
    getCurrentContent, // Added to dependency array
    prevContent, // Added to dependency array
  ]);

  switch (currentStep) {
    case 1:
      return showPropertyView || (isPropertyLoading && !showPropertyCard) ? (
        <div
          className={cn(
            "w-full",
            shouldAnimatePropertyView &&
              !isPropertyLoading &&
              "animate-slide-in-from-left"
          )}
        >
          <PropertyView
            address={
              address || textData.step1Content.defaultPropertyViewAddress
            }
            isLoading={isPropertyLoading}
          />
        </div>
      ) : showPropertyCard ? (
        <div
          className={cn(
            "w-full",
            shouldAnimatePropertyCard &&
              !isPropertyLoading &&
              "animate-slide-in-from-left"
          )}
        >
          <PropertyCard {...propertyData} isLoading={isPropertyLoading} />
        </div>
      ) : null;

    case 2:
      return (
        <div
          className={cn(
            "w-full",
            shouldAnimatePropertyView &&
              !isPropertyLoading &&
              "slide-in-from-left"
          )}
        >
          <PresentPropertyCard
            {...comparableProperties[currentComparableIndex]}
            onPrevious={() => {
              if (currentComparableIndex > 0) {
                setCurrentComparableIndex(currentComparableIndex - 1);
                setShouldAnimatePropertyView(false);
              }
            }}
            onNext={() => {
              if (currentComparableIndex < comparableProperties.length - 1) {
                setCurrentComparableIndex(currentComparableIndex + 1);
                setShouldAnimatePropertyView(false);
              }
            }}
          />
        </div>
      );

    case 3:
      return (
        <div
          className={cn(
            "w-full",
            shouldAnimateMarketGauge &&
              !isPropertyLoading &&
              "animate-slide-in-from-left"
          )}
        >
          <MarketGauge
            initialMarketType={marketGaugeData.initialMarketType as MarketType}
            medianPrice={marketGaugeData.medianPrice}
            priceYoY={marketGaugeData.priceYoY}
            priceMoM={marketGaugeData.priceMoM}
            saleToListRatio={marketGaugeData.saleToListRatio}
            belowAsking={marketGaugeData.belowAsking}
            priceReduced={marketGaugeData.priceReduced}
            lastMonthChange={marketGaugeData.lastMonthChange}
            medianDays={marketGaugeData.medianDays}
            daysYoY={marketGaugeData.daysYoY}
            daysVsLast={marketGaugeData.daysVsLast}
            selectedMarketAnalysisOption={marketAnalysisOption}
          />
        </div>
      );
    case 4:
      return (
        <div className="w-full">
          {step4Stage === "initial" && (
            <div
              className={cn(
                "w-full",
                shouldAnimateMarketGauge &&
                  !isPropertyLoading &&
                  "animate-slide-in-from-left"
              )}
            >
              <ImageCard images={images} />
            </div>
          )}
          {step4Stage === "inside-scoop" && (
            <div
              className={cn(
                "w-full",
                shouldAnimateMarketGauge &&
                  !isPropertyLoading &&
                  "animate-slide-in-from-left"
              )}
            >
              <QualityScoreCard
                notchText={selectedMarketAnalysisText ?? "Exterior"}
                images={images}
              />
            </div>
          )}
          {step4Stage === "in-person" && (
            <div
              className={cn(
                "w-full",
                shouldAnimateMarketGauge &&
                  !isPropertyLoading &&
                  "animate-slide-in-from-left"
              )}
            >
              <ImageCard images={images} variant="repairs" />
            </div>
          )}
          {step4Stage === "confirmation" && (
            <div
              className={cn(
                "w-full",
                shouldAnimateMarketGauge &&
                  !isPropertyLoading &&
                  "animate-slide-in-from-left"
              )}
            >
              <VideoCard videos={videoThumbnails} initialIndex={0} />
            </div>
          )}
        </div>
      );
    case 5:
      return (
        <div className="w-full">
          {showVideoCard ? (
            <div
              className={cn(
                "w-full",
                shouldAnimatePropertyCard &&
                  !isPropertyLoading &&
                  "animate-slide-in-from-left"
              )}
            >
              <VideoCard videos={videoThumbnails} initialIndex={0} />
            </div>
          ) : (
            <div
              className={cn(
                "w-full",
                shouldAnimatePropertyCard &&
                  !isPropertyLoading &&
                  "animate-slide-in-from-left"
              )}
            >
              <PropertyCard {...propertyData} isLoading={false} />
            </div>
          )}
        </div>
      );
    case 6:
      return (
        <div className="w-full p-4">
          {step6Stage === "initial" && (
            <div
              className={cn(
                "w-full",
                shouldAnimateMarketGauge &&
                  !isPropertyLoading &&
                  "animate-slide-in-from-left"
              )}
            >
              <FinalOfferStaggerCardSkeleton isLoading={isPropertyLoading} />
            </div>
          )}
          {step6Stage === "review-offer" && (
            <div
              className={cn(
                "w-full",
                shouldAnimateMarketGauge &&
                  !isPropertyLoading &&
                  "animate-slide-in-from-left"
              )}
            >
              {/* <FinalOfferStaggerCard {...offerData} /> */}
            </div>
          )}
          {step6Stage === "customize-offer" && (
            <div
              className={cn(
                "w-full",
                shouldAnimateMarketGauge &&
                  !isPropertyLoading &&
                  "animate-slide-in-from-left"
              )}
            >
              <FinalOfferCard {...offerData} />
            </div>
          )}
          {step6Stage === "confirmation" && (
            <div
              className={cn(
                "w-full",
                shouldAnimateMarketGauge &&
                  !isPropertyLoading &&
                  "animate-slide-in-from-left"
              )}
            >
              <FinalOfferCard
                {...offerData}
                matches={offerData.matches}
                partialMatches={offerData.partialMatches}
              />
            </div>
          )}
        </div>
      );
    default:
      return null;
  }
}
