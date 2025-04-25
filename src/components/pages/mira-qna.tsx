import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { agent } from "@/assets/images";
import { ChatHeader, PropertyForm } from "../pageComponents/offerSteps";
import UserQueryMessage from "../pageComponents/offerSteps/userQuery/userQueryMessage";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "@/components/ui/avatar";
import { cn, getMatchColor } from "@/lib/utils";
import { useDispatch, useSelector } from 'react-redux';
import { searchProperties, fetchUserHistory, fetchMarkedQna, fetchCurrentQuestion, getPropertyInformation, saveQnaQuestion, getCmaList, getPropertyFacts, removeComparableFromCMA, offerPriceReCalculate } from '@/services/apiService';
import { Input } from '@/components/ui/input';
import { useCurrentPage, DataBinderWithChat } from '@/utils/routeUtils';
import { useLoader } from "../../services/LoaderContext";
import textData from "@/config/text.json";
import { useNavigate } from "react-router-dom";

import { setPropertyData, setPropertyLoading, selectPropertyData, setPropertyFact } from '@/slices/propertySlice';
import { setQnaQuestions, clearQnaQuestions, setCurrentPage, selectQnaQuestions, selectAllQnaQuestions } from '../../slices/qnaSlice';
import { getCmaData, setCmaList } from '../../slices/preferenceSlice';

import { MessageCircle, RotateCw, ArrowRight, Trash2,Building2, Search, Shield, Sparkles, Check,  BarChart, LineChart, PieChart,
     Utensils, BedDouble, ShowerHead, X, Heart, School, TreePine, LayoutGrid, PanelTop, Sun, Car, DollarSign, Box, Equal, Hammer
} from "lucide-react";
import { Button } from "../ui";
import { OfferAdjustmentSlider } from "../pageComponents/offerSteps/property/common/offerAdjustmentSlider";
import { DreamHomeForm } from "@/components/pageComponents/offerSteps/property/common/uploadFile";
import { createSelector } from '@reduxjs/toolkit';
import { Textarea } from "../ui/textarea";
import { toast } from "react-toastify";
import { RootState } from "@/store";


// Utility function for debouncing
function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Define message type
interface MessageType {
    question_id: string;
    type: 'agent' | 'user';
    question_text: string;
    timestamp?: string;
    showAvatar?: boolean;
    avatarUrl?: string;
    isSelected?: boolean;
    event?: string;
}

interface Suggestion {
    ListingId: string;
    UnparsedAddress: string;
}

interface SearchResponse {
    code: number;
    response: Suggestion[];
}

const MessageContainer = ({ children, showAvatar, isSelected, variant, message, propertyInfo }: { children: React.ReactNode; showAvatar?: boolean; isSelected?: boolean; variant?: string; message?: any; propertyInfo?: any; }) => (
    <div
        className={cn(
            "rounded-xs p-3 pb-4 max-w-3xl w-full ",
            (message.event === "search-property" && propertyInfo?.propertyId)
                ? "bg-[#B8D4FF]"
                : "bg-[#ECECEC]",
            showAvatar ? "rounded-tl-none" : "ml-12"
        )}
    >
        {children}
    </div>
);

const MessageAvatar = ({ showAvatar, message, propertyInfo, currentPage }: { showAvatar?: boolean; message?: any; propertyInfo?: any; currentPage?: string; }) => (
    <>
        {showAvatar && (
            <Avatar className={cn("w-12 h-12 p-1 bg-[#ECECEC] rounded-r-none",
                ((message.event === "search-property" && propertyInfo?.propertyId) 
                || (currentPage === "property_market" && message?.response && message?.right_panel) 
                || (message?.right_panel && message?.response?.length > 0) 
                || (message?.right_panel && message?.response_options.length === 0 && message?.question_type !== "upload-only")
                || message?.question_type === "preselect-text-only")  
                && (!message?.response || !message?.response_options.some((option: any) => option.option_id === message?.response?.[0] && option.option_text.includes("Skip")))
                && "bg-[#B8D4FF] cursor-pointer")}>

                <AvatarImage src={agent} alt="Agent Mira" className="rounded-full" />
                <AvatarFallback>
                    <MessageCircle className="w-4 h-4" />
                </AvatarFallback>
            </Avatar>
        )}
    </>
);

const iconMap = {
    "Sparkles": Sparkles,
    "Building2": Building2,
    "Shield": Shield,
    "Search": Search,
    "Check": Check,
    "X": X,
    "BarChart": BarChart,
    "LineChart": LineChart,
    "PieChart": PieChart,
    "Equal": Equal,
    "Heart": Heart,
    "Utensils": Utensils,
    "TreePine": TreePine,
    "LayoutGrid": LayoutGrid,
    "School": School,
    "PanelTop": PanelTop,
    "ShowerHead": ShowerHead,   
    "BedDouble": BedDouble,
    "Sun": Sun,
    "Car": Car,
    "DollarSign": DollarSign,
    "Balance": Equal,
    "Storage": Box,
    "Hammer": Hammer
};

// Add these memoized selectors outside of the component
const selectMemoizedQnaQuestions = createSelector(
    [(state: RootState) => state, (_, currentPage: string) => currentPage],
    (state, currentPage) => selectQnaQuestions(state, currentPage)
);

const selectMemoizedPropertyData = createSelector(
    [(state: RootState) => state],
    (state) => selectPropertyData(state)
);

const selectMemoizedCmaData = createSelector(
    [(state: RootState) => state],
    (state) => getCmaData(state)
);

export default function MiraQnaContainer({ onQuestionClick }: { onQuestionClick?: (question: any) => void }) {

    const currentPage = useCurrentPage();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const allQnaQuestions = useSelector(selectAllQnaQuestions) as { [key: string]: { questions: any[] } };

    const hasFetchedData = useRef(false);
    const { showLoader, hideLoader } = useLoader();
    const isInitialized = useRef(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLastquestion, setIsLastquestion] = useState(false);
    const [loadingQuestion, setLoadingQuestion] =  useState(false);
    
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [propertyQna, setPropertyQna] = useState<MessageType[]>([]);
    const [propertyInitialPrompts, setPropertyInitialPrompts] = useState<MessageType[]>([]);
    const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
    const propertyInfo = useSelector(selectMemoizedPropertyData);
    const [address, setAddress] = useState<string>(propertyInfo?.UnparsedAddress || '');
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
    const questionFromRedux = useSelector((state: RootState) => selectMemoizedQnaQuestions(state, currentPage));

    // Comparable Property variables start
    const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
    const [isComparableSubmitted, setIsComparableSubmitted] = useState(false);
    const [reason, setReason] = useState<string>("");
    const propertyCmaListings = useSelector(selectMemoizedCmaData);
    const [properties, setProperties] = useState<any>(propertyCmaListings?.comparableProperty);
    // Comparable Property variables end

    const [chatHistory, setChatHistory] = useState<Suggestion[]>([]);
    const [description, setDescription] = useState("");

    const scrollToBottom = useCallback(() => {
        const scrollContainer = document.querySelector('[data-radix-scroll-area-viewport]');
        if (scrollContainer) {
            setTimeout(() => {
                scrollContainer.scrollTo({
                    top: scrollContainer.scrollHeight,
                    behavior: 'smooth'
                });
            }, 100);
        }
    }, []);

    const handleSingleOptionClick = useCallback((ques: any, option: any , propertyQna: any) => {
        setSelectedOptionId(option.option_id);
        saveQuestionResponse(ques, option.option_id, propertyQna);
        if (ques.question_type === "single-select-slider" && onQuestionClick && ques) {
            onQuestionClick(option.option_id);
        }
        else if ((ques.question_type === "inspection-features" || ques.question_type === "quality-score" || ques.question_type === "quality-specific-area" || ques.right_panel === "current-market-conditions") && onQuestionClick && ques) {
            const finalResponse = {
                ...ques,
                response: [option.option_id]
            }
            onQuestionClick(finalResponse);
        }

        // to update user preferences QNA
        if(ques && onQuestionClick && currentPage === "property_information" && ques.question_type === "single-select" && ques?.response?.length > 0){
            updateSliderQuestion(option);            
        }
    }, [onQuestionClick, dispatch, allQnaQuestions, currentPage]);


    const updateSliderQuestion = (option: any) => {
        // Find property_offer page data
        const propertyOfferQuestions = allQnaQuestions["property_offer"]?.questions || [];
        
        if (propertyOfferQuestions.length > 0) {
            // Find the preselect-text-only question
            const preselectQuestion = propertyOfferQuestions.find((q: any) => q.question_type === "preselect-text-only");
           
            if (preselectQuestion && option?.offer_subtext) {
                // Update the response_options first object's option_text
                const updatedQuestions = propertyOfferQuestions.map((q: any) => {
                    if (q.question_type === "preselect-text-only") {
                        return {
                            ...q,
                            response_options: q.response_options.map((opt: any, index: number) => 
                                index === 0 ? { ...opt, option_text: option?.offer_subtext } : opt
                            )
                        };
                    }
                    return q;
                });
                
                // Update Redux store with modified questions
                dispatch(setQnaQuestions({ page: "property_offer", questions: updatedQuestions }));
            }
        }
    }

    // Handle changes to propertyInfo
    useEffect(() => {
        setAddress(propertyInfo?.UnparsedAddress ?? '');
    
        setProperties(propertyCmaListings?.comparableProperty ?? []);
    }, [propertyInfo, propertyCmaListings]);

    // 1. First useEffect for initial messages - no changes needed here since it only runs once
    useEffect(() => {
        if (currentPage === textData.routes.pages.PROPERTY_INFORMATION_PAGE && !isInitialized.current) {
            const initialMessages: MessageType[] = textData.miraQna.map((message) => ({
                question_id: message.question_id,
                question_text: message.content,
                type: message.type as 'agent' | 'user',
                showAvatar: message.showAvatar,
                avatarUrl: agent,
                timestamp: new Date().toISOString(),
                isSelected: message.isSelected,
                event: message.event
            }));
            
            // If we have propertyQna or propertyId, show all messages at once
            if (propertyQna.length > 0 || propertyInfo?.propertyId) {
                setPropertyInitialPrompts(initialMessages);
            } 
            else {
                
                // Show the first message instantly
                if (initialMessages.length > 0) {
                    setPropertyInitialPrompts([initialMessages[0]]);
                }

                let index = 1;
                const intervalId = setInterval(() => {
                    if (index < initialMessages.length) {
                        setPropertyInitialPrompts(prev => [...prev, initialMessages[index]]);
                        index++;
                    } else {
                        clearInterval(intervalId);
                    }
                }, 2000); // 2 seconds interval

                isInitialized.current = true;
                return () => clearInterval(intervalId) ; // Cleanup on unmount
            }
        }
        if (currentPage) {
            dispatch(setCurrentPage(currentPage));
        }
    }, [currentPage, dispatch]);

    const saveDefaultResponse = useCallback(async (response: any, updatedQnaArr: any) => {
        try {
            // If it's the last question and already has a response, don't proceed
            if ((response.isLast === true && response.response)) {      
                return;
            }
            
            const questionId = response?.question_id;
            const defaultResponse = ["1"];
            const lastQuestion = updatedQnaArr.some((q: any) => q.isLast === true);
            if (response.isLast !== true || !lastQuestion) {
                setLoadingQuestion(true);
            }
            
            const getResponse = await saveQnaQuestion({ 
                question_id: questionId, 
                response: defaultResponse 
            }, currentPage, (propertyInfo as any)?.propertyId);

            if (getResponse.code === 200) {
                Promise.resolve().then(() => {
                    // Update both local state and Redux state with the default response
                    setPropertyQna(prevQna => {
                        // Check if question already exists before updating
                        if (!prevQna.some((question: any) => question.question_id === questionId)) {
                            return prevQna; // Don't update if question doesn't exist
                        }
                        const updatedQna = prevQna.map((question: any) => 
                            question.question_id === questionId 
                                ? { ...question, response: defaultResponse }
                                : question
                        );
                        // Update Redux state
                        dispatch(setQnaQuestions({ page: currentPage, questions: updatedQna }));
                        return updatedQna;
                    });
                });

                if((response.isLast === true || lastQuestion) || (response?.response?.length > 0 && !lastQuestion)){
                    setSelectedOptionIds([]);
                    setSelectedOptionId(null);
                    setIsSubmitted(false);
                    setLoadingQuestion(false);
                    return
                }
                
                const apiResponse = await fetchCurrentQuestion((propertyInfo as any)?.propertyId, currentPage);

                if (apiResponse.code === 200) {
                    setSelectedOptionIds([]);
                    setSelectedOptionId(null);
                    setIsSubmitted(false);
                    if ((apiResponse as any)?.response?.isLast === true) {
                        setLoadingQuestion(false);
                    }

                    const updatedResponse = Array.isArray(apiResponse.response)
                        ? apiResponse.response.map((item: any) => ({
                            ...item,
                            showAvatar: item.showAvatar ?? false,
                            response: item.question_id === questionId ? defaultResponse : item.response
                        }))
                        : [{
                            ...apiResponse.response,
                            showAvatar: (apiResponse.response as any).showAvatar ?? false,
                            response: (apiResponse.response as any).question_id === questionId ? defaultResponse : (apiResponse.response as any).response
                        }];

                    // Only add new responses that don't already exist in propertyQna
                    const newResponses = updatedResponse.filter((item: any) => 
                        !propertyQna.some((q: any) => q.question_id === item.question_id)
                    );

                    if (newResponses.length) {
                        setTimeout(() => {
                            Promise.resolve().then(() => {
                                setPropertyQna((prev) => {
                                    const updated = [...prev, ...newResponses];
                                    // Update Redux state with all questions including new ones
                                    dispatch(setQnaQuestions({ page: currentPage, questions: updated }));
                                    return updated;
                                });
                                setLoadingQuestion(false);
                            });
                        }, 2000);
                    }

                    // Modified condition for auto-saving the next question
                    const currentQuestion = (apiResponse as any)?.response;
                    if ((!currentQuestion.right_panel && currentQuestion?.response_options.length === 0)) {
                        setTimeout(async () => {
                            await saveDefaultResponse((apiResponse?.response as any), newResponses);
                        }, 1000);
                    }
                }
                else {
                    setLoadingQuestion(false);
                }
            }
            else {
                setLoadingQuestion(false);
            }
        } catch (error) {
            console.error('Error saving default response:', error);
            setLoadingQuestion(false);
        }
    }, [propertyQna, currentPage, propertyInfo, dispatch]);

    // Modify the function to batch state updates
    const processQnaData = useCallback(async () => {
        if (!propertyInfo?.propertyId || !currentPage) return;

        await dispatch(clearQnaQuestions(currentPage));
        showLoader();

        try {
            const [historyData, markedQuestions, currentQuestion] = await Promise.all([
                fetchUserHistory(propertyInfo.propertyId, currentPage),
                fetchMarkedQna(propertyInfo.propertyId, currentPage),
                fetchCurrentQuestion(propertyInfo.propertyId, currentPage)
            ]);

            if (historyData.code === 200 && markedQuestions.code === 200 && currentQuestion.code === 200) {
                // Prepare all the data first
                const chatHistory = DataBinderWithChat(historyData.response);
                let combinedData = (markedQuestions as any).response[currentPage] ?
                (markedQuestions as any).response[currentPage].map((item: any) => ({
                    ...item,
                    showAvatar: item.showAvatar ?? true
                })) : [];       

                const questionExists = combinedData.some((question: any) => 
                    question.question_id === (currentQuestion.response as any).question_id
                );
                
                if (!questionExists) {
                    combinedData.push(currentQuestion.response);
                }
                const dataArray = Array.isArray(combinedData) ? combinedData : combinedData ? [combinedData] : [];

                // Batch all state updates using Promise.resolve().then()
                Promise.resolve().then(() => {
                    setChatHistory(chatHistory);
                    
                    setSelectedOptionIds([]);
                    setSelectedOptionId(null);
                    setIsSubmitted(false);

                    if (dataArray.length) {
                        // Update propertyQna and Redux state together
                        setPropertyQna(prev => {
                            const uniqueData = dataArray.filter(
                                (item: any) => !prev.some((q: any) => q.question_id === item.question_id)
                            );
                            const updated = [...prev, ...uniqueData];
                            
                            // Dispatch Redux action in the next tick
                            Promise.resolve().then(() => {
                            dispatch(setQnaQuestions({ page: currentPage, questions: updated }));
                            });
                            
                            return updated;
                        });
                    }

                    const hasLastQuestion = dataArray.some((q: any) => q.isLast === true); 
                    if (hasLastQuestion) {
                        setLoadingQuestion(false);
                        return;
                    } 

                    // Handle auto-save for questions with no response options
                    const latestQuestion = (currentQuestion.response as any);
                    if ((!latestQuestion.right_panel && latestQuestion?.response_options.length === 0)) {
                        setTimeout(() => {
                            saveDefaultResponse((currentQuestion?.response as any), dataArray);
                        }, 100);
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching QNA data:', error);
        } finally {
            hideLoader();
        }
    }, [propertyInfo?.propertyId, currentPage, dispatch, showLoader, hideLoader, saveDefaultResponse]);

    // Get CMA data
    const getCma = useCallback(async (mlsid: string) => {
        if(propertyCmaListings?.comparableProperty?.length > 0){
            return;
        }
        
        try {
            const cmaResponse = await getCmaList(mlsid);
            if (cmaResponse.code === 200) {
                dispatch(setCmaList(cmaResponse.response as any));
            } 
        } 
        catch (error) {}
    }, [dispatch]);

    useEffect(() => {
        if (propertyInfo?.propertyId && !hasFetchedData.current) {
            if (currentPage && questionFromRedux && questionFromRedux.length > 0) {
                Promise.resolve().then(() => {
                    setPropertyQna(questionFromRedux);
                });
            } 
            else {
                processQnaData();
            }
            
            getCma(propertyInfo?.propertyId);
            hasFetchedData.current = true;
        }
    }, [propertyInfo, processQnaData, questionFromRedux, currentPage, getCma]);

    useEffect(() => {
        if (loadingQuestion || propertyQna.length > 0) {
            const lastQuestion = propertyQna.some((q: any) => q.isLast === true);
            if (!lastQuestion && selectedOptionIds.length === 0) {
                scrollToBottom();
            }
        }
    }, [loadingQuestion, scrollToBottom, propertyQna]);

    useEffect(() => {
        if (propertyQna.length > 0) {
            const hasLastQuestion = propertyQna.some((q: any) => q.isLast === true);
            setIsLastquestion(hasLastQuestion);
            
            // If we've reached the last question, stop the loading state
            if (hasLastQuestion) {
                setLoadingQuestion(false);
            }
        }

        if (questionFromRedux) {
            Promise.resolve().then(() => {
                setPropertyQna(questionFromRedux);
            });
        }
    }, [propertyQna, questionFromRedux]);

    const debouncedSearch = useMemo(() => {
        return debounce(async (term: string) => {
            if (term.length === 0) {
                setSuggestions([]);
                setShowSuggestions(false);
                setIsLoading(false);
                return;
            }

            try {
                const response = await searchProperties({ "user_str": term }) as SearchResponse;
                if (response.code === 200 && Array.isArray(response.response)) {
                    setSuggestions(response.response);
                    setShowSuggestions(true);
                } else {
                    setSuggestions([]);
                }
            } catch (error) {
                setSuggestions([]);
                console.error("Error fetching search results:", error);
            }
            setIsLoading(false);
        }, 500);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAddress(value);
        setIsLoading(true);
        debouncedSearch(value);
    };

    const handleSuggestionSelect = async (suggestion: Suggestion) => {
        showLoader();
        setAddress(suggestion.UnparsedAddress);
        getCma(suggestion.ListingId);

        try {
            const apiResponse = await getPropertyInformation(suggestion.ListingId);
            if (apiResponse.code === 200) {
                const finalResponse = (apiResponse as any).response[suggestion.ListingId];
                const updatedResponse = {
                    ...finalResponse,
                    propertyId: suggestion.ListingId, // Set propertyId to suggestion.ListingId
                };
                dispatch(setPropertyData(updatedResponse));
            }
        }
        catch (error) {
            console.error('Error fetching map data:', error);
        }

        try {
            const apiResponse = await getPropertyFacts(suggestion.ListingId);
            if (apiResponse.code === 200) {
                dispatch(setPropertyFact((apiResponse.response as any)?.fact));
            }
        }
        catch (error) {
            console.error('Error fetching map data:', error);
        }        

        setSuggestions([]);
        setShowSuggestions(false);
        setIsSubmitted(true);

    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && address.trim()) {
            setIsSubmitted(true);
            setShowSuggestions(false);
            dispatch(setPropertyLoading(true));
        }
    };

    const renderSuggestion = (suggestion: Suggestion, input: string) => {
        const addressText = suggestion.UnparsedAddress;
        const index = addressText.toLowerCase().indexOf(input.toLowerCase());

        if (index === -1) return addressText;

        return (
            <>
                {addressText.slice(0, index)}
                <strong>{addressText.slice(index, index + input.length)}</strong>
                {addressText.slice(index + input.length)}
            </>
        );
    };

    // ================================================================
    // ================================================================
    const saveQuestionResponse = async (qList: any, optionId: any, propertyQna: any) => {
        try {
            const checkedOptions: string[] = Array.isArray(optionId) ? optionId.map(id => id.toString()) : [optionId.toString()];

            const lastQuestion = propertyQna.some((q: any) => q.isLast === true);

            if (qList.isLast !== true && !lastQuestion && !qList?.response) {
                setLoadingQuestion(true);
            }
            
            const getResponse = await saveQnaQuestion({ 
                question_id: qList.question_id,
                response: checkedOptions 
            }, currentPage, (propertyInfo as any)?.propertyId);

            if (getResponse.code === 200) {
                // If skip then clear all data and move to next question
                if(qList?.logic?.toLowerCase() === "skip" && qList?.response?.length > 0){
                    showLoader();
                    processQnaData();
                    return
                }
                
                Promise.resolve().then(() => {
                    // Update both local state and Redux state with the new response
                    setPropertyQna(prevQna => {
                        // Check if question already exists before updating
                        if (!prevQna.some((question: any) => question.question_id === qList.question_id)) {
                            return prevQna; // Don't update if question doesn't exist
                        }
                        
                        const updatedQna = prevQna.map((question: any) => 
                            question.question_id === qList.question_id 
                                ? { ...question, response: checkedOptions }
                                : question
                        );
                        // Update Redux state
                        dispatch(setQnaQuestions({ page: currentPage, questions: updatedQna }));
                        return updatedQna;
                    });
                });

                
                if((qList.isLast === true || lastQuestion) || (qList?.response?.length > 0 && lastQuestion)){
                    setSelectedOptionIds([]);
                    setSelectedOptionId(null);
                    setIsSubmitted(false);
                    setLoadingQuestion(false);
                    return
                }

                const apiResponse = await fetchCurrentQuestion((propertyInfo as any)?.propertyId, currentPage);

                if (apiResponse.code === 200) {
                    setSelectedOptionIds([]);
                    setSelectedOptionId(null);
                    setIsSubmitted(false);
                    if ((apiResponse as any)?.response?.isLast === true) {
                        setLoadingQuestion(false);
                    }

                    const updatedResponse = Array.isArray(apiResponse.response)
                        ? apiResponse.response.map((item: any) => ({
                            ...item,
                            showAvatar: item.showAvatar ?? false,
                            response: item.question_id === qList.question_id ? checkedOptions : item.response
                        }))
                        : [{
                            ...apiResponse.response,
                            showAvatar: (apiResponse.response as any).showAvatar ?? false,
                            response: (apiResponse.response as any).question_id === qList.question_id ? checkedOptions : (apiResponse.response as any).response
                        }];

                    // Only add new responses that don't already exist in propertyQna
                    const newResponses = updatedResponse.filter(
                        (item: any) => !propertyQna.some((q: any) => q.question_id === item.question_id)
                    );

                    if (newResponses.length) {
                        Promise.resolve().then(() => {
                            setPropertyQna((prev) => {
                                const updated = [...prev, ...newResponses];
                                // Update Redux state with all questions including new ones
                                dispatch(setQnaQuestions({ page: currentPage, questions: updated }));
                                if(!isLastquestion){
                                    scrollToBottom();
                                }
                                setLoadingQuestion(false);
                                return updated;
                            });
                        });
                        
                    }

                    // Modified condition for auto-saving the next question
                    if ((apiResponse.response as any).response_options.length === 0 
                        && (apiResponse.response as any).isFirst === false
                        && (apiResponse.response as any).question_type !== "upload-only"
                        && (apiResponse.response as any).question_type !== "input-text-only"
                        && !(apiResponse.response as any).right_panel
                    ) {
                        setTimeout(async () => {
                            await saveQuestionResponse((apiResponse.response as any), '1', propertyQna);
                            if(!isLastquestion){
                                scrollToBottom();
                            }
                        }, 1000);
                    }
                }
                else {
                    setLoadingQuestion(false);
                }
            }
        } catch (error) {
            console.error('Error fetching QNA data:', error);
            setLoadingQuestion(false);
        } finally {
            hideLoader();
        }
    };

    const onNextStep = () => {
        if (currentPage === textData.routes.pages.PROPERTY_INFORMATION_PAGE) {
            dispatch(setCurrentPage(textData.routes.pages.PROPERTY_COMPARABLE_PAGE));
            navigate('/comparable/' + propertyInfo?.propertyId);
        }
        else if (currentPage === textData.routes.pages.PROPERTY_COMPARABLE_PAGE) {
            dispatch(setCurrentPage(textData.routes.pages.PROPERTY_MARKET_PAGE));
            navigate('/market/' + propertyInfo?.propertyId);
        }
        else if (currentPage === textData.routes.pages.PROPERTY_MARKET_PAGE) {
            dispatch(setCurrentPage(textData.routes.pages.PROPERTY_CONDITION_INPUT));
            navigate('/conditions/' + propertyInfo?.propertyId);
        }
        else if (currentPage === textData.routes.pages.PROPERTY_CONDITION_INPUT) {
            dispatch(setCurrentPage(textData.routes.pages.PERSONALISED_PAGE));
            navigate('/preference/' + propertyInfo?.propertyId);
        }
        else if (currentPage === textData.routes.pages.PERSONALISED_PAGE) {
            dispatch(setCurrentPage(textData.routes.pages.PROPERTY_OFFER_PAGE));
            navigate('/offer/' + propertyInfo?.propertyId);
        }
    };

    const submitMultipleQuestion = (ques: any, propertyQna: any) => {
        setIsSubmitted(true);
        saveQuestionResponse(ques, selectedOptionIds, propertyQna);
    };

    const handleMultipleOptionClick = (option: any, ques: any) => {
        if (isSubmitted) return; // Disable interaction after submission
        setSelectedOptionIds([]);
        // Create a new array based on whether the option is already selected
        const newResponse = ques?.response?.includes(option.option_id)
            ? ques.response.filter((id: any) => id !== option.option_id)
            : [...(ques.response || []), option.option_id];

        // Update the local state
        setSelectedOptionIds(newResponse);
        
        // Update the propertyQna state with the modified question
        setPropertyQna(prevQna => {
            const updatedQna = prevQna.map(q => 
                q.question_id === ques.question_id ? {...q, response: newResponse} : q
            );
            
            // Dispatch to Redux store
            dispatch(setQnaQuestions({ page: currentPage, questions: updatedQna }));
            
            return updatedQna;
        });
        
    };

    const handlePropertyFormSubmit = (question: any, propertyQna: any) => {
        saveQuestionResponse(question, "1", propertyQna);
    };

    const rightPanelClicked = (question_id: string, question: any, propertyQna: any) => {

        const findIsLast = propertyQna.some((q: any) => q.isLast === true);
        if((question?.response_options?.length === 0 || question?.question_type === "preselect-text-only") && question?.right_panel && !findIsLast){
            saveQuestionResponse(question, '0', propertyQna);
        }

        if(question_id === "initial_3"){ 
            if (onQuestionClick && question_id) {
                onQuestionClick(question_id);
            }
        }
        else {
            // Find the full question object to pass to the parent
            const question = propertyQna.find((q: any) => q.question_id === question_id);
            // Call the parent's callback function if it exists
            if (onQuestionClick && question) {
                onQuestionClick(question);
            }
        }
    };

    // ===========================CMA Comparables Start===============================
    // ===============================================================================    
    const removeComparable = async (ques: any) => {
        if (properties.length > 3 && !isComparableSubmitted) {
            setIsComparableSubmitted(true);
            showLoader();
            try {
                const apiResponse = await removeComparableFromCMA((propertyInfo as any)?.propertyId, {"listing_id": selectedPropertyId, reason: reason});
                if (apiResponse.code === 200) {
                    setIsComparableSubmitted(false);
                    setSelectedPropertyId(null);
                    setReason("");

                    const latestCmaResponse = {...propertyCmaListings};
                    if (latestCmaResponse?.comparableProperty) {
                        // Filter out the selected property from the comparableProperty array
                        const updatedComparableProperties = latestCmaResponse.comparableProperty.filter((item: any) => item.ListingId !== selectedPropertyId);
                        
                        // Update the CMA data with the filtered list
                        const updatedCmaData = {
                            ...latestCmaResponse,
                            comparableProperty: updatedComparableProperties
                        };
                        // Dispatch the updated data to Redux
                        dispatch(setCmaList(updatedCmaData));
                        setProperties(updatedComparableProperties);
                    }

                    toast.success("Comparable removed successfully");
                    saveQuestionResponse(ques, '0', propertyQna);

                    // call price re calculate api
                    await offerPriceReCalculate((propertyInfo as any)?.propertyId, {});
                }
                hideLoader();
            } 
            catch (error) {
                hideLoader();
            }
        }
        else {
            saveQuestionResponse(ques, '0', propertyQna);
        }
    };

    function getIntegerMatchScore(score: any): number {
        // First ensure it's a valid number
        const numScore = parseFloat(score);
        
        // Check if parseFloat resulted in a valid number
        if (isNaN(numScore)) {
          return 0; // Return a default value if the input can't be converted to a number
        }
        
        // Round to nearest integer
        return Math.round(numScore);
    }

    // ===========================CMA Comparables End=================================
    // ===============================================================================
    
    // Fetch data from slider and share with parent QNA
    const fetchSliderCall = (ques: any, price: any, propertyQna: any) => {
        if(!ques?.response){
            saveQuestionResponse(ques, ques?.response_options?.[0]?.option_id || '0', propertyQna);
        }

        if (typeof price === "object" && price !== null && price?.price_cut !== "") {
            const finalOutput = {
                ...ques,
                priceCut: price
            }
    
            if (onQuestionClick && ques) {
                onQuestionClick(finalOutput);
            }
        }
    }

    const handleDescription = (ques: any, description: any, propertyQna: any) => {
        if(description.trim() === ""){
            toast.error("Please provide a description");
        }
        else{
            saveQuestionResponse(ques, description, propertyQna);
            toast.success("Data saved successfully.");
        }
    }

    const onImageUpload = (question: any, propertyQna: any) => {
        saveQuestionResponse(question, '0', propertyQna);

        setTimeout(() => {
            if (onQuestionClick && question) {
                onQuestionClick(question);
            }
        }, 1000);
    }

    const showRightPanelIcon = (question: any) => {
        if(question?.response?.length > 0){
            const selectedOptionId = question?.response[0];
            let selectedOption = question?.response_options.find((option: any) => option.option_id === selectedOptionId && option.option_text.includes("Skip"));
            if(selectedOption){
                return false;
            }
        }
        
        if(question?.question_type === "preselect-text-only"){
           return true;
        }
        else if((currentPage === "property_market" && question?.response && question?.right_panel)
            || (question?.right_panel && question?.response?.length > 0)
            || (question?.right_panel && question?.response_options.length === 0 && question?.question_type !== "upload-only")
        ){
            return true;
        }
    }

    const handleReportDownload = (ques: any) => {
        if(ques?.question_type === "report_download_prompt" && onQuestionClick){
            const finalJson = {
                ...ques,
                download: true
            }
            onQuestionClick(finalJson);
        }
    }

    return (
        <div className="flex flex-col h-[100%] w-full mx-auto bg-white relative">
            {/* Chat Header */}
            <ChatHeader />

            <ScrollArea className="flex-1 p-4 px-10 overflow-auto">
                <div className="space-y-4 mb-15" ref={scrollContainerRef}>                    
                    {/* Property Initial Prompts */}
                    {propertyInitialPrompts.map((message: any) => (
                        <>
                            <div key={message.question_id}
                                className={`flex items-start gap-0 relative pr-7 w-full max-w-3xl mx-auto ${message?.event === "search-property" ? "cursor-pointer" : "cursor-default" }`} 
                                onClick={() => {
                                    if (message?.event === "search-property") {
                                      rightPanelClicked(message?.question_id, message, propertyQna);
                                    }
                                }}
                            >
                                <MessageAvatar showAvatar={true} message={message} propertyInfo={propertyInfo} currentPage={currentPage} />

                                <div className="flex items-start relative w-full">
                                    <MessageContainer showAvatar={true} isSelected={message?.isSelected} message={message} propertyInfo={propertyInfo} >
                                        <div className="agentChat pb-1 w-full pr-3">{message.question_text}</div>

                                        {message?.event === "search-property" && propertyInfo?.propertyId && <>
                                            <div className="group cursor-pointer absolute -right-6 bg-[#B8D4FF] rounded-r-full pr-2 h-14 flex items-center justify-center" 
                                                style={{ top: `${(0)}px` }}>
                                                <div className="bg-[#1E4DB7] text-[#F6F3EE] p-2 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                                                    <ArrowRight strokeWidth={1.5} className="h-5 w-5" />
                                                </div>
                                            </div>  
                                        </>}

                                        {message?.event === "search-property" && <>
                                            <>
                                                {isSubmitted || propertyInfo?.propertyId ? (
                                                    <div className="flex items-center gap-0">
                                                        <div className="bg-white/80 rounded-full p-3 px-4 max-w-[70%] text-[#272727] w-full">
                                                            {(propertyInfo as any)?.propertyData?.address || address}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="bg-[#F7F7F7] rounded-xl">
                                                        <Input
                                                            value={address}
                                                            onChange={handleInputChange}
                                                            placeholder="Search for a property..."
                                                            className="bg-white rounded-xl"
                                                            onKeyDown={handleKeyDown}
                                                            disabled={!!propertyInfo?.propertyId}
                                                        />
                                                        {isLoading && (
                                                            <div className="overflow-hidden w-full">
                                                                <button className="py-2 px-4 text-sm text-gray-500 animate-pulse">
                                                                    Loading data<span className="dots">...</span>
                                                                </button>
                                                            </div>
                                                        )}

                                                        {showSuggestions && address && !propertyInfo?.propertyId && (
                                                            <div className="overflow-auto max-h-[300px] w-full">
                                                                {suggestions.length > 0 && !isLoading && <>
                                                                    {suggestions.map((suggestion) => (
                                                                        <button
                                                                            key={suggestion.ListingId}
                                                                            className="cursor-pointer w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                                                                            onClick={() => handleSuggestionSelect(suggestion)}
                                                                        >
                                                                            {renderSuggestion(suggestion, address)}
                                                                        </button>
                                                                    ))}
                                                                </>}
                                                                {suggestions.length === 0 && !isLoading && <>
                                                                    <button className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm">
                                                                        No address found
                                                                    </button>
                                                                </>}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </>
                                        </>}
                                    </MessageContainer>


                                    {message?.isSelected && (
                                        <div className="absolute top-0 -right-7 bg-[#B8D4FF] rounded-r-full p-1.5 flex items-center justify-center cursor-pointer">
                                            <div className="bg-[#1354B6] p-2 rounded-full">
                                                <RotateCw className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    ))}

                    {/* ================================================================ */}
                    {/* ================================================================ */}
                    {/* QNA data from API */}
                    {propertyQna.map((ques: any) => (
                        <>
                            <div key={ques.question_id} className={`flex items-start gap-0 relative pr-7 w-full max-w-3xl mx-auto ${ques.right_panel && showRightPanelIcon(ques) && ques?.response_options?.length === 0 ? "cursor-pointer" : "cursor-default" }`} 
                                onClick={() => {
                                    if (ques.right_panel && showRightPanelIcon(ques) && ques?.response_options?.length === 0) {
                                      rightPanelClicked(ques.question_id, ques, propertyQna);
                                    }
                                }}
                            >
                                <div className="flex items-start relative w-full">
                                    <MessageAvatar showAvatar={true} message={ques} propertyInfo={propertyInfo} currentPage={currentPage} />

                                    <div className={cn("rounded-xs p-3 pb-4 max-w-3xl w-full bg-[#ECECEC]", ques.right_panel && showRightPanelIcon(ques) && "bg-[#B8D4FF]")}>
                                        <div className="space-y-4">
                                            <div className="agentChat pb-1 w-full pr-3">{ques.question_text}</div> 

                                            {ques.right_panel && showRightPanelIcon(ques) && <>
                                                <div className="group cursor-pointer absolute -right-6 bg-[#B8D4FF] rounded-r-full pr-2 h-14 flex items-center justify-center" style={{ top: `${(0)}px` }}
                                                    onClick={() => {
                                                        if (ques.right_panel && showRightPanelIcon(ques)) {
                                                          rightPanelClicked(ques.question_id, ques, propertyQna);
                                                        }
                                                    }}
                                                >
                                                    <div className="bg-[#1E4DB7] text-[#F6F3EE] p-2 rounded-full flex items-center justify-center transition-transform group-hover:translate-x-0.5">
                                                        <ArrowRight strokeWidth={1.5} className="h-5 w-5" />
                                                    </div>
                                                </div>     
                                            </>}
                                            
                                            {(ques?.question_type === "single-select" || ques?.question_type === "standout-features" || ques?.question_type === "quality-score" || ques?.question_type === "quality-specific-area" || ques?.question_type === "inspection-features") && <>
                                                <div className={cn("space-y-2 flex flex-wrap gap-2 justify-center")}>
                                                    {ques?.response_options.map((option: any) => {
                                                        const Icon = iconMap[option?.icon as keyof typeof iconMap] || Sparkles;
                                                        const isSelected = (selectedOptionId === option.id || ques?.response?.includes(option.option_id));

                                                        return (
                                                            <>
                                                                {/* {isSelected && currentPage === "property_market" && <>
                                                                    <div className="absolute -right-6 bg-[#B8D4FF] rounded-r-full pr-2 h-14 flex items-center justify-center" style={{ top: `${(81 + (index * 95))}px` }} >
                                                                        <ChevronRight className="w-6 h-6 text-[#0C0C0C]" />
                                                                    </div>
                                                                </>} */}

                                                                <div key={option.option_id}
                                                                    className={cn("flex items-center rounded-full justify-start gap-3 text-left p-2 cursor-pointer w-full",
                                                                        isSelected
                                                                            ? "bg-[#37D3AE]" // Green for selected data-switch
                                                                            : "bg-[#1354B6] hover:bg-[#5D9DFE]", // Dark blue for unselected data-switch
                                                                        isSelected && "bg-[#FFFFFF] border-2 border-green-500", // White with green border for selected (non-data-switch)
                                                                        // ques?.response?.length > 0 && "opacity-50 cursor-not-allowed",
                                                                        loadingQuestion && "opacity-50 cursor-not-allowed"
                                                                    )}
                                                                    onClick={() => handleSingleOptionClick(ques, option, propertyQna)}
                                                                >
                                                                    {Icon && (
                                                                        <div className={cn(
                                                                            "rounded-full p-4",
                                                                            isSelected
                                                                                ? "bg-[#B8D4FF]" // Light blue for selected data-switch icon background
                                                                                : "bg-[#96C0FF]" // Lighter blue for selected (non-data-switch) icon background
                                                                        )}>
                                                                            <Icon className="w-6 h-6 text-[#1354B6]" />
                                                                        </div>
                                                                    )}

                                                                    <span className={cn("font-[Geologica] font-light text-wrap text-base truncate",
                                                                        isSelected ? "text-[#1354B6]" // Dark blue text for all selected states
                                                                            : "text-[#fff]" // White text for unselected states (both side-by-side and default)
                                                                    )} >
                                                                        {option.option_text}
                                                                    </span>

                                                                </div>
                                                            </>
                                                        );
                                                    })}
                                                </div>
                                            </>}

                                            {(ques?.question_type === "multiple-select" || ques?.question_type === "multiple-choice") && <>
                                                <div className="space-y-3 w-full max-w-md mx-auto">
                                                    <div className="grid grid-cols-2 gap-3">
                                                        {ques?.response_options.map((option: any) => {
                                                            const isSelected = (ques?.response?.includes(option.option_id));
                                                            return (
                                                                <>
                                                                    <button key={option.option_id} type="button" onClick={() => handleMultipleOptionClick(option, ques)}
                                                                        className={`flex items-center gap-2 py-2 px-4 rounded-full transition-colors ${(isSubmitted)
                                                                                ? isSelected
                                                                                    ? "bg-white text-[#1E293B]"
                                                                                    : "bg-white/50 text-[#1E293B]"
                                                                                : isSelected
                                                                                    ? "bg-[#1354B6] text-white"
                                                                                    : "bg-[#B8D4FF] text-[#1E293B]"
                                                                            } ${(isSubmitted) ? "cursor-not-allowed" : "cursor-pointer"}`}
                                                                        disabled={isSubmitted || loadingQuestion} // Disable button after submission
                                                                    >
                                                                        {/* Radio circle */}
                                                                        <div className={`w-5 h-5 rounded-full flex items-center justify-center ${(isSubmitted)
                                                                            ? isSelected
                                                                                ? "bg-[#1354B6]"
                                                                                : "bg-white border border-gray-300"
                                                                            : isSelected
                                                                                ? "bg-white"
                                                                                : "bg-white border border-gray-300"
                                                                        }`} >
                                                                            {/* Inside radio dot */}
                                                                            {isSelected && (<div className={`w-2.5 h-2.5 rounded-full ${(isSubmitted) ? "bg-[#37D3AE]" : "bg-[#37D3AE]"}`} />)}
                                                                        </div>
                                                                        <span className="font-medium text-sm">{option.option_text}</span>
                                                                    </button>
                                                                </>
                                                            );
                                                        })}
                                                    </div>

                                                    {/* Skip and Submit Buttons */}
                                                    <div className="flex justify-center mt-6">
                                                        <div className="flex gap-4 w-full max-w-md">
                                                            {!ques?.response && <>
                                                                <Button variant="outline" onClick={() => !ques?.response && selectedOptionIds.length === 0 && !isSubmitted && !loadingQuestion && saveQuestionResponse(ques, '0', propertyQna)} className="flex-1 cursor-pointer rounded-full py-2 bg-[#1354B6] text-white border-none hover:bg-[#7A99C6] shadow-sm" disabled={selectedOptionIds.length > 0 || isSubmitted || loadingQuestion || ques?.response?.length > 0}>
                                                                    Skip
                                                                </Button>
                                                            </>}
                                                            <Button variant="default"
                                                                onClick={() => selectedOptionIds.length > 0 && !isSubmitted && !loadingQuestion && submitMultipleQuestion(ques, propertyQna)}
                                                                disabled={selectedOptionIds.length === 0 || isSubmitted || loadingQuestion} // Disable if no selection or already submitted
                                                                className="flex-1 cursor-pointer rounded-full py-2 bg-[#1354B6] text-white hover:bg-blue-700 shadow-sm disabled:opacity-70"
                                                            >
                                                                Submit
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </>}

                                            {ques?.question_type === "comparable-input" && properties && Object.keys(properties).length > 0 && <>
                                                <div className="property-list flex flex-col gap-3">
                                                    {properties.map((property: any) => (
                                                        <div key={property.ListingId} className={cn("flex flex-col gap-2", isComparableSubmitted && (selectedPropertyId === property.ListingId ? "opacity-100" : "opacity-50"))}>
                                                            <div className="property-item flex items-center justify-between">
                                                                <div className={cn("flex items-center w-[80%] bg-[#1354B6] p-1 rounded-3xl",
                                                                    selectedPropertyId === property.ListingId && "border-3 border-red-500 opacity-50",
                                                                    (isComparableSubmitted || properties.length <= 3) && "w-full")}>
                                                                    
                                                                    {property?.images.length > 0 && <>
                                                                        <img src={property?.images[0]} alt={`${property.UnparsedAddress} preview`} className="w-26 h-16 object-cover rounded-3xl mr-2"/>
                                                                    </>}
                                                                    
                                                                    {property?.images.length === 0 && <>
                                                                        <div className="w-26 h-16 object-cover rounded-3xl bg-[#DEDEDE] rounded-3xl overflow-hidden mr-2">
                                                                            <div className="flex items-center justify-center h-full w-full relative aspect-[16/8.5] bg-transparent pt-4 pb-2 overflow-hidden z-20">
                                                                                <p className="font-[ClashDisplay-Medium] text-xs text-[#1354B6] text-center">
                                                                                    image not found
                                                                                </p>
                                                                            </div>
                                                                        </div>
                                                                    </>}

                                                                    <div className="flex-1 flex justify-center items-center">
                                                                        <span className="text-white font-[Geologica] font-normal text-sm text-left">
                                                                            {property.UnparsedAddress}
                                                                        </span>
                                                                    </div>

                                                                    {property.FinalMatchScore !== undefined && (
                                                                        <div className={cn("rounded-full p-2 mr-2", getMatchColor(getIntegerMatchScore(property.FinalMatchScore)))} >
                                                                            <div className="text-sm font-[ClashDisplay-Regular] text-center font-bold">
                                                                                {getIntegerMatchScore(property.FinalMatchScore)}%
                                                                            </div>
                                                                            <div className="text-xs">Match</div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            
                                                                {!isComparableSubmitted && properties.length > 3 && (
                                                                    <div className="cursor-pointer flex justify-end pr-3 rounded-r-lg h-full items-center" onClick={() => setSelectedPropertyId(property.ListingId)}>
                                                                        <Trash2 className="w-6 h-6 text-red-500" />
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {selectedPropertyId === property.ListingId && (
                                                                <div className="px-1">
                                                                    <Textarea  placeholder="Type your reason why..." value={reason}  onChange={(e) => !isComparableSubmitted && setReason(e.target.value)}  disabled={isComparableSubmitted} className="w-full p-2 border border-gray-300 bg-white rounded-xl placeholder:font-[Geologica] placeholder:text-sm placeholder:px-1" />
                                                                </div>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                <div className={cn("flex justify-between gap-2", !ques.response ? "justify-between" : "justify-end")}>
                                                    {!ques.response && <>
                                                        <Button className="cursor-pointer w-36 rounded-full bg-[#1354B6] hover:bg-blue-700 py-5" onClick={()=> saveQuestionResponse(ques, '0', propertyQna)} disabled={isComparableSubmitted || loadingQuestion} >
                                                            <span className="text-white font-[ClashDisplay-Medium] text-lg leading-[18px]">
                                                                Skip
                                                            </span>
                                                        </Button>
                                                    </>}

                                                    {Object.keys(properties).length > 3  && <>
                                                        <Button className="cursor-pointer w-36 rounded-full bg-[#1354B6] hover:bg-blue-700 py-5" onClick={()=> removeComparable(ques)} disabled={isComparableSubmitted || loadingQuestion} >
                                                            <span className="text-white font-[ClashDisplay-Medium] text-lg leading-[18px]">
                                                                Submit
                                                            </span>
                                                        </Button>
                                                    </>}
                                                </div>
                                            </>}

                                            {ques?.question_type === "preselect-text-only" && <>                                            
                                                {ques?.response_options.map((option: any) => {
                                                    const Icon = iconMap[option?.icon as keyof typeof iconMap] || Sparkles;
                                                    return (
                                                        <>
                                                            <div key={option.option_id} className="flex items-center rounded-full justify-start gap-3 text-left p-2 w-full bg-[#FFFFFF] border-2 border-green-500 cursor-not-allowed"
                                                                >
                                                                {Icon && (
                                                                    <div className="rounded-full p-4 bg-[#B8D4FF]">
                                                                        <Icon className="w-6 h-6 text-[#1354B6]" />
                                                                    </div>
                                                                )}

                                                                <span className="text-[#1354B6] font-[Geologica] font-light text-wrap text-base truncate">
                                                                    {option.option_text}
                                                                </span>
                                                            </div>
                                                        </>
                                                    );
                                                })}
                                            </>}                                            
                                                                                    
                                            {ques?.question_type === "single-select-slider" && <> 
                                                <OfferAdjustmentSlider onSubmit={(priceCut) => fetchSliderCall(ques, priceCut, propertyQna)} />
                                            </>}

                                            {ques?.question_type === "edit-text" && (
                                                <PropertyForm onSubmit={() => handlePropertyFormSubmit(ques, propertyQna)}  />
                                            )}

                                            {ques?.question_type === "report_download_prompt" && (
                                                <>
                                                    <div className="flex justify-center gap-2">
                                                        {/* <Button variant="outline" disabled={true} className="cursor-pointer rounded-full py-5 bg-[#0036AB] text-white border-none hover:bg-[#7A99C6] shadow-sm px-10 items-center">
                                                            No, Thank you!
                                                        </Button> */}
                                                        <Button variant="outline" disabled={loadingQuestion} onClick={() => handleReportDownload(ques)} className="cursor-pointer rounded-full py-5 bg-[#0036AB] text-white border-none hover:bg-[#7A99C6] shadow-sm px-10 items-center">
                                                            Download Report
                                                        </Button>
                                                    </div>
                                                </>
                                            )}
                                            
                                            {ques?.question_type === "input-text-only" && <>
                                                <textarea
                                                    value={description || ques?.response?.[0]}
                                                    onChange={(e) => setDescription(e.target.value)}
                                                    placeholder= {
                                                        currentPage === "property_condition" 
                                                            ? ques.placeholder || "Type your response here..." // Use placeholder from question if available
                                                            : "Describe your dream home here…"
                                                    }
                                                    className="w-full h-24 p-2 rounded-[12px] bg-white text-[#272727] placeholder:text-sm font-[Geologica] font-normal placeholder-[#272727] focus:outline-none focus:ring-2 focus:ring-[#0036AB]"
                                                    disabled={loadingQuestion}
                                                />

                                                <div className="flex space-x-4">
                                                    {!ques?.response && <>
                                                        <button type="submit" 
                                                            className={`cursor-pointer flex-1 py-2 bg-[#0036AB] text-white rounded-full text-sm font-[ClashDisplay-Medium] ${
                                                                loadingQuestion ? "cursor-not-allowed opacity-50" : "hover:bg-[#1354B6]"
                                                            }`}
                                                            disabled={loadingQuestion} onClick={() => saveQuestionResponse(ques, '', propertyQna)} >
                                                            Skip
                                                        </button>
                                                    </>}

                                                    <button type="submit"
                                                        className={`cursor-pointer flex-1 py-2 bg-[#0036AB] text-white rounded-full text-sm font-[ClashDisplay-Medium] ${
                                                            loadingQuestion ? "cursor-not-allowed opacity-50" : "hover:bg-[#1354B6]"
                                                        }`}
                                                        disabled={loadingQuestion} onClick={() => handleDescription(ques, description, propertyQna)}>
                                                        Submit
                                                    </button>
                                                </div>
                                            </>}

                                            {(ques?.question_type === "upload-only") && <>
                                                <DreamHomeForm key={ques.question_id} onSubmit={() => onImageUpload(ques, propertyQna)} onSkip={() => saveQuestionResponse(ques, '0' , propertyQna)} question={ques} />
                                            </>}

                                            {/* Last question move to next step */}
                                            {ques?.isLast && !currentPage.includes(textData.routes.pages.PROPERTY_OFFER_PAGE) &&<>
                                                <div className="p-4 justify-center flex">
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
                                            </>}
                                        </div>                                   
                                    </div>

                                    {/* {ques?.response_options?.length > 0 && ques?.response?.length > 0 && (
                                        <div className="absolute top-0 -right-7 bg-[#B8D4FF] rounded-r-full p-1.5 flex items-center justify-center cursor-pointer">
                                            <div className="bg-[#1354B6] p-2 rounded-full">
                                                <RotateCw className="w-4 h-4 text-white" />
                                            </div>
                                        </div>
                                    )} */}
                                </div>
                            </div>
                        </>
                    ))}

                    
                    {loadingQuestion && !isLastquestion && <>
                        <div className="w-full flex justify-center items-center py-4">
                            <div className="animate-pulse flex space-x-2">
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                            </div>
                            <span className="ml-3 text-blue-500">Processing Information...</span>
                        </div>
                    </>}
                </div>
            </ScrollArea>


            {/* Fixed UserQueryMessage at the Bottom (constrained to ChatContainer width) */}
            {propertyInfo?.propertyId && <>
                <div className="sticky bottom-0 left-0 w-full bg-white border-t border-gray-200">
                    <div className="mx-auto w-full">
                        <UserQueryMessage propertyInfo={propertyInfo} currentPage={currentPage} chatHistory={chatHistory} loadingQuestion={loadingQuestion} />
                    </div>
                </div>
            </>}
        </div>
    );
}
