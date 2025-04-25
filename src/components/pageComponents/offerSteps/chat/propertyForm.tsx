import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { bath, bed, home } from "@/assets/images";
import textData from "@/config/text.json";

interface PropertyFormProps {
  onSubmit: (data: { type: string; value: string }) => void;
}

function PropertyForm({ onSubmit }: PropertyFormProps) {
  const [bedValue, setBedValue] = useState("2 Bedrooms");
  const [bathValue, setBathValue] = useState("20 Bathrooms");
  const [sqFeetVale, setSqFeetVale] = useState("4,712 sqft");
  const [otherValue, setOtherValue] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const propertyFormText = textData.step4Content.propertyForm;
  const placeholders = propertyFormText.placeholders;
  const labels = propertyFormText.labels;

  const handleSubmit = () => {
    const value = bedValue || bathValue || sqFeetVale || otherValue;
    onSubmit({
      type: "bedrooms",
      value: value,
    });
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-4">
      <div className="agentChat py-1 pl-3">{propertyFormText.agentMessage}</div>
      <div className="bg-transparent rounded-lg p-4 space-y-4">
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
              className="flex-1 bg-white rounded-full"
            />
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
              className="flex-1 bg-white rounded-full"
            />
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
              className="flex-1 bg-white rounded-full"
            />
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
              className="mt-2 bg-white rounded-[12px] placeholder:font-[Geologica] placeholder:font-normal placeholder:text-[#797979] placeholder:text-sm placeholder:leading-3.5"
            />
          </div>
        </div>

        {!isSubmitted && (
          <Button
            className="w-36 rounded-full bg-[#1354B6] hover:bg-blue-700 py-5"
            onClick={handleSubmit}
          >
            <span className="text-white font-[ClashDisplay-Medium] text-lg leading-[18px]">
              {labels.submit}
            </span>
          </Button>
        )}
      </div>
    </div>
  );
}

export default PropertyForm;