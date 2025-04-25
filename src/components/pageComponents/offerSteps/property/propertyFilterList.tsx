import { useState } from "react";
import { cn, getMatchColor } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui";
import { Textarea } from "@/components/ui/textarea";

interface PropertyFilterListProps {
  avatarUrl?: string;
  onPropertySelect: (option: {
    id: string;
    address: string;
    imageUrl: string;
    matchPercentage?: number;
    reason?: string;
  }) => void;
  properties: {
    id: string;
    address: string;
    imageUrl: string;
    matchPercentage?: number;
  }[];
}

export function PropertyFilterList({
  avatarUrl,
  onPropertySelect,
  properties,
}: PropertyFilterListProps) {
  const removePropertyQuestion = {
    id: "remove-property-question",
    type: "agent" as const,
    content: "Select a property below to remove from the comparable properties list.",
    showAvatar: true,
    avatarUrl,
  };

  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [reason, setReason] = useState<string>("");

  const handleSelect = (property: {
    id: string;
    address: string;
    imageUrl: string;
    matchPercentage?: number;
  }) => {
    if (!isSubmitted) {
      setSelectedPropertyId(property.id);
    }
  };

  const handleSubmit = () => {
    if (selectedPropertyId && !isSubmitted) {
      const selectedProperty = properties.find((p) => p.id === selectedPropertyId);
      if (selectedProperty) {
        onPropertySelect({ ...selectedProperty, reason });
        setIsSubmitted(true);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="agentChat py-1">{removePropertyQuestion.content}</div>
      <div className="property-list flex flex-col gap-3">
        {properties.map((property) => (
          <div
            key={property.id}
            className={cn(
              "flex flex-col gap-2",
              isSubmitted &&
                (selectedPropertyId === property.id ? "opacity-100" : "opacity-50")
            )}
          >
            <div
              className={cn(
                "property-item flex items-center justify-between",
                !isSubmitted && "cursor-pointer"
              )}
              onClick={() => handleSelect(property)}
            >
              <div
                className={cn(
                  "flex items-center w-[80%] bg-[#1354B6] p-1 rounded-3xl",
                  selectedPropertyId === property.id && "border-3 border-green-500",
                  isSubmitted && "w-full"
                )}
              >
                <img
                  src={property.imageUrl}
                  alt={`${property.address} preview`}
                  className="w-26 h-16 object-cover rounded-3xl"
                />
                <div className="flex-1 flex justify-center items-center">
                  <span className="text-white font-[Geologica] font-normal text-sm text-left">
                    {property.address}
                  </span>
                </div>
                {property.matchPercentage !== undefined && (
                  <div
                    className={cn(
                      "rounded-full p-2 mr-2",
                      getMatchColor(property.matchPercentage)
                    )}
                  >
                    <div className="text-sm font-[ClashDisplay-Regular] text-center font-bold">
                      {property.matchPercentage}%
                    </div>
                    <div className="text-xs">Match</div>
                  </div>
                )}
              </div>
              {/* Right side div with bin icon - Hidden post-submission */}
              {!isSubmitted && (
                <div className="flex justify-end pr-3 rounded-r-lg h-full items-center">
                  <Trash2 className="w-6 h-6 text-red-500" />
                </div>
              )}
            </div>
            {/* Textarea - Matches left div width, persists post-submission */}
            {selectedPropertyId === property.id && (
              <div className="px-1">
                <Textarea
                  placeholder="Type your reason why..."
                  value={reason}
                  onChange={(e) => !isSubmitted && setReason(e.target.value)}
                  disabled={isSubmitted}
                  className="w-full p-2 border border-gray-300 bg-white rounded-xl placeholder:font-[Geologica] placeholder:text-sm placeholder:px-1"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      {!isSubmitted && (
        <div className="flex justify-end">
          <Button
            className="w-36 rounded-full bg-[#1354B6] hover:bg-blue-700 py-5"
            onClick={handleSubmit}
          >
            <span className="text-white font-[ClashDisplay-Medium] text-lg leading-[18px]">
              Submit
            </span>
          </Button>
        </div>
      )}
    </div>
  );
}

export default PropertyFilterList;