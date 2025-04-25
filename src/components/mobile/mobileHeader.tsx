import { sidebar } from "@/config/text.json";

interface MobileHeaderProps {
  title?: string; // Optional title prop for flexibility
  buttonText?: string; // Optional button text prop
  onButtonClick?: () => void; // Optional callback for button click
}

export default function MobileHeader({
  title = sidebar.newOffer, // Default to sidebar.newOffer
  buttonText = sidebar.step1, // Default to sidebar.step1
  onButtonClick,
}: MobileHeaderProps) {
  return (
    <header className="py-[20px] flex items-center justify-between bg-[#E3EEFF]">
      <h2 className="font-[ClashDisplay-Medium] text-[14px] font-normal ml-[40%]">
        {title}
      </h2>
      <button
        className="bg-[#5D9DFE] py-2 px-4 text-[12px] mr-[4%] rounded-[16px] font-[ClashDisplay-Medium] font-medium"
        onClick={onButtonClick}
      >
        {buttonText}
      </button>
    </header>
  );
}