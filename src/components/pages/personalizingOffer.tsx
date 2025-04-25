import { ResizablePanel, } from "@/components/pageComponents/offerSteps";
import Layout from "@/layouts/OfferLayout";
import textData from "@/config/text.json";
import { MainNavbar } from "./main-navbar";
import MiraQnaContainer from "./mira-qna";
import { RootState } from "@/store";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import PropertyViewSkeleton from "../animations/PropertyViewSkeleton";
import { PropertyCard } from "../pageComponents/offerSteps/property/verifyingPropertyInformation/propertyCard";
import { getSavedImagesList, getSingleImage } from "@/services/apiService";
import { useCurrentPage } from "@/utils/routeUtils";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { Button } from "../ui";
import { selectQnaQuestions } from "@/slices/qnaSlice";
import { toast } from "react-toastify";

const mainTitle = textData.offerProcess.steps[0].title;

export default function PersonalizingOffer() {
    // Keep only currentStep as a static value
    const currentStep = 5;
    const currentPage = useCurrentPage();
    const { propertyData, propertyFact } = useSelector((state: RootState) => state.propertySlice);
    const [propertyInfo, setPropertyInfo] = useState<any>(propertyData);
    const [isLoading, setIsLoading] = useState(true);
    const [images, setImages] = useState<any[]>([]);
    const [direction, setDirection] = useState<"left" | "right" | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const qnaQuestions = useSelector((state: RootState) => selectQnaQuestions(state, currentPage));
    const [isImageUploaded, setIsImageUploaded] = useState(false);
    const [showPropertyInfo, setShowPropertyInfo] = useState(false);
    const hasFetchedData = useRef(false);


    useEffect(() => {
        if (propertyData) {
            setPropertyInfo(propertyData);
        }

        if(qnaQuestions.length > 0 && !hasFetchedData.current) {
            if(qnaQuestions[0].response?.length > 0) {
                setShowPropertyInfo(true);
            }
            else {
                setShowPropertyInfo(false);
            }
            hasFetchedData.current = true;     
        }
    }, [propertyData, qnaQuestions]);

    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            // You would typically fetch this data from an API
            // For now, we're just using the default values
            setIsLoading(false);
        }, 1500);

        return () => clearTimeout(timer);
    }, []);

    const handleUploadImage = async () => {
        setImages([]);
        setIsLoading(true);
        try {
            const apiResponse = await getSavedImagesList((propertyData as any)?.propertyId, currentPage);
            if (apiResponse?.code === 200) {
                if ((apiResponse as any)?.response?.images?.length > 0) {
                    const images = (apiResponse as any)?.response?.images;
                    const processedImages = [];
                    // Process each image sequentially using for...of loop
                    for (const image of images) {
                        try {
                            const blobResponse = await getSingleImage((propertyData as any)?.propertyId, image);
                            if (blobResponse) {
                                // Create object URL directly from the blob response
                                const imageUrl = URL.createObjectURL(blobResponse);
                                processedImages.push({
                                    image_url: imageUrl,
                                    description: ''
                                });
                            }
                        } catch (imageError) {
                            console.error("Error processing single image:", imageError);
                            console.error("Error details:", {
                                image,
                                error: imageError
                            });
                        }
                    }

                    if (processedImages.length > 0) {
                        setIsImageUploaded(true);
                        setImages(processedImages);
                        setIsLoading(false);
                    }
                }
                else {
                    toast.warning("No images found");
                    setIsLoading(false);
                }
            }
            else {
                toast.warning("No images found");
                setIsLoading(false);
            }
        }
        catch (error) {
            setIsLoading(false);
            console.error("Error in handleUploadImage:", error);
        }
    }

    const handleQuestionClick = (que: any) => {
        if (que && que.question_type === "upload-only") {
            handleUploadImage();
            setShowPropertyInfo(false);
        }
        else {
            setShowPropertyInfo(true);
            setImages([]);
            setIsImageUploaded(false);
        }
    }

    const handlePrevious = () => {
        setDirection("right");
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setTimeout(() => setDirection(null), 500);
    };

    const handleNext = () => {
        setDirection("left");
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setTimeout(() => setDirection(null), 500);
    };

    return (
        <Layout>
            <main className="h-screen w-full flex flex-col overflow-hidden">
                <MainNavbar currentStep={currentStep} />
                <div className="flex-1 overflow-hidden">
                    <ResizablePanel
                        leftPanel={
                            <div className="relative z-10 h-full bg-white">
                                <MiraQnaContainer onQuestionClick={handleQuestionClick} />
                            </div>
                        }
                        rightPanel={
                            <div className="relative z-0 overflow-y-auto h-screen no-scrollbar">
                                <div className="relative z-0 h-full overflow-y-auto">
                                    <div className="w-full animate-slide-in-from-left">
                                        
                                        {isLoading ? (
                                            <>
                                                <PropertyViewSkeleton propertyInfo={propertyInfo}/>
                                            </>
                                        ) : isImageUploaded && images.length > 0 ? (
                                            <div className="w-full bg-transparent max-w-3xl mx-auto px-4 pt-6 pb-10">
                                                <div className="w-full max-w-5xl bg-[#DBE9FF] rounded-[32px] relative">
                                                    <div className="relative h-[450px] w-full overflow-hidden">
                                                        <div className="h-full w-full p-2 absolute inset-0">
                                                            {images.length > 0 && <>
                                                                <img src={images[currentIndex]?.image_url || "/placeholder.svg"}
                                                                    alt={`Property image ${currentIndex + 1}`}
                                                                    className={cn(
                                                                        "h-full w-full object-cover rounded-3xl transition-all",
                                                                        direction === "left" && "animate-slide-in-from-right",
                                                                        direction === "right" && "animate-slide-in-from-left",
                                                                        !direction && "translate-x-0"
                                                                    )}
                                                                />
                                                            </>}
                                                        </div>

                                                        {/* Navigation Arrows */}
                                                        {images.length > 1 && <>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={handlePrevious}
                                                                className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/75 hover:bg-gray-300/80"
                                                                disabled={images.length <= 1}
                                                            >
                                                                <ArrowLeft className="w-6 h-6 text-black" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={handleNext}
                                                                className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/75 hover:bg-gray-300/80"
                                                                disabled={images.length <= 1}
                                                            >
                                                                <ArrowRight className="w-6 h-6 text-black" />
                                                            </Button>

                                                            {/* Expand Icon */}
                                                            {/* <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="absolute bottom-0 right-0 m-4 w-12 h-12 rounded-full bg-black/50 hover:bg-gray-300/80"
                                                            >
                                                                <Expand className="w-6 h-6 text-white" />
                                                            </Button> */}
                                                        </>}
                                                    </div>
                                                </div>

                                            </div>
                                        ) : (
                                            <div className="w-full bg-transparent max-w-3xl mx-auto h-screen px-4 pt-6 pb-10">                                               
                                                <div className="flex flex-col gap-4 w-full px-4 h-[90vh] items-center justify-center">
                                                    <div className="w-full h-[383px] bg-gray-200 rounded-3xl flex items-center justify-center">
                                                    </div>
                                                </div>                                                
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        }
                    />
                </div>
            </main>
        </Layout>
    );
}