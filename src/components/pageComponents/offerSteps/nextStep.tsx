import { ArrowRight } from "lucide-react";

interface NextStepProps {
  content: string;
  onNextStep: () => void;
}

const NextStep = ({ content, onNextStep }: NextStepProps) => {
  return (
    <div className="w-full">
      <div className="agentChat py-2 pl-2">
        {content}
      </div>
      <div className="p-4 justify-center flex">
        <button
          className="group flex w-72"
          onClick={onNextStep}
        >
          {/* Left Section: Button Text */}
          <div className="flex-1 bg-[#1354B6] text-white rounded-full flex items-center justify-center font-[ClashDisplay-Medium] text-base">
            Next Step
          </div>

          {/* Right Section: Arrow Icon with hover effect */}
          <div className="bg-[#1354B6] text-white p-2 rounded-full transition-transform group-hover:translate-x-2">
            <ArrowRight strokeWidth={1.5} className="h-5 w-5" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default NextStep;