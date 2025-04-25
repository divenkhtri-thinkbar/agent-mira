import React, { forwardRef } from "react";
import { motion } from "framer-motion";

interface ImageCardProps {
  imageSrc?: string;
  title?: string;
  variant?: "offerOpened" | "offerClosed" | "withoutImage";
  selected?: boolean;
  onClick?: () => void;
}

const ImageCardMobile = forwardRef<HTMLDivElement, ImageCardProps>(
  ({ imageSrc, title, variant = "offerOpened", selected, onClick }, ref) => {
    if (variant === "withoutImage") {
      return (
        <div
          ref={ref}
          className="w-[calc(50%-10px)] h-auto min-h-[15vh] max-h-[165px] mb-0 rounded-2xl border-[#797979] bg-transparent border-[0.5px]"
        />
      );
    }

    return (
      <div
        ref={ref}
        className={`w-[calc(50%-10px)] max-h-[165px] h-[auto] rounded-[20px] mb-0 shadow-lg overflow-hidden flex relative cursor-pointer transition-all border-2 ${
          selected ? "border-green-500" : "border-transparent"
        } ${variant === "offerClosed" ? "bg-[#B8D4FF]" : "bg-white hover:border-[#37D3AE]"}`}
        onClick={onClick}
      >
        {variant === "offerClosed" && (
          <div className="absolute top-[32%] left-1/2 transform -translate-x-1/2 bg-[#B8D4FF] text-black font-[Geologica] text-[12px] text-nowrap font-normal px-6 py-1.5 rounded-full">
            Offer Closed
          </div>
        )}
        <div className="flex flex-col h-full p-2">
          {imageSrc && (
            <div className="flex-1">
              <img
                src={imageSrc}
                alt={title}
                className="w-full h-full object-cover rounded-[20px] max-h-[100px]"
              />
            </div>
          )}
          {title && (
            <div className="bg-transparent font-[Geologica] text-sm p-2 text-center text-black font-normal text-[10px]">
              {title}
            </div>
          )}
        </div>
      </div>
    );
  }
);

const MotionImageCardMobile = motion(ImageCardMobile);
export default MotionImageCardMobile;