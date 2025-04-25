import React from "react";

interface ImageCardProps {
  imageSrc?: string;
  title?: string;
  variant?: "offerOpened" | "offerClosed" | "withoutImage" | "onSelect" | string;
  isSelected?: boolean;        // New prop to track selection state
  onSelect?: () => void;       // New prop for selection callback
}

const ImageCard: React.FC<ImageCardProps> = ({ 
  imageSrc, 
  title, 
  variant = "offerOpened",
  isSelected = false,
  onSelect,
}) => {
  if (variant === "withoutImage") {
    return <div className="w-64 h-[164px] rounded-2xl border-[#797979] bg-transparent border-[2px] opacity-15" />;
  }

  const handleClick = () => {
    if (variant === "onSelect" && onSelect) {
      onSelect();
    }
  };

  return (
    <div 
      className={`w-[216px] h-[174px] rounded-[20px] shadow-lg overflow-hidden flex flex-col relative ${
        variant === "offerClosed" ? "bg-[#B8D4FF]" : "bg-white"
      } ${variant === "onSelect" && isSelected ? "border-[3px] border-[#37D3AE]" : ""}`}
      onClick={handleClick}
    >
      {variant === "offerClosed" && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#B8D4FF] text-black font-[Geologica] text-sm text-nowrap font-normal px-6 py-1.5 rounded-b-[15px]">
          Offer Closed
        </div>
      )}

      <div className="flex flex-col h-full p-2">
        {imageSrc && (
          <div className="flex-1 overflow-hidden">
            <img 
              src={imageSrc} 
              alt={title} 
              className="w-full h-full object-cover rounded-[20px]" 
            />
          </div>
        )}

        {title && (
          <div className="bg-transparent font-[Geologica] text-sm p-2 text-center text-black font-normal">
            {title}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;