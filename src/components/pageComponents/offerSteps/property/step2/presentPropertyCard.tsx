import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import { bath, bed } from "@/assets/images";
import NumberCounter from "@/components/animations/NumberIncrement";
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

export function PresentPropertyCard({
  imageUrl,
  matchPercentage,
  price,
  address,
  distance,
  beds,
  baths,
  sqft,
  similarFeatures,
  keyDifferences,
  soldDate,
  onPrevious,
  onNext,
}: PresentPropertyCardProps) {
  const labels = textData.step2Content.presentPropertyCard.labels;

  return (
    <div className="flex flex-col px-14 py-4 w-full h-full items-center justify-center">
      <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 textColor mb-4 text-center">
        {labels.title}
      </h1>

      {/* First Card: Image, Price, Location, and Property Details */}
      <Card className="max-w-3xl w-full mx-auto overflow-hidden bg-[#B8D4FF] rounded-[32px] relative z-[5]">
        <div className="relative h-[360px] w-full">
          {/* Match Badge */}
          <div className="rounded-full bg-[#B8D4FF] p-2 absolute left-0 top-0 z-10">
            <div className="bg-[#FFB952] text-black rounded-full px-4 py-3">
              <div className="text-xl font-bold">
                <NumberCounter endValue={matchPercentage} duration={2000} />%
              </div>
              <div className="text-sm">{labels.match}</div>
            </div>
          </div>

          {/* Price and Price per SqFt */}
          <div className="absolute bottom-[-7%] right-0 bg-[#B8D4FF] px-5 py-3 rounded-tl-[33px] z-30">
            <span className="text-[38px] font-[ClashDisplay-Medium] textColor leading-9">
              $ <NumberCounter endValue={price} duration={4500} />
            </span>
            <div className="text-sm textColor text-right">{labels.pricePerSqFt}</div>
          </div>

          {/* Property Image */}
          <div className="h-full w-full p-3">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt="Property"
              className="h-full w-full object-cover rounded-3xl"
            />
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Location Section */}
          <div className="flex justify-between items-start">
            <div className="flex gap-3">
              <div className="">
                <MapPin className="w-9 h-9 text-[#FFC251] bg-[#1354B6] rounded-full p-1.5 flex-shrink-0" />
              </div>
              <div className="text-wrap max-w-72">
                <h3 className="font-[ClashDisplay-Medium] text-xl textColor">
                  {address.street}
                </h3>
                <p className="persentPropertyDetailsText text-[#0036ABB2]">
                  {distance} away
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="font-[ClashDisplay-Medium] text-base textColor mt-1">
                {soldDate}
              </div>
            </div>
          </div>

          {/* Property Details */}
          <div className="flex justify-between items-start px-0">
            <div className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-full bg-[#1354B6] flex items-center justify-center">
                <img src={bed} alt="Beds" className="w-full h-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-[ClashDisplay-Medium] text-[22px] leading-5 textColor">
                  <NumberCounter endValue={beds} duration={300} />
                </span>
                <span className="persentPropertyDetailsText textColor">
                  {labels.beds}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-full bg-[#1354B6] flex items-center justify-center">
                <img src={bath} alt="Baths" className="w-full h-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-[ClashDisplay-Medium] text-[22px] leading-5 textColor">
                  <NumberCounter endValue={baths} duration={300} />
                </span>
                <span className="persentPropertyDetailsText textColor">
                  {labels.baths}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-2 rounded-full bg-[#1354B6] flex items-center justify-center">
                <img src={bed} alt="SqFt" className="w-full h-full" />
              </div>
              <div className="flex flex-col">
                <span className="font-[ClashDisplay-Medium] text-[22px] leading-5 textColor">
                  <NumberCounter endValue={sqft} duration={2000} />
                </span>
                <span className="persentPropertyDetailsText textColor">
                  {labels.sqft}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Second Card: Comparison Section */}
      <Card className="max-w-3xl w-full mx-auto overflow-hidden bg-[#D3E4FF] rounded-[32px] relative z-0 -mt-16">
        <div className="p-6 flex flex-col mt-16">
          {/* Row 1: Headers */}
          <div className="flex flex-row justify-between mb-0 font-[ClashDisplay-Semibold] text-lg leading-[18px] textColor">
            <h4 className="text-left w-1/2">{labels.similarFeatures}</h4>
            <h4 className="text-left w-1/2">{labels.keyDifferences}</h4>
          </div>

          <div className="border-t-2 border-black/10 my-3" />

          {/* Row 2: Bullet Points */}
          <div className="flex flex-row justify-between">
            {/* Features Column */}
            <ul className="space-y-3 w-1/2 px-2">
              {similarFeatures.map((feature, index) => (
                <li
                  key={index}
                  className="text-base font-[Geologica] textColor font-normal flex items-start"
                >
                  <span className="text-[#1463FF] mr-2">•</span>
                  {feature}
                </li>
              ))}
            </ul>

            {/* Differences Column */}
            <ul className="space-y-3 w-1/2 px-2">
              {keyDifferences.map((difference, index) => (
                <li
                  key={index}
                  className="text-base font-[Geologica] textColor font-normal flex items-start"
                >
                  <span className="text-[#1463FF] mr-2">•</span>
                  {difference}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* Navigation Arrows */}
      <div className="flex justify-center gap-4 pt-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          className="w-12 h-12 rounded-full bg-[#CBCCCD] hover:bg-gray-300/80"
          disabled={!onPrevious} // Disable if no previous card
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          className="w-12 h-12 rounded-full bg-[#CBCCCD] hover:bg-gray-300/80"
          disabled={!onNext} // Disable if no next card
        >
          <ArrowRight className="w-6 h-6 text-white" />
        </Button>
      </div>
    </div>
  );
}