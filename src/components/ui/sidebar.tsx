import { Settings, ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import textData from "@/config/text.json";
import ImageCard from "../pageComponents/common/sidebar/imageCard";
import { placeholder } from "@/assets/images";
interface SidebarProps {
  address?: string;
  selectedCardId: number | null;
  handleCardSelect: (id: number) => void;
}

export default function Sidebar({ address, selectedCardId, handleCardSelect }: SidebarProps) {
  const { sidebar } = textData;

  const targetAddresses = textData.step1Content.addressSuggestions;
  const hasMatchingAddress = address
    ? targetAddresses.some(target => target.toLowerCase() === address.toLowerCase())
    : false;

  return (
    <div className="fixed top-0 left-0 h-screen w-[280px] flex flex-col border-r-[1px] border-[#BFBFBF] bg-[#E3EEFF] group">
      {/* User Profile Section */}
      <div className="flex items-center justify-between px-4 pt-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg" alt="Rajat" />
            <AvatarFallback>R</AvatarFallback>
          </Avatar>
          <span className="text-sm font-[Geologica] font-medium text-[#797979]">
            {sidebar.username}
          </span>
        </div>
        <Settings strokeWidth={3} size={20} className="text-[#79ACF8]" />
      </div>

      {/* Create Offer Button */}
      <div className="p-4">
        <div className="group flex w-full">
          <div className="flex-1 bg-[#1E4DB7] text-[#F6F3EE] rounded-full flex items-center justify-center font-[ClashDisplay-Medium] text-base">
            {sidebar.buttonText}
          </div>
          <div className="bg-[#1E4DB7] text-[#F6F3EE] p-2 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-2">
            <ArrowRight strokeWidth={1.5} className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="border-t-[#797979] border-t-[0.5px] opacity-40" />

      {/* Offers Section - Made Scrollable with Custom Scrollbar */}
      <div className="flex-1 px-4 py-0 overflow-y-auto flex flex-col items-center custom-scrollbar">
        <h2 className="my-4 text-sm font-[Geologica] font-normal text-[#272727]">
          {sidebar.headingText}
        </h2>

        {/* Cards Display */}
        <div className="space-y-4 flex flex-col items-center w-full">
          {[1, 2, 3].map((i) => {
            if (!address || !hasMatchingAddress) {
              return (
                <ImageCard
                  key={i}
                  title={`Offer ${i}`}
                  variant="withoutImage"
                />
              );
            }

            return (
              <ImageCard
                key={i}
                imageSrc={placeholder}
                title={`${address} - Offer ${i}`}
                variant="onSelect"
                isSelected={selectedCardId === i}
                onSelect={() => handleCardSelect(i)}
              />
            );
          })}
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="flex border-t border-[#E5E7EB] bg-[#B8D4FF] rounded-t-2xl text-[#272727]">
        <a
          href="/"
          className="flex-1 p-4 text-center font-[ClashDisplay-Medium] text-base"
        >
          {sidebar.home}
        </a>
        <a
          href="/faq"
          className="flex-1 p-4 text-center font-[ClashDisplay-Medium] text-base"
        >
          {sidebar.faq}
        </a>
      </div>
    </div>
  );
}