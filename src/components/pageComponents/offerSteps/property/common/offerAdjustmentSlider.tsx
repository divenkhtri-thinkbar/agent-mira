import { useEffect, useState } from "react";
import { Slider } from "@/components/ui/slider";
import textData from "@/config/text.json";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

interface OfferAdjustmentSliderProps {
    onSubmit: (priceCut: any) => void;
    onSkip?: () => void;
    initialOffer?: number;
    minOffer?: number;
    maxOffer?: number;
}

export function OfferAdjustmentSlider({
    onSubmit,
    onSkip,
    initialOffer = 5504000,
    minOffer = initialOffer * 0.97,
    maxOffer = initialOffer * 1.03,
}: OfferAdjustmentSliderProps) {
    const [submitted, setSubmitted] = useState(false);
    const preferenceState = useSelector((state: RootState) => state.preferenceSlice);
    const [offerInfo, setOfferInfo] = useState<any>(preferenceState.offerInfo);
    
    const [cutPriceValues, setCutPriceValues] = useState<any>([0]);
    const [sliderValue, setSliderValue] = useState([cutPriceValues[0]]);
    const [currentPrice, setCurrentPrice] = useState("");

    const sliderText = textData.step6Content.offerAdjustmentSlider;
    const buttons = sliderText.buttons;

    // Handle form submission
    const handleSubmit = async () => {
        if (submitted || offerInfo?.cutPrice?.length === 0) return;
        
        const priceCut = offerInfo?.cutPrice?.find((item: any) => item.cut === sliderValue[0]);

        if(priceCut){
            onSubmit(priceCut);         
        }
        else {
            toast.error("No price cut found");
        }
    };

    // Handle skip action
    const handleSkip = () => {
        onSubmit({"price_cut": ""});
    };

    function extractPriceValues(cutPriceData: Array<{ cut: number; price: string }>): number[] {
        return cutPriceData.map(item => item.cut);
    }

    // Update current price when slider value changes
    useEffect(() => {
        if (offerInfo?.cutPrice) {
            const priceCut = offerInfo.cutPrice.find((item: any) => item.cut === sliderValue[0]);
            if (priceCut) {
                setCurrentPrice(priceCut.price);
            }
        }
    }, [sliderValue, offerInfo]);

    useEffect(() => {
        if(preferenceState.offerInfo){
            setOfferInfo(preferenceState.offerInfo);
            if(preferenceState?.offerInfo?.cutPrice?.length > 0){
                const priceValues = extractPriceValues(preferenceState.offerInfo.cutPrice);
                if(priceValues.length > 0){
                    setCutPriceValues(priceValues);

                    if(preferenceState?.offerInfo?.price_cut && preferenceState?.offerInfo?.price_cut !== ""){
                        setSliderValue([preferenceState?.offerInfo?.price_cut]);
                    }
                    else {
                        if(preferenceState?.offerInfo?.offerStrategy?.toLowerCase() === "aggressive"){
                            setSliderValue([priceValues[preferenceState?.offerInfo?.cutPrice?.length - 1]]);
                        }
                        else if(preferenceState?.offerInfo?.offerStrategy?.toLowerCase() === "balanced"){
                            setSliderValue([priceValues[4]]);
                        }
                        else if(preferenceState?.offerInfo?.offerStrategy?.toLowerCase() === "conservative"){
                            setSliderValue([priceValues[0]]);
                        }
                    }
                }
            }
        }
        
    }, [preferenceState.offerInfo]);

    return (
        <div className="space-y-4">
            {/* Instruction */}
            {cutPriceValues?.length > 1 && 
                <>
                    <p className="text-[#8D8D8D] text-xs font-[Geologica] font-normal">
                        {sliderText.instruction}
                    </p>

                    {/* Slider Section */}
                    <div className="space-y-2">
                            <>
                                <div className="relative flex items-center w-full">
                                    <Slider cutPrice={cutPriceValues} value={sliderValue} onValueChange={setSliderValue} className="w-full" evenlyDistributed={true} />

                                    {/* Min Offer (Left End) */}
                                    <span className="absolute bottom-[-25px] left-0 text-[#272727] text-sm font-[Geologica] font-normal">
                                        Conservative
                                    </span>

                                    {/* Current Offer Value (Centered) */}
                                    <span className="absolute bottom-[-25px] left-1/2 transform -translate-x-1/2 text-[#272727] text-sm font-[Geologica] font-normal">
                                        Balanced
                                    </span>

                                    {/* Max Offer (Right End) */}
                                    <span className="absolute bottom-[-25px] right-0 text-[#272727] text-sm font-[Geologica] font-normal">
                                        Aggressive
                                    </span>
                                </div>

                                {/* Value Field */}
                                <div className="flex justify-center mt-14">
                                    <input 
                                        type="text" 
                                        value={currentPrice || `$${sliderValue[0].toLocaleString()}`} 
                                        readOnly 
                                        className={`w-full p-2 py-3 rounded-full text-[#0036AB] text-2xl font-[ClashDisplay-Medium] text-center focus:outline-none ${submitted ? 'bg-white/60 py-2' : 'bg-white'}`} 
                                    />
                                </div>
                            </>
                    </div>
                </>
            }

            {cutPriceValues?.length <= 1 && 
                <div className="flex justify-center mt-14">
                    No offer price found
                </div>
            }

            {/* Buttons */}
            <div className="flex space-x-4 mt-6">
                <button
                    type="button"
                    onClick={handleSkip}
                    className={`cursor-pointer flex-1 py-2 bg-[#0036AB]/50 text-white rounded-full text-sm font-[ClashDisplay-Medium] ${submitted ? "cursor-not-allowed opacity-50" : "hover:bg-[#1354B6]"}`}
                    disabled={submitted}
                >
                    {buttons.skip}
                </button>

                {cutPriceValues?.length > 1 && 
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className={`cursor-pointer flex-1 py-2 bg-[#0036AB] text-white rounded-full text-sm font-[ClashDisplay-Medium] ${submitted ? "cursor-not-allowed opacity-50" : "hover:bg-[#1354B6]"
                            }`}
                        disabled={submitted}
                    >
                        {buttons.submit}
                    </button>
                }
            </div>
        </div>
    );
}

export default OfferAdjustmentSlider;