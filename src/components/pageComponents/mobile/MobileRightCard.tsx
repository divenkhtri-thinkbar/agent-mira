import { ArrowRight } from "lucide-react";
import { agent } from "@/assets/images";

interface MobileRightCardProps {
  onClick: () => void;
  imageSrc?: string; // Prop for the image source
  topText?: string; // Prop for text above the image
  boldText?: string; // Prop for bold medium text below the image
  subtitle?: string; // Prop for subtitle below the image
}

const MobileRightCard: React.FC<MobileRightCardProps> = ({
  onClick,
  imageSrc = agent, // Default to agent if no image is provided
  topText,
  boldText,
  subtitle,
}) => {
  return (
    <div
      className="flex items-center justify-end z-50 "
      onClick={onClick}
    >
      <div className="w-60 h-auto  flex flex-col bg-[#E3EEFF] rounded-[20px] text-center items-center cursor-pointer ">
        {/* Text above the image */}
        <div className="text-[#1354B6] text-xs sm:text-sm md:text-base font-[ClashDisplay-Medium] pt-2">
          {topText}
        </div>

        {/* Image */}
        <img
          className=" px-4 py-2 w-60 h-40  bg-[#E3EEFF] rounded-[24px] object-cover"
          src={imageSrc}
          alt="Property Preview"
        />

        {/* Bold medium text below the image */}
        <div className="text-[#1354B6] text-sm sm:text-base md:text-lg font-[ClashDisplay-Medium] font-bold ">
          {boldText}
        </div>

        {/* Subtitle below the bold text */}
        <div className="text-black text-xs sm:text-sm md:text-base font-[Geologica] font-normal pb-2 max-w-48 ">
          {subtitle}
        </div>
      </div>

      <div className="bg-[#1354B6] text-white p-2 rounded-full ml-2 rotate-[-45deg] flex items-center justify-center">
        <ArrowRight strokeWidth={1.5} className="h-5 w-5" />
      </div>
    </div>
  );
};

export default MobileRightCard;
