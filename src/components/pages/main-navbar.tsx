import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import textData from "@/config/text.json";
import { useSelector } from 'react-redux';
import { selectPropertyData } from '@/slices/propertySlice';
import { selectAllQnaQuestions } from "@/slices/qnaSlice";
import { RootState } from "@/store";
import { useCurrentPage } from "@/utils/routeUtils";
import { sideNavigation } from '@/services/apiService';

interface ProgressNavProps {
    currentStep: number;
}

const tabColors = [
    "#5D9DFE",
    "#468FFE",
    "#2F7CF2",
    "#0D64E9",
    "#1058C5",
    "#0B43BE",
];

const PADDING = 110;

const steps = textData.offerProcess.steps;

const getResponsiveStyles = (
    index: number,
    stepsCount: number,
    screenWidth: number
) => {
    const maxContainerWidth = Math.min(screenWidth, 1920);
    const availableWidth =
        screenWidth < 768 ? maxContainerWidth : maxContainerWidth - PADDING;

    const minTabWidth = 150;
    const maxTabWidth = 302;
    let tabWidth: number;
    let overlap: number;

    if (screenWidth < 768) {
        tabWidth = Math.max(
            minTabWidth,
            Math.min(maxTabWidth, availableWidth / stepsCount)
        );
        overlap = 20;
    } else if (screenWidth >= 768 && screenWidth < 1024) {
        tabWidth = Math.max(
            minTabWidth,
            Math.min(240, availableWidth / stepsCount)
        );
        overlap = 25;
    } else if (screenWidth >= 1024 && screenWidth < 1280) {
        tabWidth = Math.max(
            minTabWidth,
            Math.min(260, availableWidth / stepsCount)
        );
        overlap = 38;
    } else if (screenWidth >= 1280 && screenWidth < 1536) {
        tabWidth = Math.max(
            minTabWidth,
            Math.min(280, availableWidth / stepsCount)
        );
        overlap = 39;
    } else {
        tabWidth = Math.max(
            minTabWidth,
            Math.min(maxTabWidth, availableWidth / stepsCount)
        );
        overlap = 40;
    }

    const totalWidth = tabWidth + (stepsCount - 1) * (tabWidth - overlap);
    if (totalWidth > availableWidth) {
        tabWidth = (availableWidth + (stepsCount - 1) * overlap) / stepsCount;
        overlap = Math.max(10, overlap * (availableWidth / totalWidth));
    }

    const leftOffset = `calc(${index} * (${tabWidth}px - ${overlap}px))`;

    return { tabWidth: `${tabWidth}px`, leftOffset, overlap: `${overlap}px` };
};

export function MainNavbar({ currentStep }: ProgressNavProps) {

    const navigate = useNavigate();
    const currentPage = useCurrentPage();
    const [windowWidth, setWindowWidth] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth;
        }
        return 1024; // Default width for SSR
    });
    const propertyInfo = useSelector(selectPropertyData);
    const [listingId, setListingId] = useState<any>(propertyInfo?.propertyId || '');
    const qnaQuestions = useSelector((state: RootState) => selectAllQnaQuestions(state));
    const [questionList, setQuestionList] = useState<any>({});
    const [navSteps, setNavSteps] = useState<any>(steps);
    const hasCalledApi = useRef(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const handleResize = () => setWindowWidth(window.innerWidth);
            window.addEventListener("resize", handleResize);
            return () => window.removeEventListener("resize", handleResize);
        }
    }, []);

    useEffect(() => {
        if (propertyInfo) {
            setListingId(propertyInfo?.propertyId);
        }
    }, [propertyInfo, setListingId]);

    useEffect(() => {
        if (listingId && !hasCalledApi.current) {
            const fetchData = async () => {
                try {
                    const apiResponse = await sideNavigation(listingId);
                    if (apiResponse.code === 200) {
                        const response = (apiResponse as any).response;
                        // Map API response to navigation steps
                        const updatedSteps = steps.map((step: any) => {
                            // Determine if the step should be enabled based on API response
                            const isShow = response[step.page as keyof typeof response];
                            return {
                                ...step,
                                isShow
                            };
                        });
                        setNavSteps(updatedSteps);
                    }
                    hasCalledApi.current = true;
                } 
                catch (error) {
                    // Handle error
                }
            };

            fetchData();
        }
    }, [listingId]);

    const handleStepClick = (step: { route?: string }, event: React.MouseEvent<HTMLAnchorElement>) => {
        if (!event.ctrlKey && !event.metaKey && event.button !== 1 && step?.route) {
            event.preventDefault();
            if(step.route === "/agent") {
                navigate(step.route);
            }
            else {
                navigate(step.route+listingId);
            }
        }
    };

    useEffect(() => {
        if (qnaQuestions) {
            setQuestionList(qnaQuestions);
        }
    }, [steps, questionList, qnaQuestions]);

    return (
        <div className="w-full max-w-[1920px] mx-auto group progress-nav">
            <div className={cn("relative bg-[#0B43BE] w-full rounded-none overflow-x-auto overflow-y-hidden custom-scrollbar whitespace-nowrap", windowWidth <= 1350 ? "h-[96px]" : "h-[80px]")} >
                {navSteps.map((step: any, index: any) => {
                    const isCompleted = (index + 1) <= currentStep;
                    const zIndex = steps.length - index;
                    const { tabWidth, leftOffset } = getResponsiveStyles(index, steps.length, windowWidth );
                    const isDisabled = !listingId;
                    // const isDisabled = (!listingId || !step.isShow);

                    return (
                        <a key={step.id}
                            className={cn("cursor-pointer absolute h-full flex items-center justify-center transition-all rounded-r-full duration-200 px-4 md:px-8 no-underline",
                                step.id === currentStep && "border-[#37D3AE] border-[4px] rounded-r-full",isCompleted && "rounded-r-full",
                                isDisabled && "cursor-not-allowed"
                            )}
                            style={{width: tabWidth,left: leftOffset,backgroundColor: tabColors[index],zIndex: zIndex,}}
                            onClick={(e) => !isDisabled && handleStepClick(step, e)}
                        >
                            <div className="relative z-30 px-4 md:px-6 py-2">
                                <p  className={cn("text-center text-xs md:text-sm text-wrap leading-normal truncate",
                                    step.id === currentStep ? "text-white font-medium" : "text-white/60")}>
                                    {step.title}
                                </p>
                            </div>
                        </a>
                    );
                })}
            </div>
        </div>
    );
}
