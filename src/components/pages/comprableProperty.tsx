import { ChatHeader, ResizablePanel, } from "@/components/pageComponents/offerSteps";
import Layout from "@/layouts/OfferLayout";
import textData from "@/config/text.json";
import { MainNavbar } from "./main-navbar";
import MiraQnaContainer from "./mira-qna";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { bath, bed, verifyProperty } from "@/assets/images";
import NumberCounter from "@/components/animations/NumberIncrement";
import { getCmaData, setCmaList } from "@/slices/preferenceSlice";
import { useDispatch, useSelector } from "react-redux";
import PropertyCardSkeleton from "../animations/PropertyCardSkeleton";
import { selectPropertyData } from "@/slices/propertySlice";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { RootState } from "@/store";
import { selectQnaQuestions } from "@/slices/qnaSlice";
import { useCurrentPage } from "@/utils/routeUtils";
import { getCmaList } from "@/services/apiService";
import { useLoader } from "@/services/LoaderContext";

// Define Property interface
interface Property {
    imageUrl: string[];
    matchPercentage: number;
    price: number;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    distance: any;
    beds: number;
    baths: number;
    sqft: number;
    similarFeatures: string[];
    keyDifferences: string[];
    soldDate: string;
}

export default function ComprableProperty() {
    // Keep only currentStep as a static value
    const currentStep = 2;
    const navigate = useNavigate();
    const currentPage = useCurrentPage();
    // Add state variables for property data
    const [currentPropertyIndex, setCurrentPropertyIndex] = useState(0);
    const propertyCmaListings = useSelector(getCmaData);
    const propertyInfo = useSelector(selectPropertyData);
    // Replace the hardcoded properties with dynamic data from cmaListing
    const [properties, setProperties] = useState<Property[]>([]);
    // Add these new state variables near the top with other state declarations
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [direction, setDirection] = useState<"left" | "right" | null>(null);
    const [prevImageIndex, setPrevImageIndex] = useState<number | null>(null);
    const [rightSidePanel, setRightSidePanel] = useState(false);
    const qnaQuestions = useSelector((state: RootState) => selectQnaQuestions(state, currentPage));
    const dispatch = useDispatch();
    const hasFetchedData = useRef(false);
    const { showLoader, hideLoader } = useLoader();

    // Get CMA data
    const getCma = useCallback(async (mlsid: string) => {
        if (propertyCmaListings?.comparableProperty?.length > 0) {
            return;
        }

        try {
            showLoader();
            const cmaResponse = await getCmaList(mlsid);
            if (cmaResponse.code === 200) {
                dispatch(setCmaList(cmaResponse.response as any));
                hideLoader();
            }
            else {
                hideLoader();
            }
        }
        catch (error) {
            hideLoader();
        }
    }, [dispatch]);

    useEffect(() => {
        if (propertyInfo?.propertyId && !hasFetchedData.current) {
            getCma(propertyInfo?.propertyId as string);
            hasFetchedData.current = true;
        }
    }, []);

    useEffect(() => {
        if (propertyCmaListings && propertyCmaListings.comparableProperty && propertyCmaListings.comparableProperty.length > 0) {
            const mappedProperties: Property[] = propertyCmaListings.comparableProperty.map((property: any) => {
                return {
                    imageUrl: Array.isArray(property?.images) ? property.images : property?.images ? [property.images] : [],
                    matchPercentage: parseInt(property.FinalMatchScore?.replace(/[^0-9]/g, ""), 10),
                    price: parseInt(property.ClosePrice?.replace(/[^0-9]/g, ""), 10),
                    address: {
                        street: property.UnparsedAddress?.split(", ")[0] || "",
                        city: property.UnparsedAddress?.split(", ")[1]?.split(" ")[0] || "",
                        state: property.UnparsedAddress?.split(", ")[1]?.split(" ")[1] || "",
                        zip: property.UnparsedAddress?.split(", ")[1]?.split(" ")[2] || ""
                    },
                    distance: property?.DistanceFromSubject,
                    beds: property.BedroomsTotal || 0,
                    baths: property.BathroomsTotalDecimal || 0,
                    sqft: parseInt(property.LivingArea?.replace(" Sqft", "").replace(",", "") || "0"),
                    similarFeatures: property.Top3SimilarFeatures || [],
                    keyDifferences: property.Top3KeyDifferences || [],
                    soldDate: property.CloseDate ? `Sold ${property.CloseDate}` : "Recently Listed"
                };
            });
            setProperties(mappedProperties);
        }
        else {
            setProperties([]);
        }

        if (qnaQuestions && qnaQuestions.length > 0) {
            const ques = qnaQuestions.some((question) => question.right_panel === "comparable-properties" && question?.response?.length > 0);
            if (ques) {
                setRightSidePanel(true);
            }
        }
    }, [propertyCmaListings, qnaQuestions]);

    // Get current property (with fallback for empty properties array)
    const currentProperty = properties[currentPropertyIndex] || {
        imageUrl: [],
        matchPercentage: 0,
        price: 0,
        address: { street: "", city: "", state: "", zip: "" },
        distance: 0,
        beds: 0,
        baths: 0,
        sqft: 0,
        similarFeatures: [],
        keyDifferences: [],
        soldDate: ""
    } as Property;

    // Navigation functions
    const onNext = () => {
        if (currentPropertyIndex < properties.length - 1) {
            setCurrentPropertyIndex(currentPropertyIndex + 1);
        }
    };

    const onPrevious = () => {
        if (currentPropertyIndex > 0) {
            setCurrentPropertyIndex(currentPropertyIndex - 1);
        }
    };

    const handleQuestionClick = (que: any) => {
        if (que.right_panel === "comparable-properties" && que?.response?.length > 0) {
            setRightSidePanel(true);
        }
        else {
            setRightSidePanel(false);
        }
    }

    const labels = textData.step2Content.presentPropertyCard.labels;

    // Destructure current property
    const {
        imageUrl,
        matchPercentage,
        price,
        address,
        distance,
        beds,
        baths,
        sqft,
        similarFeatures,
        keyDifferences,
        soldDate
    } = currentProperty;

    const onNextStep = () => {
        navigate('/market/' + propertyInfo?.propertyId);
    };

    // Add these navigation functions
    const nextImage = (images: string[]) => {
        setDirection("right");
        setPrevImageIndex(currentImageIndex);
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const previousImage = (images: string[]) => {
        setDirection("left");
        setPrevImageIndex(currentImageIndex);
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    // Add this useEffect to reset animation
    useEffect(() => {
        if (direction) {
            const timer = setTimeout(() => {
                setDirection(null);
                setPrevImageIndex(null);
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [direction]);

    return (
        <Layout>
            <main className="h-screen w-full flex flex-col overflow-hidden">
                <MainNavbar currentStep={currentStep} />
                <div className="flex-1 overflow-hidden">
                    <ResizablePanel
                        leftPanel={
                            <div className="relative z-10 h-full bg-white">
                                {(!propertyCmaListings || Object.keys(propertyCmaListings).length === 0 || propertyCmaListings?.comparableProperty?.length === 0) && <>
                                    <div className="flex flex-col h-[100%] w-full mx-auto bg-white relative">
                                        {/* Chat Header */}
                                        <ChatHeader />
                                        <div className="flex flex-col px-14 py-4 w-full h-full items-center justify-center">
                                            <div className="w-[500px] p-5 rounded-[20px] shadow-lg overflow-hidden flex flex-col relative border-[3px] border-[#468ffe]">
                                                <div className="flex flex-col h-full p-2 items-center justify-center">
                                                    <h1 className="font-[Geologica] text-xl leading-9 text-[#1354B6] mb-4 text-center">
                                                        No comparables for this property? That's a challenge—but not a roadblock. Agent Mira knows the home, the neighborhood, and the market—leveraging deep insights to estimate a strong offer price.
                                                    </h1>

                                                    <button className="group flex w-72 cursor-pointer" onClick={onNextStep}>
                                                        {/* Left Section: Button Text */}
                                                        <div className="flex-1 bg-[#1354B6] text-white rounded-full flex items-center justify-center font-[ClashDisplay-Medium] text-base">
                                                            Next Step
                                                        </div>

                                                        {/* Right Section: Arrow Icon with hover effect */}
                                                        <div className="bg-[#1354B6] text-white p-2 rounded-full transition-transform group-hover:translate-x-2">
                                                            <ArrowRight strokeWidth={1.5} className="h-5 w-5" />
                                                        </div>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>}
                                {propertyCmaListings && Object.keys(propertyCmaListings).length > 0 && propertyCmaListings?.comparableProperty?.length > 0 && <MiraQnaContainer onQuestionClick={handleQuestionClick} />}
                            </div>
                        }
                        rightPanel={
                            <div className="relative z-0 overflow-y-auto h-screen no-scrollbar">
                                {(!propertyCmaListings || Object.keys(propertyCmaListings).length === 0 || propertyCmaListings?.comparableProperty?.length === 0 || !rightSidePanel) && <>
                                    <PropertyCardSkeleton propertyInfo={propertyInfo} />
                                </>}


                                {propertyCmaListings && propertyCmaListings?.comparableProperty?.length > 0 && rightSidePanel && <>
                                    <div className="w-full slide-in-from-left">
                                        <div className="flex flex-col px-14 py-4 w-full h-full items-center justify-center">
                                            <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 textColor mb-4 text-center">
                                                {labels.title}
                                            </h1>

                                            {/* First Card: Image, Price, Location, and Property Details */}
                                            <Card className="max-w-3xl w-full mx-auto overflow-hidden bg-[#B8D4FF] rounded-[32px] relative z-[5]">
                                                <div className="relative h-[360px] w-full">
                                                    {/* Match Badge */}
                                                    <div className="rounded-full bg-[#B8D4FF] p-2 absolute left-0 top-0 z-10">
                                                        <div className={cn("bg-[#FFB952] text-black rounded-full px-4 py-3",
                                                            matchPercentage < 70 && "bg-[#ffe300]",
                                                            matchPercentage > 70 && "bg-[#FFB952]",
                                                            matchPercentage > 80 && "bg-emerald-400"
                                                        )}>
                                                            <div className="text-xl font-bold">
                                                                <NumberCounter endValue={matchPercentage} duration={2000} />%
                                                            </div>
                                                            <div className="text-sm">{labels.match}</div>
                                                        </div>
                                                    </div>

                                                    {/* Price and Price per SqFt */}
                                                    <div className="absolute bottom-[-7%] right-0 bg-[#B8D4FF] px-5 py-3 rounded-tl-[33px] z-30">
                                                        <span className="text-[38px] font-[ClashDisplay-Medium] textColor leading-9">
                                                            $ <NumberCounter endValue={price} duration={4500} />
                                                        </span>
                                                        <div className="text-sm textColor text-right">{labels.pricePerSqFt}</div>
                                                    </div>

                                                    {/* Property Image */}
                                                    <div className="h-full w-full p-3">
                                                        {imageUrl && imageUrl.length > 0 ? (
                                                            <div className="relative h-full w-full">
                                                                {prevImageIndex !== null && direction && (
                                                                    <div className="absolute inset-0 transition-transform duration-500 ease-in-out">
                                                                        <img
                                                                            src={imageUrl[prevImageIndex]}
                                                                            alt="Property"
                                                                            className={cn(
                                                                                "h-full w-full object-cover rounded-3xl",
                                                                                direction === "right" && "animate-slide-out-left",
                                                                                direction === "left" && "animate-slide-out-right"
                                                                            )}
                                                                        />
                                                                    </div>
                                                                )}

                                                                <div className="absolute inset-0 transition-transform duration-500 ease-in-out">
                                                                    <img
                                                                        src={imageUrl[currentImageIndex]}
                                                                        alt="Property"
                                                                        className={cn(
                                                                            "h-full w-full object-cover rounded-3xl",
                                                                            direction === "right" && "animate-slide-in-from-right",
                                                                            direction === "left" && "animate-slide-in-from-left",
                                                                            !direction && "translate-x-0"
                                                                        )}
                                                                    />
                                                                </div>

                                                                {imageUrl.length > 1 && (
                                                                    <>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="absolute left-3 top-1/2 -translate-y-1/2 bg-[#DEEBFFC4] hover:bg-white rounded-full z-30"
                                                                            onClick={() => previousImage(imageUrl)}
                                                                        >
                                                                            <ChevronLeft className="h-8 w-8" />
                                                                        </Button>
                                                                        <Button
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            className="absolute right-3 top-1/2 -translate-y-1/2 bg-[#DEEBFFC4] hover:bg-white rounded-full z-30"
                                                                            onClick={() => nextImage(imageUrl)}
                                                                        >
                                                                            <ChevronRight className="h-8 w-8" />
                                                                        </Button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div className="h-full w-full object-cover rounded-3xl bg-[#DEDEDE] rounded-3xl overflow-hidden">
                                                                <div className="flex items-center justify-center h-full w-full relative aspect-[16/8.5] bg-transparent pt-4 pb-2 overflow-hidden z-20">
                                                                    <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] text-center">
                                                                        No image found
                                                                    </h1>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="p-6 space-y-8">
                                                    {/* Location Section */}
                                                    <div className="flex justify-between items-start">
                                                        <div className="flex gap-4 max-w-[70%]">
                                                            <div className="flex-shrink-0">
                                                                <MapPin className="w-9 h-9 text-[#FFC251] bg-[#1354B6] rounded-full p-1.5" />
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <h3 className="font-[ClashDisplay-Medium] text-xl textColor break-words">
                                                                    {address.street}
                                                                </h3>
                                                                <p className="persentPropertyDetailsText text-[#0036ABB2]">
                                                                    {distance} miles away
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <div className="font-[ClashDisplay-Medium] text-base textColor mt-1">
                                                                {soldDate}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Property Details */}
                                                    <div className="flex justify-between items-start px-0">
                                                        <div className="flex items-center gap-2">
                                                            <div className="px-3 py-2 rounded-full bg-[#1354B6] flex items-center justify-center">
                                                                <img src={bed} alt="Beds" className="w-full h-full" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-[ClashDisplay-Medium] text-[22px] leading-5 textColor">
                                                                    <NumberCounter endValue={beds} duration={300} />
                                                                </span>
                                                                <span className="persentPropertyDetailsText textColor">
                                                                    {labels.beds}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="px-3 py-2 rounded-full bg-[#1354B6] flex items-center justify-center">
                                                                <img src={bath} alt="Baths" className="w-full h-full" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-[ClashDisplay-Medium] text-[22px] leading-5 textColor">
                                                                    <NumberCounter endValue={baths} duration={300} />
                                                                </span>
                                                                <span className="persentPropertyDetailsText textColor">
                                                                    {labels.baths}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="px-3 py-2 rounded-full bg-[#1354B6] flex items-center justify-center">
                                                                <img src={bed} alt="SqFt" className="w-full h-full" />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <span className="font-[ClashDisplay-Medium] text-[22px] leading-5 textColor">
                                                                    <NumberCounter endValue={sqft} duration={2000} />
                                                                </span>
                                                                <span className="persentPropertyDetailsText textColor">
                                                                    {labels.sqft}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>

                                            {/* Second Card: Comparison Section */}
                                            <Card className="max-w-3xl w-full mx-auto overflow-hidden bg-[#D3E4FF] rounded-[32px] relative z-0 -mt-16">
                                                <div className="p-6 flex flex-col mt-16">
                                                    {/* Row 1: Headers */}
                                                    <div className="flex flex-row justify-between mb-0 font-[ClashDisplay-Semibold] text-lg leading-[18px] textColor">
                                                        <h4 className="text-left w-1/2">{labels.similarFeatures}</h4>
                                                        <h4 className="text-left w-1/2">{labels.keyDifferences}</h4>
                                                    </div>

                                                    <div className="border-t-2 border-black/10 my-3" />

                                                    {/* Row 2: Bullet Points */}
                                                    <div className="flex flex-row justify-between">
                                                        {/* Features Column */}
                                                        <ul className="space-y-3 w-1/2 px-2">
                                                            {similarFeatures.map((feature, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="text-base font-[Geologica] textColor font-normal flex items-start"
                                                                >
                                                                    <span className="text-[#1463FF] mr-2 flex-shrink-0">•</span>
                                                                    <span className="break-words">
                                                                        {feature}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>

                                                        {/* Differences Column */}
                                                        <ul className="space-y-3 w-1/2 px-2">
                                                            {keyDifferences.map((difference, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="text-base font-[Geologica] textColor font-normal flex items-start"
                                                                >
                                                                    <span className="text-[#1463FF] mr-2 flex-shrink-0">•</span>
                                                                    <span className="break-words">
                                                                        {difference}
                                                                    </span>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </Card>

                                            {/* Navigation Arrows */}
                                            <div className="flex justify-center gap-4 pt-4">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={onPrevious}
                                                    className="w-12 h-12 rounded-full bg-[#CBCCCD] hover:bg-gray-300/80"
                                                    disabled={!onPrevious} // Disable if no previous card
                                                >
                                                    <ArrowLeft className="w-6 h-6 text-white" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={onNext}
                                                    className="w-12 h-12 rounded-full bg-[#CBCCCD] hover:bg-gray-300/80"
                                                    disabled={!onNext} // Disable if no next card
                                                >
                                                    <ArrowRight className="w-6 h-6 text-white" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </>}
                            </div>
                        }
                    />
                </div>
            </main>
        </Layout>
    );
}