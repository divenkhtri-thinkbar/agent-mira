import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { bath, bed, home } from "@/assets/images";
import textData from "@/config/text.json";
import { RootState } from "@/store";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updatePropertyInformation } from "@/services/apiService";
import { useLoader } from "../../../../services/LoaderContext";
import { setPropertyData } from "@/slices/propertySlice";
import { selectQnaQuestions } from "@/slices/qnaSlice";
import { useCurrentPage } from "@/utils/routeUtils";

interface PropertyFormProps {
    onSubmit: () => void;
}

function PropertyForm({ onSubmit }: PropertyFormProps) {
    
    const propertyFormText = textData.step4Content.propertyForm;
    const placeholders = propertyFormText.placeholders;
    const labels = propertyFormText.labels;
    const { propertyData } = useSelector((state: RootState) => state.propertySlice);
    const [propertyInfo, setPropertyInfo] = useState<any>(propertyData);
    const { showLoader, hideLoader } = useLoader();
    const dispatch = useDispatch();
    const currentPage = useCurrentPage();
    const qnaQuestions = useSelector((state: RootState) => selectQnaQuestions(state, currentPage));
    const [isDisabled, setIsDisabled] = useState(false);
    const [bedValue, setBedValue] = useState(propertyData?.BedroomsTotal || "");
    const [bathValue, setBathValue] = useState(propertyData?.BathroomsFull || "");
    const [sqFeetVale, setSqFeetVale] = useState(propertyData?.LotSizeSquareFeet || "");
    const [otherValue, setOtherValue] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
   
    
    // State for error messages
    const [bedError, setBedError] = useState("");
    const [bathError, setBathError] = useState("");
    const [sqFeetError, setSqFeetError] = useState("");
    const [otherError, setOtherError] = useState("");

    useEffect(() => {
        setPropertyInfo(propertyData);
        setBedValue(propertyData?.BedroomsTotal || "");
        setBathValue(propertyData?.BathroomsTotalDecimal || "");
        setSqFeetVale(propertyData?.LotSizeSquareFeet || "");
    }, [propertyData]);

    useEffect(() => {
        if (qnaQuestions) {
            const option = qnaQuestions.find((ques: any) => ques.question_type === "edit-text");
            if(option?.hasOwnProperty("response") && option?.response?.length > 0) {
                if (option?.response_options?.length > 0) {
                    const lastOption = option.response_options[option.response_options.length - 1];
                    if (lastOption && lastOption.option_text) {
                        setOtherValue(lastOption.option_text);
                    }
                }
                setIsDisabled(true);
            }
        }
    }, [qnaQuestions]);
    
    const handleSubmit = async () => {
        // Reset error messages
        setBedError("");
        setBathError("");
        setSqFeetError("");
        setOtherError("");

        let hasError = false;

        // Validate mandatory fields
        // Numeric validation regex - updated to allow decimal values
        const numericRegex = /^\d*\.?\d+$/;

        // Validate bedrooms
        if (!bedValue) {
            setBedError("Bedrooms are required.");
            hasError = true;
        } else if (!numericRegex.test(bedValue.toString())) {
            setBedError("Please enter a valid number for bedrooms (e.g. 7.5).");
            hasError = true;
        }

        // Validate bathrooms
        if (!bathValue) {
            setBathError("Bathrooms are required.");
            hasError = true;
        } else if (!numericRegex.test(bathValue.toString())) {
            setBathError("Please enter a valid number for bathrooms (e.g. 7.5).");
            hasError = true;
        }

        // Validate square feet
        if (!sqFeetVale) {
            setSqFeetError("Square Feet are required.");
            hasError = true;
        } else if (!numericRegex.test(sqFeetVale.toString())) {
            setSqFeetError("Please enter only numbers for square feet.");
            hasError = true;
        }

        if (hasError) {
            return; // Stop submission if there are validation errors
        }

        setIsSubmitting(true); // Set submitting state to true
        showLoader();

        try {
            // Call the API to update property information
            const getResponse = await updatePropertyInformation({
                mlsid: propertyData?.propertyId,
                bedrooms: bedValue,
                bathrooms: bathValue,
                lotSizeSquareFeet: sqFeetVale,
                other: otherValue,
            });

            if (getResponse.code === 200) {
                onSubmit();
                
                // Use type assertion to tell TypeScript that this object matches the PropertyData type
                const updatedData = {
                    ...propertyData,
                    BedroomsTotal: Number(bedValue),
                    BathroomsTotalDecimal: Number(bathValue),
                    LotSizeSquareFeet: sqFeetVale.toString(),
                    propertyId: propertyData?.propertyId || "",
                } as any; // Use 'as any' temporarily to bypass type checking
                
                dispatch(setPropertyData(updatedData));

                toast.success("Property information updated successfully.");
                setIsSubmitted(true); // Set submitted state to true
            } 
            else {
                toast.error((getResponse as any).message || "Failed to update property information.");
            }
        } catch (error) {
            console.error("Error updating property information:", error);
            toast.error("An error occurred while updating property information.");
        } finally {
            hideLoader();
            setIsSubmitting(false); // Reset submitting state
        }
    };

    return (
        <div className="space-y-4">
            {/* <div className="agentChat py-1 pl-3">{propertyFormText.agentMessage}</div> */}
            <div className={`bg-transparent rounded-lg p-4 space-y-4 ${isDisabled ? "opacity-90" : ""}`}>
                {/* Bedrooms Option */}
                <div className="flex items-center space-x-4">
                    <div className="bg-[#1354B6] px-4 py-2 rounded-full">
                        <img src={bed} alt="Bedrooms" className="w-6 h-6" />
                    </div>
                    <div className="w-52">
                        <Input
                            value={bedValue}
                            onChange={(e) => setBedValue(e.target.value)}
                            placeholder={placeholders.bedrooms}
                            className={`flex-1 bg-white rounded-full ${bedError ? "border-red-500" : ""}`}
                            disabled={isDisabled}
                        />
                        {bedError && <p className="text-red-500">{bedError}</p>}
                    </div>
                </div>

                {/* BathRoom Option */}
                <div className="flex items-center space-x-4">
                    <div className="bg-[#1354B6] px-4 py-2 rounded-full">
                        <img src={bath} alt="Bathrooms" className="w-6 h-6" />
                    </div>
                    <div className="w-52">
                        <Input
                            value={bathValue}
                            onChange={(e) => setBathValue(e.target.value)}
                            placeholder={placeholders.bathrooms}
                            className={`flex-1 bg-white rounded-full ${bathError ? "border-red-500" : ""}`}
                            disabled={isDisabled}
                        />
                        {bathError && <p className="text-red-500">{bathError}</p>}
                    </div>
                </div>

                {/* Square Feet */}
                <div className="flex items-center space-x-4">
                    <div className="bg-[#1354B6] px-4 py-2 rounded-full">
                        <img src={home} alt="sq ft" className="w-6 h-6" />
                    </div>
                    <div className="w-52">
                        <Input
                            value={sqFeetVale}
                            onChange={(e) => setSqFeetVale(e.target.value)}
                            placeholder={placeholders.squareFeet}
                            className={`flex-1 bg-white rounded-full ${sqFeetError ? "border-red-500" : ""}`}
                            disabled={isDisabled}
                        />
                        {sqFeetError && <p className="text-red-500">{sqFeetError}</p>}
                    </div>
                </div>

                {/* Other Option */}
                <div className="space-y-2 pr-12 mt-6">
                    <span className="block font-[ClashDisplay-Medium] text-lg leading-4 textColor">
                        {labels.other}
                    </span>
                    <div>
                        <Input
                            value={otherValue}
                            onChange={(e) => setOtherValue(e.target.value)}
                            placeholder={placeholders.other}
                            className={`mt-2 bg-white rounded-[12px] placeholder:font-[Geologica] placeholder:font-normal placeholder:text-[#797979] placeholder:text-sm placeholder:leading-3.5 ${otherError ? "border-red-500" : ""}`}
                            disabled={isDisabled}
                        />
                        {otherError && <p className="text-red-500">{otherError}</p>}
                    </div>
                </div>

                {!isSubmitted && !isDisabled && (
                    <Button
                        className="w-36 rounded-full bg-[#1354B6] hover:bg-blue-700 py-5"
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                    >
                        <span className="text-white font-[ClashDisplay-Medium] text-lg leading-[18px]">
                            {isSubmitting ? "Submitting..." : labels.submit}
                        </span>
                    </Button>
                )}
            </div>
        </div>
    );
}

export default PropertyForm;
