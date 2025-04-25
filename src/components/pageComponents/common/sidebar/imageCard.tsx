import { getPropertyFacts, getPropertyInformation } from "@/services/apiService";
import { useLoader } from "@/services/LoaderContext";
import { clearPropertyData, clearPropertyFeatures, setPropertyData, setPropertyFact } from "@/slices/propertySlice";
import { clearAllQnaQuestions } from "@/slices/qnaSlice";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { selectPropertyData } from "@/slices/propertySlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clearAllMessages } from "@/slices/chatSlice";
import { clearCmaList, clearOfferInfo } from "@/slices/preferenceSlice";

const ImageCard = ({ property }: { property: any }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showLoader, hideLoader } = useLoader();
    const propertyInfo = useSelector(selectPropertyData);
    const [currentPropertyId, setCurrentPropertyId] = useState<any>(propertyInfo?.propertyId || '');

    useEffect(() => {
        if (propertyInfo) {
            setCurrentPropertyId(propertyInfo?.propertyId);
        }
    }, [propertyInfo, setCurrentPropertyId]);
    
    if (property?.variant === "withoutImage") {
        return <div className="w-64 h-[164px] rounded-2xl border-[#797979] bg-transparent border-[2px] opacity-15" />;
    }

    const handleClick = async () => {
        try {
            showLoader();
            const apiResponse = await getPropertyInformation(property?.property_id);
            if (apiResponse.code === 200 && apiResponse.response) {
                dispatch(clearAllQnaQuestions());
                dispatch(clearPropertyData());
                dispatch(clearCmaList());
                dispatch(clearAllMessages());
                dispatch(clearPropertyFeatures());
                dispatch(clearOfferInfo());

                const finalResponse = (apiResponse as any).response[property.property_id];
                const updatedResponse = {
                    ...finalResponse,
                    propertyId: property.property_id, // Set propertyId to the current property_id
                };
                dispatch(setPropertyData(updatedResponse));

                try {
                    const factsResponse = await getPropertyFacts(property.property_id);
                    if (factsResponse.code === 200) {
                        dispatch(setPropertyFact((factsResponse.response as any)?.fact));
                    }
                } catch (error) {
                    console.error('Error fetching map data:', error);
                }

                // Reload the page to get the new listing ID data and questions
                if(location.pathname === "/" || location.pathname.includes("faq")) { 
                    navigate("/agent");
                }
                else {
                    location.reload();
                }
                // hideLoader();
            } else {
                hideLoader();
                toast.error("Failed to fetch property information");
            }
        } catch (error) {
            hideLoader();
            toast.error("Error fetching property information");
        }
    };

    return (
        <div className={`w-[216px] h-[174px] rounded-[20px] shadow-lg overflow-hidden flex flex-col relative ${(property?.MlsStatus.toLowerCase() === "Closed" || property?.property_id === currentPropertyId) ? "bg-[#B8D4FF]" : "cursor-pointer bg-white"
            } ${property?.MlsStatus.toLowerCase() === "onSelect" && property?.isSelected ? "border-[3px] border-[#37D3AE]" : ""}`}
            onClick={handleClick}
        >
            {property?.MlsStatus.toLowerCase() === "closed" && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-[#B8D4FF] text-black font-[Geologica] text-sm text-nowrap font-normal px-6 py-1.5 rounded-b-[15px]">
                    Offer Closed
                </div>
            )}

            <div className="flex flex-col h-full p-2">
                {property?.images.length > 0 ? (
                    <div className="flex-1 overflow-hidden">
                        <img src={property?.images[0]} alt={property?.property_address} className="w-full h-full object-cover rounded-[20px]" />
                    </div>
                ) : (
                    <div className="flex-1 overflow-hidden">
                        <div className="w-full h-full bg-gray-200 rounded-[20px] flex items-center justify-center">
                            <span className="text-gray-400">Image not available</span>
                        </div>
                    </div>
                )}

                {property?.property_address && (
                    <div className="bg-transparent font-[Geologica] text-sm p-2 text-center text-black font-normal">
                        {property?.property_address}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ImageCard;

