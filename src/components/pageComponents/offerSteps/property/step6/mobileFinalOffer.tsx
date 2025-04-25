import { useState } from "react";
import { CheckCircle, BadgeCheck, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MatchDetailCard } from "../common/matchCard";
import Lottie from "lottie-react";
import star from "./Animation.json";
import NumberCounter from "@/components/animations/NumberIncrement";
import textData from "@/config/text.json";

interface HorizontalFinalOfferCardProps {
  propertyImage: string;
  propertyAddress: string;
  matchPercentage: number;
  matches: string[];
  partialMatches: string[];
  offerAmount: number;
  bonusAmount: number;
  winProbability: number;
  marketConditions: string;
  listOffer: number;
  competitionLevel: string;
  validityPeriod: number;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const insightsVariants = {
  open: {
    opacity: 1,
    height: "auto",
    transition: { duration: 0.3, ease: "easeInOut" },
  },
  closed: {
    opacity: 0,
    height: 0,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

export function HorizontalFinalOfferCard({
  propertyImage,
  propertyAddress,
  matchPercentage,
  matches,
  partialMatches,
  offerAmount,
  bonusAmount,
  winProbability,
  marketConditions,
  listOffer,
  competitionLevel,
}: HorizontalFinalOfferCardProps) {
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const finalOfferText = textData.step6Content.finalOfferCard;
  const matchSection = finalOfferText.matchSection;
  const offerSection = finalOfferText.offerSection;
  const liveMetrics = finalOfferText.liveMetricsSection;
  const marketInsights = liveMetrics.insightsList;

  return (
    <div className="w-full max-w-3xl mx-auto ">
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-600 mb-4 text-center">
        {finalOfferText.title}
      </h1>
      <motion.div
        className="overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Section: Full-width Image */}
        <motion.div variants={itemVariants}>
          <div className="relative w-full p-2 bg-[#B8D4FF] rounded-2xl">
            <img
              src={propertyImage || "/placeholder.svg"}
              alt="Property"
              className="w-full h-[230px] object-cover rounded-2xl"
            />
            <div className="absolute bottom-0 left-0 bg-[#B8D4FF] p-3 text-xs sm:text-sm md:text-base font-[ClashDisplay-Medium] text-[#0036AB] rounded-tr-[15px] rounded-bl-2xl">
              {propertyAddress}
            </div>
          </div>
        </motion.div>

        {/* Separator Div (after image) */}
        <div className="bg-[#B8D4FF] px-2 rounded-2xl">
          <motion.div
            className="text-center text-xs sm:text-sm md:text-base font-[ClashDisplay-Medium] leading-[18.84px] text-blue-600 my-4"
            variants={itemVariants}
          ></motion.div>

          {/* Second Box: Title and Match Percentage */}
          <motion.div
            className="flex justify-between items-center  p-2 bg-[#B8D4FF] rounded-[15px]"
            variants={itemVariants}
          >
            <div className="font-[ClashDisplay-Medium] text-xs sm:text-sm md:text-base leading-[18px] textColor">
              {matchSection.matchLabel}
            </div>
            <div className="font-[ClashDisplay-Medium] bg-[#37D3AE] px-2 py-1 rounded-full text-sm sm:text-base md:text-lg text-[#0036AB]">
              {matchPercentage}% {matchSection.matchSuffix}
            </div>
          </motion.div>

          {/* Match Detail Cards Side by Side */}
          <motion.div className="flex gap-2 mb-2" variants={itemVariants}>
            <MatchDetailCard
              icon={
                <BadgeCheck strokeWidth={3} className="w-4 h-4 text-white" />
              }
              iconPlacement="right"
              textStyle="lineSeparated"
              title={matchSection.matchTitle}
              text={matches}
            />
            <MatchDetailCard
              icon={
                <CheckCircle strokeWidth={3} className="w-4 h-4 text-white" />
              }
              iconPlacement="right"
              textStyle="lineSeparated"
              title={matchSection.partialMatchTitle}
              text={partialMatches}
            />
          </motion.div>

          {/* Offer Section */}
          <motion.div
            className="bg-[#B8D4FF]rounded-[16px] relative mb-2"
            variants={itemVariants}
          >
            <div className="absolute top-1 left-0 w-16 sm:w-8 md:w-25 lg:w-15 h-auto z-10">
              <Lottie loop={true} animationData={star} />
            </div>
            <div className="absolute top-1 right-0 w-16 sm:w-8 md:w-25 lg:w-15 h-auto z-10">
              <Lottie loop={true} animationData={star} />
            </div>
            <div className="relative bg-[#E6F0FF] rounded-[20px]">
              <div className="text-center space-y-2 py-3 overflow-visible">
                <h3 className="textColor text-xs sm:text-sm md:text-base font-[ClashDisplay-Medium]">
                  {offerSection.recommendationLabel}
                </h3>
                <div className="relative flex justify-center items-center gap-1">
                  <div className="bg-[#0036AB] text-white text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] leading-8 px-5 py-0 sm:px-16 md:px-20 lg:px-10 lg:py-0 rounded-full inline-flex items-center">
                    $<NumberCounter endValue={offerAmount} duration={8500} />
                  </div>
                  <span className="bg-white rounded-full px-1 py-0.5 textColor font-[ClashDisplay-Medium] lg:px-4 lg:py-0 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-6">
                    +$
                    <NumberCounter endValue={bonusAmount} duration={8500} />
                  </span>
                </div>
                <p className="textColor text-xs sm:text-sm md:text-[15px] font-[ClashDisplay-Medium]">
                  {offerSection.offerDescription}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Live Metrics Section */}
          <motion.div
            className="bg-[#B8D4FF] pb-2     rounded-[16px]"
            variants={itemVariants}
          >
            <div className="grid grid-cols-5 gap-2">
              <motion.div
                className="bg-white rounded-[18px] px-2 py-1 text-center overflow-hidden"
                variants={itemVariants}
              >
                <div className="text-[10px] sm:text-xs md:text-sm lg:text-xs textColor font-[Geologica] font-light text-wrap">
                  {liveMetrics.winProbability}
                </div>
                <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] textColor py-2 sm:py-3 md:py-4 lg:py-6">
                  <NumberCounter endValue={winProbability} duration={3500} />%
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-[18px] px-2 py-1 col-span-2"
                variants={itemVariants}
              >
                <div className="text-[10px] sm:text-xs md:text-sm textColor font-[Geologica] font-light">
                  {liveMetrics.offerStrategy}
                </div>
                <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] leading-tight textColor py-2 sm:py-4 md:py-10">
                  {liveMetrics.moreAggressive}
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-[18px] px-2 py-1 col-span-2"
                variants={itemVariants}
              >
                <div className="text-[10px] sm:text-xs md:text-sm font-[ClashDisplay-Medium] textColor">
                  {liveMetrics.marketConditions}
                </div>
                <div className="mt-1">
                  <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] textColor">
                    {marketConditions}
                  </div>
                  <div className="text-[10px] sm:text-sm md:text-base font-[ClashDisplay-Medium] text-[#37D3AE]">
                    {competitionLevel}
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="col-span-3 bg-white rounded-xl px-2 py-1"
                variants={itemVariants}
              >
                <div className="text-[10px] sm:text-xs md:text-sm textColor font-[Geologica] font-light">
                  {liveMetrics.yourOffer}
                </div>
                <div className="flex justify-between mt-2">
                  <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] textColor">
                    $<NumberCounter endValue={offerAmount} duration={8500} />
                  </div>
                  <div className="text-[10px] sm:text-xs md:text-sm textColor font-[Geologica] font-light flex items-center">
                    +$
                    <NumberCounter endValue={bonusAmount} duration={8500} />
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="bg-[#E0E0E0] rounded-xl px-2 py-1 col-span-2"
                variants={itemVariants}
              >
                <div className="text-[10px] sm:text-xs md:text-sm font-[ClashDisplay-Medium] text-[#717171]">
                  {liveMetrics.listOffer}
                </div>
                <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] text-[#585858] mt-2">
                  $<NumberCounter endValue={listOffer} duration={8500} />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Market Insights Section (outside Live Metrics) */}
        <div className="mt-4">
          <button
            onClick={() => setIsInsightsOpen(!isInsightsOpen)}
            className="w-full flex items-center justify-between p-2 text-[#0036AB] font-medium text-xs sm:text-sm md:text-base"
          >
            {liveMetrics.marketInsights}
            <ChevronUp
              className={cn(
                "w-5 h-5 transition-transform",
                isInsightsOpen && "transform rotate-180"
              )}
            />
          </button>
          <AnimatePresence>
            {isInsightsOpen && (
              <motion.ul
                className="list-disc pl-6 text-[10px] sm:text-xs md:text-sm textColor font-[Geologica] font-light mt-2 overflow-hidden"
                variants={insightsVariants}
                initial="closed"
                animate="open"
                exit="closed"
              >
                {marketInsights.map((insight, index) => (
                  <li key={index} className="mb-1">
                    {insight}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

export default HorizontalFinalOfferCard;
