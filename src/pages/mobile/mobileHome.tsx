import { ArrowRight } from "lucide-react";
import { logo, agentMobile } from "@/assets/images/index";
import textData from "@/config/text.json";
import { motion } from "framer-motion";
import { useState } from "react";
import { Badge_Button } from "@/components/common/index";

export default function MobileHome() {
  const { homepage } = textData;
  const { Badges } = textData;
  const [screen, setScreen] = useState("home");

  // const bgClass = [
  //   "#5D9DFE",
  //   "#468FFE",
  //   "#2F7CF2",
  //   "0D64E9",
  //   "#1058C5",
  //   "0B43BE",
  // ];

  const screenVariants = {
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at 1000px 40px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    }),
    closed: {
      clipPath: "circle(0px at 0px 0px)",
      transition: {
        delay: 0.2,
        type: "spring",
        stiffness: 300,
        damping: 40,
      },
    },
  };

  return (
    <>
      {/* <Header screen={screen} setScreen={setScreen} /> */}

      {/* Screen Container */}
      <div className="relative h-[calc(100vh-60px)] overflow-hidden">
        {/* Home First Screen */}
        <motion.div
          className="p-4 absolute top-0 left-0 w-full h-full"
          initial={false}
          animate={screen === "home" ? "open" : "closed"}
          variants={screenVariants}
        >
          <div className="flex relative">
            <div className="relative w-full h-full">
              {/* Content Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  scale: { type: "spring", stiffness: 100, bounce: 0.5 },
                  delay: 0.1,
                }}
                className="space-y-4 bg-[#1E4DB7] rounded-[12px] rounded-tr-none px-6 py-5 w-[80%]"
              >
                <h1 className="font-[ClashDisplay-medium] text-[36px] text-left mb-0 text-white">
                  {homepage.welcomeTitle}
                  <br />
                  <span className="font-[ClashDisplay-Medium] text-[36px]">
                    {homepage.brandName}
                  </span>
                </h1>
                <div className="text-left mt-0 text-white">
                  <p className="font-[Geologica] text-[12px] leading-none text-left font-extralight">
                    {homepage.tagline.split("\n").map((line, index) => (
                      <span key={index} className="mr-1">
                        {line}
                      </span>
                    ))}
                  </p>
                </div>
              </motion.div>

              {/* Agent Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  scale: { type: "spring", stiffness: 100, bounce: 0.5 },
                  delay: 0.3,
                }}
              >
                <img
                  src={agentMobile}
                  alt="Professional"
                  className="h-auto max-w-full object-contain absolute right-1 -bottom-10"
                />
              </motion.div>

              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.4,
                  scale: { type: "spring", stiffness: 100, bounce: 0.5 },
                  delay: 0.5,
                }}
                className="absolute top-0 left-[83%] transform -translate-x-1/2 bg-[#1E4DB7] p-5 h-auto w-auto rounded-tr-[18px] rounded-br-[18px] -z-1"
              >
                <img alt="Logo" className="h-[20px] w-[14px]" src={logo} />
              </motion.div>
            </div>
          </div>

          {/* Full Width Button */}
          <a
            href="/offer-process"
            className="group flex w-full h-11 relative top-[25px] z-2 mb-14"
          >
            <div className="flex-1 bg-[#4ADAA8] text-[#1E4DB7] font-[ClashDisplay-Medium] text-[16px] leading-auto text-center flex items-center justify-center rounded-full">
              {homepage.buttonText}
            </div>
            <div className="h-11 w-11 -ml-1 flex items-center justify-center bg-[#4ADAA8] text-[#1E4DB7] rounded-full transition-transform group-hover:translate-x-2">
              <ArrowRight className="h-4 w-4" />
            </div>
          </a>

          {/* Description */}
          <div className="border-[#1354B6] border-[0.5px] p-4 rounded-[12px] font-[Geologica] text-[12px] text-[#1E4DB7]">
            {homepage.descriptionMobile}
          </div>

          {/* Dropdowns */}
          <div className="space-y-4 p-1 mt-4">
            <details
              className="group [&_summary::-webkit-details-marker]:hidden mb-0 border-b-1 border-[#000]"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 text-gray-900">
                <h2 className="font-[ClashDisplay-medium] text-[#000]">
                  {homepage.faq}
                </h2>
                <div className="h-11 w-11 -ml-1 flex items-center justify-end text-[#000] rounded-full transition-transform group-hover:translate-x-2">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </summary>
            </details>
            <details
              className="group [&_summary::-webkit-details-marker]:hidden"
              open
            >
              <summary className="flex cursor-pointer items-center justify-between gap-1.5 rounded-lg bg-gray-50 text-gray-900">
                <h2 className="font-[ClashDisplay-medium] text-[#000]">
                  {homepage.TipsAdvice}
                </h2>
                <div className="h-11 w-11 -ml-1 flex items-center justify-end text-[#000] rounded-full transition-transform group-hover:translate-x-2">
                  <ArrowRight className="h-4 w-4" />
                </div>
              </summary>
            </details>
          </div>
        </motion.div>

        {/* Menu Second Screen */}
        <motion.div
          className="p-4 absolute top-0 left-0 w-full h-full bg-[#DBE9FF]"
          initial={false}
          animate={screen === "menu" ? "open" : "closed"}
          variants={screenVariants}
        >
          {Object.entries(Badges).map(([key, badge], index) => (
            <Badge_Button key={key} id={badge.id} label={badge.label} />
          ))}
        </motion.div>
      </div>
    </>
  );
}