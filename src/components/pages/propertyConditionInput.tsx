import { ResizablePanel, } from "@/components/pageComponents/offerSteps";
import Layout from "@/layouts/OfferLayout";
import textData from "@/config/text.json";
import { MainNavbar } from "./main-navbar";
import MiraQnaContainer from "./mira-qna";
import { CircleCheckBig, ArrowLeft, ArrowRight, CircleHelp, Expand, X } from "lucide-react";
import { useEffect, useMemo, useState, useRef } from "react";
import { Button, ScrollArea } from "../ui";
import { selectQnaQuestions } from '@/slices/qnaSlice';
import { useCurrentPage } from '@/utils/routeUtils';
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";
import CircularLoading from "../animations/circularLoading";
import { getSavedImagesList, getSingleImage } from "@/services/apiService";
import { createSelector } from "@reduxjs/toolkit";
import { placeholder } from "@/assets/images";
import { ImageExpandView } from "../ui/imageExpandView";

// Define interface for Question
interface Question {
    question_id?: string;
    question_text?: string;
    question_type?: string;
    right_panel?: string;
    isViewType?: string | number;
    featureList?: Array<{
        image_url: string;
        description: string;
    }>;
    response?: any[];
    is_saved?: boolean;
    response_options?: Array<{
        optionId: string;
        featureList?: Array<{
            image_url: string;
            description: string;
        }>;
    }>;
    isArrowVisible?: boolean;
    qualityScore?: string;
    score_text?: string;
}

// Add these memoized selectors outside of the component
const selectMemoizedPropertySlice = createSelector(
    [(state: RootState) => state.propertySlice],
    (propertySlice) => ({
        propertyData: propertySlice.propertyData
    })
);

export default function PropertyConditionInput() {
    // Keep only currentStep as a static value
    const currentStep = 4;
    const currentPage = useCurrentPage();
    const [currentIndex, setCurrentIndex] = useState(0);
    const imageCardText = textData.step4Content.imageCard;
    // Quality Score Card
    const [direction, setDirection] = useState<"left" | "right" | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [notchText, setnotchText] = useState("");
    const [question, setQuestion] = useState<Question>({});
    const [images, setImages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isHandleClicked, setIsHandleClicked] = useState(false);
    const [showQualityScore, setShowQualityScore] = useState(false);
    const { propertyData } = useSelector(selectMemoizedPropertySlice);

    const qualityScoreText = textData.step4Content.qualityScoreCard;
    const dropdown = qualityScoreText.dropdown;
    const scoreData = dropdown.scores;
    const qnaQuestions = useSelector((state: RootState) => selectQnaQuestions(state, currentPage));
    const [isImageExpanded, setIsImageExpanded] = useState(false);

    // Add useRef for the dropdown container
    const dropdownRef = useRef<HTMLDivElement>(null);
    const hasFetchedData = useRef(false);

    // Add useEffect for Escape key handling
    useEffect(() => {
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && isImageExpanded) {
                setIsImageExpanded(false);
            }
        };

        window.addEventListener('keydown', handleEscapeKey);
        return () => {
            window.removeEventListener('keydown', handleEscapeKey);
        };
    }, [isImageExpanded]);

    // Create lastQuestion variable to avoid the "Cannot find name 'lastQuestion'" errors
    const lastQuestion = useMemo(() => {
        if (!qnaQuestions?.length) return null;
        
        // First check for standout-features type question
        for (let i = qnaQuestions.length - 1; i >= 0; i--) {
            if (qnaQuestions[i]?.question_type === "standout-features" && qnaQuestions[i]?.right_panel && qnaQuestions[i]?.response?.length > 0) {
                return qnaQuestions[i];
            }
        }
        
        // If no standout-features found, proceed with existing logic
        // for (let i = qnaQuestions.length - 1; i >= 0; i--) {
        //     if (qnaQuestions[i]?.right_panel && qnaQuestions[i]?.response?.length > 0) {
        //         if(qnaQuestions[i]?.question_type === "quality-score"){
        //             const selectedOptionId = qnaQuestions[i]?.response[0];
        //             let selectedOption = qnaQuestions[i]?.response_options.find((option: any) => option.option_id === selectedOptionId && option.option_text.includes("Skip"));
        //             if(!selectedOption){
        //                 setImages([]);
        //                 return qnaQuestions[i];   
        //             }
        //         }
        //         else if(qnaQuestions[i]?.hasOwnProperty("featureList")){
        //             return qnaQuestions[i];
        //         }
        //     }
        // }
        return null;
    }, [qnaQuestions]);

    const handleUploadImage = async (que: any) => {
        setImages([]);
        setIsLoading(true);
        setShowQualityScore(false);
        try {
            const apiResponse = await getSavedImagesList((propertyData as any)?.propertyId, currentPage);
            if(apiResponse?.code === 200){
                if((apiResponse as any)?.response?.images?.length > 0){
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
                        setImages(processedImages);
                        setQuestion(que);
                    }
                    setIsLoading(false);
                }
                else{
                    setIsLoading(false);
                }
            }
            else {
                setIsLoading(false);
            }
        } 
        catch (error) {
            setIsLoading(false);
            console.error("Error in handleUploadImage:", error);
        }
    }
    
    // Update the toggleDropdown function
    const checkSkipLogic = (question: any) => {
        if(question?.question_type === "quality-score" && question?.response?.length > 0){
            const selectedOptionId = question?.response[0];
            let selectedOption = question?.response_options.find((option: any) => option.option_id === selectedOptionId && option.option_text.includes("Skip"));
            if(selectedOption){
                return true;
            }
            else{
                return false;
            }
        }
        return false;
    };

    // Cleanup function to revoke object URLs when component unmounts
    useEffect(() => {
        return () => {
            // Cleanup object URLs
            images.forEach(image => {
                if (image.image_url && image.image_url.startsWith('blob:')) {
                    URL.revokeObjectURL(image.image_url);
                }
            });
        };
    }, [images]);

    useEffect(() => {
        if(lastQuestion && !hasFetchedData.current){
            setQuestion(lastQuestion);  
                   
            setnotchText('');
            if (lastQuestion && lastQuestion?.question_type === "quality-specific-area"){
                if (lastQuestion?.response_options && lastQuestion?.response && lastQuestion?.response.length > 0) {
                    const selectedOptionId = lastQuestion?.response[0];
                    const selectedOption = lastQuestion?.response_options.find((option: any) => option.option_id === selectedOptionId);
                   
                    if (selectedOption && selectedOption.featureList) {
                        setnotchText(selectedOption.option_text);
                        setImages(selectedOption.featureList);
                    } 
                    else {
                        setImages(lastQuestion?.featureList || []);
                    }
                }
            }
            else if(lastQuestion && lastQuestion.question_type === "quality-score" && lastQuestion.response?.length > 0){
                const selectedOptionId = lastQuestion?.response[0];
                let selectedOption = lastQuestion?.response_options.find((option: any) => option.option_id === selectedOptionId && option.option_text.includes("Skip"));
                if(!selectedOption && lastQuestion?.qualityScore){
                    setShowQualityScore(true);
                    setImages([]);
                }
                else{
                    setImages([]);
                    setQuestion({});
                }
            }
            else if(lastQuestion?.featureList?.length > 0) {
                setImages(lastQuestion?.featureList || []);
            }
            hasFetchedData.current = true; 
        }
    }, []); // Empty dependency array means this effect will only run once on mount

    const handleQuestionClick = (que: any) => { 
        if(que?.question_type !== "quality-score" && que?.question_type !== "inspection-features"){
            setImages([]);
        }
        setIsHandleClicked(true);
        if(que?.featureList?.length === 0){
            setIsLoading(true);
        }
        setCurrentIndex(0);
        setQuestion(que);
        setnotchText('');  
        setShowQualityScore(false);      
        if (que && que.question_type === "upload-only"){
            handleUploadImage(que);
        }
        else if (que && que.question_type === "quality-specific-area"){            
            // Check if que has response_options and response
            if (que.response_options && que.response && que.response.length > 0) {
                const selectedOptionId = que.response[0];
                // Find the option that matches the selected response
                const selectedOption = que.response_options.find((option: any) => option.option_id === selectedOptionId);
                // If a matching option is found and it has a featureList, use it
                
                if (selectedOption && selectedOption.featureList) {
                    setnotchText(selectedOption?.option_text);
                    setImages(selectedOption.featureList);
                } 
                else {
                    // Fallback to the question's featureList if no matching option found
                    setImages(que.featureList || []);
                }
            } 
            else {
                // Use default featureList if no response_options or response
                setImages(que.featureList || []);
            }
        }
        else if(que && que.question_type === "quality-score" && que.response?.length > 0){
            const selectedOptionId = que?.response[0];
            let selectedOption = que?.response_options.find((option: any) => option.option_id === selectedOptionId && !option.option_text.includes("Skip"));
            if(selectedOption && que?.qualityScore){
                setShowQualityScore(true);
                setImages([]);
            }
        }
        else if(que && que.question_type === "inspection-features" && que.response?.length > 0){
            const selectedOptionId = que?.response[0];
            let selectedOption = que?.response_options.find((option: any) => option.option_id === selectedOptionId && !option.option_text.includes("Skip"));
            if(selectedOption){
                setImages(que?.featureList);
            }
            else{
                setImages([]);
            }
        }

        if(que?.featureList?.length > 0 && que?.question_type !== "quality-score" && que?.question_type !== "inspection-features") {
            setImages(que?.featureList || []);
        }

        if (que && que.question_type !== "upload-only"){ 
            setTimeout(() => {
                setIsLoading(false);
                setIsHandleClicked(false);
            }, 300);
        }
    }

    const handlePrevious = (e: React.MouseEvent) => {
        e.preventDefault();
        setDirection("right");
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setTimeout(() => setDirection(null), 500);
    };
    
    const handleNext = (e: React.MouseEvent) => {
        e.preventDefault();
        setDirection("left");
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
        setTimeout(() => setDirection(null), 500);
    };
    // ================================================================

    // Update the useEffect to handle outside clicks
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    // Update the toggleDropdown function
    const toggleDropdown = () => {
        setIsDropdownOpen(prev => !prev);
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
                                {!isImageExpanded && <>
                                    {/* {JSON.stringify(showQualityScore)} */}
                                    {(showQualityScore || question?.isViewType || images.length > 0) && <>
                                        <div className="flex flex-col px-4 sm:px-14 py-4 w-full h-full items-center justify-center gap-6">
                                            {/* Show when quality score is available */}
                                            {showQualityScore && <>
                                                <div className="w-full flex flex-col items-center">
                                                    <div className="flex justify-between items-center w-full max-w-5xl relative">
                                                        <div className="px-4 py-2 rounded-t-[25px] bg-[#DBE9FF]">
                                                            <span className="font-[Geologica] text-lg textColor">
                                                                {qualityScoreText?.overallQualityScore}
                                                            </span>
                                                        </div>
                                                        
                                                        <Button variant="ghost" className="cursor-pointer bg-transparent flex items-center gap-2 relative" onClick={toggleDropdown} >
                                                            <span className="text-sm textColor text-wrap">{qualityScoreText?.qualityScoreLabel}</span>
                                                            <div className="bg-[#1354B6] rounded-full p-1">
                                                                <CircleHelp className="w-5 h-5 text-white" />
                                                            </div>
                                                        </Button>

                                                        {isDropdownOpen && (
                                                            <div 
                                                                ref={dropdownRef} 
                                                                className="absolute top-full right-0 mt-2 w-full max-w-[90%] sm:max-w-[450px] bg-[#B8D4FF] rounded-lg shadow-lg p-4 z-50"
                                                                onClick={(e) => e.stopPropagation()}
                                                            >
                                                                <div className="relative">
                                                                    <Button 
                                                                        variant="ghost" 
                                                                        size="icon" 
                                                                        className="cursor-pointer top-3 right-10 w-6 h-6 rounded-full hover:bg-[#A0C1FF]" 
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            e.stopPropagation();
                                                                            setIsDropdownOpen(false);
                                                                        }}
                                                                        aria-label="Close dropdown"
                                                                    >
                                                                        <X className="w-4 h-4 text-[#1354B6]" />
                                                                    </Button>
                                                                    <ScrollArea className="h-[200px] sm:h-[250px] md:h-[300px] lg:h-[470px] pr-4">
                                                                        <h2 className="font-[ClashDisplay-Medium] text-lg text-[#0246AC] mb-8">
                                                                            {dropdown.title}
                                                                        </h2>
                                                                        <div className="space-y-8">
                                                                            {scoreData.map(({ score, title, description }) => (
                                                                                <div key={score} className="flex items-center gap-3">
                                                                                    <p
                                                                                        className={cn(
                                                                                            "bg-[#DBE9FF] text-[#0036AB] rounded-full p-2 px-4 font-[ClashDisplay-Medium] text-xl",
                                                                                            score === question?.qualityScore && "border-4 border-[#37D3AE]"
                                                                                        )}
                                                                                    >
                                                                                        {score}
                                                                                    </p>
                                                                                    <div className="flex flex-col">
                                                                                        <p className="font-[ClashDisplay-Semibold] text-base text-[#0246AC]">
                                                                                            {title}
                                                                                        </p>
                                                                                        <p className="font-[Geologica] font-extralight text-sm text-[#0246AC]">
                                                                                            {description}
                                                                                        </p>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </ScrollArea>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="w-full max-w-5xl bg-[#DBE9FF] rounded-[33px] rounded-tl-none p-2 mt-0">
                                                        <div className="flex items-center gap-4 bg-[#F5F7FA] p-4 rounded-[25px]">
                                                            <p className="bg-[#DBE9FF] text-[#0036AB] rounded-full p-3 px-5 font-[ClashDisplay-Medium] text-2xl">
                                                                {question?.qualityScore}
                                                            </p>
                                                            <div className="flex flex-col">
                                                                {/* <p className="font-[ClashDisplay-Semibold] text-lg text-[#0246AC]">
                                                                    {currentScoreData?.title}
                                                                </p> */}
                                                                <div className="font-[Geologica] font-extralight text-base text-[#0246AC]">
                                                                    <div dangerouslySetInnerHTML={{ __html: question?.score_text || '' }} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="mt-3 w-full max-w-5xl bg-[#DBE9FF] rounded-[33px] p-2 mt-0">
                                                        {propertyData?.image_url && propertyData?.image_url.length > 0 && 
                                                            <img src={propertyData?.image_url[0]} alt="Quality Score Card" className="rounded-[33px] w-full h-full object-cover" />
                                                        }

                                                        {propertyData?.image_url && propertyData?.image_url.length === 0 && 
                                                            <img src={placeholder} alt="Quality Score Card" className="rounded-[33px] w-full h-full object-cover" />
                                                        }
                                                    </div>
                                                </div>
                                            </>}
                                                                    
                                            {question?.isViewType === "1" && <>
                                                <div className="p-2 pr-14 bg-[#B8D4FF] rounded-full flex items-center justify-center gap-2 mb-6">
                                                    <div className="bg-[#1354B6] rounded-full p-2 flex-shrink-0">
                                                        <CircleCheckBig className="text-[#37D3AE] w-6 h-6" />
                                                    </div>
                                                    <h1 className="font-[Geologica] text-lg leading-7 textColor text-center">
                                                        {imageCardText.standOutFeature}
                                                    </h1>
                                                </div>
                                            </>}
                                            
                                            {/* {notchText} */}
                                            {images.length > 0 && <>
                                                {/* Div 2 */}
                                                <div className="w-full max-w-5xl bg-[#DBE9FF] rounded-[32px] relative">
                                                    {/* Notch Text */}
                                                    {notchText && <>
                                                        <div className="absolute top-6 left-10 bg-[#DBE9FF] px-8 py-1 rounded-b-[25px] -translate-y-1/2 z-20">
                                                            <span className="font-[ClashDisplay-Medium] text-xl textColor">
                                                                {notchText}
                                                            </span>
                                                        </div>
                                                    </>}

                                                    {/* Image Container */}
                                                    {images.length > 0 && <>
                                                        <div className="relative h-[450px] w-full overflow-hidden">
                                                            <div className="h-full w-full p-2 absolute inset-0">
                                                                <img src={images[currentIndex]?.image_url} alt={`Property image ${currentIndex + 1}`}
                                                                    className={cn(
                                                                        "h-full w-full object-cover rounded-3xl transition-all",
                                                                        direction === "left" && "animate-slide-in-from-right",
                                                                        direction === "right" && "animate-slide-in-from-left",
                                                                        !direction && "translate-x-0"
                                                                    )}
                                                                />
                                                            </div>

                                                            {/* Navigation Arrows */}
                                                            {images.length > 0 && <> 
                                                                <Button variant="ghost"
                                                                    size="icon"
                                                                    onClick={handlePrevious}
                                                                    className="cursor-pointer absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/75 hover:bg-gray-300/80"
                                                                    disabled={images.length <= 1}
                                                                >
                                                                    <ArrowLeft className="w-6 h-6 text-black" />
                                                                </Button>
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={handleNext}
                                                                    className="cursor-pointer absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/75 hover:bg-gray-300/80"
                                                                    disabled={images.length <= 1}
                                                                >
                                                                    <ArrowRight className="w-6 h-6 text-black" />
                                                                </Button>
                                                            </>}

                                                            {/* Expand Icon */}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="cursor-pointer absolute bottom-0 right-0 m-4 w-12 h-12 rounded-full bg-black/50 hover:bg-gray-300/80"
                                                                onClick={() => setIsImageExpanded(true)}
                                                            >
                                                                <Expand className="w-6 h-6 text-white" />
                                                            </Button>
                                                        </div>

                                                        <div className="w-full max-w-5xl bg-[#DBE9FF] rounded-b-[33px] px-4 pb-3 mt-1 mb-2">
                                                            <div className="flex items-center gap-4">
                                                                <div className="flex flex-col">
                                                                    <p className="font-[Geologica] font-extralight text-base text-[#0246AC]">
                                                                        {typeof images[currentIndex]?.description === 'object' 
                                                                            ? `Damage: ${images[currentIndex]?.description[0].damage}, Severity: ${images[currentIndex]?.description[0].severity}`
                                                                            : images[currentIndex]?.description}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </>}
                                                </div>
                                            </>}
                                        </div>
                                    </>}
                                    
                                                                                                                
                                    {(!question?.right_panel || images.length === 0) && !isLoading && !showQualityScore && <>
                                        <div className="w-full bg-transparent max-w-3xl mx-auto h-screen px-4" id={question?.question_id}>
                                            <div>
                                                {/* Title */}
                                                <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] mb-4 text-center">
                                                    {Object.keys(question).length > 0 &&
                                                    <>{imageCardText.title}</>}  
                                                </h1>
                                                <div className="bg-[#DEDEDE] rounded-3xl overflow-hidden">
                                                    <div className="relative aspect-[16/8.5] bg-transparent pt-4 pb-2 overflow-hidden z-20">
                                                        <h1 className="mt-4 font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] mb-4 text-center">
                                                            {Object.keys(question).length > 0 &&
                                                            <>No images or data found</>}                                                            
                                                        </h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </>}


                                    {isLoading && <>
                                        <CircularLoading message="Please wait while we load the images..." />
                                    </>}
                                </>}

                                {isImageExpanded && (
                                    <div className="relative z-0 h-full overflow-hidden">
                                        <div className="w-full animate-slide-in-from-left">
                                            <div className="w-full bg-[#F4F4F4] max-w-3xl mx-auto h-screen px-4 pt-6 pb-10">
                                                <div className="bg-[#B8D4FF] rounded-3xl overflow-hidden">
                                                    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
                                                        <ImageExpandView
                                                            images={images.map(img => img.image_url)}
                                                            currentIndex={currentIndex}
                                                            onClose={() => setIsImageExpanded(false)}
                                                            onIndexChange={setCurrentIndex}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    />
                </div>
            </main>
        </Layout>
    );
}
