// CompareProperty.tsx
import React from "react";
import textData from "@/config/text.json";
import { agent } from "@/assets/images";
import { cn } from "@/lib/utils"

const ComparsionData = textData.step2Content.data;

interface ComparePropertyProps {
    onClick: () => void;
    imageSrc?: string;
    Addresss?: string;
    PercentageMatch?: string;
    backgroundColor?: string; 
}

const CompareProperty: React.FC<ComparePropertyProps> = ({
    onClick,
    imageSrc = agent,
    Addresss,
    PercentageMatch ="84%",
    backgroundColor = "bg-[#FFC251]"
}) => {
    return (
        <div
            className="flex items-center justify-center z-50"
            onClick={onClick}
        >
            <div className="w-full" >
                <div className="w-full h-full flex items-center pt-2 justify-between">
                    {/* Image */}
                    <img
                        className="w-12 h-8 bg-[#E3EEFF] rounded-[8px] object-cover"
                        src={imageSrc}
                        alt="Property Preview"
                    />

                    {/* Address */}
                    <div className="text-[#1354B6] text-xs sm:text-base md:text-lg font-[Geologica] font-normal">
                        {Addresss}
                    </div>

                    {/* Percentage */}
                    <div 
                        className={cn(
                            "p-2 rounded-[12px]",
                            backgroundColor // Apply the background color prop
                        )}
                    >
                        <div className="text-xs sm:text-base md:text-lg font-[ClashDisplay-Medium] font-normal">
                            {PercentageMatch}<br />
                            {ComparsionData.match}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CompareProperty;