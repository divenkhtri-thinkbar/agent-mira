import Layout from "@/layouts/OfferLayout";
import { useEffect, useState, lazy, Suspense } from 'react';
import { MainNavbar } from "./main-navbar";
import MiraQnaContainer from "./mira-qna";
import PropertyViewSkeleton from "../animations/PropertyViewSkeleton";
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { ResizablePanel } from "@/components/pageComponents/offerSteps";
import { Card, CardContent } from "@/components/ui/card";
import { selectQnaQuestions } from '@/slices/qnaSlice';
import { useCurrentPage } from '@/utils/routeUtils';
import { PropertyCard } from "../pageComponents/offerSteps/property/verifyingPropertyInformation/propertyCard";
import { createSelector } from '@reduxjs/toolkit';

// Lazy load the Google Maps components
const GoogleMapComponent = lazy(() => import('./GoogleMapComponent'));

// Add these memoized selectors outside of the component
const selectMemoizedPropertySlice = createSelector(
    [(state: RootState) => state?.propertySlice],
    (propertySlice) => ({
        propertyData: propertySlice.propertyData,
        propertyFact: propertySlice.propertyFact
    })
);

const selectMemoizedQnaQuestions = createSelector(
    [(state: RootState) => state, (_, currentPage: string) => currentPage],
    (state, currentPage) => selectQnaQuestions(state, currentPage)
);

// Add this helper function before the return statement
const parseCoordinate = (value: string | number): number => {
    return typeof value === 'string' ? parseFloat(value) : value;
};

export default function VerifyPropertyInformation() {
    const currentStep = 1;
    const currentPage = useCurrentPage();
    
    // With these memoized versions:
    const { propertyData, propertyFact } = useSelector(selectMemoizedPropertySlice);
    const qnaQuestions = useSelector((state: RootState) => selectMemoizedQnaQuestions(state, currentPage));
    
    const [propertyInfo, setPropertyInfo] = useState<any>(propertyData);
    const [panelInfo, setPanelInfo] = useState<any>('initial_3');
    const [panelTwo, setPanelTwo] = useState<any>({});

    useEffect(() => {
        if (propertyData) {
            setPropertyInfo(propertyData);
        }
    }, [propertyData]);

    const handleQuestionClick = (que: any) => {
        setPanelInfo('');
        setPanelTwo({});        
        if (typeof que === 'string' && que === 'initial_3') {
            setPanelInfo(que);
        } 
        else if (typeof que === 'object' && que !== null) {
            setPanelTwo(que);
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
                            <div className="relative z-0 h-full overflow-y-auto">
                                <div className="w-full animate-slide-in-from-left">
                                    {panelInfo === "initial_3" && qnaQuestions?.length > 0 && propertyData && propertyInfo ? (
                                        <>
                                            <div className="flex flex-col gap-4 w-full max-w-4xl px-4 min-h-[100vh] items-center justify-center mx-auto">
                                                <div className="bg-[#B8D4FF] p-4 rounded-[25px] flex flex-col items-center w-full">
                                                    <Card className="w-full">
                                                        <CardContent className="p-0 overflow-hidden">
                                                            {propertyInfo?.image_url.length > 0 && <>
                                                                <img src={propertyInfo?.image_url[0]} alt="Property" className="w-full h-auto max-h-[60vh] object-contain rounded-3xl" />
                                                            </>}

                                                            {propertyInfo?.image_url?.length === 0 && <>
                                                                <div className="h-full w-full object-cover rounded-3xl bg-[#DEDEDE] rounded-3xl overflow-hidden">
                                                                    <div className="flex items-center justify-center h-full w-full relative aspect-[16/8.5] bg-transparent  pt-4 pb-2 overflow-hidden z-20">
                                                                        <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] text-center">
                                                                            No image found
                                                                        </h1>
                                                                    </div>
                                                                </div>
                                                            </>}
                                                            <div className="px-4 my-4 flex items-center justify-center text-[#1354B6] gap-2 font-[Geologica] font-light text-base text-center">
                                                                <h3>Property Address:</h3>
                                                                <p>{propertyInfo?.UnparsedAddress}</p>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                    <Card className="w-full">
                                                        <CardContent className="p-0 overflow-hidden rounded-3xl">
                                                            {propertyInfo?.Latitude && propertyInfo?.Longitude ? (
                                                                <Suspense fallback={<div className="h-[400px] w-full bg-[#DEDEDE] rounded-3xl flex items-center justify-center">
                                                                    <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] text-center">
                                                                        Loading map...
                                                                    </h1>
                                                                </div>}>
                                                                    <GoogleMapComponent 
                                                                        lat={parseCoordinate(propertyInfo.Latitude)}
                                                                        lng={parseCoordinate(propertyInfo.Longitude)}
                                                                    />
                                                                </Suspense>
                                                            ) : (
                                                                <div className="h-[400px] w-full bg-[#DEDEDE] rounded-3xl flex items-center justify-center">
                                                                    <h1 className="font-[ClashDisplay-Medium] text-xl leading-9 text-[#1354B6] text-center">
                                                                        No address found
                                                                    </h1>
                                                                </div>
                                                            )}
                                                        </CardContent>
                                                    </Card>
                                                </div>
                                            </div>
                                        </>
                                    ) : 
                                    panelTwo?.right_panel === "property-information" && qnaQuestions?.length > 0 && panelInfo === "" && propertyData && propertyInfo ? (
                                        <>
                                            {/* {JSON.stringify(propertyInfo)} */}
                                            <PropertyCard 
                                                propertyInfo={{
                                                    images: propertyInfo?.image_url || [], // Ensure it's an array
                                                    price: propertyInfo?.ListPrice,
                                                    beds: propertyInfo?.BedroomsTotal,
                                                    baths: propertyInfo?.BathroomsTotalDecimal,
                                                    sqft: propertyInfo?.LotSizeSquareFeet,
                                                    builtIn: propertyInfo?.YearBuilt,
                                                    hoa: propertyInfo?.HOAPresence_derived || "N/A",
                                                    propertyType: propertyInfo?.PropertySubType,
                                                    features: propertyInfo?.features,
                                                    description: propertyFact || "No fact available.",
                                                    isLoading: false, 
                                                    propertyId: propertyInfo?.propertyId,
                                                    lotSize: propertyInfo?.LotSizeSquareFeet,
                                                    livingArea: propertyInfo?.LivingArea
                                                }} 
                                            />
                                        </>
                                    ) : (
                                        <PropertyViewSkeleton propertyInfo={propertyInfo} />
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