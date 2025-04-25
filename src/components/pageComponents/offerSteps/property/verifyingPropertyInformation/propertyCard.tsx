import { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, Expand, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PropertyStats } from "../propertyStats";
import { getPropertyFeatures } from '@/services/apiService';
import textData from "@/config/text.json";
import { useDispatch, useSelector } from "react-redux";
import { selectPropertyFeatures, setPropertyFeatures } from "@/slices/propertySlice";
import { RootState } from "@/store";
import { useCurrentPage } from "@/utils/routeUtils";
import { ImageExpandView } from "@/components/ui/imageExpandView";

const pageName = textData.routes.page_names;

export function PropertyCard({ propertyInfo }: { propertyInfo: any }) {

    const dispatch = useDispatch();
    const currentPage = useCurrentPage();
    const [currentImage, setCurrentImage] = useState(0);
    const [direction, setDirection] = useState<"left" | "right" | null>(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [prevImage, setPrevImage] = useState<number | null>(null);
    const [isImageExpanded, setIsImageExpanded] = useState(false);
    const [loading, setLoading] = useState(false);
    const hasFetchedData = useRef(false);
    const storedFeatures = useSelector((state: RootState) => selectPropertyFeatures(state));

    const nextImage = () => {
        setDirection("right");
        setPrevImage(currentImage);
        setCurrentImage((prev) => (prev + 1) % propertyInfo?.images.length);
    };

    const previousImage = () => {
        setDirection("left");
        setPrevImage(currentImage);
        setCurrentImage((prev) => (prev - 1 + propertyInfo?.images.length) % propertyInfo?.images.length);
    };

    useEffect(() => {
        const fetchPropertyFeatures = async () => {
            if (propertyInfo?.propertyId) {
                // If we already have features in Redux, don't fetch again
                if (storedFeatures && storedFeatures.length > 0) {
                    return;
                }
                
                setLoading(true);
                try {
                    const apiResponse = await getPropertyFeatures(propertyInfo.propertyId);
                    if (apiResponse.code === 200) {
                        const features = (apiResponse.response as any)?.top_features || [];
                        dispatch(setPropertyFeatures(features));
                    }
                } catch (error) {
                    console.error('Error fetching property features:', error);
                } finally {
                    setLoading(false);
                }
            }
        };

        if (!hasFetchedData.current) {
            fetchPropertyFeatures();
            hasFetchedData.current = true;
        }
   
    }, [propertyInfo?.propertyId, dispatch, storedFeatures]);

    useEffect(() => {
        if (direction) {
            const timer = setTimeout(() => {
                setDirection(null);
                setPrevImage(null);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [direction]);

    useEffect(() => {
        if (isImageExpanded) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }
        return () => {
            document.body.classList.remove("overflow-hidden");
        };
    }, [isImageExpanded]);

    // if (propertyInfo?.isLoading) {
    //     return <PropertyCardSkeleton />;
    // }
    
    return (
        <div className="w-full bg-[#F4F4F4] max-w-3xl mx-auto h-screen px-4 pt-6 pb-10">
            <div>
                <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] mb-4 text-center">
                    {(pageName as any)[currentPage]}
                </h1>

                <div className="bg-[#B8D4FF] rounded-3xl overflow-hidden">
                    {/* Image Carousel */}
                    <div className="relative aspect-[16/10] bg-transparent px-4 pt-4 pb-2 overflow-hidden">
                        {prevImage !== null && direction && (
                            <div className={cn("absolute top-4 bottom-2 left-4 right-4 transition-transform duration-500 ease-in-out")}>
                                {propertyInfo?.images[prevImage] && <>
                                    <img src={propertyInfo?.images[prevImage]} alt={`Property image ${prevImage + 1}`}
                                        className={cn("w-full h-full object-cover rounded-3xl",
                                            direction === "right" && "animate-slide-out-left",
                                            direction === "left" && "animate-slide-out-right"
                                        )}
                                    />
                                </>}

                                {!propertyInfo?.images[prevImage] && <>
                                    <div className="h-full w-full object-cover rounded-3xl bg-[#DEDEDE] rounded-3xl overflow-hidden">
                                        <div className="flex items-center justify-center h-full w-full relative aspect-[16/8.5] bg-transparent  pt-4 pb-2 overflow-hidden z-20">
                                            <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] text-center">
                                                No image found
                                            </h1>
                                        </div>
                                    </div>
                                </>}
                            </div>
                        )}

                        <div className={cn("absolute top-4 bottom-2 left-4 right-4 transition-transform duration-500 ease-in-out")}>
                            {propertyInfo?.images[currentImage] && <>
                                <img src={propertyInfo?.images[currentImage]} alt={`Property image ${currentImage + 1}`}
                                    className={cn("w-full h-full object-cover rounded-3xl",
                                    direction === "right" && "animate-slide-in-from-right",
                                    direction === "left" && "animate-slide-in-from-left",
                                    !direction && "translate-x-0")} />
                            </>}

                            {!propertyInfo?.images[currentImage] && <>
                                <div className="h-full w-full object-cover rounded-3xl bg-[#DEDEDE] rounded-3xl overflow-hidden">
                                    <div className="flex items-center justify-center h-full w-full relative aspect-[16/8.5] bg-transparent  pt-4 pb-2 overflow-hidden z-20">
                                        <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] text-center">
                                            No image found
                                        </h1>
                                    </div>
                                </div>
                            </>}
                        </div>
                        
                        {propertyInfo?.images.length > 1 && <>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute left-7 top-1/2 -translate-y-1/2 bg-[#DEEBFFC4] hover:bg-white rounded-full z-30"
                                onClick={previousImage}
                            >
                                <ChevronLeft className="h-8 w-8" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-7 top-1/2 -translate-y-1/2 bg-[#DEEBFFC4] hover:bg-white rounded-full z-30"
                                onClick={nextImage}
                            >
                                <ChevronRight className="h-8 w-8" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute right-7 bottom-5 bg-black/50 hover:bg-black/70 text-white/100 hover:text-white z-30 cursor-pointer"
                                onClick={() => setIsImageExpanded(true)}
                            >
                                <Expand className="h-7 w-7" />
                            </Button>
                        </>}

                        <div className="absolute bottom-0 left-0 bg-[#B8D4FF] px-5 py-3 rounded-tr-[33px] z-30">
                            <span className="text-[38px] font-[ClashDisplay-Medium] text-[#1354B6] leading-9">
                                {propertyInfo?.price}
                            </span>
                        </div>
                    </div>

                    {isImageExpanded && (
                        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                            <ImageExpandView
                                images={propertyInfo?.images || []}
                                currentIndex={currentImage}
                                onClose={() => setIsImageExpanded(false)}
                                onIndexChange={setCurrentImage}
                            />
                        </div>
                    )}

                    {/* Property Stats */}
                    <PropertyStats
                        beds={propertyInfo?.beds}
                        baths={propertyInfo?.baths}
                        sqft={propertyInfo?.sqft}
                        builtIn={propertyInfo?.builtIn}
                        hoa={propertyInfo?.hoa}
                        lotSize={propertyInfo?.lotSize}
                        propertyType={propertyInfo?.propertyType}
                        livingArea={propertyInfo?.livingArea}
                    />

                    {/* Features */}
                    <div className="px-6 py-4 bg-[#C9DEFF] rounded-b-[20px] relative -mt-10 z-10">
                        <div className="text-[#1354B6] text-sm leading-6 pt-10">
                            <div className="leading-relaxed">
                                {loading ? (
                                    <div className="loader">Loading...</div>
                                ) : storedFeatures && storedFeatures.length > 0 ? (
                                    <>
                                        {storedFeatures.map((feature: any, index: any) => (
                                            <span key={index} className="font-[ClashDisplay-Medium] me-3">
                                                + {feature} 
                                            </span>
                                        ))}
                                    </>
                                ) : (
                                    <div>No features available.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="px-6 pb-6 bg-[#DBE9FF] relative -mt-10 z-0">
                        <p
                            className={cn("text-[#1354B6] font-[Geologica] font-light text-sm leading-7 relative pt-12",
                                !isExpanded && "line-clamp-3"
                            )}
                        >
                            {propertyInfo?.description} 
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center relative pt-2">
                    <div className="flex items-center gap-1">
                        {/* <p className="text-[#9E9E9E] font-[Geologica] font-light text-xs">
                            Data sourced from
                        </p>
                        <img
                            src={verifyPropertyFooter}
                            alt="Stellar MLS"
                            className="w-auto h-4 object-contain"
                        /> */}
                    </div>
                    {propertyInfo?.description?.length > 195 && <>
                        <div
                            className="bg-[#DBE9FF] cursor-pointer px-2 py-2 absolute rounded-b-[9px] flex justify-end bottom-0 right-0 items-center gap-2 text-[#1354B6] font-[ClashDisplay-Regular] text-sm leading-[22.8px] tracking-[7%] underline underline-offset-2 decoration-1 decoration-solid"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <span className="uppercase">
                                {isExpanded ? "Show Less" : "Show More"}
                            </span>
                        </div>
                    </>}
                </div>
            </div>
        </div>
    );
}
