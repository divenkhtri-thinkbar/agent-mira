import { useState, useEffect } from "react";
import textData from "@/config/text.json";
import { useNavigate, useParams } from "react-router";
import MobileStep1Content from "@/components/pageComponents/mobile/mobileSteps/MobileStep1Content";
import MobileStep2Content from "@/components/pageComponents/mobile/mobileSteps/MobileStep2Content";
import MobileStep3Content from "@/components/pageComponents/mobile/mobileSteps/MobileStep3Content";
import MobileStep4Content from "@/components/pageComponents/mobile/mobileSteps/MobileStep4Content";
import MobileStep5Content from "@/components/pageComponents/mobile/mobileSteps/MobileStep5Content";
import MobileStep6Content from "@/components/pageComponents/mobile/mobileSteps/MobileStep6Content";
import MobileHeader from "@/components/mobile/mobileHeader";
import { motion } from "framer-motion";
import { Badge_Button } from "@/components/common/index";
import ImageBox from "../../assets/images/imageBox.png";
import ImageBoxMobile from "@/components/mobile/imageBoxMobile";
import MessageInput from "@/components/mobile/MessageInput";

const steps = textData.offerProcess.steps;

// Animation variants for the dropdown (from MobileHome)
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

const bgClass = [
  "bg-[#5D9DFE]",
  "bg-[#468FFE]",
  "bg-[#2F7CF2]",
  "bg-[#0D64E9]",
  "bg-[#1058C5]",
  "bg-[#0B43BE]",
];

const TitleData = [{ title: "18, xyz street, miami florida 12.08.2025" }];

// Animation variants for the hamburger menu toggle (from MobileHome)
const topVariants = {
  closed: { d: "M 5 5 L 25 25" },
  open: { d: "M 5 8 H 25" },
};

const middleVariants = {
  closed: { opacity: 0 },
  open: { opacity: 1 },
};

const bottomVariants = {
  closed: { d: "M 5 25 L 25 5" },
  open: { d: "M 5 22 H 25" },
};

const Badges = textData.Badges;

export default function MobileParentComponent() {
  const { step } = useParams<{ step?: string }>();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [screen, setScreen] = useState("content");
  const [input, setInput] = useState("");

  useEffect(() => {
    const stepNum = step ? parseInt(step, 10) : 1;
    if (!isNaN(stepNum) && stepNum >= 1 && stepNum <= steps.length) {
      setCurrentStep(stepNum);
    } else {
      navigate("/offer-process/1");
    }
  }, [step, navigate]);

  const handleNextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
      navigate(`/offer-process/${currentStep + 1}`);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <MobileStep1Content onNextStep={handleNextStep} />;
      case 2:
        return <MobileStep2Content onNextStep={handleNextStep} />;
      case 3:
        return <MobileStep3Content onNextStep={handleNextStep} />;
      case 4:
        return <MobileStep4Content onNextStep={handleNextStep} />;
      case 5:
        return <MobileStep5Content onNextStep={handleNextStep} />;
      case 6:
        return <MobileStep6Content />;
      default:
        return <div>Step {currentStep} content coming soon!</div>;
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-white relative">
      {/* Mobile Header */}
      <MobileHeader
        title="Custom Title"
        buttonText="Next Step"
        onButtonClick={handleNextStep}
      />

      {/* Toggle Button with Animated Hamburger/X */}
      <button
        onClick={() => setScreen(screen === "content" ? "menu" : "content")}
        className={`top-4 ${
          screen === "menu" ? "right-4 absolute z-[37]" : "left-4 absolute"
        }  bg-[#B8D4FF] text-black p-2 rounded-[8px]`}
      >
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 30 30"
          initial={false}
          animate={screen === "content" ? "open" : "closed"}
        >
          <motion.path
            variants={topVariants}
            stroke="black"
            strokeWidth="2"
            transition={{ duration: 0.2 }}
          />
          <motion.path
            d="M 5 15 H 25"
            variants={middleVariants}
            stroke="black"
            strokeWidth="2"
            transition={{ duration: 0.2 }}
          />
          <motion.path
            variants={bottomVariants}
            stroke="black"
            strokeWidth="2"
            transition={{ duration: 0.2 }}
          />
        </motion.svg>
      </button>

      {/* Main Content */}
      <main className="flex flex-col h-[calc(100vh-5rem)] p-2">
        {/* Scrollable Step Content */}
        <div className="overflow-y-auto mb-6">
          {renderStepContent()}
        </div>

        {/* Fixed Message Input at Bottom */}
        <div className="mt-auto">
          <MessageInput value={input} onChange={setInput} />
        </div>
      </main>

      {/* Badge Dropdown */}
      <motion.div
        className="p-4 absolute top-0 left-0 w-full h-full bg-[#DBE9FF] z-20"
        initial={false}
        animate={screen === "menu" ? "open" : "closed"}
        variants={screenVariants}
      >
        <ImageBoxMobile src={ImageBox} title={TitleData[0].title} />
        {screen === "menu" &&
          Object.entries(Badges).map(([key, badge], index) => (
            <Badge_Button
              key={key}
              id={badge.id}
              label={badge.label}
              bgColor={bgClass[index % bgClass.length]}
            />
          ))}
      </motion.div>
    </div>
  );
}