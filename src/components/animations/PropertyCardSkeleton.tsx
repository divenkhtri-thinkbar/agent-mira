import { house } from "@/assets/images";
import textData from "@/config/text.json";
import { useCurrentPage } from "@/utils/routeUtils";

const pageName = textData.routes.page_names;

function PropertyCardSkeleton({propertyInfo}: {propertyInfo: any}) {
    const currentPage = useCurrentPage();
    return (
        <div className="w-full bg-transparent max-w-3xl mx-auto h-screen px-4 pt-6 pb-10">
            <div>
                {/* Title */}
                <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] mb-4 text-center">
                    {(pageName as any)[currentPage]}
                </h1>
                <div className=" bg-[#DEDEDE] rounded-3xl overflow-hidden">
                    <div className="relative aspect-[16/8.5] bg-transparent  pt-4 pb-2 overflow-hidden z-20">
                        {propertyInfo?.image_url?.length > 0 && propertyInfo?.propertyId ? (
                            <img
                                src={propertyInfo.image_url[0]}
                                className="absolute top-4 bottom-2 left-0.5 px-4 right-4 opacity-50 rounded-3xl"
                            />
                        ) : (
                            <div className="flex flex-col gap-4 w-full px-4 h-[90vh] items-center justify-center">
                                <div className="w-full h-[383px] bg-gray-200 rounded-3xl flex items-center justify-center">
                                    <span className="text-xl">Please search for a property to view</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Property Stats */}
                    <div className="p-6 grid grid-cols-3 gap-4 bg-[#DEDEDE] rounded-b-[20px] relative z-15">
                        {Array.from({ length: 6 }).map((_, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div className="px-3 py-2 rounded-full bg-[#B2B2B2] w-14 h-8" />
                            </div>
                        ))}
                    </div>

                    {/* Features */}
                    <div className="px-6 py-4 bg-[#CFCFCF] rounded-b-[20px] relative -mt-10 z-10">
                        <div className="pt-10 space-y-2">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-4 w-full max-w-[80%] rounded"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-6 pb-6 bg-[#C5C5C5] relative -mt-10 z-0">
                        <div className="pt-12 space-y-2">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="h-4 w-full rounded"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center relative pt-2">
                    <div className="flex items-center gap-1">
                        <div className="h-3 w-24  " />
                        <div className="h-4 w-16 " />
                    </div>
                    <div className="bg-[#C5C5C5] px-2 py-2 absolute rounded-b-[9px] right-0 bottom-1">
                        <div className="h-7 w-20  animate-pulse rounded" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PropertyCardSkeleton;
