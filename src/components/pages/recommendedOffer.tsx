import { ResizablePanel, } from "@/components/pageComponents/offerSteps";
import Layout from "@/layouts/OfferLayout";
import textData from "@/config/text.json";
import { MainNavbar } from "./main-navbar";
import MiraQnaContainer from "./mira-qna";
import { useEffect, useMemo, useRef, useState } from "react";
import { FinalOfferStaggerCardSkeleton } from "@/components/animations/skeletonLoading/finalOfferCardSkeleton";
import { RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { getOfferPrice, getMatchData, offerPriceCalculation } from "@/services/apiService";
import { setOfferLists } from "@/slices/preferenceSlice";
import { toast } from "react-toastify";
import { FinalOfferStaggerCard } from "../pageComponents/offerSteps/property/step6/finalOfferStaggerCard";
import { selectQnaQuestions } from "@/slices/qnaSlice";
import { useCurrentPage } from "@/utils/routeUtils";

const offerLables = textData.offerProcess.labels;

export default function RecommendedOffer() {
    
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const printRef = useRef<HTMLDivElement>(null);
    const currentPage = useCurrentPage();

    // Keep only currentStep as a static value
    const currentStep = 6;
    const { propertyData } = useSelector((state: RootState) => state.propertySlice);
    const [propertyInfo, setPropertyInfo] = useState<any>(propertyData);
    const [matchInformation, setMatchInformation] = useState<any>();

    // Add state to store API response data
    const [offerInformation, setOfferInformation] = useState<any>(null);
    const [question, setQuestion] = useState<any>(null);
    const qnaQuestions = useSelector((state: RootState) => selectQnaQuestions(state, currentPage));

    // Create lastQuestion variable to avoid the "Cannot find name 'lastQuestion'" errors
    const lastQuestion = useMemo(() => {
        if (qnaQuestions?.length > 1){
            setQuestion({})
            const lastQuestion = qnaQuestions.find((question: any) => question.question_type === "preselect-text-only" && question.right_panel && question.response?.length > 0);
            if(lastQuestion){
                setQuestion(lastQuestion);
            }
        }
    }, [qnaQuestions]);
    
    useEffect(() => {
        // Simulate data loading
        const timer = setTimeout(() => {
            // You would typically fetch this data from an API
            // For now, we're just using the default values
            setIsLoading(false);
        }, 1500);
        
        return () => clearTimeout(timer);
    }, []);

    // Define fetchOfferPrice outside useEffect
    const fetchOfferPrice = async (priceCut: string) => {
        setIsLoading(true);
        try {
            const apiResponse = await offerPriceCalculation((propertyInfo as any)?.propertyId, {"price_cut": priceCut});
            // Update the offerPriceData state with the API response data
            if (apiResponse.code === 200) {
                const responseData = (apiResponse as any).response;
                setOfferInformation(responseData);
                dispatch(setOfferLists(responseData));
            }
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching market analysis:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchMatchData = async () => {
        try {
            const apiResponse = await getMatchData((propertyInfo as any)?.propertyId);
            if(apiResponse.code === 200){
                const responseData = (apiResponse as any).response;
                setMatchInformation(responseData);
            }
        } catch (error) {
            console.error("Error fetching match data:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        // Fetch market analysis data only once when component mounts
        if (propertyInfo?.propertyId && question !== null && Object.keys(question).length > 0) {
            fetchOfferPrice("");
            fetchMatchData();
        }
        if (propertyData) {
            setPropertyInfo(propertyData);
        }
    }, [propertyInfo?.propertyId, propertyData]);

   
    const handleQuestionClick = async (que: any) => {
        if(que !== undefined && que?.download !== true){
            if (typeof que === 'object') {
                setIsLoading(true);
                const priceCut = que?.priceCut?.cut !== undefined ? que.priceCut.cut : '';
                fetchOfferPrice(priceCut);
            } 
            else {
                // If que is a string or any other type, pass it directly
                fetchOfferPrice("");
            }
        }
        else if(que?.download === true) {
            setIsLoading(false);
            const printContents = printRef?.current?.innerHTML;
            if (printContents) {
                const originalContents = document.body.innerHTML;
                document.body.innerHTML = printContents;
                window.print();
                document.body.innerHTML = originalContents;
                toast.success("Successfully downloaded offer report");
                window.location.reload();
            }
        }
    }

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
                            <div className="relative z-0 overflow-y-auto h-screen no-scrollbar" id="download-offer-report" ref={printRef}>
                                {(isLoading || question === null || Object.keys(question).length === 0) && <FinalOfferStaggerCardSkeleton isLoading={isLoading} />}

                                {!isLoading && question && Object.keys(question).length > 0 && <>
                                    <FinalOfferStaggerCard
                                        propertyInfo={propertyInfo}
                                        matchInformation={matchInformation}
                                        offerLables={offerLables}
                                        offerInformation={offerInformation}
                                    />
                                </>}
                            </div>
                        }
                    />
                </div>
            </main>
        </Layout>
    );
}