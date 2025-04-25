import { useState } from "react";
import { ChevronDown, CheckCircle, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MatchDetailCard } from "../common/matchCard";
import Lottie from "lottie-react";
import star from "./Animation.json";
import NumberCounter from "@/components/animations/NumberIncrement";
import textData from "@/config/text.json";

interface FinalOfferCardProps {
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
  matchIconPlacement?: "left" | "right";
  matchTextStyle?: "bullet" | "lineSeparated";
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

export function FinalOfferCard({
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
  validityPeriod,
  matchIconPlacement = "right",
  matchTextStyle = "lineSeparated",
}: FinalOfferCardProps) {
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const finalOfferText = textData.step6Content.finalOfferCard;
  const matchSection = finalOfferText.matchSection;
  const offerSection = finalOfferText.offerSection;
  const liveMetrics = finalOfferText.liveMetricsSection;
  const marketInsights = liveMetrics.insightsList;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-600 mb-4 text-center">
        {finalOfferText.title}
      </h1>
      <motion.div
        className="overflow-hidden"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Section */}
        <motion.div
          className="p-1 bg-[#B8D4FF] grid grid-cols-2 gap-2 items-start rounded-t-[25px]"
          variants={itemVariants}
        >
          <div className="relative overflow-visible">
            <img
              src={propertyImage || "/placeholder.svg"}
              alt="Property"
              className="w-full h-[230px] object-cover rounded-t-[25px] rounded-br-[25px]"
            />
            <div className="absolute font-[ClashDisplay-Medium] text-[#0036AB] rounded-tr-[15px] bottom-0 left-0 bg-[#B8D4FF] p-3 text-xs sm:text-sm md:text-base">
              {propertyAddress}
            </div>
            <div className="absolute top-0 -right-2 bg-emerald-400 text-white p-7 rounded-full flex flex-col w-12 h-12 items-center justify-center text-sm font-medium border-2 border-[#B8D4FF] z-30">
              <span className="text-black text-sm sm:text-base">
                <NumberCounter endValue={matchPercentage} duration={3500} />%
              </span>
              <span className="text-[8px] sm:text-[10px] text-black/50 leading-tight">
                {matchSection.matchSuffix}
              </span>
            </div>
          </div>
          <div className="space-y-2 flex flex-col justify-start">
            <div className="font-[ClashDisplay-Medium] text-xs sm:text-sm md:text-base leading-[18px] textColor text-center mt-2">
              {matchSection.matchLabel}
            </div>
            <MatchDetailCard
              icon={<BadgeCheck strokeWidth={3} className="w-4 h-4 text-white" />}
              iconPlacement={matchIconPlacement}
              textStyle={matchTextStyle}
              title={matchSection.matchTitle}
              text={matches}
            />
            <MatchDetailCard
              icon={<CheckCircle strokeWidth={3} className="w-4 h-4 text-white" />}
              iconPlacement={matchIconPlacement}
              textStyle={matchTextStyle}
              title={matchSection.partialMatchTitle}
              text={partialMatches}
            />
          </div>
        </motion.div>

        {/* Offer Section */}
        <motion.div
          className="bg-[#B8D4FF] p-1 rounded-b-[25px] relative"
          variants={itemVariants}
        >
          <div className="absolute top-1 left-0 w-6 sm:w-8 md:w-25 lg:w-15 h-auto z-10">
            <Lottie loop={true} animationData={star} />
          </div>
          <div className="absolute top-1 right-0 w-6 sm:w-8 md:w-25 lg:w-15 h-auto z-10">
            <Lottie loop={true} animationData={star} />
          </div>
          <div className="relative bg-[#E6F0FF] rounded-[20px]">
            <div className="text-center space-y-2 py-3 overflow-visible">
              <h3 className="textColor text-xs sm:text-sm md:text-base font-[ClashDisplay-Medium]">
                {offerSection.recommendationLabel}
              </h3>
              <div className="relative flex justify-center items-center gap-1">
                <span className="absolute -left-8 text-lg sm:text-xl md:text-2xl">✨</span>
                <div className="bg-[#0036AB] text-white text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] leading-12 px-10 sm:px-16 md:px-20 lg:px-10 lg:py-0 rounded-full inline-flex items-center">
                  $<NumberCounter endValue={offerAmount} duration={8500} />
                </div>
                <span className="bg-white rounded-full px-1 py-0.5 textColor font-[ClashDisplay-Medium] lg:px-4 lg:py-0 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl leading-6">
                  +$<NumberCounter endValue={bonusAmount} duration={8500} />
                </span>
                <span className="absolute -right-12 text-lg sm:text-xl md:text-2xl">✨</span>
              </div>
              <p className="textColor text-xs sm:text-sm md:text-[15px] font-[ClashDisplay-Medium]">
                {offerSection.offerDescription}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Separator Div */}
        <motion.div
          className="text-center text-xs sm:text-sm md:text-base font-[ClashDisplay-Medium] leading-[18.84px] text-blue-600 my-4"
          variants={itemVariants}
        >
          {liveMetrics.liveMetricsLabel}
        </motion.div>

        {/* Live Metrics Section */}
        <motion.div
          className="bg-[#B8D4FF] px-2 py-2 rounded-[25px]"
          variants={itemVariants}
        >
          <div className="grid grid-cols-5 gap-2">
            <motion.div
              className="bg-white rounded-[18px] p-2 sm:p-3 md:p-4 text-center overflow-hidden"
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
              className="bg-white rounded-[18px] p-4 px-5 col-span-2"
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
              className="bg-white rounded-[18px] p-4 col-span-2"
              variants={itemVariants}
            >
              <div className="text-[10px] sm:text-xs md:text-sm font-[ClashDisplay-Medium] textColor">
                {liveMetrics.yourOffer}
              </div>
              <div className="mt-2 text-center py-2 sm:py-4 md:py-6">
                <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] textColor">
                  $<NumberCounter endValue={offerAmount} duration={8500} />
                </div>
                <div className="text-[10px] sm:text-sm md:text-base font-[ClashDisplay-Medium] text-[#37D3AE]">
                  +$<NumberCounter endValue={bonusAmount} duration={8500} />
                </div>
              </div>
            </motion.div>

            <motion.div
              className="col-span-3 bg-white rounded-xl p-4"
              variants={itemVariants}
            >
              <div className="text-[10px] sm:text-xs md:text-sm textColor font-[Geologica] font-light">
                {liveMetrics.marketConditions}
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-[32px] font-[ClashDisplay-Medium] textColor">
                  {marketConditions}
                </div>
                <div className="text-[10px] sm:text-xs md:text-sm textColor font-[Geologica] font-light flex items-center">
                  {competitionLevel}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-[#E0E0E0] rounded-xl p-4 col-span-2"
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

          {/* Market Insights Section */}
          <div>
            <button
              onClick={() => setIsInsightsOpen(!isInsightsOpen)}
              className="w-full flex items-center justify-between p-2 text-[#0036AB] font-medium text-xs sm:text-sm md:text-base"
            >
              {liveMetrics.marketInsights}
              <ChevronDown
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

        <div className="mt-4 text-[10px] sm:text-xs md:text-sm textColor font-[Geologica] font-light text-center">
          {finalOfferText.validityMessage.replace("{validityPeriod}", validityPeriod.toString())}
        </div>
      </motion.div>
    </div>
  );
}