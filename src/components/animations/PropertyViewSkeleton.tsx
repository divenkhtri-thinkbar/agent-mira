import { placeholder } from "@/assets/images";
import { Card, CardContent } from "@/components/ui/card";
import { useCurrentPage } from "@/utils/routeUtils";

function PropertyViewSkeleton({propertyInfo}: {propertyInfo: any}) {
    const currentPage = useCurrentPage();

    
    return (
        <>
            {((propertyInfo?.image_url?.length > 0 && propertyInfo?.propertyId) || currentPage === "user_preferences") ? (
                <div className="flex flex-col gap-4 w-full px-4 h-[90vh] items-center justify-center">
                    <div className="rounded-[25px] relative overflow-hidden">
                        <Card className="">
                            <CardContent className="p-0 bg">
                                {placeholder && <>
                                    <img
                                        src={placeholder}
                                        alt="Property"
                                        className="object-contain rounded-[32px] opacity-50"
                                    />
                                </>}
                                
                                {propertyInfo?.image_url?.length > 0 && <>
                                    <img
                                        src={propertyInfo.image_url[0]}
                                        alt="Property"
                                        className="w-full h-[383px] object-contain rounded-3xl opacity-50"
                                    />
                                </>}
                                <div className="px-4 flex items-center justify-center gap-2 h-8" />
                            </CardContent>
                        </Card>

                        {/* Second Card */}
                        <Card className="bg-black/10 animate-pulse">
                            <CardContent className="p-0">
                                <div className="h-[260px] w-full" />
                            </CardContent>
                        </Card>

                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 border-8 border-black/5  bg-[#F4F4F4] rounded-full" />
                                <div className="absolute inset-0 border-8 border-transparent border-t-green-500 rounded-full animate-spin" />          </div>

                            {/* Animated Text Below Loader */}
                            <p className="text-[#343434] font-[ClashDisplay-Medium] text-base text-center max-w-[290px]">
                                Buying a home is one of the biggest decisions you'll ever make.
                                Getting the offer price just right.
                            </p>
                        </div>
                    </div>
                </div>                      
            ) : (
                <div className="flex flex-col gap-4 w-full px-4 h-[90vh] items-center justify-center">
                    <div className="w-full h-[383px] bg-gray-200 rounded-3xl flex items-center justify-center">
                        <span className="text-xl">Please search for a property to view</span>
                    </div>
                </div>
            )}
        </>
    );
}

export default PropertyViewSkeleton;