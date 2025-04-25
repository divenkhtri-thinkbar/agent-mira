import { useState } from "react";
import { ChevronDown, CheckCircle, BadgeCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { MatchDetailCard } from "../common/matchCard";
import Lottie from "lottie-react";
import star from "./Animation.json";
import NumberCounter from "@/components/animations/NumberIncrement";
import textData from "@/config/text.json";

interface FinalOfferStaggerCardProps {
  propertyImage: string;
  propertyAddress: string;
  matchPercentage: number;
  matches: string[];
  partialMatches: string[];
  offerAmount: number;
  bonusAmount: number;
  winProbability: number;
  offerStrategy: string;
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
      staggerChildren: 0.4,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
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

export function FinalOfferStaggerCard({
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
}: FinalOfferStaggerCardProps) {
  const [isInsightsOpen, setIsInsightsOpen] = useState(false);
  const finalOfferText = textData.step6Content.finalOfferCard;
  const matchSection = finalOfferText.matchSection;
  const offerSection = finalOfferText.offerSection;
  const liveMetrics = finalOfferText.liveMetricsSection;
  const marketInsights = liveMetrics.insightsList;

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] mb-4 text-center">
        {finalOfferText.title}
      </h1>

      <motion.div
        className="overflow-visible bg-[#B8D4FF] rounded-[25px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Top Section */}
        <motion.div
          className="p-2 bg-[#B8D4FF] grid grid-cols-2 gap-2 items-start rounded-t-[25px]"
          variants={itemVariants}
        >
          {/* Image div (0.0s) */}
          <motion.div
            className="relative overflow-visible"
            variants={itemVariants}
            transition={{ delay: 0 }}
          >
            <img
              src={propertyImage || "/placeholder.svg"}
              alt="Property"
              className="w-full h-[255px] object-cover rounded-t-[25px] rounded-br-[25px]"
            />
            <div className="absolute font-[ClashDisplay-Medium] text-[#0036AB] rounded-tr-[15px] bottom-0 left-0 bg-[#B8D4FF] p-3 text-sm">
              {propertyAddress}
            </div>
            <div className="absolute -top-3 -right-12 bg-emerald-400 font-[ClashDisplay-Medium] rounded-full p-3 flex flex-col items-center justify-center border-4 border-[#B8D4FF] z-30">
              <span className="text-black text-base">
                <NumberCounter endValue={matchPercentage} duration={3500} />%
              </span>
              <span className="text-[10px] text-black/50 leading-tight">
                {matchSection.matchSuffix}
              </span>
            </div>
          </motion.div>

          {/* Match Div (0.4s) */}
          <motion.div
            className="space-y-2 flex flex-col justify-start"
            variants={itemVariants}
            transition={{ delay: 0.4 }}
          >
            <div className="font-[ClashDisplay-Medium] font-sm leading-[18px] textColor text-center mt-2">
              {matchSection.matchLabel}
            </div>
            <div className="space-y-2 mt-6">
              <MatchDetailCard
                icon={<BadgeCheck strokeWidth={3} className="w-4 h-4 text-white" />}
                iconPlacement="right"
                textStyle="lineSeparated"
                title={matchSection.matchTitle}
                text={matches}
              />
              <MatchDetailCard
                icon={<CheckCircle strokeWidth={3} className="w-4 h-4 text-white" />}
                iconPlacement="right"
                textStyle="lineSeparated"
                title={matchSection.partialMatchTitle}
                text={partialMatches}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Offer Section (2.4s) */}
        <motion.div
          className="bg-[#B8D4FF] p-2 relative"
          variants={itemVariants}
          transition={{ delay: 2.4 }}
        >
          <div className="absolute top-1 left-0 w-6 sm:w-8 md:w-25 h-auto z-10">
            <Lottie loop={true} animationData={star} />
          </div>
          <div className="absolute top-1 right-0 w-6 sm:w-8 md:w-25 h-auto z-10">
            <Lottie loop={true} animationData={star} />
          </div>
          <div className="relative bg-[#E6F0FF] rounded-[20px]">
            <div className="text-center space-y-2 py-8 overflow-visible">
              <h3 className="textColor text-sm font-[ClashDisplay-Medium]">
                {offerSection.recommendationLabel}
              </h3>
              <div className="relative flex justify-center items-center gap-1">
                <div className="bg-[#0036AB] text-white text-[32px] font-[ClashDisplay-Medium] leading-12 px-20 rounded-full inline-flex items-center">
                  $<NumberCounter endValue={offerAmount} duration={8500} />
                </div>
                <span className="bg-white rounded-full px-1 py-0.5 textColor font-[ClashDisplay-Medium] text-base leading-6">
                  + $<NumberCounter endValue={bonusAmount} duration={8500} />
                </span>
              </div>
              <p className="textColor text-[15px] font-[ClashDisplay-Medium]">
                {offerSection.offerDescription}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Live Metrics Section */}
        <motion.div
          className="bg-[#B8D4FF] px-2 py-2 rounded-b-[25px]"
          variants={itemVariants}
        >
          <div className="grid grid-cols-5 gap-2">
            {/* Win Probability (2.8s) */}
            <motion.div
              className="bg-white rounded-[18px] p-4 text-center"
              variants={itemVariants}
              transition={{ delay: 2.8 }}
            >
              <div className="text-xs sm:text-sm textColor font-[Geologica] font-light">
                {liveMetrics.winProbability}
              </div>
              <div className="text-xl sm:text-2xl md:text-[28px] font-[ClashDisplay-Medium] textColor py-4 sm:py-2 md:py-2">
                <NumberCounter endValue={winProbability} duration={3500} />%
              </div>
            </motion.div>

            {/* Offer Strategy (1.6s) */}
            <motion.div
              className="bg-white rounded-[18px] p-4 col-span-2"
              variants={itemVariants}
              transition={{ delay: 1.6 }}
            >
              <div className="text-xs sm:text-sm textColor font-[Geologica] font-light">
                {liveMetrics.offerStrategy}
              </div>
              <div className="text-xl sm:text-2xl md:text-[28px] font-[ClashDisplay-Medium] leading-tight textColor py-4 sm:py-2 md:py-2">
                {liveMetrics.moreAggressive}
              </div>
            </motion.div>

            {/* Your Offer (2.0s) */}
            <motion.div
              className="bg-white rounded-[18px] p-4 col-span-2"
              variants={itemVariants}
              transition={{ delay: 2.0 }}
            >
              <div className="text-sm sm:text-base textColor font-[ClashDisplay-Medium]">
                {liveMetrics.yourOffer}
              </div>
              <div className="py-1">
                <div className="text-xl sm:text-xl md:text-[32px] font-[ClashDisplay-Medium] textColor">
                  $<NumberCounter endValue={offerAmount} duration={8500} />
                </div>
                <div className="mt-2 text-sm sm:text-base text-right font-[ClashDisplay-Medium] textColor">
                  (+0.1%)
                </div>
              </div>
            </motion.div>

            {/* Market Conditions (1.2s) */}
            <motion.div
              className="col-span-3 bg-white rounded-xl px-4 py-2"
              variants={itemVariants}
              transition={{ delay: 1.2 }}
            >
              <div className="text-xs sm:text-sm textColor font-[Geologica] font-light">
                {liveMetrics.marketConditions}
              </div>
              <div className="flex justify-between mt-2">
                <div className="text-xl sm:text-2xl md:text-[28px] font-[ClashDisplay-Medium] textColor">
                  {marketConditions}
                </div>
                <div className="text-xs sm:text-sm textColor font-[Geologica] font-light flex items-center">
                  {competitionLevel}
                </div>
              </div>
            </motion.div>

            {/* List Offer (0.4s) */}
            <motion.div
              className="bg-[#E0E0E0] rounded-xl px-4 py-2 col-span-2"
              variants={itemVariants}
              transition={{ delay: 0.4 }}
            >
              <div className="text-sm sm:text-base font-[ClashDisplay-Medium] text-[#717171]">
                {liveMetrics.listOffer}
              </div>
              <div className="text-xl sm:text-2xl md:text-[32px] font-[ClashDisplay-Medium] text-[#585858] mt-1">
                $<NumberCounter endValue={listOffer} duration={8500} />
              </div>
            </motion.div>
          </div>

          {/* Market Insights Section (0.0s, with Image div) */}
          <motion.div
            className="w-full p-2 text-[#0036AB] font-medium"
            variants={itemVariants}
            transition={{ delay: 0 }}
          >
            <button
              onClick={() => setIsInsightsOpen(!isInsightsOpen)}
              className="w-full flex items-center justify-between p-2 text-[#0036AB] font-medium"
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
                  className="list-disc pl-6 text-sm textColor font-[Geologica] font-light mt-2 overflow-hidden"
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
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        className="mt-4 text-xs sm:text-sm textColor font-[Geologica] font-light text-center"
        variants={itemVariants}
        transition={{ delay: 0 }}
      >
        {finalOfferText.validityMessage.replace("{validityPeriod}", validityPeriod.toString())}
      </motion.div>
    </div>
  );
}