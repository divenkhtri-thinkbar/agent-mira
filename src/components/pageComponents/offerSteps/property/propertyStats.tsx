import { bath, bed, home, calendar, calendarcheck, user } from "@/assets/images";
import NumberCounter from "@/components/animations/NumberIncrement";
import textData from "@/config/text.json";

interface PropertyStatsProps {
    beds: number;
    baths: number;
    sqft: number;
    builtIn: number;
    hoa: string;
    propertyType: string;
    lotSize: any;
    livingArea: any;
}

export function PropertyStats({
    beds,
    baths,
    sqft,
    builtIn,
    hoa,
    lotSize,
    livingArea,
    propertyType,
}: PropertyStatsProps) {
    const labels = textData.step1Content.propertyCard.propertyStats.labels;

    return (
        <div className="p-6 grid grid-cols-3 gap-4 bg-[#B8D4FF] rounded-b-[20px] relative z-20">
            {/* Beds */}
            <div className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-full bg-[#1354B6] flex items-center justify-center">
                    <img src={bed} alt="Beds" className="w-full h-full" />
                </div>
                <div className="flex flex-col">
                    <span className="font-[ClashDisplay-Medium] lg:text-[14px] xl-mid xl:text-[18px] leading-5 text-[#1354B6]">
                        {beds}
                    </span>
                    <span className="font-[Geologica] font-extralight text-xs leading-3 text-[#1354B6]">
                        {labels?.beds}
                    </span>
                </div>
            </div>

            {/* Baths */}
            <div className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-full bg-[#1354B6] flex items-center justify-center">
                    <img src={bath} alt="Baths" className="w-full h-full" />
                </div>
                <div className="flex flex-col">
                    <span className="font-[ClashDisplay-Medium] lg:text-[14px] xl:text-[18px] leading-5 text-[#1354B6]">
                        {baths}
                    </span>
                    <span className="font-[Geologica] font-extralight text-xs leading-3 text-[#1354B6]">
                        {labels.baths}
                    </span>
                </div>
            </div>

            {/* SqFt */}
            <div className="flex items-center gap-2">
                <div className="px-3 py-2 rounded-full bg-[#1354B6] flex items-center justify-center">
                    <img src={calendarcheck} alt="SqFt" className="w-full h-full" />
                </div>
                <div className="flex flex-col">
                    <span className="font-[ClashDisplay-Medium] lg:text-[14px] xl:text-[18px] leading-5 text-[#1354B6]">
                        <NumberCounter endValue={livingArea} duration={1000} />
                    </span>
                    <span className="font-[Geologica] font-extralight text-xs leading-3 text-[#1354B6]">
                        {labels.sqft}
                    </span>
                </div>
            </div>

            {/* Built In */}
            <div className="flex items-center gap-2">
                <div className="px-3.5 py-2 rounded-full bg-[#1354B6] flex items-center justify-center">
                    <img src={home} alt="Built In" className="w-full h-full" />
                </div>
                <div className="flex flex-col">
                    <span className="font-[ClashDisplay-Medium] lg:text-[14px] xl:text-[18px] leading-5 text-[#1354B6]">
                        {/* <NumberCounter endValue={builtIn} duration={1000} /> */}
                        {builtIn}
                    </span>
                    <span className="font-[Geologica] font-extralight text-xs leading-3 text-[#1354B6]">
                        {labels?.builtIn}
                    </span>
                </div>
            </div>

            {/* lotSize */}
            <div className="flex items-center gap-2">
                <div className="px-3 lg:px-3.5 py-2 rounded-full bg-[#1354B6] flex items-center justify-center">
                    <img src={calendar} alt="HOA" className="lg:max-w-[20px] lg:w-[24px] lg:h-[24px] w-full h-full" />
                </div>
                <div className="flex flex-col">
                    <span className="font-[ClashDisplay-Medium] lg:text-[14px] xl:text-[18px] leading-5 text-[#1354B6]">
                        {lotSize?.toLocaleString()}
                    </span>
                    <span className="font-[Geologica] font-extralight text-xs leading-3 text-[#1354B6]">
                        {labels.lotSize}
                    </span>
                </div>
            </div>

            {/* Property Type */}
            <div className="flex items-center gap-2">
                <div className="px-4 py-2 rounded-full bg-[#1354B6] flex items-center justify-center">
                    <img src={user} alt="Property Type" className="lg:max-w-[20px] lg:w-[24px] lg:h-[24px] w-full h-full" />
                </div>
                <div className="flex flex-col">
                    <span className="font-[ClashDisplay-Medium] lg:text-[14px] xl:text-[18px] leading-none xl:leading-5 text-[#1354B6] text-wrap">
                        {propertyType}
                    </span>
                </div>
            </div>
        </div>
    );
}