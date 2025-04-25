// rightBox.tsx
import React from "react";
import textData from "@/config/text.json";
import { house } from "@/assets/images"; 
import { ArrowRight } from "lucide-react";
import CompareProperty from "./comparePropertyCard";



const ComparsionData = textData.step2Content.data;

const RightBox: React.FC = () => {
    // Array of properties
    const properties = [
        {
            id: 0,
            imageSrc: house,
            address: "123, Palm Avenue",
            percentageMatch: "84%",
            backG:"bg-[#FFC251]"
          },
          {
            id: 1,
            imageSrc: house,
            address: "456, Oak Street",
            percentageMatch: "92%",
            backG:"bg-[#FFEE51]"
          },
          {
            id: 2,
            imageSrc: house,
            address: "789, Maple Drive",
            percentageMatch: "78%",
            backG:"bg-[#37D3AE]"
          }
    ];

    // Handle click function (replace with your actual handler)
    const handleCardClick = (id: number) => {
        console.log(`Card ${id} clicked`);
    };

    return (
        <div className="rounded-lg mb-0 w-full flex items-center justify-end h-full py-2">
            <div className=" w-62 p-4 h-auto flex flex-col bg-[#E3EEFF] rounded-[20px] text-center items-center cursor-pointer">

                <div className='w-full'>
                    {/* Title rendered once */}
                    <div className="text-[#1354B6] text-sm sm:text-sm md:text-base font-[ClashDisplay-Semibold] text-center mb-4">
                        {ComparsionData.title}
                    </div>

                    {/* Mapped CompareProperty components */}
                    <div className="w-full">
                        {properties.map((property) => (
                            <CompareProperty
                                key={property.id}
                                onClick={() => handleCardClick(property.id)}
                                imageSrc={property.imageSrc}
                                Addresss={property.address}
                                PercentageMatch={property.percentageMatch}
                                backgroundColor={property.backG}
                            />
                        ))}
                    </div>

                </div>
            </div>
            <div className="bg-[#1354B6] text-white p-2 rounded-full ml-2 rotate-[-45deg] flex items-center justify-center">
        <ArrowRight strokeWidth={1.5} className="h-5 w-5" />
    </div>
        </div>
    );
};

export default RightBox;