import { ResizablePanel, } from "@/components/pageComponents/offerSteps";
import Layout from "@/layouts/OfferLayout";
import textData from "@/config/text.json";
import { MainNavbar } from "./main-navbar";
import MiraQnaContainer from "./mira-qna";
import { useState, useEffect, useCallback, useRef } from "react";
import { SkeletonMarketGauge } from "../animations/skeletonLoading/marketGaugeSkeleton";
import Tabs from "../pageComponents/offerSteps/property/step3/Tabs";
import { getMarketAnalysis } from "@/services/apiService";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import ReactSpeedometer from "react-d3-speedometer";
import { selectQnaQuestions } from "@/slices/qnaSlice";
import { useCurrentPage } from "@/utils/routeUtils";
import { createSelector } from '@reduxjs/toolkit';

const mainTitle = textData.marketGauge.title;

// Add this memoized selector outside of the component
const selectMemoizedQnaQuestions = createSelector(
    [(state: RootState) => state, (_, currentPage: string) => currentPage],
    (state, currentPage) => selectQnaQuestions(state, currentPage)
);

export default function CurrentMarketConditions() {
    // Keep only currentStep as a static value
    const currentStep = 3;
    const currentPage = useCurrentPage();
    const speedometerText = textData.step3Content.marketGauge.speedometer;
    const headerOptions = speedometerText.headerOptions;
    const [isLoading, setIsLoading] = useState(true);
    const [isAPILoading, setIsAPILoading] = useState(false);
    const [activeTab, setActiveTab] = useState<"county" | "city" | "home">("county");
    const [marketType, setMarketType] = useState<"seller" | "balanced" | "buyer">("balanced");
    const { propertyData } = useSelector((state: RootState) => state.propertySlice);
    const [propertyInfo, setPropertyInfo] = useState<any>(propertyData);
    const qnaQuestions = useSelector((state: RootState) => selectMemoizedQnaQuestions(state, currentPage));
    const [currentOptionId, setCurrentOptionId] = useState<string>('');
    const [marketData, setMarketData] = useState<any>({});
    const isFirstRender = useRef(false);

    // Convert fetchMarketAnalysis to callback
    const fetchMarketAnalysis = useCallback(async (optionId: string) => {
        setIsAPILoading(true);
        try {
            const apiResponse = await getMarketAnalysis((propertyData as any)?.propertyId, optionId);
            if (apiResponse.code === 200) {
                setMarketData(apiResponse.response);
            }
            setIsLoading(false);
            setIsAPILoading(false);
        }
        catch (error) {
            console.error("Error fetching market analysis:", error);
        }
        finally {
            setIsLoading(false);
            setIsAPILoading(false);
        }
    }, [propertyData]); // Add propertyData as dependency

    // Convert processQuestionAndFetchData to callback
    const processQuestionAndFetchData = useCallback((question: any) => {
        if (question?.response_options?.length > 0) {
            setIsLoading(true);
            let optionId;

            // Check for existing response first
            if (question?.response?.length > 0) {
                const option = question.response_options.find(
                    (option: any) => option.option_id === question.response[0]
                );
                optionId = option?.option_id;
            }

            // If no existing response, use first option
            if (!optionId) {
                optionId = question.response_options[0]?.option_id;
            }

            if (optionId) {
                setCurrentOptionId(optionId);
                fetchMarketAnalysis(optionId);
            }
        }
    }, [fetchMarketAnalysis]); // Add fetchMarketAnalysis as dependency

    // Update handleQuestionClick to use callbacks
    const handleQuestionClick = useCallback((que: any) => {
        if (que?.right_panel === "current-market-conditions") {
            isFirstRender.current = true;
            processQuestionAndFetchData(que);
        }
    }, [processQuestionAndFetchData]);

    // Update useEffect to use callback
    useEffect(() => {
        if (!isFirstRender.current && qnaQuestions) {
            const question = qnaQuestions.find(
                (ques: any) => ques?.right_panel === "current-market-conditions" && ques?.response?.length > 0
            );
            if (question) {
                processQuestionAndFetchData(question);
                isFirstRender.current = true;
            }
        }
    }, [qnaQuestions, processQuestionAndFetchData]); // Add processQuestionAndFetchData as dependency

    useEffect(() => {
        // Determine market type based on score
        const tabData = activeTab;
        if (marketData && marketData[tabData]) {
            const score = marketData[tabData]?.score;

            // Convert score to number and set marketType based on its value
            if (score !== "N/A") {
                const numScore = parseFloat(score);
                if (numScore < 2) {
                    setMarketType("seller");
                }
                else if (numScore > 2.5) {
                    setMarketType("buyer");
                }
                else {
                    setMarketType("balanced");
                }
            }
        }
    }, [activeTab, marketData]);

    // Add this function before the return statement
    const getStats = () => {
        // Use the market data from API response, stored in state
        const tabData = activeTab;

        // Add a check to ensure marketData and the active tab data exist
        if (!marketData || !marketData[tabData]) return [];

        const activeTabData = marketData[tabData];
        // Filter out the score field which is handled separately by Speedometer
        return Object.entries(activeTabData)
            .filter(([key]) => key !== 'score' && key !== 'name' && key !== 'show_text') // Filter out the score key
            .map(([key, data]) => {
                const statData = data as any;

                // Prepare subStats if they exist
                const subStats = [];

                if (statData.subText) {
                    subStats.push({
                        text: `${statData.arrow === 'up' ? '↑' : '↓'} ${statData.subText}`,
                        color: statData.color === 'positive' ? 'text-[#3FE972]' : 'text-[#F9462D]'
                    });
                }

                if (statData.subText2) {
                    subStats.push({
                        text: `${statData.arrow2 === 'up' ? '↑' : '↓'} ${statData.subText2}`,
                        color: statData.color2 === 'positive' ? 'text-[#3FE972]' : 'text-[#F9462D]'
                    });
                }

                // Return formatted stat object using the name field instead of key
                return {
                    label: statData.name, // Use the name field instead of the key
                    value: statData.value,
                    icon: key === "homes_sold" ? "$" :
                        key === "absorption_rate" ? "A" :
                            key === "active_listings" ? "L" :
                                key === "cash_transactions" ? "$" :
                                    key === "listings_with_price_cut" ? "L" :
                                        key === "median_days_on_market" ? "D" :
                                            key === "median_days_to_cut_price" ? "$" :
                                                key === "net_addition" ? "N" :
                                                    key === "median_close_price" ? "P" :
                                                        key === "median_close_price_per_sqft" ? "S" :
                                                            key === "median_list_price" ? "L" :
                                                                key === "sale_to_list_price_ratio" ? "P" :
                                                                    key === "sold_under_asking" ? "$" :
                                                                        key === "months_of_inventory" ? "M" : "",
                    subStats: subStats.length > 0 ? subStats : null
                };
            });
    };


    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


    const getHeaderText = () => {
        if (currentOptionId === "price_trends") {
            return headerOptions.priceTrends;
        }
        else if (currentOptionId === "supply_demand") {
            return headerOptions.supplyAvailability;
        }
        else if (currentOptionId === "market_type") {
            return headerOptions.demandCompetition;
        }
    };

    const getSpeedometerDimensions = () => {
        const width = window.innerWidth;
        if (width >= 1520) {
            return { width: 400, height: 200, ringWidth: 170 };
        } else if (width >= 1367) {
            return { width: 350, height: 200, ringWidth: 140 };
        } else if (width >= 1366) {
            return { width: 350, height: 200, ringWidth: 130 };
        } else if (width >= 1280) {
            return { width: 300, height: 200, ringWidth: 110 };
        }
        else if(width >= 1250){
            return { width: 220, height: 180, ringWidth: 150 };
        }
        else if (width >= 1024) {
            return { width: 250, height: 200, ringWidth: 170 };
        } else {
            return { width: 200, height: 200, ringWidth: 170 };
        }
    };

    const [dimensions, setDimensions] = useState(getSpeedometerDimensions());

    useEffect(() => {
        const handleResize = () => {
            setDimensions(getSpeedometerDimensions());
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Add this right before or after the return statement in your component
    const getScoreDisplay = () => {
        const tabData = activeTab;
        // Add a check to ensure marketData and the score exist
        if (!marketData || !marketData[tabData] || !marketData[tabData].score) return 0;
        const score = marketData[tabData].score;
        return score === "N/A" ? 0 : score;
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
                                <div className="px-20 py-4 w-full h-full items-center justify-center bg-[#F4F4F4] slide-in-from-left">
                                    <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 textColor mb-4 text-center">
                                        {mainTitle}
                                    </h1>
                                    {isLoading ? (
                                        <SkeletonMarketGauge selectedMarketAnalysisOption={"1"} propertyInfo={propertyInfo} isAPILoading={isAPILoading} />
                                    ) : (
                                        <div className="overflow-hidden">
                                            {/* All 3 tabs */}
                                            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

                                            {(marketData && marketData[activeTab]?.message) || (!marketData || Object.keys(marketData).length === 0) ? (
                                                // Show message when it exists
                                                <div className="bg-white p-6 border-4 border-[#B8D4FF] w-full max-w-3xl mx-auto text-center">
                                                    <p className="font-[ClashDisplay-Medium] text-lg text-gray-700">
                                                        {(!marketData || Object.keys(marketData).length === 0) && <>No data found</>}
                                                        {marketData && marketData[activeTab]?.message && <>{marketData[activeTab].message}</>}
                                                    </p>
                                                </div>
                                            ) : (
                                                <>
                                                    {/* Speedo Meter Chart */}
                                                    <div className="bg-white p-4 sm:p-6 pb-4 border-4 border-[#B8D4FF] relative w-full max-w-3xl mx-auto">
                                                        <div className="relative w-full flex justify-center items-center mb-12 sm:mb-16">
                                                            <div className="relative">
                                                                <div className="absolute w-full font-[ClashDisplay-Medium] text-sm sm:text-base md:text-lg leading-7 textColor flex justify-center">
                                                                    <span className="text-blue-900">{marketData[activeTab]?.name}</span>
                                                                </div>

                                                                <div className="mt-5">
                                                                    <ReactSpeedometer
                                                                        maxValue={5}
                                                                        value={marketData[activeTab]?.score || 0}
                                                                        segments={3}
                                                                        segmentColors={["#F9462D", "#F7BE2D", "#3FE972"]}
                                                                        needleColor="#fff"
                                                                        ringWidth={dimensions.ringWidth}
                                                                        width={dimensions.width}
                                                                        height={dimensions.height}
                                                                        maxSegmentLabels={0}
                                                                        needleTransitionDuration={1000}
                                                                        currentValueText=""
                                                                        textColor="transparent"
                                                                    />
                                                                </div>
                                                                <div className="absolute font-[ClashDisplay-Medium] text-sm sm:text-base md:text-lg 
                                                                lg:text-[20px]
                                                                leading-4 text-wrap text-white/80 text-center" style={{ left: "50%", top: "25%", transform: "translateX(-50%)" }}>
                                                                    {speedometerText.balancedMarket} <br />
                                                                </div>
                                                                <div className="absolute w-full font-[ClashDisplay-Medium] text-sm sm:text-base md:text-lg leading-7 textColor flex justify-between mb-0">
                                                                    <span style={{ marginLeft: "20px" }}>{speedometerText.sellersMarket}</span>
                                                                    <span style={{ marginRight: "20px" }}>{speedometerText.buyersMarket}</span>
                                                                </div>

                                                            </div>
                                                        </div>

                                                        <div className="mb-5 w-full font-[ClashDisplay-Medium] text-sm sm:text-base md:text-lg leading-7 textColor flex justify-center">
                                                            <span className="text-blue-900">{marketData?.show_text}</span>
                                                        </div>

                                                        <div className="font-[ClashDisplay-Medium] absolute bottom-0 left-0 bg-[#B8D4FF] px-3 py-0.5 rounded-tr-[10px] text-sm sm:text-base md:text-lg font-medium text-blue-800/70">
                                                            {getHeaderText()}
                                                        </div>
                                                    </div>

                                                    {/* ALL KPI's */}
                                                    <div className="bg-white space-y-0">
                                                        {getStats().map((stat, idx) => (
                                                            <>
                                                                {stat.label && <>
                                                                    <div
                                                                        key={idx}
                                                                        className={`flex items-end justify-between relative h-18 xl:h-22 2xl:h-18 border-4 border-t-0 border-[#B8D4FF]`}
                                                                    >
                                                                        <div className="flex items-end gap-14 xl:gap-28">
                                                                            <div className="absolute top-0 left-0 p-1 bg-[#B8D4FF] rounded-full rounded-tl-none ">
                                                                                <div className="w-6 h-6 rounded-full bg-[#1354B6] flex items-center justify-center text-[#37D3AE] font-medium">
                                                                                    {stat.icon}
                                                                                </div>
                                                                            </div>
                                                                            <span className="lg:pt-20 font-[ClashDisplay-Medium] text-base lg:text-xs xl:text-sm textColor ml-2 py-1">{stat.label}</span>
                                                                        </div>
                                                                        <div className="text-right px-2 mb-2">
                                                                            <div className="text-xl font-semibold text-blue-900">{stat.value}</div>
                                                                            {stat.subStats && (
                                                                                <div
                                                                                    className={`text-xs text-right ${stat.label === "Months of Inventory" ? "flex flex-col items-end" : "flex items-center gap-2"
                                                                                        }`}
                                                                                >
                                                                                    {stat.subStats.map((subStat, index) => (
                                                                                        <span key={index} className={subStat.color}>
                                                                                            {subStat.text}
                                                                                        </span>
                                                                                    ))}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </>}
                                                            </>
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        }
                    />
                </div>
            </main>
        </Layout>
    );
}